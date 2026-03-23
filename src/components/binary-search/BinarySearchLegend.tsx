import s from "./binary-search.module.css";

const LEGEND = [
  { bg: "#1f2937", border: "#374151", label: "탐색 범위" },
  { bg: "#facc15", border: "#fbbf24", label: "mid (비교 중)" },
  { bg: "#10b981", border: "#34d399", label: "발견!" },
  { bg: "#0d1117", border: "#1a2232", label: "제외된 범위" },
];

export default function BinarySearchLegend() {
  return (
    <div className={s.legend}>
      {LEGEND.map(({ bg, border, label }) => (
        <div key={label} className={s.legendItem}>
          <div className={s.legendDot} style={{ background: bg, outline: `1.5px solid ${border}` }} />
          <span className={s.legendLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
