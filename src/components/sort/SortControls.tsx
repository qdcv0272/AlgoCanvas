import s from "./sort.module.css";
import CtrlBtn from "@/components/CtrlBtn";

interface SortControlsProps {
  isPlaying: boolean;
  isFirst: boolean;
  isLast: boolean;
  isReversed: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onEnding: () => void;
  onRandomize: () => void;
  onReverse: () => void;
  onCustomInput?: () => void;
}

export default function SortControls({ isPlaying, isFirst, isLast, isReversed, onPlay, onPause, onNext, onPrev, onReset, onEnding, onRandomize, onReverse, onCustomInput }: SortControlsProps) {
  return (
    <div className={s.controls}>
      <div className={s.btnRow}>
        <CtrlBtn onClick={onRandomize} title="새 숫자로 바꾸기" className={s.ctrlBtn}>
          🔢 숫자 바꾸기
        </CtrlBtn>
        <CtrlBtn onClick={onReverse} title="오름차순/내림차순 전환" active={isReversed} className={s.ctrlBtn} activeClassName={s.ctrlBtnActive}>
          🔄 {isReversed ? "내림차순" : "오름차순"}
        </CtrlBtn>
        {onCustomInput && (
          <CtrlBtn onClick={onCustomInput} title="커스텀 배열 입력" className={s.ctrlBtn}>
            📥 직접 입력
          </CtrlBtn>
        )}
      </div>
      <div className={s.btnRow}>
        <CtrlBtn onClick={onReset} disabled={isFirst} title="처음으로" className={s.ctrlBtn}>
          ⏮
        </CtrlBtn>
        <CtrlBtn onClick={onPrev} disabled={isFirst} title="이전 단계" className={s.ctrlBtn}>
          ◀
        </CtrlBtn>

        {isPlaying ? (
          <button className={`${s.playBtn} ${s.pause}`} onClick={onPause} title="일시정지">
            ⏸
          </button>
        ) : (
          <button className={`${s.playBtn} ${s.play}`} onClick={onPlay} disabled={isLast} title="재생">
            ▶
          </button>
        )}

        <CtrlBtn onClick={onNext} disabled={isLast} title="다음 단계" className={s.ctrlBtn}>
          ▶
        </CtrlBtn>
        <CtrlBtn onClick={onEnding} disabled={isLast} title="끝으로" className={s.ctrlBtn}>
          ⏭
        </CtrlBtn>
      </div>
    </div>
  );
}
