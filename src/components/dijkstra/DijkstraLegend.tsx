import s from "./dijkstra.module.css";

const LEGEND = [
  { cls: s.legendUnvisited, label: "미방문" },
  { cls: s.legendInQueue, label: "큐 대기" },
  { cls: s.legendCurrent, label: "처리 중" },
  { cls: s.legendSettled, label: "확정 완료" },
];

export default function DijkstraLegend() {
  return (
    <div className={s.legend}>
      {LEGEND.map(({ cls, label }) => (
        <div key={label} className={s.legendItem}>
          <div className={`${s.legendDot} ${cls}`} />
          <span className={s.legendLabel}>{label}</span>
        </div>
      ))}
      <div className={s.legendItem}>
        <div className={`${s.legendOptimal}`} />
        <span className={s.legendLabel}>최적 경로</span>
      </div>
    </div>
  );
}
