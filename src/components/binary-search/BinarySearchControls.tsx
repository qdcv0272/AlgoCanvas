import s from "./binary-search.module.css";
import CtrlBtn from "@/components/CtrlBtn";

interface Props {
  isPlaying: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onEnding: () => void;
  onRandomize: () => void;
  onChangeTarget: () => void;
}

export default function BinarySearchControls({ isPlaying, isFirst, isLast, onPlay, onPause, onNext, onPrev, onReset, onEnding, onRandomize, onChangeTarget }: Props) {
  return (
    <div className={s.controls}>
      <div className={s.btnRow}>
        <CtrlBtn onClick={onRandomize} title="새 배열 + 새 목표값" className={s.ctrlBtn}>
          🔢 숫자 바꾸기
        </CtrlBtn>
        <CtrlBtn onClick={onChangeTarget} title="같은 배열, 목표값만 변경" className={s.ctrlBtn}>
          🎯 목표 바꾸기
        </CtrlBtn>
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
