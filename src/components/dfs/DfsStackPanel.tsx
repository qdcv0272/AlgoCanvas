import s from "./dfs.module.css";

interface Props {
  stack: number[];
  visitOrder: number[];
  totalNodes: number;
}

export default function DfsStackPanel({ stack, visitOrder, totalNodes }: Props) {
  return (
    <div className={s.stackPanel}>
      {/* 스택 */}
      <div>
        <p className={s.panelTitle}>📦 Stack</p>
        <div className={s.stackItems}>
          {stack.length === 0 ? (
            <span className={s.stackEmpty}>비어 있음</span>
          ) : (
            [...stack].reverse().map((id, i) => (
              <div key={id} className={`${s.stackItem} ${i === 0 ? s.stackItemTop : ""}`}>
                {i === 0 && <span className={s.stackTopLabel}>TOP</span>}
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
