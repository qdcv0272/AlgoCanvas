"use client";

import { useEffect, useState } from "react";
import { useGreedyStore } from "@/store/greedyStore";
import Link from "next/link";
import s from "@/app/sort-page.module.css";
import GuideModal from "@/components/GuideModal";
import SortProgressBanner from "@/components/sort/SortProgressBanner";
import GreedyVisualizer from "@/components/greedy/GreedyVisualizer";
import GreedyStatsPanel from "@/components/greedy/GreedyStatsPanel";
import DfsControls from "@/components/dfs/DfsControls";
import CtrlBtn from "@/components/CtrlBtn";
import sc from "@/components/sort/sort.module.css";
import CustomInputModal from "@/components/CustomInputModal";
import { useAlgorithmTracker } from "@/hooks/useAlgorithmTracker";

export default function GreedyPage() {
  const { steps, currentStep, isPlaying, init, play, pause, next, prev, reset, ending, randomize, initWithCustom } = useGreedyStore();

  const [showGuide, setShowGuide] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useAlgorithmTracker("greedy");

  useEffect(() => {
    if (steps.length === 0) {
      init();
    }
  }, [steps.length, init]);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  if (!step) return null;

  return (
    <main className={s.page}>
      {showGuide && (
        <GuideModal title="💡 Greedy 사용 가이드" onClose={() => setShowGuide(false)}>
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 탐욕 알고리즘이란?</h3>
            <ul className={s.guideList}>
              <li>
                매 순간 <strong>현재 상황에서 가장 좋은 선택</strong>을 반복하는 알고리즘입니다.
              </li>
              <li>미래를 고려하지 않고 지금 당장 최선인 것을 선택합니다.</li>
              <li>항상 최적해를 보장하지는 않지만, 특정 문제에서는 최적해를 냅니다.</li>
              <li>거스름돈 문제는 큰 단위 동전부터 최대한 사용하는 것이 최적입니다.</li>
            </ul>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>💰 거스름돈 문제</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>문제</span>
                <span className={s.guideRowDesc}>주어진 금액을 500, 100, 50, 10, 5, 1원 동전으로 최소 개수로 거슬러줍니다.</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>전략</span>
                <span className={s.guideRowDesc}>가장 큰 단위 동전부터 최대한 사용하고 남은 금액으로 다음 동전을 사용합니다.</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>한계</span>
                <span className={s.guideRowDesc}>동전 단위가 배수 관계일 때만 최적해를 보장합니다. (예: 1, 4, 6원이면 실패)</span>
              </div>
            </div>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🕹 버튼 설명</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>🔢 금액 바꾸기</span>
                <span className={s.guideBtnDesc}>랜덤한 새 금액으로 초기화합니다.</span>
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
        <h1 className={s.headerTitle}>💡 Greedy</h1>
        <span className={s.headerSub}>— 매 순간 최선의 선택</span>
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
            comparingIndices={step.coinIdx !== null ? [step.coinIdx, step.coinIdx] : null}
          />
          <GreedyVisualizer step={step} />
          {/* 랜덤 버튼 */}
          <div className={sc.controls}>
            <div className={sc.btnRow}>
              <CtrlBtn onClick={randomize} title="새 금액으로 바꾸기" className={sc.ctrlBtn}>
                🔢 금액 바꾸기
              </CtrlBtn>
              <CtrlBtn onClick={() => setShowCustomInput(true)} title="콘요 금액 입력" className={sc.ctrlBtn}>
                📥 직접 입력
              </CtrlBtn>
            </div>
          </div>
          <DfsControls isPlaying={isPlaying} isFirst={isFirst} isLast={isLast} onPlay={play} onPause={pause} onNext={next} onPrev={prev} onReset={reset} onEnding={ending} />
        </div>
        <div className={s.right}>
          <GreedyStatsPanel totalCoins={step.totalCoins} originalAmount={step.originalAmount} remaining={step.amount} done={step.done} currentStep={currentStep} />
        </div>
      </div>

      {showCustomInput && (
        <CustomInputModal
          algorithmId="greedy"
          title="Greedy"
          placeholder="거스름돈 금액 (1~9999, 예: 1370)"
          onLoad={(data) => {
            const amount = parseInt(data.trim(), 10);
            if (!isNaN(amount) && amount >= 1 && amount <= 9999) initWithCustom(amount);
          }}
          onClose={() => setShowCustomInput(false)}
        />
      )}
    </main>
  );
}
