import { describe, it, expect, beforeEach } from "vitest";
import { useDfsStore, NODES, EDGES } from "../dfsStore";

function getStore() {
  return useDfsStore.getState();
}

/** 고정 그래프 기반의 DFS 방문 순서 */
const EXPECTED_VISIT_ORDER = [1, 2, 4, 8, 9, 5, 3, 6, 10, 7];

describe("dfsStore", () => {
  beforeEach(() => {
    getStore().init();
  });

  it("init() — 스텝이 생성되고 currentStep은 0이어야 한다", () => {
    const { steps, currentStep } = getStore();
    expect(steps.length).toBeGreaterThan(1);
    expect(currentStep).toBe(0);
  });

  it("첫 스텝 — 모든 노드가 'unvisited' 상태여야 한다", () => {
    const { steps } = getStore();
    const first = steps[0];
    NODES.forEach((n) => {
      expect(first.nodeStates[n.id]).toBe("unvisited");
    });
  });

  it("첫 스텝 — stack이 비어있어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].stack).toHaveLength(0);
  });

  it("마지막 스텝 — 모든 노드가 'visited' 상태여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    NODES.forEach((n) => {
      expect(last.nodeStates[n.id]).toBe("visited");
    });
  });

  it("마지막 스텝 — 모든 노드가 방문 순서에 포함되어야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.visitOrder).toHaveLength(NODES.length);
    NODES.forEach((n) => {
      expect(last.visitOrder).toContain(n.id);
    });
  });

  it("DFS 방문 순서가 올바른 깊이 우선 순서여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.visitOrder).toEqual(EXPECTED_VISIT_ORDER);
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
    useDfsStore.setState({ currentStep: 5 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — 마지막 스텝으로 이동해야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("NODES는 10개의 노드를 가져야 한다", () => {
    expect(NODES).toHaveLength(10);
  });

  it("EDGES는 9개의 간선을 가져야 한다", () => {
    expect(EDGES).toHaveLength(9);
  });

  it("노드 id들은 1~10이어야 한다", () => {
    const ids = NODES.map((n) => n.id).sort((a, b) => a - b);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
