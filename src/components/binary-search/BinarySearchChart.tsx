import s from "./binary-search.module.css";
import { BsBar } from "@/store/binarySearchStore";

interface Props {
  bars: BsBar[];
  low: number;
  high: number;
  mid: number | null;
  target: number;
}

export default function BinarySearchChart({ bars, low, high, mid, target }: Props) {
  return (
    <div className={s.chartBox}>
      {/* 목표값 */}
      <div className={s.targetRow}>
        <span className={s.targetLabel}>🎯 목표값</span>
        <span className={s.targetValue}>{target}</span>
      </div>

      {/* 막대 */}
      <div className={s.barsWrapper}>
        <div className={s.barsContainer}>
          {bars.map((bar, idx) => {
            const ptrs: { label: string; cls: string }[] = [];
            if (idx === low) ptrs.push({ label: "L", cls: s.ptrL });
            if (mid !== null && idx === mid) ptrs.push({ label: "M", cls: s.ptrM });
            if (idx === high) ptrs.push({ label: "H", cls: s.ptrH });

            return (
              <div key={idx} className={s.barSlot}>
                <div className={`${s.barBox} ${s[bar.state]}`}>{bar.value}</div>
                <div className={s.ptrRow}>
                  {ptrs.map((p) => (
                    <span key={p.label} className={`${s.ptr} ${p.cls}`}>
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
