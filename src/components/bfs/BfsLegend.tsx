import s from "@/components/dfs/dfs.module.css";

const LEGEND = [
  { cls: s.legendUnvisited, label: "미방문" },
  { cls: s.legendStacked, label: "큐 대기" },
  { cls: s.legendVisiting, label: "탐색 중" },
  { cls: s.legendVisited, label: "방문 완료" },
  { cls: s.legendCurrent, label: "현재 노드" },
];

export default function BfsLegend() {
  return (
    <div className={s.legend}>
      {LEGEND.map(({ cls, label }) => (
        <div key={label} className={s.legendItem}>
          <div className={`${s.legendDot} ${cls}`} />
          <span className={s.legendLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
