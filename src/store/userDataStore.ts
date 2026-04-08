import { create } from "zustand";
import { apiFetchBookmarks, apiAddBookmark, apiRemoveBookmark, apiFetchMemos, apiSaveMemo, apiDeleteMemo } from "@/lib/api";

interface UserDataState {
  bookmarks: string[];
  memos: Record<string, string>;
  fetchAll: (token: string) => Promise<void>;
  toggleBookmark: (token: string, algorithmId: string) => Promise<void>;
  saveMemo: (token: string, algorithmId: string, content: string) => Promise<void>;
  deleteMemo: (token: string, algorithmId: string) => Promise<void>;
  clear: () => void;
}

export const useUserDataStore = create<UserDataState>()((set, get) => ({
  bookmarks: [],
  memos: {},

  fetchAll: async (token) => {
    const [bookmarks, memos] = await Promise.all([apiFetchBookmarks(token), apiFetchMemos(token)]);
    set({ bookmarks, memos });
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

  clear: () => set({ bookmarks: [], memos: {} }),
}));
