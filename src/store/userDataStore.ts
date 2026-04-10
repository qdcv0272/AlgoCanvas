import { create } from "zustand";
import {
  apiFetchBookmarks,
  apiAddBookmark,
  apiRemoveBookmark,
  apiFetchMemos,
  apiSaveMemo,
  apiDeleteMemo,
  apiFetchCustomInputs,
  apiSaveCustomInput,
  apiDeleteCustomInput,
  CustomInputItem,
  apiFetchHistory,
  apiRecordRun,
  HistoryEntry,
} from "@/lib/api";

interface UserDataState {
  bookmarks: string[];
  memos: Record<string, string>;
  customInputs: Record<string, CustomInputItem[]>;
  history: Record<string, HistoryEntry>;
  fetchAll: (token: string) => Promise<void>;
  toggleBookmark: (token: string, algorithmId: string) => Promise<void>;
  saveMemo: (token: string, algorithmId: string, content: string) => Promise<void>;
  deleteMemo: (token: string, algorithmId: string) => Promise<void>;
  fetchCustomInputs: (token: string, algorithmId: string) => Promise<void>;
  saveCustomInput: (token: string, algorithmId: string, label: string, data: string) => Promise<CustomInputItem>;
  deleteCustomInput: (token: string, id: number, algorithmId: string) => Promise<void>;
  recordRun: (token: string, algorithmId: string) => Promise<void>;
  clear: () => void;
}

export const useUserDataStore = create<UserDataState>()((set, get) => ({
  bookmarks: [],
  memos: {},
  customInputs: {},
  history: {},

  fetchAll: async (token) => {
    const [bookmarks, memos, history] = await Promise.all([apiFetchBookmarks(token), apiFetchMemos(token), apiFetchHistory(token)]);
    set({ bookmarks, memos, history });
  },

  toggleBookmark: async (token, algorithmId) => {
    const { bookmarks } = get();
    const isBookmarked = bookmarks.includes(algorithmId);
    // 낙관적 업데이트
    set({
      bookmarks: isBookmarked ? bookmarks.filter((id) => id !== algorithmId) : [...bookmarks, algorithmId],
    });
    try {
      if (isBookmarked) {
        await apiRemoveBookmark(token, algorithmId);
      } else {
        await apiAddBookmark(token, algorithmId);
      }
    } catch {
      // 실패 시 롤백
      set({ bookmarks });
    }
  },

  saveMemo: async (token, algorithmId, content) => {
    await apiSaveMemo(token, algorithmId, content);
    set((state) => ({
      memos: { ...state.memos, [algorithmId]: content },
    }));
  },

  deleteMemo: async (token, algorithmId) => {
    await apiDeleteMemo(token, algorithmId);
    set((state) => {
      const next = { ...state.memos };
      delete next[algorithmId];
      return { memos: next };
    });
  },

  fetchCustomInputs: async (token, algorithmId) => {
    const items = await apiFetchCustomInputs(token, algorithmId);
    set((state) => ({ customInputs: { ...state.customInputs, [algorithmId]: items } }));
  },

  saveCustomInput: async (token, algorithmId, label, data) => {
    const item = await apiSaveCustomInput(token, algorithmId, label, data);
    set((state) => ({
      customInputs: {
        ...state.customInputs,
        [algorithmId]: [item, ...(state.customInputs[algorithmId] ?? [])],
      },
    }));
    return item;
  },

  deleteCustomInput: async (token, id, algorithmId) => {
    await apiDeleteCustomInput(token, id);
    set((state) => ({
      customInputs: {
        ...state.customInputs,
        [algorithmId]: (state.customInputs[algorithmId] ?? []).filter((i) => i.id !== id),
      },
    }));
  },

  recordRun: async (token, algorithmId) => {
    const entry = await apiRecordRun(token, algorithmId);
    set((state) => ({
      history: { ...state.history, [algorithmId]: entry },
    }));
  },

  clear: () => set({ bookmarks: [], memos: {}, customInputs: {}, history: {} }),
}));
