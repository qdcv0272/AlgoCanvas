"use client";

import { useEffect, useState } from "react";
import { useBubbleSortStore } from "@/store/bubbleSortStore";
import Link from "next/link";
import s from "../sort-page.module.css";
import GuideModal from "@/components/GuideModal";
import SortBarChart from "@/components/sort/SortBarChart";
import SortProgressBanner from "@/components/sort/SortProgressBanner";
import SortControls from "@/components/sort/SortControls";
import SortStatsPanel from "@/components/sort/SortStatsPanel";
import SortLegend from "@/components/sort/SortLegend";
import CustomInputModal from "@/components/CustomInputModal";
import { useAlgorithmTracker } from "@/hooks/useAlgorithmTracker";

export default function BubbleSortPage() {
  const { steps, currentStep, isPlaying, isReversed, init, play, pause, next, prev, reset, ending, randomize, reverse, initWithCustom } = useBubbleSortStore();

  const [showGuide, setShowGuide] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useAlgorithmTracker("bubble-sort");

  useEffect(() => {
    if (steps.length === 0) {
      init();
    }
  }, [steps.length, init]);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  const comparisons = steps.slice(0, currentStep + 1).filter((st) => st.comparingIndices !== null).length;
  const swaps = steps.slice(0, currentStep + 1).filter((st) => st.swapped).length;

  if (!step) return null;

  return (
    <main className={s.page}>
      {/* ── 가이드 모달 ── */}
      {showGuide && (
        <GuideModal title="🫧 Bubble Sort 사용 가이드" onClose={() => setShowGuide(false)}>
          {/* 1. 개념 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 버블 소트란?</h3>
            <ul className={s.guideList}>
              <li>인접한 두 원소를 비교해서 순서가 잘못됐으면 교환하는 정렬 알고리즘입니다.</li>
              <li>한 번의 패스(pass)가 끝나면 가장 큰 값이 맨 뒤에 확정됩니다.</li>
              <li>이 과정을 n-1번 반복하면 배열 전체가 정렬됩니다.</li>
              <li>
                거품이 위로 올라오듯 큰 값이 뒤로 이동한다고 해서 <strong>버블(Bubble)</strong> 소트입니다.
              </li>
            </ul>
          </div>

          {/* 2. 오름/내림차순 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🔄 오름차순 / 내림차순</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>오름차순</span>
                <span className={s.guideRowDesc}>
                  작은 수 → 큰 수 순으로 정렬. 기본 모드. 비교 조건: <code>arr[j] &gt; arr[j+1]</code>
                </span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>내림차순</span>
                <span className={s.guideRowDesc}>
                  큰 수 → 작은 수 순으로 정렬. 비교 조건: <code>arr[j] &lt; arr[j+1]</code>
                </span>
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
                <span className={s.guideBtnDesc}>현재까지 두 원소를 비교한 횟수입니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.rose}`}>교환 횟수</span>
                <span className={s.guideBtnDesc}>비교 후 실제로 자리를 바꾼 횟수입니다.</span>
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
        <h1 className={s.headerTitle}>🫧 Bubble Sort</h1>
        <span className={s.headerSub}>— 인접한 두 원소를 비교해 정렬</span>
        <button className={s.guideBtn} onClick={() => setShowGuide(true)}>
          ❓ 가이드
        </button>
      </div>

      <div className={s.content}>
        <div className={s.left}>
          <SortProgressBanner progress={progress} currentStep={currentStep} totalSteps={steps.length - 1} isLast={isLast} swapped={step.swapped} comparingIndices={step.comparingIndices} />

          <SortBarChart bars={step.bars} />

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
            onCustomInput={() => setShowCustomInput(true)}
          />
          <SortLegend />
        </div>

        <div className={s.right}>
          <SortStatsPanel comparisons={comparisons} swaps={swaps} sortedCount={step.sortedCount} totalBars={step.bars.length} currentStep={currentStep} />
        </div>
      </div>

      {showCustomInput && (
        <CustomInputModal
          algorithmId="bubble-sort"
          title="Bubble Sort"
          placeholder="쉼표로 구분된 숫자 (예: 5, 3, 8, 1, 9, 2)"
          onLoad={(data) => {
            const arr = data
              .split(",")
              .map((v) => parseInt(v.trim(), 10))
              .filter((v) => !isNaN(v) && v > 0);
            if (arr.length >= 2) initWithCustom(arr);
          }}
          onClose={() => setShowCustomInput(false)}
        />
      )}
    </main>
  );
}
