import { describe, it, expect, beforeEach } from "vitest";
import { useInsertionSortStore } from "../insertionSortStore";

function getStore() {
  return useInsertionSortStore.getState();
}

describe("insertionSortStore", () => {
  beforeEach(() => {
    getStore().init();
  });

  it("init() — 스텝이 생성되고 currentStep은 0이어야 한다", () => {
    const { steps, currentStep } = getStore();
    expect(steps.length).toBeGreaterThan(1);
    expect(currentStep).toBe(0);
  });

  it("next() / prev() — 범위 내에서 올바르게 이동해야 한다", () => {
    getStore().next();
    expect(getStore().currentStep).toBe(1);

    getStore().prev();
    expect(getStore().currentStep).toBe(0);
  });

  it("prev() — 첫 스텝에서 0 미만으로 내려가지 않아야 한다", () => {
    getStore().prev();
    expect(getStore().currentStep).toBe(0);
  });

  it("reset() — currentStep을 0으로 되돌려야 한다", () => {
    useInsertionSortStore.setState({ currentStep: 3 });
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

  it("isReversed 토글 — reverse() 두 번 호출 시 false여야 한다", () => {
    getStore().reverse();
    getStore().reverse();
    expect(getStore().isReversed).toBe(false);
  });

  it("비교(comparing) 상태의 bar가 존재해야 한다", () => {
    const { steps } = getStore();
    const hasComparing = steps.some((s) => s.bars.some((b) => b.state === "comparing"));
    expect(hasComparing).toBe(true);
  });

  it("이동(swapping) 상태의 bar가 존재해야 한다", () => {
    const { steps } = getStore();
    const hasSwapping = steps.some((s) => s.bars.some((b) => b.state === "swapping"));
    expect(hasSwapping).toBe(true);
  });
});
