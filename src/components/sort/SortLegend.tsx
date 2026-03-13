import s from "./sort.module.css";

const LEGEND = [
  { bg: "#6b7280", label: "기본" },
  { bg: "#facc15", label: "비교 중" },
  { bg: "#f43f5e", label: "교환 중" },
  { bg: "#10b981", label: "정렬 완료" },
];

export default function SortLegend() {
  return (
    <div className={s.legend}>
      {LEGEND.map(({ bg, label }) => (
        <div key={label} className={s.legendItem}>
          <div className={s.legendDot} style={{ background: bg }} />
          <span className={s.legendLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
