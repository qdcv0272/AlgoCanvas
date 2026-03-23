import s from "./binary-search.module.css";

interface Props {
  comparisons: number;
  rangeSize: number;
  found: boolean;
  notFound: boolean;
  target: number;
  currentStep: number;
}

export default function BinarySearchStatsPanel({ comparisons, rangeSize, found, notFound, target, currentStep }: Props) {
  const resultText = found ? "✅ 발견" : notFound ? "❌ 없음" : "탐색 중";
  const resultColor = found ? s.green : notFound ? s.rose : s.cyan;

  return (
    <div className={s.card}>
      <div className={s.statsGrid}>
        <div className={s.statBox}>
          <p className={s.statLabel}>비교 횟수</p>
          <p className={`${s.statValue} ${s.yellow}`}>{comparisons}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>탐색 범위</p>
          <p className={`${s.statValue} ${s.cyan}`}>{rangeSize}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>목표값</p>
          <p className={`${s.statValue} ${s.cyan}`}>{target}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>결과</p>
          <p className={`${s.statValue} ${resultColor}`} style={{ fontSize: "16px" }}>
            {resultText}
          </p>
        </div>
        <div className={s.statBox} style={{ gridColumn: "1 / -1" }}>
          <p className={s.statLabel}>현재 단계</p>
          <p className={`${s.statValue} ${s.cyan}`}>{currentStep + 1}</p>
        </div>
      </div>
    </div>
  );
}
