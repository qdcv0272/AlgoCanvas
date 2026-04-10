import { create } from "zustand";

export type BsBarState = "default" | "mid" | "eliminated" | "found";

export interface BsBar {
  value: number;
  state: BsBarState;
}

export interface BsStep {
  bars: BsBar[];
  low: number;
  high: number;
  mid: number | null;
  found: boolean;
  notFound: boolean;
  target: number;
  message: string;
}

interface BinarySearchStore {
  steps: BsStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  originalArr: number[];
  target: number;

  init: () => void;
  initWithCustom: (arr: number[], target: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  ending: () => void;
  randomize: () => void;
  changeTarget: () => void;
}

function generateSortedArray(size = 12): number[] {
  const pool = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size).sort((a, b) => a - b);
}

function pickTarget(arr: number[], exclude?: number): number {
  // 60% 확률로 배열 안의 값 (발견), 40% 확률로 배열에 없는 값 (탐색 실패)
  const useFound = Math.random() < 0.6;
  if (useFound) {
    const candidates = arr.filter((v) => v !== exclude);
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  const max = arr[arr.length - 1];
  const notInArr = Array.from({ length: max + 5 }, (_, i) => i + 1).filter((x) => !arr.includes(x) && x !== exclude);
  if (notInArr.length > 0) {
    return notInArr[Math.floor(Math.random() * notInArr.length)];
  }
  return max + 1;
}

function buildSteps(arr: number[], target: number): BsStep[] {
  const steps: BsStep[] = [];
  const n = arr.length;

  // 초기 상태
  steps.push({
    bars: arr.map((v) => ({ value: v, state: "default" })),
    low: 0,
    high: n - 1,
    mid: null,
    found: false,
    notFound: false,
    target,
    message: `탐색 시작 — 목표값: ${target}, 범위: [0, ${n - 1}]`,
  });

  let low = 0;
  let high = n - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // mid 비교 단계
    steps.push({
      bars: arr.map((v, idx) => {
        if (idx < low || idx > high) return { value: v, state: "eliminated" };
        if (idx === mid) return { value: v, state: "mid" };
        return { value: v, state: "default" };
      }),
      low,
      high,
      mid,
      found: false,
      notFound: false,
      target,
      message: `mid = ⌊(${low}+${high})/2⌋ = ${mid}  →  arr[${mid}] = ${arr[mid]} 과(와) ${target} 비교`,
    });

    if (arr[mid] === target) {
      // 발견!
      steps.push({
        bars: arr.map((v, idx) => ({
          value: v,
          state: idx === mid ? "found" : "eliminated",
        })),
        low,
        high,
        mid,
        found: true,
        notFound: false,
        target,
        message: `✅ arr[${mid}] = ${arr[mid]} — 목표값 ${target} 발견!`,
      });
      return steps;
    } else if (arr[mid] < target) {
      low = mid + 1;
      steps.push({
        bars: arr.map((v, idx) => {
          if (idx < low || idx > high) return { value: v, state: "eliminated" };
          return { value: v, state: "default" };
        }),
        low,
        high,
        mid: null,
        found: false,
        notFound: false,
        target,
        message: `arr[${mid}] = ${arr[mid]} < ${target} → low = ${mid}+1 = ${low}  (오른쪽 반 탐색)`,
      });
    } else {
      high = mid - 1;
      steps.push({
        bars: arr.map((v, idx) => {
          if (idx < low || idx > high) return { value: v, state: "eliminated" };
          return { value: v, state: "default" };
        }),
        low,
        high,
        mid: null,
        found: false,
        notFound: false,
        target,
        message: `arr[${mid}] = ${arr[mid]} > ${target} → high = ${mid}-1 = ${high}  (왼쪽 반 탐색)`,
      });
    }
  }

  // 탐색 실패
  steps.push({
    bars: arr.map((v) => ({ value: v, state: "eliminated" })),
    low,
    high,
    mid: null,
    found: false,
    notFound: true,
    target,
    message: `❌ ${target}를 찾지 못했습니다 (low=${low} > high=${high})`,
  });

  return steps;
}

let playTimer: ReturnType<typeof setTimeout> | null = null;

export const useBinarySearchStore = create<BinarySearchStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 800,
  originalArr: [],
  target: 0,

  init() {
    const arr = generateSortedArray(12);
    const target = pickTarget(arr);
    const steps = buildSteps(arr, target);
    set({ steps, currentStep: 0, isPlaying: false, originalArr: arr, target });
  },

  randomize() {
    if (playTimer) clearTimeout(playTimer);
    const arr = generateSortedArray(12);
    const target = pickTarget(arr);
    const steps = buildSteps(arr, target);
    set({ steps, currentStep: 0, isPlaying: false, originalArr: arr, target });
  },

  initWithCustom(arr: number[], target: number) {
    if (playTimer) clearTimeout(playTimer);
    const sorted = [...arr].sort((a, b) => a - b);
    const steps = buildSteps(sorted, target);
    set({ steps, currentStep: 0, isPlaying: false, originalArr: sorted, target });
  },

  changeTarget() {
    if (playTimer) clearTimeout(playTimer);
    const { originalArr, target: currentTarget } = get();
    const newTarget = pickTarget(originalArr, currentTarget);
    const steps = buildSteps(originalArr, newTarget);
    set({ steps, currentStep: 0, isPlaying: false, target: newTarget });
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
