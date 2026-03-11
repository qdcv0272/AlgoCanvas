import Link from "next/link";
import s from "./page.module.css";
import React from "react";

interface Category {
  id: number;
  title: string;
  description: string;
  href: string;
  gradFrom: string;
  gradTo: string;
  accent: string;
  icon: string;
}

const categories: Category[] = [
  { id: 1, title: "Bubble Sort", description: "인접한 두 원소를 비교해 정렬", href: "/bubble-sort", gradFrom: "#ef4444", gradTo: "#f97316", accent: "#f97316", icon: "🫧" },
  { id: 2, title: "Selection Sort", description: "최솟값을 찾아 앞으로 이동", href: "/selection-sort", gradFrom: "#f97316", gradTo: "#eab308", accent: "#eab308", icon: "🎯" },
  { id: 3, title: "Insertion Sort", description: "카드 정렬처럼 적절한 위치에 삽입", href: "/insertion-sort", gradFrom: "#eab308", gradTo: "#84cc16", accent: "#84cc16", icon: "🃏" },
  { id: 4, title: "Binary Search", description: "정렬된 배열에서 절반씩 탐색", href: "/binary-search", gradFrom: "#84cc16", gradTo: "#22c55e", accent: "#22c55e", icon: "🔍" },
  { id: 5, title: "DFS", description: "깊이 우선 탐색 — 스택/재귀", href: "/dfs", gradFrom: "#22c55e", gradTo: "#14b8a6", accent: "#14b8a6", icon: "🌲" },
  { id: 6, title: "BFS", description: "너비 우선 탐색 — 큐 활용", href: "/bfs", gradFrom: "#14b8a6", gradTo: "#06b6d4", accent: "#06b6d4", icon: "🌊" },
  { id: 7, title: "Merge Sort", description: "분할 정복으로 병합 정렬", href: "/merge-sort", gradFrom: "#06b6d4", gradTo: "#3b82f6", accent: "#3b82f6", icon: "🔀" },
  { id: 8, title: "Quick Sort", description: "피벗 기준으로 분할 정렬", href: "/quick-sort", gradFrom: "#3b82f6", gradTo: "#6366f1", accent: "#6366f1", icon: "⚡" },
  { id: 9, title: "Union Find", description: "서로소 집합 — 합집합 탐색", href: "/union-find", gradFrom: "#6366f1", gradTo: "#a855f7", accent: "#a855f7", icon: "🔗" },
  { id: 10, title: "Dijkstra", description: "최단 경로 알고리즘", href: "/dijkstra", gradFrom: "#a855f7", gradTo: "#ec4899", accent: "#ec4899", icon: "🗺️" },
  { id: 11, title: "TailwindCSS", description: "클래스 레퍼런스 완전 정리", href: "/tailwind-reference", gradFrom: "#ec4899", gradTo: "#f43f5e", accent: "#f43f5e", icon: "🎨" },
];

export default function Home() {
  return (
    <main className={s.page}>
      <div className={s.hero}>
        <h1 className={s.title}>AlgoCanvas</h1>
        <p className={s.subtitle}>알고리즘 시각화 학습 플랫폼</p>
      </div>

      <div className={s.grid}>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={s.card}
            style={
              {
                "--grad-from": cat.gradFrom,
                "--grad-to": cat.gradTo,
                "--accent-color": cat.accent,
                "--border-color": `${cat.accent}33`,
              } as React.CSSProperties
            }
          >
            <span className={s.badge}>#{String(cat.id).padStart(2, "0")}</span>

            <div className={s.icon}>{cat.icon}</div>

            <h2 className={s.cardTitle}>{cat.title}</h2>
            <p className={s.cardDesc}>{cat.description}</p>

            <div className={s.arrow}>
              <span>바로가기</span>
              <span className={s.arrowIcon}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
