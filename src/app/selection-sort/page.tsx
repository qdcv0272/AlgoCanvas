"use client";

import { useEffect, useRef, useState } from "react";
import { useSelectionSortStore } from "@/store/selectionSortStore";
import Link from "next/link";
import s from "../sort-page.module.css";
import GuideModal from "@/components/GuideModal";
import SortBarChart from "@/components/sort/SortBarChart";
import SortProgressBanner from "@/components/sort/SortProgressBanner";
import SortControls from "@/components/sort/SortControls";
import SortStatsPanel from "@/components/sort/SortStatsPanel";
import SortLegend from "@/components/sort/SortLegend";

export default function SelectionSortPage() {
  const { steps, currentStep, isPlaying, isReversed, init, play, pause, next, prev, reset, ending, randomize, reverse } = useSelectionSortStore();

  const initialized = useRef(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    if (!initialized.current) {
      init();
      initialized.current = true;
    }
  }, [init]);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  const comparisons = steps.slice(0, currentStep + 1).filter((st) => st.comparingIndices !== null && !st.swapped).length;
  const swaps = steps.slice(0, currentStep + 1).filter((st) => st.swapped).length;

  if (!step) return null;

  return (
    <main className={s.page}>
      {/* ── 가이드 모달 ── */}
      {showGuide && (
        <GuideModal title="🎯 Selection Sort 사용 가이드" onClose={() => setShowGuide(false)}>
          {/* 1. 개념 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 선택 정렬이란?</h3>
            <ul className={s.guideList}>
              <li>배열을 앞에서부터 확정하며 정렬하는 알고리즘입니다.</li>
              <li>미정렬 부분에서 최소값(또는 최대값)을 찾아 현재 위치와 교환합니다.</li>
              <li>한 번의 패스가 끝나면 현재 위치의 값이 확정됩니다.</li>
              <li>
                최소값을 <strong>선택</strong>하여 앞으로 이동시킨다고 해서 <strong>선택(Selection)</strong> 정렬입니다.
              </li>
            </ul>
          </div>

          {/* 2. 오름/내림차순 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🔄 오름차순 / 내림차순</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>오름차순</span>
                <span className={s.guideRowDesc}>작은 수 → 큰 수 순으로 정렬. 기본 모드. 최소값을 찾아 앞으로 이동</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>내림차순</span>
                <span className={s.guideRowDesc}>큰 수 → 작은 수 순으로 정렬. 최대값을 찾아 앞으로 이동</span>
              </div>
            </div>
          </div>

          {/* 3. 버튼 설명 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🕹 버튼 설명</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>🔢 숫자 바꾸기</span>
                <span className={s.guideBtnDesc}>새로운 랜덤 숫자 10개로 배열을 초기화합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>🔄 오름/내림차순</span>
                <span className={s.guideBtnDesc}>정렬 방향을 전환합니다. 같은 배열로 방향만 바뀝니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⏮ 처음으로</span>
                <span className={s.guideBtnDesc}>정렬 과정을 첫 단계로 되돌립니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>◀ 이전 단계</span>
                <span className={s.guideBtnDesc}>한 단계씩 뒤로 이동합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>▶ / ⏸</span>
                <span className={s.guideBtnDesc}>자동 재생 / 일시정지. 자동으로 단계를 진행합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>▶ 다음 단계</span>
                <span className={s.guideBtnDesc}>한 단계씩 앞으로 이동합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⏭ 끝으로</span>
                <span className={s.guideBtnDesc}>정렬이 완료된 마지막 단계로 바로 이동합니다.</span>
              </div>
            </div>
          </div>

          {/* 4. 통계 설명 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📊 통계 패널 설명</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.yellow}`}>비교 횟수</span>
                <span className={s.guideBtnDesc}>미정렬 부분에서 값을 비교한 횟수입니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.rose}`}>교환 횟수</span>
                <span className={s.guideBtnDesc}>최소값을 찾아 현재 위치와 맞바꾼 횟수입니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.green}`}>완료된 요소</span>
                <span className={s.guideBtnDesc}>정렬 위치가 확정된 요소의 수 / 전체 수입니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.cyan}`}>현재 단계</span>
                <span className={s.guideBtnDesc}>전체 단계 중 현재 몇 번째 단계인지 표시합니다.</span>
              </div>
            </div>
          </div>
        </GuideModal>
      )}

      {/* ── 헤더 ── */}
      <div className={s.header}>
        <Link href="/" className={s.backLink}>
          ← 홈
        </Link>
        <div className={s.divider} />
        <h1 className={s.headerTitle}>🎯 Selection Sort</h1>
        <span className={s.headerSub}>— 최소값을 찾아 정렬</span>
        <button className={s.guideBtn} onClick={() => setShowGuide(true)}>
          ❓ 가이드
        </button>
      </div>

      <div className={s.content}>
        <div className={s.left}>
          <SortProgressBanner progress={progress} currentStep={currentStep} totalSteps={steps.length - 1} isLast={isLast} swapped={step.swapped} comparingIndices={step.comparingIndices} />
          <SortBarChart bars={step.bars} targetIndex={step.targetIndex} />
          <SortControls
            isPlaying={isPlaying}
            isFirst={isFirst}
            isLast={isLast}
            isReversed={isReversed}
            onPlay={play}
            onPause={pause}
            onNext={next}
            onPrev={prev}
            onReset={reset}
            onEnding={ending}
            onRandomize={randomize}
            onReverse={reverse}
          />
          <SortLegend />
        </div>

        <div className={s.right}>
          <SortStatsPanel comparisons={comparisons} swaps={swaps} sortedCount={step.sortedCount} totalBars={step.bars.length} currentStep={currentStep} />
        </div>
      </div>
    </main>
  );
}
