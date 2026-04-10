"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useUserDataStore } from "@/store/userDataStore";
import MemoModal from "./MemoModal";
import s from "./AlgoGrid.module.css";

export const categories = [
  { id: 1, title: "Bubble Sort", description: "인접한 두 원소를 비교해 정렬", href: "/bubble-sort", theme: "red", icon: "🫧" },
  { id: 2, title: "Selection Sort", description: "최솟값을 찾아 앞으로 이동", href: "/selection-sort", theme: "orange", icon: "🎯" },
  { id: 3, title: "Insertion Sort", description: "카드 정렬처럼 적절한 위치에 삽입", href: "/insertion-sort", theme: "yellow", icon: "🃏" },
  { id: 4, title: "Binary Search", description: "정렬된 배열에서 절반씩 탐색", href: "/binary-search", theme: "lime", icon: "🔍" },
  { id: 5, title: "Greedy", description: "매 순간 최선의 선택을 반복", href: "/greedy", theme: "cyan", icon: "💡" },
  { id: 6, title: "DFS", description: "깊이 우선 탐색 — 스택/재귀", href: "/dfs", theme: "green", icon: "🌲" },
  { id: 7, title: "BFS", description: "너비 우선 탐색 — 큐 활용", href: "/bfs", theme: "teal", icon: "🌊" },
  { id: 8, title: "DP", description: "중복 계산을 줄이는 동적 프로그래밍", href: "/dp", theme: "blue", icon: "🧩" },
  { id: 9, title: "Dijkstra", description: "가중 그래프에서 최단 경로 탐색", href: "/dijkstra", theme: "pink", icon: "🗺️" },
];

interface MemoTarget {
  id: string;
  title: string;
}

export default function AlgoGrid() {
  const { token, isLoggedIn } = useAuthStore();
  const { bookmarks, memos, history, fetchAll, toggleBookmark, saveMemo, deleteMemo } = useUserDataStore();
  const [memoTarget, setMemoTarget] = useState<MemoTarget | null>(null);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (loggedIn && token) {
      fetchAll(token);
    }
  }, [loggedIn, token, fetchAll]);

  const handleBookmark = (e: React.MouseEvent, algorithmId: string) => {
    e.preventDefault();
    if (!token) return;
    toggleBookmark(token, algorithmId);
  };

  const handleMemoOpen = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    setMemoTarget({ id, title });
  };

  return (
    <>
      <div className={s.grid}>
        {categories.map((cat) => {
          const algId = cat.href.slice(1);
          const isBookmarked = bookmarks.includes(algId);
          const hasMemo = !!memos[algId];
          const runCount = history[algId]?.runCount ?? 0;

          return (
            <div key={cat.id} className={`${s.card} ${s[cat.theme]}`}>
              <Link href={cat.href} className={s.cardLink}>
                <span className={s.badge}>#{String(cat.id).padStart(2, "0")}</span>
                {loggedIn && runCount > 0 && (
                  <span className={s.runBadge} title={`${runCount}회 학습`}>
                    ▶ {runCount}회
                  </span>
                )}
                <div className={s.icon}>{cat.icon}</div>
                <h2 className={s.cardTitle}>{cat.title}</h2>
                <p className={s.cardDesc}>{cat.description}</p>
                <div className={s.arrow}>
                  <span>바로가기</span>
                  <span className={s.arrowIcon}>→</span>
                </div>
              </Link>

              {loggedIn && (
                <div className={s.actions}>
                  <button
                    className={`${s.actionBtn} ${isBookmarked ? s.bookmarked : ""}`}
                    onClick={(e) => handleBookmark(e, algId)}
                    title={isBookmarked ? "북마크 해제" : "북마크"}
                    aria-label={isBookmarked ? "북마크 해제" : "북마크"}
                  >
                    {isBookmarked ? "★" : "☆"}
                  </button>
                  <button className={`${s.actionBtn} ${hasMemo ? s.hasMemo : ""}`} onClick={(e) => handleMemoOpen(e, algId, cat.title)} title={hasMemo ? "메모 보기/편집" : "메모 추가"} aria-label="메모">
                    ✏️
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {memoTarget && (
        <MemoModal
          algorithmId={memoTarget.id}
          title={memoTarget.title}
          initialContent={memos[memoTarget.id] ?? ""}
          onClose={() => setMemoTarget(null)}
          onSave={async (content: string) => {
            if (token) await saveMemo(token, memoTarget.id, content);
            setMemoTarget(null);
          }}
          onDelete={async () => {
            if (token) await deleteMemo(token, memoTarget.id);
            setMemoTarget(null);
          }}
        />
      )}
    </>
  );
}
