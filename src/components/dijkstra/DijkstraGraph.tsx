import { DIJKSTRA_NODES, DIJKSTRA_EDGES, type DijkstraNodeState } from "@/store/dijkstraStore";
import s from "./dijkstra.module.css";

const NODE_RADIUS = 22;

const nodePos: Record<number, { x: number; y: number }> = {};
DIJKSTRA_NODES.forEach((n) => (nodePos[n.id] = { x: n.x, y: n.y }));

function getOptimalEdgeSet(prevNode: Record<number, number | null>): Set<string> {
  const set = new Set<string>();
  for (const [nodeStr, prev] of Object.entries(prevNode)) {
    if (prev !== null) {
      const a = Math.min(parseInt(nodeStr), prev);
      const b = Math.max(parseInt(nodeStr), prev);
      set.add(`${a}-${b}`);
    }
  }
  return set;
}

interface Props {
  nodeStates: Record<number, DijkstraNodeState>;
  distances: Record<number, number>;
  prevNode: Record<number, number | null>;
  examiningEdge: [number, number] | null;
}

export default function DijkstraGraph({ nodeStates, distances, prevNode, examiningEdge }: Props) {
  const optimalEdges = getOptimalEdgeSet(prevNode);

  return (
    <div className={s.graphBox}>
      <svg viewBox="0 0 580 340" className={s.svg}>
        {/* 간선 */}
        {DIJKSTRA_EDGES.map(({ from, to, weight }) => {
          const pa = nodePos[from];
          const pb = nodePos[to];
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;

          const edgeKey = `${Math.min(from, to)}-${Math.max(from, to)}`;
          const isExamining = examiningEdge !== null && ((examiningEdge[0] === from && examiningEdge[1] === to) || (examiningEdge[0] === to && examiningEdge[1] === from));
          const isOptimal = optimalEdges.has(edgeKey);

          const edgeCls = isExamining ? s.edgeExamining : isOptimal ? s.edgeOptimal : s.edge;

          const weightCls = isExamining ? s.weightLabelExamining : isOptimal ? s.weightLabelOptimal : s.weightLabel;

          return (
            <g key={`${from}-${to}`}>
              <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className={edgeCls} />
              <rect x={mx - 8} y={my - 8} width={16} height={14} rx={3} className={s.weightBg} />
              <text x={mx} y={my} className={weightCls} dominantBaseline="central" textAnchor="middle">
                {weight}
              </text>
            </g>
          );
        })}

        {/* 노드 */}
        {DIJKSTRA_NODES.map((node) => {
          const state = nodeStates[node.id] ?? "unvisited";
          const dist = distances[node.id];
          const distStr = dist === Infinity ? "∞" : String(dist);

          return (
            <g key={node.id} className={s.nodeGroup}>
              <circle cx={node.x} cy={node.y} r={NODE_RADIUS} className={`${s.node} ${s[state]}`} />
              <text x={node.x} y={node.y - 3} className={`${s.nodeText} ${s[state]}`} dominantBaseline="central" textAnchor="middle">
                {node.label}
              </text>
              <text x={node.x} y={node.y + 12} className={`${s.distLabel} ${s[state]}`} dominantBaseline="central" textAnchor="middle">
                {distStr}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
