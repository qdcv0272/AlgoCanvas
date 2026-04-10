"use client";

import { useEffect, useState } from "react";
import { useDpStore } from "@/store/dpStore";
import Link from "next/link";
import s from "@/app/sort-page.module.css";
import GuideModal from "@/components/GuideModal";
import SortProgressBanner from "@/components/sort/SortProgressBanner";
import DpTable from "@/components/dp/DpTable";
import DpLegend from "@/components/dp/DpLegend";
import DpStatsPanel from "@/components/dp/DpStatsPanel";
import DfsControls from "@/components/dfs/DfsControls";
import CustomInputModal from "@/components/CustomInputModal";
import { useAlgorithmTracker } from "@/hooks/useAlgorithmTracker";

export default function DpPage() {
  const { steps, currentStep, isPlaying, n, init, play, pause, next, prev, reset, ending, changeN, initWithCustom } = useDpStore();

  const [showGuide, setShowGuide] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useAlgorithmTracker("dp");

  useEffect(() => {
    if (steps.length === 0) {
      init();
    }
  }, [steps.length, init]);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  const filledCount = step ? step.cells.filter((c) => c.value !== null).length : 0;
  const result = step?.done ? (step.cells[n]?.value ?? null) : null;

  if (!step) return null;

  return (
    <main className={s.page}>
      {showGuide && (
        <GuideModal title="🧩 DP 사용 가이드" onClose={() => setShowGuide(false)}>
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 동적 프로그래밍이란?</h3>
            <ul className={s.guideList}>
              <li>
                큰 문제를 작은 부분 문제로 나눠 풀고 결과를 <strong>저장(메모이제이션)</strong>하는 기법입니다.
              </li>
              <li>한 번 계산한 결과를 재사용해 중복 계산을 제거합니다.</li>
              <li>
                분할 정복과 달리, 부분 문제가 <strong>겹치는 경우</strong>에 효과적입니다.
              </li>
              <li>피보나치 수열이 DP의 대표적인 예시입니다.</li>
            </ul>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🔢 피보나치 수열</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>점화식</span>
                <span className={s.guideRowDesc}>dp[i] = dp[i-1] + dp[i-2]</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>기저 조건</span>
                <span className={s.guideRowDesc}>dp[0] = 0, dp[1] = 1</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>시간 복잡도</span>
                <span className={s.guideRowDesc}>재귀: O(2ⁿ) → DP: O(n) — 극적인 개선!</span>
              </div>
            </div>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🎨 셀 색상</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⬛ 어두움</span>
                <span className={s.guideBtnDesc}>아직 계산되지 않은 빈 칸 (?)</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.purple}`}>🟣 보라색</span>
                <span className={s.guideBtnDesc}>현재 계산에 참조되는 dp[i-1], dp[i-2]</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.yellow}`}>🟡 노란색</span>
                <span className={s.guideBtnDesc}>현재 계산 중인 dp[i]</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.green}`}>🟢 초록색</span>
                <span className={s.guideBtnDesc}>계산이 완료되어 저장된 값</span>
              </div>
            </div>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🕹 버튼 설명</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>n 선택 버튼</span>
                <span className={s.guideBtnDesc}>계산할 n 값을 변경합니다. 재생 중에는 비활성화됩니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⏮ / ◀ / ▶ / ⏭</span>
                <span className={s.guideBtnDesc}>처음 / 이전 / 다음 / 마지막 단계로 이동합니다.</span>
              </div>
            </div>
          </div>
        </GuideModal>
      )}

      <div className={s.header}>
        <Link href="/" className={s.backLink}>
          ← 홈
        </Link>
        <div className={s.divider} />
        <h1 className={s.headerTitle}>🧩 DP</h1>
        <span className={s.headerSub}>— 동적 프로그래밍 (피보나치)</span>
        <button className={s.guideBtn} onClick={() => setShowGuide(true)}>
          ❓ 가이드
        </button>
      </div>

      <div className={s.content}>
        <div className={s.left}>
          <SortProgressBanner
            progress={progress}
            currentStep={currentStep}
            totalSteps={steps.length - 1}
            isLast={isLast}
            swapped={false}
            comparingIndices={step.currentIdx !== null ? [step.currentIdx, step.currentIdx] : null}
          />
          <DpTable step={step} n={n} onChangeN={changeN} isPlaying={isPlaying} onCustomInput={() => setShowCustomInput(true)} />
          <DfsControls isPlaying={isPlaying} isFirst={isFirst} isLast={isLast} onPlay={play} onPause={pause} onNext={next} onPrev={prev} onReset={reset} onEnding={ending} />
          <DpLegend />
        </div>
        <div className={s.right}>
          <DpStatsPanel n={n} filledCount={filledCount} result={result} done={step.done} currentStep={currentStep} />
        </div>
      </div>

      {showCustomInput && (
        <CustomInputModal
          algorithmId="dp"
          title="DP (Fibonacci)"
          placeholder="피보나치 N (2~20, 예: 15)"
          onLoad={(data) => {
            const val = parseInt(data.trim(), 10);
            if (!isNaN(val) && val >= 2 && val <= 20) initWithCustom(val);
          }}
          onClose={() => setShowCustomInput(false)}
        />
      )}
    </main>
  );
}
