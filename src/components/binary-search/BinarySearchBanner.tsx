import s from "./binary-search.module.css";

interface Props {
  progress: number;
  currentStep: number;
  totalSteps: number;
  found: boolean;
  notFound: boolean;
  mid: number | null;
}

export default function BinarySearchBanner({ progress, currentStep, totalSteps, found, notFound, mid }: Props) {
  let dotCls = s.idle;
  if (found) dotCls = s.found;
  else if (notFound) dotCls = s.notFound;
  else if (mid !== null) dotCls = s.comparing;

  return (
    <div className={s.banner}>
      <div className={s.bannerTopRow}>
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
    </div>
  );
}
