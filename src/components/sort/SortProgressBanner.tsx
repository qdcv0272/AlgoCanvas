import s from "./sort.module.css";

interface SortProgressBannerProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
  isLast: boolean;
  swapped: boolean;
  comparingIndices: [number, number] | null;
}

export default function SortProgressBanner({ progress, currentStep, totalSteps, isLast, swapped, comparingIndices }: SortProgressBannerProps) {
  let dotCls = s.default;
  if (isLast) dotCls = s.done;
  else if (swapped) dotCls = s.swapping;
  else if (comparingIndices) dotCls = s.comparing;

  return (
    <div className={s.banner}>
      <span className={`${s.bannerDot} ${dotCls}`} />
      <div className={s.bannerProgress}>
        <div className={s.progressTrack}>
          <div className={s.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <span className={s.bannerStepLabel}>
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}
