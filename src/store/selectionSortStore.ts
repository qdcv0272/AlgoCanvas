import { create } from "zustand";

export type BarState = "default" | "comparing" | "swapping" | "sorted";

export interface Bar {
  value: number;
  state: BarState;
}

export interface Step {
  bars: Bar[];
  comparingIndices: [number, number] | null; // 비교 중인 고정점과 탐색점
  swapped: boolean;
  sortedCount: number; // 앞에서 몇 개가 정렬됐는지
  targetIndex: number | null; // 최솟값이 놓일 자리 (현재 패스의 기준 위치 i)
}

interface SelectionSortStore {
  steps: Step[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  isReversed: boolean;
  originalArr: number[];

  init: (size?: number) => void;
  initWithCustom: (arr: number[]) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  ending: () => void;
  randomize: () => void;
  reverse: () => void;
}

function generateArray(size = 10): number[] {
  return Array.from({ length: size }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
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
    targetIndex: null,
  });

  let sortedCount = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // 최소값(또는 최대값) 찾기
    for (let j = i + 1; j < n; j++) {
      // 비교 단계 (현재 최소값 위치 minIdx와 탐색 위치 j를 비교)
      const compareBars: Bar[] = a.map((v, idx) => {
        if (idx < i) return { value: v, state: "sorted" };
        if (idx === minIdx) return { value: v, state: "comparing" };
        if (idx === j) return { value: v, state: "comparing" };
        return { value: v, state: "default" };
      });

      steps.push({
        bars: compareBars,
        comparingIndices: [minIdx, j],
        swapped: false,
        sortedCount,
        targetIndex: i,
      });

      const shouldUpdate = descending ? a[j] > a[minIdx] : a[j] < a[minIdx];
      if (shouldUpdate) {
        minIdx = j;
      }
    }

    // 교환 단계
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];

      const swapBars: Bar[] = a.map((v, idx) => {
        if (idx === i || idx === minIdx) return { value: v, state: "swapping" };
        if (idx < i) return { value: v, state: "sorted" };
        return { value: v, state: "default" };
      });

      steps.push({
        bars: swapBars,
        comparingIndices: [i, minIdx],
        swapped: true,
        sortedCount,
        targetIndex: i,
      });
    }

    sortedCount = i + 1;
    const passEndBars: Bar[] = a.map((v, idx) => {
      if (idx <= i) return { value: v, state: "sorted" };
      return { value: v, state: "default" };
    });

    steps.push({
      bars: passEndBars,
      comparingIndices: null,
      swapped: false,
      sortedCount,
      targetIndex: null,
    });
  }

  // 완료
  steps.push({
    bars: a.map((v) => ({ value: v, state: "sorted" })),
    comparingIndices: null,
    swapped: false,
    sortedCount: n,
    targetIndex: null,
  });

  return steps;
}

let playTimer: ReturnType<typeof setTimeout> | null = null;

export const useSelectionSortStore = create<SelectionSortStore>((set, get) => ({
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

  initWithCustom(arr: number[]) {
    if (playTimer) clearTimeout(playTimer);
    const { isReversed } = get();
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
  ending() {
    if (playTimer) clearTimeout(playTimer);
    const { steps } = get();
    set({ isPlaying: false, currentStep: steps.length - 1 });
  },
}));
