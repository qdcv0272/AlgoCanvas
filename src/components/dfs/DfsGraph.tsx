import { NODES, EDGES, type NodeState } from "@/store/dfsStore";
import s from "./dfs.module.css";

const NODE_RADIUS = 22;

const nodePos: Record<number, { x: number; y: number }> = {};
NODES.forEach((n) => (nodePos[n.id] = { x: n.x, y: n.y }));

const stateClass: Record<NodeState, string> = {
  unvisited: s.unvisited,
  stacked: s.stacked,
  visiting: s.visiting,
  visited: s.visited,
};

interface Props {
  nodeStates: Record<number, NodeState>;
  currentNode: number | null;
}

export default function DfsGraph({ nodeStates, currentNode }: Props) {
  return (
    <div className={s.graphBox}>
      <svg viewBox="0 0 520 340" className={s.svg}>
        {/* 엣지 */}
        {EDGES.map(([a, b]) => {
          const pa = nodePos[a];
          const pb = nodePos[b];
          const active = nodeStates[a] === "visited" || (nodeStates[a] === "visiting" && nodeStates[b] !== "unvisited") || nodeStates[b] === "visited";
          return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className={`${s.edge} ${active ? s.edgeActive : ""}`} />;
        })}

        {/* 노드 */}
        {NODES.map((node) => {
          const state = nodeStates[node.id] ?? "unvisited";
          const isCurrent = currentNode === node.id;
          return (
            <g key={node.id} className={s.nodeGroup}>
              <circle cx={node.x} cy={node.y} r={NODE_RADIUS} className={`${s.node} ${stateClass[state]} ${isCurrent ? s.current : ""}`} />
              <text x={node.x} y={node.y} className={`${s.nodeText} ${stateClass[state]}`} dominantBaseline="central" textAnchor="middle">
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
