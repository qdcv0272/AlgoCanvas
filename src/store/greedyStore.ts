import { create } from "zustand";

// 거스름돈 문제: 주어진 금액을 최소 동전 개수로 거슬러주기
export const COINS = [500, 100, 50, 10, 5, 1];

export interface GreedyStep {
  amount: number; // 현재 남은 금액
  originalAmount: number; // 최초 금액
  coinIdx: number | null; // 현재 검사 중인 동전 인덱스
  usedCoins: { coin: number; count: number }[]; // 사용된 동전
  totalCoins: number;
  done: boolean;
}

function buildSteps(amount: number): GreedyStep[] {
  const steps: GreedyStep[] = [];
  const originalAmount = amount;
  const usedCoins: { coin: number; count: number }[] = [];
  let totalCoins = 0;

  steps.push({
    amount,
    originalAmount,
    coinIdx: null,
    usedCoins: [],
    totalCoins: 0,
    done: false,
  });

  for (let i = 0; i < COINS.length; i++) {
    const coin = COINS[i];

    // 동전 선택 단계
    steps.push({
      amount,
      originalAmount,
      coinIdx: i,
      usedCoins: [...usedCoins],
      totalCoins,
      done: false,
    });

    if (amount < coin) {
      steps.push({
        amount,
        originalAmount,
        coinIdx: i,
        usedCoins: [...usedCoins],
        totalCoins,
        done: false,
      });
      continue;
    }

    const count = Math.floor(amount / coin);
    amount -= coin * count;
    totalCoins += count;
    usedCoins.push({ coin, count });

    steps.push({
      amount,
      originalAmount,
      coinIdx: i,
      usedCoins: [...usedCoins],
      totalCoins,
      done: false,
    });
  }

  steps.push({
    amount: 0,
    originalAmount,
    coinIdx: null,
    usedCoins: [...usedCoins],
    totalCoins,
    done: true,
  });

  return steps;
}

function randomAmount(): number {
  // 1~9999 사이의 랜덤 금액 (1원 단위)
  return Math.floor(Math.random() * 9999) + 1;
}

interface GreedyStore {
  steps: GreedyStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  amount: number;
  init: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  ending: () => void;
  randomize: () => void;
}

let playTimer: ReturnType<typeof setTimeout> | null = null;

export const useGreedyStore = create<GreedyStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 700,
  amount: 0,

  init() {
    const amount = randomAmount();
    set({ steps: buildSteps(amount), currentStep: 0, isPlaying: false, amount });
  },

  randomize() {
    if (playTimer) clearTimeout(playTimer);
    const amount = randomAmount();
    set({ steps: buildSteps(amount), currentStep: 0, isPlaying: false, amount });
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
