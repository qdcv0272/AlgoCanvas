const BASE_URL = "";

export interface AuthUser {
  id: number;
  username: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function apiRegister(username: string, password: string, name: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "회원가입에 실패했습니다.");
  return data as AuthResponse;
}

export async function apiLogin(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "로그인에 실패했습니다.");
  return data as AuthResponse;
}

// ── 북마크 ─────────────────────────────────────────────

export async function apiFetchBookmarks(token: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "북마크를 불러오지 못했습니다.");
  return data as string[];
}

export async function apiAddBookmark(token: string, algorithmId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ algorithmId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "북마크 저장에 실패했습니다.");
  }
}

export async function apiRemoveBookmark(token: string, algorithmId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/bookmarks/${encodeURIComponent(algorithmId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "북마크 삭제에 실패했습니다.");
  }
}

// ── 메모 ───────────────────────────────────────────────

export async function apiFetchMemos(token: string): Promise<Record<string, string>> {
  const res = await fetch(`${BASE_URL}/api/memos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "메모를 불러오지 못했습니다.");
  return data as Record<string, string>;
}

export async function apiSaveMemo(token: string, algorithmId: string, content: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/memos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ algorithmId, content }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "메모 저장에 실패했습니다.");
  }
}

export async function apiDeleteMemo(token: string, algorithmId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/memos/${encodeURIComponent(algorithmId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "메모 삭제에 실패했습니다.");
  }
}

// ── 커스텀 입력 ────────────────────────────────────────

export interface CustomInputItem {
  id: number;
  label: string;
  data: string;
  createdAt: string;
}

export async function apiFetchCustomInputs(token: string, algorithmId: string): Promise<CustomInputItem[]> {
  const res = await fetch(`${BASE_URL}/api/custom-inputs?algorithmId=${encodeURIComponent(algorithmId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "커스텀 입력을 불러오지 못했습니다.");
  return data as CustomInputItem[];
}

export async function apiSaveCustomInput(token: string, algorithmId: string, label: string, data: string): Promise<CustomInputItem> {
  const res = await fetch(`${BASE_URL}/api/custom-inputs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ algorithmId, label, data }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "커스텀 입력 저장에 실패했습니다.");
  return result as CustomInputItem;
}

export async function apiDeleteCustomInput(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/custom-inputs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? "커스텀 입력 삭제에 실패했습니다.");
  }
}

// ── 학습 진도 기록 ─────────────────────────────────────

export interface HistoryEntry {
  runCount: number;
  lastRunAt: string;
}

export async function apiFetchHistory(token: string): Promise<Record<string, HistoryEntry>> {
  const res = await fetch(`${BASE_URL}/api/learning-history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "학습 기록을 불러오지 못했습니다.");
  return data as Record<string, HistoryEntry>;
}

export async function apiRecordRun(token: string, algorithmId: string): Promise<HistoryEntry> {
  const res = await fetch(`${BASE_URL}/api/learning-history`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ algorithmId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "학습 기록 저장에 실패했습니다.");
  return data as HistoryEntry;
}
