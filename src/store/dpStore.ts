import { create } from "zustand";

// 피보나치 DP 시각화 (n=10까지)
export interface DpCell {
  index: number;
  value: number | null;
  state: "empty" | "computing" | "filled" | "referencing";
}

export interface DpStep {
  cells: DpCell[];
  currentIdx: number | null;
  refIndices: number[]; // 참조 중인 인덱스 (i-1, i-2)
  done: boolean;
}

function buildSteps(n: number): DpStep[] {
  const steps: DpStep[] = [];
  const dp: (number | null)[] = Array(n + 1).fill(null);

  const makeSnapshot = (currentIdx: number | null, refIndices: number[], done = false): DpStep => ({
    cells: Array.from({ length: n + 1 }, (_, i) => ({
      index: i,
      value: dp[i],
      state: i === currentIdx ? "computing" : refIndices.includes(i) ? "referencing" : dp[i] !== null ? "filled" : "empty",
    })),
    currentIdx,
    refIndices,
    done,
  });

  steps.push(makeSnapshot(null, []));

  // 기저 조건
  dp[0] = 0;
  steps.push(makeSnapshot(0, []));

  if (n >= 1) {
    dp[1] = 1;
    steps.push(makeSnapshot(1, []));
  }

  for (let i = 2; i <= n; i++) {
    steps.push(makeSnapshot(i, [i - 1, i - 2]));
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    steps.push(makeSnapshot(i, []));
  }

  steps.push(makeSnapshot(null, [], true));

  return steps;
}

interface DpStore {
  steps: DpStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  n: number;
  init: () => void;
  initWithCustom: (n: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  ending: () => void;
  changeN: (n: number) => void;
}

let playTimer: ReturnType<typeof setTimeout> | null = null;

export const useDpStore = create<DpStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 700,
  n: 10,

  init() {
    const n = 10;
    set({ steps: buildSteps(n), currentStep: 0, isPlaying: false, n });
  },

  changeN(n: number) {
    if (playTimer) clearTimeout(playTimer);
    set({ steps: buildSteps(n), currentStep: 0, isPlaying: false, n });
  },

  initWithCustom(n: number) {
    if (playTimer) clearTimeout(playTimer);
    set({ steps: buildSteps(n), currentStep: 0, isPlaying: false, n });
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
