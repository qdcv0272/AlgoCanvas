import s from "./sort.module.css";

interface SortStatsPanelProps {
  comparisons: number;
  swaps: number;
  sortedCount: number;
  totalBars: number;
  currentStep: number;
}

export default function SortStatsPanel({ comparisons, swaps, sortedCount, totalBars, currentStep }: SortStatsPanelProps) {
  return (
    <div className={s.card}>
      <div className={s.statsGrid}>
        <div className={s.statBox}>
          <p className={s.statLabel}>비교 횟수</p>
          <p className={`${s.statValue} ${s.yellow}`}>{comparisons}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>교환 횟수</p>
          <p className={`${s.statValue} ${s.rose}`}>{swaps}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>완료된 요소</p>
          <p className={`${s.statValue} ${s.green}`}>
            {sortedCount} / {totalBars}
          </p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>현재 단계</p>
          <p className={`${s.statValue} ${s.cyan}`}>{currentStep + 1}</p>
        </div>
      </div>
    </div>
  );
}
