import { DIJKSTRA_NODES, type DijkstraNodeState } from "@/store/dijkstraStore";
import s from "./dijkstra.module.css";

interface Props {
  pqSnapshot: Array<{ node: number; dist: number }>;
  distances: Record<number, number>;
  prevNode: Record<number, number | null>;
  nodeStates: Record<number, DijkstraNodeState>;
}

function buildPath(nodeId: number, prevNode: Record<number, number | null>): string {
  const path: string[] = [];
  let cur: number | null = nodeId;
  while (cur !== null) {
    path.unshift(DIJKSTRA_NODES[cur - 1].label);
    cur = prevNode[cur];
  }
  return path.join(" → ");
}

export default function DijkstraDistancePanel({ pqSnapshot, distances, prevNode, nodeStates }: Props) {
  return (
    <div className={s.pqPanel}>
      {/* 우선순위 큐 */}
      <div>
        <p className={s.panelTitle}>⚡ Priority Queue (min-heap)</p>
        <div className={s.pqItems}>
          {pqSnapshot.length === 0 ? (
            <span className={s.pqEmpty}>비어 있음</span>
          ) : (
            pqSnapshot.map(({ node, dist }, i) => {
              const label = DIJKSTRA_NODES[node - 1].label;
              return (
                <div key={`${node}-${dist}-${i}`} className={`${s.pqItem} ${i === 0 ? s.pqItemTop : ""}`}>
                  <span>
                    {i === 0 && <span className={s.pqTopLabel}>MIN</span>} {label}({node})
                  </span>
                  <span>{dist === Infinity ? "∞" : dist}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 거리 테이블 */}
      <div>
        <p className={s.panelTitle}>📏 최단 거리 테이블</p>
        <table className={s.distTable}>
          <thead>
            <tr>
              <th>노드</th>
              <th>거리</th>
              <th>경로</th>
            </tr>
          </thead>
          <tbody>
            {DIJKSTRA_NODES.map((n) => {
              const state = nodeStates[n.id] ?? "unvisited";
              const dist = distances[n.id];
              const path = dist !== Infinity ? buildPath(n.id, prevNode) : "—";
              return (
                <tr key={n.id} className={`${s.distRow} ${s[state]}`}>
                  <td className={s.distNodeCell}>
                    {n.label}({n.id})
                  </td>
                  <td className={`${s.distValue} ${dist === Infinity ? s.distInf : ""}`}>{dist === Infinity ? "∞" : dist}</td>
                  <td className={s.distPath}>{path}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
