import { create } from "zustand";

export type BarState = "default" | "comparing" | "swapping" | "sorted";

export interface Bar {
  value: number;
  state: BarState;
}

export interface Step {
  bars: Bar[];
  comparingIndices: [number, number] | null; // [key 위치, 비교 대상 위치]
  swapped: boolean; // true = 이동(shift) 발생
  sortedCount: number; // 앞에서 몇 개가 정렬됐는지
  targetIndex: number | null; // key의 현재 위치 (▼ 표시용)
}

interface InsertionSortStore {
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

  for (let i = 1; i < n; i++) {
    const key = a[i];

    // key 선택 단계 — i번째 원소 하이라이트
    steps.push({
      bars: a.map((v, idx) => {
        if (idx < i) return { value: v, state: "sorted" };
        if (idx === i) return { value: v, state: "comparing" };
        return { value: v, state: "default" };
      }),
      comparingIndices: null,
      swapped: false,
      sortedCount: i,
      targetIndex: i,
    });

    let j = i - 1;

    while (j >= 0) {
      const shouldShift = descending ? a[j] < key : a[j] > key;

      // 비교 단계 — key(j+1 위치)와 a[j] 비교
      steps.push({
        bars: a.map((v, idx) => {
          if (idx < j) return { value: v, state: "sorted" };
          if (idx === j) return { value: v, state: "comparing" };
          if (idx === j + 1) return { value: key, state: "comparing" }; // key 표시
          return { value: v, state: "default" };
        }),
        comparingIndices: [j + 1, j],
        swapped: false,
        sortedCount: i,
        targetIndex: j + 1,
      });

      if (!shouldShift) break;

      // 이동(shift) 단계 — a[j]를 오른쪽으로 한 칸 밀기
      a[j + 1] = a[j];

      steps.push({
        bars: a.map((v, idx) => {
          if (idx < j) return { value: v, state: "sorted" };
          if (idx === j) return { value: key, state: "swapping" }; // key 위치
          if (idx === j + 1) return { value: v, state: "swapping" }; // 밀린 원소
          return { value: v, state: "default" };
        }),
        comparingIndices: [j + 1, j],
        swapped: true,
        sortedCount: i,
        targetIndex: j,
      });

      j--;
    }

    // key를 올바른 위치에 삽입
    a[j + 1] = key;

    // 패스 종료 — 0..i 확정
    steps.push({
      bars: a.map((v, idx) => {
        if (idx <= i) return { value: v, state: "sorted" };
        return { value: v, state: "default" };
      }),
      comparingIndices: null,
      swapped: false,
      sortedCount: i + 1,
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

export const useInsertionSortStore = create<InsertionSortStore>((set, get) => ({
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
