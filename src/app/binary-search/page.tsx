"use client";

import { useEffect, useRef, useState } from "react";
import { useBinarySearchStore } from "@/store/binarySearchStore";
import Link from "next/link";
import s from "@/app/sort-page.module.css";
import GuideModal from "@/components/GuideModal";
import BinarySearchChart from "@/components/binary-search/BinarySearchChart";
import BinarySearchBanner from "@/components/binary-search/BinarySearchBanner";
import BinarySearchControls from "@/components/binary-search/BinarySearchControls";
import BinarySearchLegend from "@/components/binary-search/BinarySearchLegend";
import BinarySearchStatsPanel from "@/components/binary-search/BinarySearchStatsPanel";

export default function BinarySearchPage() {
  const { steps, currentStep, isPlaying, target, init, play, pause, next, prev, reset, ending, randomize, changeTarget } = useBinarySearchStore();

  const initialized = useRef(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    if (!initialized.current) {
      init();
      initialized.current = true;
    }
  }, [init]);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  // 비교 횟수 = mid가 있는 단계 중 found 표시 단계는 제외 (같은 비교가 2번 집계되는 것 방지)
  const comparisons = steps.slice(0, currentStep + 1).filter((st) => st.mid !== null && !st.found).length;
  // 현재 탐색 범위 크기
  const rangeSize = step ? (step.found || step.notFound ? 0 : step.high - step.low + 1) : 0;

  if (!step) return null;

  return (
    <main className={s.page}>
      {/* ── 가이드 모달 ── */}
      {showGuide && (
        <GuideModal title="🔍 Binary Search 사용 가이드" onClose={() => setShowGuide(false)}>
          {/* 1. 개념 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 이진 탐색이란?</h3>
            <ul className={s.guideList}>
              <li>
                <strong>정렬된 배열</strong>에서만 동작하는 고속 탐색 알고리즘입니다.
              </li>
              <li>전체를 둘로 나눠 중간값(mid)과 목표값을 비교하며 범위를 절반씩 줄여갑니다.</li>
              <li>
                최악의 경우도 <strong>O(log n)</strong>번만 비교하면 됩니다.
              </li>
              <li>n = 1,000,000 이어도 최대 20번만 비교합니다.</li>
            </ul>
          </div>

          {/* 2. 동작 순서 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>⚙️ 동작 순서</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>1단계</span>
                <span className={s.guideRowDesc}>low=0, high=n-1로 전체 범위를 설정합니다.</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>2단계</span>
                <span className={s.guideRowDesc}>
                  mid = ⌊(low+high)/2⌋ 계산 후 <code>arr[mid]</code>와 목표값 비교.
                </span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>3단계</span>
                <span className={s.guideRowDesc}>같으면 탐색 성공. 작으면 low = mid+1, 크면 high = mid-1.</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>4단계</span>
                <span className={s.guideRowDesc}>low &gt; high가 되면 탐색 실패.</span>
              </div>
            </div>
          </div>

          {/* 3. 포인터 설명 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🔖 포인터 설명</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.cyan}`}>L (low)</span>
                <span className={s.guideBtnDesc}>현재 탐색 범위의 왼쪽 끝 인덱스입니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.yellow}`}>M (mid)</span>
                <span className={s.guideBtnDesc}>목표값과 비교하는 중간 인덱스입니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.purple}`}>H (high)</span>
                <span className={s.guideBtnDesc}>현재 탐색 범위의 오른쪽 끝 인덱스입니다.</span>
              </div>
            </div>
          </div>

          {/* 4. 버튼 설명 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🕹 버튼 설명</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>🔢 숫자 바꾸기</span>
                <span className={s.guideBtnDesc}>새로운 정렬된 배열과 새 목표값으로 초기화합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>🎯 목표 바꾸기</span>
                <span className={s.guideBtnDesc}>같은 배열로 목표값만 변경해 다시 탐색합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⏮ / ◀ / ▶ / ⏭</span>
                <span className={s.guideBtnDesc}>처음 / 이전 / 다음 / 마지막 단계로 이동합니다.</span>
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
        <h1 className={s.headerTitle}>🔍 Binary Search</h1>
        <span className={s.headerSub}>— 절반씩 줄이는 고속 탐색</span>
        <button className={s.guideBtn} onClick={() => setShowGuide(true)}>
          ❓ 가이드
        </button>
      </div>

      <div className={s.content}>
        <div className={s.left}>
          <BinarySearchBanner progress={progress} currentStep={currentStep} totalSteps={steps.length - 1} found={step.found} notFound={step.notFound} mid={step.mid} />
          <BinarySearchChart bars={step.bars} low={step.low} high={step.high} mid={step.mid} target={target} />
          <BinarySearchControls
            isPlaying={isPlaying}
            isFirst={isFirst}
            isLast={isLast}
            onPlay={play}
            onPause={pause}
            onNext={next}
            onPrev={prev}
            onReset={reset}
            onEnding={ending}
            onRandomize={randomize}
            onChangeTarget={changeTarget}
          />
          <BinarySearchLegend />
        </div>

        <div className={s.right}>
          <BinarySearchStatsPanel comparisons={comparisons} rangeSize={rangeSize} found={step.found} notFound={step.notFound} target={target} currentStep={currentStep} />
        </div>
      </div>
    </main>
  );
}
