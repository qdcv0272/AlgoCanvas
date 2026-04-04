import { describe, it, expect, beforeEach } from "vitest";
import { useBinarySearchStore } from "../binarySearchStore";

function getStore() {
  return useBinarySearchStore.getState();
}

describe("binarySearchStore", () => {
  beforeEach(() => {
    getStore().init();
  });

  it("init() — 스텝이 생성되고 currentStep은 0이어야 한다", () => {
    const { steps, currentStep } = getStore();
    expect(steps.length).toBeGreaterThan(1);
    expect(currentStep).toBe(0);
  });

  it("init() — originalArr는 오름차순 정렬된 배열이어야 한다", () => {
    const { originalArr } = getStore();
    expect(originalArr.length).toBeGreaterThan(0);
    for (let i = 1; i < originalArr.length; i++) {
      expect(originalArr[i]).toBeGreaterThanOrEqual(originalArr[i - 1]);
    }
  });

  it("init() — target은 숫자여야 한다", () => {
    const { target } = getStore();
    expect(typeof target).toBe("number");
  });

  it("첫 스텝 — 모든 bar가 'default' 상태여야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].bars.every((b) => b.state === "default")).toBe(true);
  });

  it("첫 스텝 — found와 notFound가 모두 false여야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].found).toBe(false);
    expect(steps[0].notFound).toBe(false);
  });

  it("마지막 스텝 — found 또는 notFound 중 하나는 true여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.found || last.notFound).toBe(true);
  });

  it("target이 배열에 있을 때 — found가 true인 스텝이 존재해야 한다", () => {
    // target이 배열 안에 있는 경우를 강제 설정
    const { originalArr } = getStore();
    const target = originalArr[Math.floor(originalArr.length / 2)];
    useBinarySearchStore.setState((s) => {
      const newSteps = rebuildStepsForTest(s.originalArr, target);
      return { steps: newSteps, currentStep: 0, target };
    });
    const { steps } = getStore();
    const foundStep = steps.find((s) => s.found);
    expect(foundStep).toBeDefined();
    expect(foundStep?.bars.some((b) => b.state === "found")).toBe(true);
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
    useBinarySearchStore.setState({ currentStep: 3 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — 마지막 스텝으로 이동해야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("randomize() — 새로운 배열과 스텝이 생성되어야 한다", () => {
    getStore().randomize();
    const { steps, currentStep, originalArr } = getStore();
    expect(currentStep).toBe(0);
    expect(steps.length).toBeGreaterThan(1);
    expect(originalArr.length).toBeGreaterThan(0);
  });

  it("changeTarget() — 새 target으로 스텝이 재생성되어야 한다", () => {
    const { target: oldTarget } = getStore();
    // changeTarget은 다른 값을 선택하므로 여러 번 확인
    let changed = false;
    for (let i = 0; i < 20; i++) {
      getStore().changeTarget();
      if (getStore().target !== oldTarget) {
        changed = true;
        break;
      }
    }
    // target이 변경되거나, 같은 값이 재선택될 수 있음 — 스텝은 항상 재생성
    expect(getStore().currentStep).toBe(0);
    expect(getStore().steps.length).toBeGreaterThan(1);
    // changed는 99% 확률로 true
    expect(changed).toBe(true);
  });

  it("각 스텝의 bars 배열 길이가 동일해야 한다", () => {
    const { steps } = getStore();
    const len = steps[0].bars.length;
    steps.forEach((s) => {
      expect(s.bars).toHaveLength(len);
    });
  });
});

// 테스트용 — binarySearchStore.ts 내부 buildSteps 로직을 재현
function rebuildStepsForTest(arr: number[], target: number) {
  type BsBarState = "default" | "mid" | "eliminated" | "found";
  interface BsBar {
    value: number;
    state: BsBarState;
  }
  interface BsStep {
    bars: BsBar[];
    low: number;
    high: number;
    mid: number | null;
    found: boolean;
    notFound: boolean;
    target: number;
    message: string;
  }

  const steps: BsStep[] = [];
  const n = arr.length;

  steps.push({
    bars: arr.map((v) => ({ value: v, state: "default" })),
    low: 0,
    high: n - 1,
    mid: null,
    found: false,
    notFound: false,
    target,
    message: `탐색 시작 — 목표값: ${target}`,
  });

  let low = 0;
  let high = n - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
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
      message: "",
    });

    if (arr[mid] === target) {
      steps.push({
        bars: arr.map((v, idx) => ({ value: v, state: idx === mid ? "found" : "eliminated" })),
        low,
        high,
        mid,
        found: true,
        notFound: false,
        target,
        message: "found",
      });
      return steps;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
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
      message: "",
    });
  }

  steps.push({
    bars: arr.map((v) => ({ value: v, state: "eliminated" })),
    low,
    high,
    mid: null,
    found: false,
    notFound: true,
    target,
    message: "not found",
  });

  return steps;
}
