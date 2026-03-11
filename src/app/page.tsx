import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Bubble Sort",
    description: "인접한 두 원소를 비교해 정렬",
    href: "/bubble-sort",
    color: "from-red-500 to-orange-500",
    border: "border-red-500/30 hover:border-red-400",
    icon: "🫧",
  },
  {
    id: 2,
    title: "Selection Sort",
    description: "최솟값을 찾아 앞으로 이동",
    href: "/selection-sort",
    color: "from-orange-500 to-yellow-500",
    border: "border-orange-500/30 hover:border-orange-400",
    icon: "🎯",
  },
  {
    id: 3,
    title: "Insertion Sort",
    description: "카드 정렬처럼 적절한 위치에 삽입",
    href: "/insertion-sort",
    color: "from-yellow-500 to-lime-500",
    border: "border-yellow-500/30 hover:border-yellow-400",
    icon: "🃏",
  },
  {
    id: 4,
    title: "Binary Search",
    description: "정렬된 배열에서 절반씩 탐색",
    href: "/binary-search",
    color: "from-lime-500 to-green-500",
    border: "border-lime-500/30 hover:border-lime-400",
    icon: "🔍",
  },
  {
    id: 5,
    title: "DFS",
    description: "깊이 우선 탐색 — 스택/재귀",
    href: "/dfs",
    color: "from-green-500 to-teal-500",
    border: "border-green-500/30 hover:border-green-400",
    icon: "🌲",
  },
  {
    id: 6,
    title: "BFS",
    description: "너비 우선 탐색 — 큐 활용",
    href: "/bfs",
    color: "from-teal-500 to-cyan-500",
    border: "border-teal-500/30 hover:border-teal-400",
    icon: "🌊",
  },
  {
    id: 7,
    title: "Merge Sort",
    description: "분할 정복으로 병합 정렬",
    href: "/merge-sort",
    color: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/30 hover:border-cyan-400",
    icon: "🔀",
  },
  {
    id: 8,
    title: "Quick Sort",
    description: "피벗 기준으로 분할 정렬",
    href: "/quick-sort",
    color: "from-blue-500 to-indigo-500",
    border: "border-blue-500/30 hover:border-blue-400",
    icon: "⚡",
  },
  {
    id: 9,
    title: "Union Find",
    description: "서로소 집합 — 합집합 탐색",
    href: "/union-find",
    color: "from-indigo-500 to-purple-500",
    border: "border-indigo-500/30 hover:border-indigo-400",
    icon: "🔗",
  },
  {
    id: 10,
    title: "Dijkstra",
    description: "최단 경로 알고리즘",
    href: "/dijkstra",
    color: "from-purple-500 to-pink-500",
    border: "border-purple-500/30 hover:border-purple-400",
    icon: "🗺️",
  },
  {
    id: 11,
    title: "TailwindCSS",
    description: "클래스 레퍼런스 완전 정리",
    href: "/tailwind-reference",
    color: "from-pink-500 to-rose-500",
    border: "border-pink-500/30 hover:border-pink-400",
    icon: "🎨",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="text-center pt-16 pb-10 px-4">
        <h1 className="text-5xl font-black tracking-tight mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AlgoCanvas</span>
        </h1>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.href}>
            <div className={`group relative bg-gray-900 border ${cat.border} rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40`}>
              {/* Number badge */}
              <span className="absolute top-4 right-4 text-xs font-mono text-gray-600">#{String(cat.id).padStart(2, "0")}</span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>{cat.icon}</div>

              {/* Title */}
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{cat.title}</h2>

              {/* Description */}
              <p className="text-sm text-gray-500">{cat.description}</p>

              {/* Arrow */}
              <div className="mt-4 flex items-center gap-1 text-xs text-gray-600 group-hover:text-cyan-400 transition-colors">
                <span>바로가기</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
