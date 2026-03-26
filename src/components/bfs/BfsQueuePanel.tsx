import s from "@/components/dfs/dfs.module.css";

interface Props {
  queue: number[];
  visitOrder: number[];
  totalNodes: number;
}

export default function BfsQueuePanel({ queue, visitOrder, totalNodes }: Props) {
  return (
    <div className={s.stackPanel}>
      {/* 큐 */}
      <div>
        <p className={s.panelTitle}>📬 Queue</p>
        <div className={s.stackItems}>
          {queue.length === 0 ? (
            <span className={s.stackEmpty}>비어 있음</span>
          ) : (
            queue.map((id, i) => (
              <div key={`${id}-${i}`} className={`${s.stackItem} ${i === 0 ? s.stackItemTop : ""}`}>
                {i === 0 && <span className={s.stackTopLabel}>FRONT</span>}
                {id}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 방문 순서 */}
      <div>
        <p className={s.panelTitle}>
          ✅ 방문 순서 ({visitOrder.length} / {totalNodes})
        </p>
        <div className={s.visitOrder}>
          {visitOrder.map((id) => (
            <span key={id} className={s.visitBadge}>
              {id}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
