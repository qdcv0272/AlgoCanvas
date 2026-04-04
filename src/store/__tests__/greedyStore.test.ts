import { describe, it, expect, beforeEach } from "vitest";
import { useGreedyStore, COINS } from "../greedyStore";

function getStore() {
  return useGreedyStore.getState();
}

describe("greedyStore (거스름돈 문제)", () => {
  beforeEach(() => {
    getStore().init();
  });

  it("init() — 스텝이 생성되고 currentStep은 0이어야 한다", () => {
    const { steps, currentStep } = getStore();
    expect(steps.length).toBeGreaterThan(1);
    expect(currentStep).toBe(0);
  });

  it("COINS — [500, 100, 50, 10, 5, 1] 순서여야 한다", () => {
    expect(COINS).toEqual([500, 100, 50, 10, 5, 1]);
  });

  it("첫 스텝 — done이 false여야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].done).toBe(false);
  });

  it("첫 스텝 — usedCoins가 비어있어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].usedCoins).toHaveLength(0);
  });

  it("마지막 스텝 — done이 true여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.done).toBe(true);
  });

  it("마지막 스텝 — 남은 금액이 0이어야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.amount).toBe(0);
  });

  it("마지막 스텝 — 사용된 동전의 합이 originalAmount와 같아야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    const total = last.usedCoins.reduce((sum, { coin, count }) => sum + coin * count, 0);
    expect(total).toBe(last.originalAmount);
  });

  it("890원 — 9개의 동전으로 거슬러줘야 한다 (500x1, 100x3, 50x1, 10x4)", () => {
    useGreedyStore.setState(() => {
      const steps = buildTestSteps(890);
      return { steps, currentStep: 0 };
    });
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.totalCoins).toBe(9);
    expect(last.usedCoins).toContainEqual({ coin: 500, count: 1 });
    expect(last.usedCoins).toContainEqual({ coin: 100, count: 3 });
    expect(last.usedCoins).toContainEqual({ coin: 50, count: 1 });
    expect(last.usedCoins).toContainEqual({ coin: 10, count: 4 });
  });

  it("1원 — 1개의 동전으로 거슬러줘야 한다", () => {
    useGreedyStore.setState(() => {
      const steps = buildTestSteps(1);
      return { steps, currentStep: 0 };
    });
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.totalCoins).toBe(1);
    expect(last.usedCoins).toContainEqual({ coin: 1, count: 1 });
  });

  it("500원 — 1개의 동전으로 거슬러줘야 한다", () => {
    useGreedyStore.setState(() => {
      const steps = buildTestSteps(500);
      return { steps, currentStep: 0 };
    });
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.totalCoins).toBe(1);
    expect(last.usedCoins).toContainEqual({ coin: 500, count: 1 });
  });

  it("next() — currentStep이 1 증가해야 한다", () => {
    getStore().next();
    expect(getStore().currentStep).toBe(1);
  });

  it("prev() — 첫 스텝에서 0 미만으로 내려가지 않아야 한다", () => {
    getStore().prev();
    expect(getStore().currentStep).toBe(0);
  });

  it("reset() — currentStep을 0으로 되돌려야 한다", () => {
    useGreedyStore.setState({ currentStep: 4 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — 마지막 스텝으로 이동해야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("randomize() — 새로운 금액으로 스텝이 재생성되어야 한다", () => {
    useGreedyStore.setState({ currentStep: 5 });
    getStore().randomize();
    const { currentStep, steps } = getStore();
    expect(currentStep).toBe(0);
    expect(steps.length).toBeGreaterThan(1);
  });
});

// 테스트용 buildSteps 재현
function buildTestSteps(amount: number) {
  const originalAmount = amount;
  const usedCoins: { coin: number; count: number }[] = [];
  let totalCoins = 0;

  const steps = [];
  steps.push({ amount, originalAmount, coinIdx: null, usedCoins: [], totalCoins: 0, done: false });

  for (let i = 0; i < COINS.length; i++) {
    const coin = COINS[i];
    steps.push({ amount, originalAmount, coinIdx: i, usedCoins: [...usedCoins], totalCoins, done: false });

    if (amount < coin) {
      steps.push({ amount, originalAmount, coinIdx: i, usedCoins: [...usedCoins], totalCoins, done: false });
      continue;
    }

    const count = Math.floor(amount / coin);
    amount -= coin * count;
    totalCoins += count;
    usedCoins.push({ coin, count });
    steps.push({ amount, originalAmount, coinIdx: i, usedCoins: [...usedCoins], totalCoins, done: false });
  }

  steps.push({ amount: 0, originalAmount, coinIdx: null, usedCoins: [...usedCoins], totalCoins, done: true });
  return steps;
}
