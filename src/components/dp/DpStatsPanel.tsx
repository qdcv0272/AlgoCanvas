import s from "./dp.module.css";

interface Props {
  n: number;
  filledCount: number;
  result: number | null;
  done: boolean;
  currentStep: number;
}

export default function DpStatsPanel({ n, filledCount, result, done, currentStep }: Props) {
  return (
    <div className={s.card}>
      <div className={s.statsGrid}>
        <div className={s.statBox}>
          <p className={s.statLabel}>n 값</p>
          <p className={`${s.statValue} ${s.yellow}`}>{n}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>채워진 칸</p>
          <p className={`${s.statValue} ${s.green}`}>
            {filledCount} / {n + 1}
          </p>
        </div>
        <div className={s.statBox} style={{ gridColumn: "1 / -1" }}>
          <p className={s.statLabel}>fib({n}) 결과</p>
          <p className={`${s.statValue} ${s.cyan}`} style={{ fontSize: result !== null ? "22px" : "14px" }}>
            {done && result !== null ? result : "계산 중…"}
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
