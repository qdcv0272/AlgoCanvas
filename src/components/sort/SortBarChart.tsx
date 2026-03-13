import s from "./sort.module.css";

type Bar = { value: number; state: string };

const stateClass: Record<string, string> = {
  default: s.default,
  comparing: s.comparing,
  swapping: s.swapping,
  sorted: s.sorted,
};

interface Props {
  bars: Bar[];
  targetIndex?: number | null;
}

export default function SortBarChart({ bars, targetIndex }: Props) {
  return (
    <div className={s.chartBox}>
      <div className={s.bars}>
        {bars.map((bar, idx) => (
          <div key={idx} className={s.barCol}>
            {targetIndex === idx && (
              <span className={s.targetArrow} title="최솟값이 놓일 자리">
                ▼
              </span>
            )}
            <span className={`${s.barLabel} ${stateClass[bar.state]} ${targetIndex === idx ? s.targetHighlight : ""}`}>{bar.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
