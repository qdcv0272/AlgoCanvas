import { describe, it, expect, beforeEach } from "vitest";
import { useDpStore } from "../dpStore";

function getStore() {
  return useDpStore.getState();
}

/** 피보나치 수열: fib(0)~fib(10) */
const FIBONACCI = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

describe("dpStore (피보나치 DP)", () => {
  beforeEach(() => {
    getStore().init();
  });

  it("init() — 스텝이 생성되고 currentStep은 0이어야 한다", () => {
    const { steps, currentStep } = getStore();
    expect(steps.length).toBeGreaterThan(1);
    expect(currentStep).toBe(0);
  });

  it("init() — n은 10이어야 한다", () => {
    expect(getStore().n).toBe(10);
  });

  it("첫 스텝 — 모든 셀이 'empty' 상태이어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].cells.every((c) => c.state === "empty")).toBe(true);
  });

  it("첫 스텝 — 모든 셀의 value가 null이어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].cells.every((c) => c.value === null)).toBe(true);
  });

  it("마지막 스텝 — done이 true여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.done).toBe(true);
  });

  it("마지막 스텝 — 모든 셀이 'filled' 상태여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.cells.every((c) => c.state === "filled")).toBe(true);
  });

  it("마지막 스텝 — 피보나치 값이 올바르게 계산되어야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    last.cells.forEach((cell) => {
      expect(cell.value).toBe(FIBONACCI[cell.index]);
    });
  });

  it("마지막 스텝 — dp[10]은 55여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    const cell10 = last.cells.find((c) => c.index === 10);
    expect(cell10?.value).toBe(55);
  });

  it("마지막 스텝 — dp[0]은 0, dp[1]은 1이어야 한다 (기저 조건)", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.cells.find((c) => c.index === 0)?.value).toBe(0);
    expect(last.cells.find((c) => c.index === 1)?.value).toBe(1);
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
    useDpStore.setState({ currentStep: 3 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — 마지막 스텝으로 이동해야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("changeN(5) — n=5로 변경 시 dp[5]는 5여야 한다", () => {
    getStore().changeN(5);
    const { steps, n } = getStore();
    expect(n).toBe(5);
    const last = steps[steps.length - 1];
    const cell5 = last.cells.find((c) => c.index === 5);
    expect(cell5?.value).toBe(5);
  });

  it("computing 상태의 셀이 존재해야 한다", () => {
    const { steps } = getStore();
    const hasComputing = steps.some((s) => s.cells.some((c) => c.state === "computing"));
    expect(hasComputing).toBe(true);
  });

  it("referencing 상태의 셀이 존재해야 한다", () => {
    const { steps } = getStore();
    const hasReferencing = steps.some((s) => s.cells.some((c) => c.state === "referencing"));
    expect(hasReferencing).toBe(true);
  });
});
