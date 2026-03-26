import s from "./greedy.module.css";

interface Props {
  totalCoins: number;
  originalAmount: number;
  remaining: number;
  done: boolean;
  currentStep: number;
}

export default function GreedyStatsPanel({ totalCoins, originalAmount, remaining, done, currentStep }: Props) {
  return (
    <div className={s.card}>
      <div className={s.statsGrid}>
        <div className={s.statBox}>
          <p className={s.statLabel}>목표 금액</p>
          <p className={`${s.statValue} ${s.yellow}`}>{originalAmount}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>남은 금액</p>
          <p className={`${s.statValue} ${s.cyan}`}>{remaining}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>동전 개수</p>
          <p className={`${s.statValue} ${s.green}`}>{totalCoins}</p>
        </div>
        <div className={s.statBox}>
          <p className={s.statLabel}>결과</p>
          <p className={`${s.statValue}`} style={{ fontSize: "16px", color: done ? "#34d399" : "#9ca3af" }}>
            {done ? "✅ 완료" : "진행 중"}
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
