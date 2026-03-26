import { COINS } from "@/store/greedyStore";
import type { GreedyStep } from "@/store/greedyStore";
import s from "./greedy.module.css";

interface Props {
  step: GreedyStep;
}

export default function GreedyVisualizer({ step }: Props) {
  const { amount, originalAmount, coinIdx, usedCoins } = step;

  const usedMap: Record<number, number> = {};
  usedCoins.forEach(({ coin, count }) => (usedMap[coin] = count));

  return (
    <div className={s.page}>
      {/* 금액 */}
      <div className={s.amountRow}>
        <div className={s.amountBlock}>
          <span className={s.amountLabel}>💰 거슬러줄 금액</span>
          <span className={s.amountValue}>{originalAmount}원</span>
        </div>
        <div className={s.amountDivider} />
        <div className={s.amountBlock}>
          <span className={s.amountLabel}>남은 금액</span>
          <span className={s.amountRemainValue}>{amount}원</span>
        </div>
      </div>

      {/* 동전 */}
      <div className={s.coinsRow}>
        {COINS.map((coin, i) => {
          const isActive = coinIdx === i;
          const isUsed = usedMap[coin] > 0;
          const isPast = coinIdx !== null && i < coinIdx && !isUsed;
          return (
            <div key={coin} className={`${s.coinChip} ${isActive ? s.active : ""} ${isUsed ? s.used : ""} ${isPast ? s.skipped : ""}`}>
              {coin >= 1000 ? `${coin / 1000}K` : `${coin}`}
            </div>
          );
        })}
      </div>

      {/* 사용 결과 */}
      {usedCoins.length > 0 && (
        <div className={s.resultGrid}>
          {usedCoins.map(({ coin, count }) => (
            <div key={coin} className={s.resultRow}>
              <span className={s.resultCoin}>{coin}원</span>
              <span className={s.resultCount}>
                × <span className={s.resultCountValue}>{count}</span>개 = {coin * count}원
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
