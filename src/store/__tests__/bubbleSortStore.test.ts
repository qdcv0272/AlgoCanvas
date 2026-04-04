import { describe, it, expect, beforeEach } from "vitest";
import { useBubbleSortStore } from "../bubbleSortStore";

function getStore() {
  return useBubbleSortStore.getState();
}

describe("bubbleSortStore", () => {
  beforeEach(() => {
    getStore().init();
  });

  it("init() — 스텝이 생성되고 currentStep은 0이어야 한다", () => {
    const { steps, currentStep } = getStore();
    expect(steps.length).toBeGreaterThan(1);
    expect(currentStep).toBe(0);
  });

  it("init() — 첫 스텝의 bars 길이는 10이어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].bars).toHaveLength(10);
  });

  it("next() — currentStep이 1 증가해야 한다", () => {
    getStore().next();
    expect(getStore().currentStep).toBe(1);
  });

  it("next() — 마지막 스텝에서 더 이상 증가하지 않아야 한다", () => {
    const { steps } = getStore();
    useBubbleSortStore.setState({ currentStep: steps.length - 1 });
    getStore().next();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("prev() — currentStep이 1 감소해야 한다", () => {
    useBubbleSortStore.setState({ currentStep: 3 });
    getStore().prev();
    expect(getStore().currentStep).toBe(2);
  });

  it("prev() — 첫 스텝에서 0 미만으로 내려가지 않아야 한다", () => {
    useBubbleSortStore.setState({ currentStep: 0 });
    getStore().prev();
    expect(getStore().currentStep).toBe(0);
  });

  it("reset() — currentStep을 0으로 되돌려야 한다", () => {
    useBubbleSortStore.setState({ currentStep: 5 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — currentStep이 마지막 스텝이어야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("마지막 스텝 — 모든 bar가 'sorted' 상태여야 한다", () => {
    const { steps } = getStore();
    const lastStep = steps[steps.length - 1];
    expect(lastStep.bars.every((b) => b.state === "sorted")).toBe(true);
  });

  it("마지막 스텝 — bar 값들이 오름차순으로 정렬되어 있어야 한다", () => {
    const { steps } = getStore();
    const values = steps[steps.length - 1].bars.map((b) => b.value);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });

  it("reverse() — 마지막 스텝에서 내림차순으로 정렬되어 있어야 한다", () => {
    getStore().reverse();
    const { steps } = getStore();
    const values = steps[steps.length - 1].bars.map((b) => b.value);
    const descSorted = [...values].sort((a, b) => b - a);
    expect(values).toEqual(descSorted);
  });

  it("reverse() 후 두 번 더 호출 시 오름차순으로 돌아와야 한다", () => {
    getStore().reverse();
    getStore().reverse();
    const { steps, isReversed } = getStore();
    expect(isReversed).toBe(false);
    const values = steps[steps.length - 1].bars.map((b) => b.value);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });

  it("randomize() — 새로운 배열로 스텝이 재생성되고 currentStep은 0이어야 한다", () => {
    useBubbleSortStore.setState({ currentStep: 5 });
    getStore().randomize();
    const { currentStep, steps } = getStore();
    expect(currentStep).toBe(0);
    expect(steps.length).toBeGreaterThan(1);
  });

  it("초기 스텝의 comparingIndices는 null이어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].comparingIndices).toBeNull();
  });

  it("초기 스텝의 sortedCount는 0이어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].sortedCount).toBe(0);
  });
});
