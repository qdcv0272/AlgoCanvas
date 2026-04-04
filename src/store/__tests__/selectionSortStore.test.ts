import { describe, it, expect, beforeEach } from "vitest";
import { useSelectionSortStore } from "../selectionSortStore";

function getStore() {
  return useSelectionSortStore.getState();
}

describe("selectionSortStore", () => {
  beforeEach(() => {
    getStore().init();
  });

  it("init() — 스텝이 생성되고 currentStep은 0이어야 한다", () => {
    const { steps, currentStep } = getStore();
    expect(steps.length).toBeGreaterThan(1);
    expect(currentStep).toBe(0);
  });

  it("init() — 각 스텝의 bars 길이는 10이어야 한다", () => {
    const { steps } = getStore();
    steps.forEach((step) => {
      expect(step.bars).toHaveLength(10);
    });
  });

  it("next() — currentStep이 1 증가해야 한다", () => {
    getStore().next();
    expect(getStore().currentStep).toBe(1);
  });

  it("next() — 마지막 스텝 이후에는 증가하지 않아야 한다", () => {
    const { steps } = getStore();
    useSelectionSortStore.setState({ currentStep: steps.length - 1 });
    getStore().next();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("prev() — 첫 스텝에서 음수로 내려가지 않아야 한다", () => {
    getStore().prev();
    expect(getStore().currentStep).toBe(0);
  });

  it("reset() — currentStep을 0으로 되돌려야 한다", () => {
    useSelectionSortStore.setState({ currentStep: 4 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — 마지막 스텝으로 이동해야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("마지막 스텝 — 모든 bar가 'sorted' 상태여야 한다", () => {
    const { steps } = getStore();
    const lastBars = steps[steps.length - 1].bars;
    expect(lastBars.every((b) => b.state === "sorted")).toBe(true);
  });

  it("마지막 스텝 — bar 값들이 오름차순이어야 한다", () => {
    const { steps } = getStore();
    const values = steps[steps.length - 1].bars.map((b) => b.value);
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it("reverse() — 마지막 스텝에서 내림차순이어야 한다", () => {
    getStore().reverse();
    const { steps } = getStore();
    const values = steps[steps.length - 1].bars.map((b) => b.value);
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  it("마지막 스텝의 sortedCount는 bars 길이와 같아야 한다", () => {
    const { steps } = getStore();
    const lastStep = steps[steps.length - 1];
    expect(lastStep.sortedCount).toBe(lastStep.bars.length);
  });

  it("비교 스텝의 comparingIndices는 null이 아니어야 한다", () => {
    const { steps } = getStore();
    const comparingSteps = steps.filter((s) => s.comparingIndices !== null);
    expect(comparingSteps.length).toBeGreaterThan(0);
  });
});
