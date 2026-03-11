import { create } from "zustand";

export type BarState = "default" | "comparing" | "swapping" | "sorted";

export interface Bar {
  value: number;
  state: BarState;
}

export interface Step {
  bars: Bar[];
  comparingIndices: [number, number] | null;
  swapped: boolean;
  sortedCount: number; // 뒤에서 몇 개가 정렬됐는지
}

interface BubbleSortStore {
  steps: Step[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  isReversed: boolean;
  originalArr: number[];

  init: (size?: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  randomize: () => void;
  reverse: () => void;
}

function generateArray(size = 10): number[] {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildSteps(arr: number[], descending = false): Step[] {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;

  // 초기 상태
  steps.push({
    bars: a.map((v) => ({ value: v, state: "default" })),
    comparingIndices: null,
    swapped: false,
    sortedCount: 0,
  });

  let sortedCount = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      // 비교 단계
      const compareBars: Bar[] = a.map((v, idx) => {
        if (idx === j || idx === j + 1) return { value: v, state: "comparing" };
        if (idx >= n - i) return { value: v, state: "sorted" };
        return { value: v, state: "default" };
      });

      steps.push({
        bars: compareBars,
        comparingIndices: [j, j + 1],
        swapped: false,
        sortedCount,
      });

      const shouldSwap = descending ? a[j] < a[j + 1] : a[j] > a[j + 1];

      if (shouldSwap) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];

        const swapBars: Bar[] = a.map((v, idx) => {
          if (idx === j || idx === j + 1) return { value: v, state: "swapping" };
          if (idx >= n - i) return { value: v, state: "sorted" };
          return { value: v, state: "default" };
        });

        steps.push({
          bars: swapBars,
          comparingIndices: [j, j + 1],
          swapped: true,
          sortedCount,
        });
      }
    }

    sortedCount = i + 1;
    const passEndBars: Bar[] = a.map((v, idx) => {
      if (idx >= n - sortedCount) return { value: v, state: "sorted" };
      return { value: v, state: "default" };
    });

    steps.push({
      bars: passEndBars,
      comparingIndices: null,
      swapped: false,
      sortedCount,
    });
  }

  // 완료
  steps.push({
    bars: a.map((v) => ({ value: v, state: "sorted" })),
    comparingIndices: null,
    swapped: false,
    sortedCount: n,
  });

  return steps;
}

let playTimer: ReturnType<typeof setTimeout> | null = null;

export const useBubbleSortStore = create<BubbleSortStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 700,
  isReversed: false,
  originalArr: [],

  init(size = 10) {
    const arr = generateArray(size);
    const steps = buildSteps(arr, false);
    set({ steps, currentStep: 0, isPlaying: false, originalArr: arr, isReversed: false });
  },

  randomize() {
    if (playTimer) clearTimeout(playTimer);
    const { isReversed } = get();
    const arr = generateArray(10);
    const steps = buildSteps(arr, isReversed);
    set({ steps, currentStep: 0, isPlaying: false, originalArr: arr });
  },

  reverse() {
    if (playTimer) clearTimeout(playTimer);
    const { isReversed, originalArr } = get();
    const newReversed = !isReversed;
    const steps = buildSteps(originalArr, newReversed);
    set({ steps, currentStep: 0, isPlaying: false, isReversed: newReversed });
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
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prev() {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  reset() {
    if (playTimer) clearTimeout(playTimer);
    set({ currentStep: 0, isPlaying: false });
  },

  setSpeed(speed) {
    set({ speed });
  },
}));
