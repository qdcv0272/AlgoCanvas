import { describe, it, expect, beforeEach } from "vitest";
import { useBfsStore, BFS_NODES, BFS_EDGES } from "../bfsStore";

function getStore() {
  return useBfsStore.getState();
}

/** BFS 방문 순서 (레벨 순서) */
const EXPECTED_VISIT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("bfsStore", () => {
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
    BFS_NODES.forEach((n) => {
      expect(steps[0].nodeStates[n.id]).toBe("unvisited");
    });
  });

  it("첫 스텝 — queue가 비어있어야 한다", () => {
    const { steps } = getStore();
    expect(steps[0].queue).toHaveLength(0);
  });

  it("마지막 스텝 — 모든 노드가 'visited' 상태여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    BFS_NODES.forEach((n) => {
      expect(last.nodeStates[n.id]).toBe("visited");
    });
  });

  it("마지막 스텝 — 모든 노드가 visitOrder에 포함되어야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.visitOrder).toHaveLength(BFS_NODES.length);
    BFS_NODES.forEach((n) => {
      expect(last.visitOrder).toContain(n.id);
    });
  });

  it("BFS 방문 순서가 올바른 너비 우선 순서여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    expect(last.visitOrder).toEqual(EXPECTED_VISIT_ORDER);
  });

  it("BFS는 DFS와 다른 방문 순서를 가져야 한다 (너비 우선)", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    const DFS_ORDER = [1, 2, 4, 8, 9, 5, 3, 6, 10, 7];
    expect(last.visitOrder).not.toEqual(DFS_ORDER);
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
    useBfsStore.setState({ currentStep: 4 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — 마지막 스텝으로 이동해야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("BFS_NODES는 10개의 노드를 가져야 한다", () => {
    expect(BFS_NODES).toHaveLength(10);
  });

  it("BFS_EDGES는 9개의 간선을 가져야 한다", () => {
    expect(BFS_EDGES).toHaveLength(9);
  });
});
