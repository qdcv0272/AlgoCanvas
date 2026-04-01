import { create } from "zustand";

export type DijkstraNodeState = "unvisited" | "inQueue" | "current" | "settled";

export interface DijkstraStep {
  nodeStates: Record<number, DijkstraNodeState>;
  distances: Record<number, number>;
  prevNode: Record<number, number | null>;
  pqSnapshot: Array<{ node: number; dist: number }>;
  examiningEdge: [number, number] | null;
  description: string;
}

export const DIJKSTRA_NODES = [
  { id: 1, x: 80, y: 170, label: "A" },
  { id: 2, x: 220, y: 60, label: "B" },
  { id: 3, x: 220, y: 280, label: "C" },
  { id: 4, x: 370, y: 60, label: "D" },
  { id: 5, x: 370, y: 280, label: "E" },
  { id: 6, x: 500, y: 170, label: "F" },
];

export const DIJKSTRA_EDGES: Array<{ from: number; to: number; weight: number }> = [
  { from: 1, to: 2, weight: 4 },
  { from: 1, to: 3, weight: 2 },
  { from: 2, to: 3, weight: 1 },
  { from: 2, to: 4, weight: 5 },
  { from: 3, to: 4, weight: 8 },
  { from: 3, to: 5, weight: 10 },
  { from: 4, to: 5, weight: 2 },
  { from: 4, to: 6, weight: 6 },
  { from: 5, to: 6, weight: 3 },
];

const SOURCE = 1;
const INF = Infinity;

// 인접 리스트 (무방향)
const ADJACENCY: Record<number, Array<{ neighbor: number; weight: number }>> = {};
DIJKSTRA_NODES.forEach((n) => (ADJACENCY[n.id] = []));
DIJKSTRA_EDGES.forEach(({ from, to, weight }) => {
  ADJACENCY[from].push({ neighbor: to, weight });
  ADJACENCY[to].push({ neighbor: from, weight });
});

function buildSteps(): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const nodeStates: Record<number, DijkstraNodeState> = {};
  const distances: Record<number, number> = {};
  const prevNode: Record<number, number | null> = {};

  DIJKSTRA_NODES.forEach((n) => {
    nodeStates[n.id] = "unvisited";
    distances[n.id] = INF;
    prevNode[n.id] = null;
  });

  const snap = () => ({
    nodeStates: { ...nodeStates },
    distances: { ...distances },
    prevNode: { ...prevNode },
  });

  // 초기 상태
  steps.push({
    ...snap(),
    pqSnapshot: [],
    examiningEdge: null,
    description: "시작 노드 A에서 Dijkstra 탐색을 시작합니다. 모든 노드의 거리는 ∞로 초기화됩니다.",
  });

  // 시작 노드 초기화
  distances[SOURCE] = 0;
  nodeStates[SOURCE] = "inQueue";
  const pq: Array<{ node: number; dist: number }> = [{ node: SOURCE, dist: 0 }];

  steps.push({
    ...snap(),
    pqSnapshot: [...pq],
    examiningEdge: null,
    description: "시작 노드 A의 거리를 0으로 설정하고 우선순위 큐에 추가합니다.",
  });

  const settled = new Set<number>();

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const entry = pq.shift()!;
    const current = entry.node;

    // 낡은 항목 건너뜀
    if (settled.has(current) || entry.dist > distances[current]) continue;

    const nodeLabel = DIJKSTRA_NODES[current - 1].label;
    nodeStates[current] = "current";

    steps.push({
      ...snap(),
      pqSnapshot: [...pq],
      examiningEdge: null,
      description: `큐에서 노드 ${nodeLabel}(${current})을(를) 꺼냅니다. 현재 최단 거리: ${distances[current]}`,
    });

    // 인접 노드 처리
    for (const { neighbor, weight } of ADJACENCY[current]) {
      if (settled.has(neighbor)) continue;

      const newDist = distances[current] + weight;
      const oldDist = distances[neighbor];
      const nLabel = DIJKSTRA_NODES[neighbor - 1].label;
      const improved = newDist < oldDist;

      // 간선 검토
      steps.push({
        ...snap(),
        pqSnapshot: [...pq],
        examiningEdge: [current, neighbor],
        description: `간선 ${nodeLabel}→${nLabel} 검토: ${distances[current]} + ${weight} = ${newDist} vs 현재 ${oldDist === INF ? "∞" : oldDist}`,
      });

      if (improved) {
        distances[neighbor] = newDist;
        prevNode[neighbor] = current;
        if (nodeStates[neighbor] === "unvisited") {
          nodeStates[neighbor] = "inQueue";
        }
        pq.push({ node: neighbor, dist: newDist });

        steps.push({
          ...snap(),
          pqSnapshot: [...pq].sort((a, b) => a.dist - b.dist),
          examiningEdge: [current, neighbor],
          description: `✅ 거리 갱신: ${nLabel}(${neighbor})  ${oldDist === INF ? "∞" : oldDist} → ${newDist}`,
        });
      } else {
        steps.push({
          ...snap(),
          pqSnapshot: [...pq],
          examiningEdge: null,
          description: `⏭ 갱신 불필요: ${nLabel}(${neighbor}) 기존 거리 ${oldDist}이(가) 더 짧거나 같습니다.`,
        });
      }
    }

    // 노드 확정
    settled.add(current);
    nodeStates[current] = "settled";

    steps.push({
      ...snap(),
      pqSnapshot: [...pq].sort((a, b) => a.dist - b.dist),
      examiningEdge: null,
      description: `🔒 노드 ${nodeLabel}(${current}) 확정 — 최단 거리 ${distances[current]} 고정.`,
    });
  }

  // 완료
  steps.push({
    ...snap(),
    pqSnapshot: [],
    examiningEdge: null,
    description: "🎉 모든 노드의 최단 경로 탐색 완료! A에서 각 노드까지의 최단 거리가 확정되었습니다.",
  });

  return steps;
}

interface DijkstraStore {
  steps: DijkstraStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  init: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  ending: () => void;
}

let playTimer: ReturnType<typeof setTimeout> | null = null;

export const useDijkstraStore = create<DijkstraStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 700,

  init() {
    set({ steps: buildSteps(), currentStep: 0, isPlaying: false });
  },

  play() {
    set({ isPlaying: true });
    const tick = () => {
      const { currentStep, steps, speed, isPlaying } = get();
      if (!isPlaying) return;
      if (currentStep >= steps.length - 1) {
        set({ isPlaying: false });
        return;
      }
      set((s) => ({ currentStep: s.currentStep + 1 }));
      playTimer = setTimeout(tick, speed);
    };
    if (playTimer) clearTimeout(playTimer);
    playTimer = setTimeout(tick, get().speed);
  },

  pause() {
    if (playTimer) clearTimeout(playTimer);
    set({ isPlaying: false });
  },

  next() {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 });
  },

  prev() {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },

  reset() {
    if (playTimer) clearTimeout(playTimer);
    set({ currentStep: 0, isPlaying: false });
  },

  ending() {
    if (playTimer) clearTimeout(playTimer);
    const { steps } = get();
    set({ isPlaying: false, currentStep: steps.length - 1 });
  },
}));
