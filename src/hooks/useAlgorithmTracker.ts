"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserDataStore } from "@/store/userDataStore";

/**
 * 알고리즘 페이지 마운트 시 1회 학습 기록을 서버에 남깁니다.
 * 로그인 상태일 때만 동작합니다.
 */
export function useAlgorithmTracker(algorithmId: string) {
  const { token, isLoggedIn } = useAuthStore();
  const { recordRun } = useUserDataStore();
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    if (isLoggedIn() && token) {
      recorded.current = true;
      recordRun(token, algorithmId).catch(() => {
        recorded.current = false;
      });
    }
  }, [algorithmId, token, isLoggedIn, recordRun]);
}
