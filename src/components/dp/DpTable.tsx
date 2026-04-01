import type { DpStep } from "@/store/dpStore";
import s from "./dp.module.css";

interface Props {
  step: DpStep;
  n: number;
  onChangeN: (n: number) => void;
  isPlaying: boolean;
}

const N_OPTIONS = [5, 7, 8, 10, 12];

export default function DpTable({ step, n, onChangeN, isPlaying }: Props) {
  return (
    <div className={s.tableBox}>
      {/* N 선택 */}
      <div className={s.nSelector}>
        <span className={s.nLabel}>n =</span>
        {N_OPTIONS.map((val) => (
          <button key={val} className={`${s.nBtn} ${n === val ? s.nBtnActive : ""}`} onClick={() => onChangeN(val)} disabled={isPlaying}>
            {val}
          </button>
        ))}
      </div>

      {/* 셀 */}
      <div className={s.cellsWrapper}>
        <div className={s.cells}>
          {step.cells.map((cell) => (
            <div key={cell.index} className={s.cellCol}>
              <div className={`${s.cell} ${s[cell.state]}`}>{cell.value !== null ? cell.value : "?"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
