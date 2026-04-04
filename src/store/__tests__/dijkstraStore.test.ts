import { describe, it, expect, beforeEach } from "vitest";
import { useDijkstraStore, DIJKSTRA_NODES, DIJKSTRA_EDGES } from "../dijkstraStore";

function getStore() {
  return useDijkstraStore.getState();
}

/**
 * 그래프 구조 (무방향):
 *   1-2:4, 1-3:2, 2-3:1, 2-4:5, 3-4:8, 3-5:10, 4-5:2, 4-6:6, 5-6:3
 *
 * 노드 1(A)에서 최단 거리:
 *   1→1: 0
 *   1→2: 3  (1→3→2: 2+1)
 *   1→3: 2  (1→3)
 *   1→4: 8  (1→3→2→4: 2+1+5)
 *   1→5: 10 (1→3→2→4→5: 2+1+5+2)
 *   1→6: 13 (1→3→2→4→5→6: 2+1+5+2+3)
 */
const EXPECTED_DISTANCES: Record<number, number> = {
  1: 0,
  2: 3,
  3: 2,
  4: 8,
  5: 10,
  6: 13,
};

describe("dijkstraStore", () => {
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
    DIJKSTRA_NODES.forEach((n) => {
      expect(steps[0].nodeStates[n.id]).toBe("unvisited");
    });
  });

  it("첫 스텝 — 모든 거리가 Infinity여야 한다 (시작 노드 포함)", () => {
    const { steps } = getStore();
    const first = steps[0];
    DIJKSTRA_NODES.forEach((n) => {
      expect(first.distances[n.id]).toBe(Infinity);
    });
  });

  it("마지막 스텝 — 노드 1(A)에서 모든 노드로의 최단 거리가 올바르게 계산되어야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    Object.entries(EXPECTED_DISTANCES).forEach(([nodeId, dist]) => {
      expect(last.distances[Number(nodeId)]).toBe(dist);
    });
  });

  it("마지막 스텝 — 모든 노드가 'settled' 상태여야 한다", () => {
    const { steps } = getStore();
    const last = steps[steps.length - 1];
    DIJKSTRA_NODES.forEach((n) => {
      expect(last.nodeStates[n.id]).toBe("settled");
    });
  });

  it("next() — currentStep이 1 증가해야 한다", () => {
    getStore().next();
    expect(getStore().currentStep).toBe(1);
  });

  it("next() — 마지막 스텝 이후에는 증가하지 않아야 한다", () => {
    const { steps } = getStore();
    useDijkstraStore.setState({ currentStep: steps.length - 1 });
    getStore().next();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("prev() — 첫 스텝에서 0 미만으로 내려가지 않아야 한다", () => {
    getStore().prev();
    expect(getStore().currentStep).toBe(0);
  });

  it("reset() — currentStep을 0으로 되돌려야 한다", () => {
    useDijkstraStore.setState({ currentStep: 5 });
    getStore().reset();
    expect(getStore().currentStep).toBe(0);
  });

  it("ending() — 마지막 스텝으로 이동해야 한다", () => {
    const { steps } = getStore();
    getStore().ending();
    expect(getStore().currentStep).toBe(steps.length - 1);
  });

  it("DIJKSTRA_NODES는 6개의 노드를 가져야 한다", () => {
    expect(DIJKSTRA_NODES).toHaveLength(6);
  });

  it("DIJKSTRA_EDGES는 9개의 간선을 가져야 한다", () => {
    expect(DIJKSTRA_EDGES).toHaveLength(9);
  });

  it("노드 레이블이 A~F여야 한다", () => {
    const labels = DIJKSTRA_NODES.map((n) => n.label);
    expect(labels).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("모든 간선의 가중치는 양수여야 한다", () => {
    DIJKSTRA_EDGES.forEach((e) => {
      expect(e.weight).toBeGreaterThan(0);
    });
  });
});
