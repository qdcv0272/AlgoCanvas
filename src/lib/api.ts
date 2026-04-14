const BASE_URL = "";

// ── 내부 헬퍼 ──────────────────────────────────────────

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function jsonHeader(token: string) {
  return { "Content-Type": "application/json", ...authHeader(token) };
}

/** JSON 응답이 있는 요청 (GET, 데이터를 반환하는 POST) */
async function request<T>(url: string, init?: RequestInit, errorMsg?: string): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message ?? errorMsg ?? "요청에 실패했습니다.");
  return data as T;
}

/** 응답 바디가 없는 요청 (DELETE, void POST) */
async function requestVoid(url: string, init?: RequestInit, errorMsg?: string): Promise<void> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const data = await res.json();
    throw new Error((data as { message?: string }).message ?? errorMsg ?? "요청에 실패했습니다.");
  }
}

// ── 타입 ───────────────────────────────────────────────

export interface AuthUser {
  id: number;
  username: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface CustomInputItem {
  id: number;
  label: string;
  data: string;
  createdAt: string;
}

export interface HistoryEntry {
  runCount: number;
  lastRunAt: string;
}

export interface AllUserData {
  bookmarks: string[];
  memos: Record<string, string>;
  history: Record<string, HistoryEntry>;
}

// ── 인증 ───────────────────────────────────────────────

export function apiRegister(username: string, password: string, name: string): Promise<AuthResponse> {
  return request<AuthResponse>(
    `${BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name }),
    },
    "회원가입에 실패했습니다.",
  );
}

export function apiLogin(username: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>(
    `${BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    },
    "로그인에 실패했습니다.",
  );
}

// ── 통합 유저 데이터 ───────────────────────────────────

export function apiFetchAllUserData(token: string): Promise<AllUserData> {
  return request<AllUserData>(
    `${BASE_URL}/api/user-data`,
    {
      headers: authHeader(token),
    },
    "데이터를 불러오지 못했습니다.",
  );
}

// ── 북마크 ─────────────────────────────────────────────

export function apiAddBookmark(token: string, algorithmId: string): Promise<void> {
  return requestVoid(
    `${BASE_URL}/api/bookmarks`,
    {
      method: "POST",
      headers: jsonHeader(token),
      body: JSON.stringify({ algorithmId }),
    },
    "북마크 저장에 실패했습니다.",
  );
}

export function apiRemoveBookmark(token: string, algorithmId: string): Promise<void> {
  return requestVoid(
    `${BASE_URL}/api/bookmarks/${encodeURIComponent(algorithmId)}`,
    {
      method: "DELETE",
      headers: authHeader(token),
    },
    "북마크 삭제에 실패했습니다.",
  );
}

// ── 메모 ───────────────────────────────────────────────

export function apiSaveMemo(token: string, algorithmId: string, content: string): Promise<void> {
  return requestVoid(
    `${BASE_URL}/api/memos`,
    {
      method: "POST",
      headers: jsonHeader(token),
      body: JSON.stringify({ algorithmId, content }),
    },
    "메모 저장에 실패했습니다.",
  );
}

export function apiDeleteMemo(token: string, algorithmId: string): Promise<void> {
  return requestVoid(
    `${BASE_URL}/api/memos/${encodeURIComponent(algorithmId)}`,
    {
      method: "DELETE",
      headers: authHeader(token),
    },
    "메모 삭제에 실패했습니다.",
  );
}

// ── 커스텀 입력 ────────────────────────────────────────

export function apiFetchCustomInputs(token: string, algorithmId: string): Promise<CustomInputItem[]> {
  return request<CustomInputItem[]>(
    `${BASE_URL}/api/custom-inputs?algorithmId=${encodeURIComponent(algorithmId)}`,
    {
      headers: authHeader(token),
    },
    "커스텀 입력을 불러오지 못했습니다.",
  );
}

export function apiSaveCustomInput(token: string, algorithmId: string, label: string, data: string): Promise<CustomInputItem> {
  return request<CustomInputItem>(
    `${BASE_URL}/api/custom-inputs`,
    {
      method: "POST",
      headers: jsonHeader(token),
      body: JSON.stringify({ algorithmId, label, data }),
    },
    "커스텀 입력 저장에 실패했습니다.",
  );
}

export function apiDeleteCustomInput(token: string, id: number): Promise<void> {
  return requestVoid(
    `${BASE_URL}/api/custom-inputs/${id}`,
    {
      method: "DELETE",
      headers: authHeader(token),
    },
    "커스텀 입력 삭제에 실패했습니다.",
  );
}

// ── 학습 진도 기록 ─────────────────────────────────────

export function apiRecordRun(token: string, algorithmId: string): Promise<HistoryEntry> {
  return request<HistoryEntry>(
    `${BASE_URL}/api/learning-history`,
    {
      method: "POST",
      headers: jsonHeader(token),
      body: JSON.stringify({ algorithmId }),
    },
    "학습 기록 저장에 실패했습니다.",
  );
}
