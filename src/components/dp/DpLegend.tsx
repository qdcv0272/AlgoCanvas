import s from "./dp.module.css";

const LEGEND = [
  { bg: "#0d1117", border: "#1f2937", label: "미계산" },
  { bg: "#7c3aed", border: "#a78bfa", label: "참조 중" },
  { bg: "#facc15", border: "#fbbf24", label: "계산 중" },
  { bg: "#10b981", border: "#34d399", label: "계산 완료" },
];

export default function DpLegend() {
  return (
    <div className={s.legend}>
      {LEGEND.map(({ bg, border, label }) => (
        <div key={label} className={s.legendItem}>
          <div className={s.legendDot} style={{ background: bg, borderColor: border }} />
          <span className={s.legendLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
