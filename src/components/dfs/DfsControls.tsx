import s from "@/components/sort/sort.module.css";
import CtrlBtn from "@/components/CtrlBtn";

interface DfsControlsProps {
  isPlaying: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onEnding: () => void;
}

export default function DfsControls({ isPlaying, isFirst, isLast, onPlay, onPause, onNext, onPrev, onReset, onEnding }: DfsControlsProps) {
  return (
    <div className={s.controls}>
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
