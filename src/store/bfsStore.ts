import { create } from "zustand";

export type BfsNodeState = "unvisited" | "queued" | "visiting" | "visited";

export interface BfsStep {
  nodeStates: Record<number, BfsNodeState>;
  queue: number[];
  currentNode: number | null;
  visitOrder: number[];
}

export const BFS_NODES = [
  { id: 1, x: 260, y: 44 },
  { id: 2, x: 140, y: 124 },
  { id: 3, x: 380, y: 124 },
  { id: 4, x: 70, y: 204 },
  { id: 5, x: 210, y: 204 },
  { id: 6, x: 310, y: 204 },
  { id: 7, x: 450, y: 204 },
  { id: 8, x: 30, y: 284 },
  { id: 9, x: 110, y: 284 },
  { id: 10, x: 350, y: 284 },
];

export const BFS_EDGES: [number, number][] = [
  [1, 2],
  [1, 3],
  [2, 4],
  [2, 5],
  [3, 6],
  [3, 7],
  [4, 8],
  [4, 9],
  [6, 10],
];

const ADJACENCY: Record<number, number[]> = {
  1: [2, 3],
  2: [4, 5],
  3: [6, 7],
  4: [8, 9],
  5: [],
  6: [10],
  7: [],
  8: [],
  9: [],
  10: [],
};

function buildSteps(): BfsStep[] {
  const steps: BfsStep[] = [];
  const nodeStates: Record<number, BfsNodeState> = {};
  BFS_NODES.forEach((n) => (nodeStates[n.id] = "unvisited"));

  steps.push({ nodeStates: { ...nodeStates }, queue: [], currentNode: null, visitOrder: [] });

  nodeStates[1] = "queued";
  const queue: number[] = [1];
  steps.push({ nodeStates: { ...nodeStates }, queue: [...queue], currentNode: null, visitOrder: [] });

  const visited = new Set<number>([1]);
  const visitOrder: number[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;

    nodeStates[node] = "visiting";
    steps.push({ nodeStates: { ...nodeStates }, queue: [...queue], currentNode: node, visitOrder: [...visitOrder] });

    visitOrder.push(node);
    nodeStates[node] = "visited";

    const neighbors = (ADJACENCY[node] ?? []).filter((n) => !visited.has(n));
    neighbors.forEach((n) => {
      visited.add(n);
      queue.push(n);
      nodeStates[n] = "queued";
    });

    steps.push({ nodeStates: { ...nodeStates }, queue: [...queue], currentNode: node, visitOrder: [...visitOrder] });
  }

  steps.push({ nodeStates: { ...nodeStates }, queue: [], currentNode: null, visitOrder: [...visitOrder] });

  return steps;
}

interface BfsStore {
  steps: BfsStep[];
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

export const useBfsStore = create<BfsStore>((set, get) => ({
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
