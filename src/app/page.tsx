import Link from "next/link";
import s from "./page.module.css";

const categories = [
  { id: 1, title: "Bubble Sort", description: "인접한 두 원소를 비교해 정렬", href: "/bubble-sort", theme: "red", icon: "🫧" },
  { id: 2, title: "Selection Sort", description: "최솟값을 찾아 앞으로 이동", href: "/selection-sort", theme: "orange", icon: "🎯" },
  { id: 3, title: "Insertion Sort", description: "카드 정렬처럼 적절한 위치에 삽입", href: "/insertion-sort", theme: "yellow", icon: "🃏" },
  { id: 4, title: "Binary Search", description: "정렬된 배열에서 절반씩 탐색", href: "/binary-search", theme: "lime", icon: "🔍" },
  { id: 5, title: "DFS", description: "깊이 우선 탐색 — 스택/재귀", href: "/dfs", theme: "green", icon: "🌲" },
  { id: 6, title: "BFS", description: "너비 우선 탐색 — 큐 활용", href: "/bfs", theme: "teal", icon: "🌊" },
  { id: 7, title: "Merge Sort", description: "분할 정복으로 병합 정렬", href: "/merge-sort", theme: "cyan", icon: "🔀" },
  { id: 8, title: "Quick Sort", description: "피벗 기준으로 분할 정렬", href: "/quick-sort", theme: "blue", icon: "⚡" },
  { id: 9, title: "Union Find", description: "서로소 집합 — 합집합 탐색", href: "/union-find", theme: "indigo", icon: "🔗" },
  { id: 10, title: "Dijkstra", description: "최단 경로 알고리즘", href: "/dijkstra", theme: "purple", icon: "🗺️" },
  { id: 11, title: "TailwindCSS", description: "클래스 레퍼런스 정리", href: "/tailwind-reference", theme: "pink", icon: "🎨" },
];

export default function Home() {
  return (
    <main className={s.page}>
      <div className={s.hero}>
        <h1 className={s.title}>AlgoCanvas</h1>
        <p className={s.subtitle}>알고리즘 시각화</p>
      </div>

      <div className={s.grid}>
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.href} className={`${s.card} ${s[cat.theme]}`}>
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
