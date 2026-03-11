"use client";

import { useEffect, useRef, useState } from "react";
import { useBubbleSortStore } from "@/store/bubbleSortStore";
import Link from "next/link";
import s from "./page.module.css";
import CtrlBtn from "@/components/CtrlBtn";

const LEGEND = [
  { bg: "#6b7280", label: "기본" },
  { bg: "#facc15", label: "비교 중" },
  { bg: "#f43f5e", label: "교환 중" },
  { bg: "#10b981", label: "정렬 완료" },
];

export default function BubbleSortPage() {
  const { steps, currentStep, isPlaying, isReversed, init, play, pause, next, prev, reset, randomize, reverse } = useBubbleSortStore();

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

  const comparisons = steps.slice(0, currentStep + 1).filter((st) => st.comparingIndices !== null).length;
  const swaps = steps.slice(0, currentStep + 1).filter((st) => st.swapped).length;

  if (!step) return null;

  const dotCls = isLast ? s.done : step.swapped ? s.swapping : step.comparingIndices ? s.comparing : s.default;

  return (
    <main className={s.page}>
      {/* ── 가이드 모달 ── */}
      {showGuide && (
        <div className={s.modalOverlay} onClick={() => setShowGuide(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>🫧 Bubble Sort 사용 가이드</h2>
              <button className={s.modalClose} onClick={() => setShowGuide(false)}>
                ✕
              </button>
            </div>
            <div className={s.modalBody}>
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
                    <span className={s.guideTag} style={{ background: "#1e3a5f", color: "#22d3ee", borderColor: "#06b6d4" }}>
                      오름차순
                    </span>
                    <span className={s.guideRowDesc}>
                      작은 수 → 큰 수 순으로 정렬. 기본 모드. 비교 조건: <code>arr[j] &gt; arr[j+1]</code>
                    </span>
                  </div>
                  <div className={s.guideRow}>
                    <span className={s.guideTag} style={{ background: "#1e3a5f", color: "#22d3ee", borderColor: "#06b6d4" }}>
                      내림차순
                    </span>
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
            </div>
            <div className={s.modalFooter}>
              <button className={s.modalStartBtn} onClick={() => setShowGuide(false)}>
                시작하기 →
              </button>
            </div>
          </div>
        </div>
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
        {/* ── 왼쪽 ── */}
        <div className={s.left}>
          {/* 상태 배너 + 진행바 */}
          <div className={s.banner}>
            <span className={`${s.bannerDot} ${dotCls}`} />
            <div className={s.bannerProgress}>
              <div className={s.progressTrack}>
                <div className={s.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>
            <span className={s.bannerStepLabel}>
              {currentStep} / {steps.length - 1}
            </span>
          </div>

          {/* 숫자 배열 */}
          <div className={s.chartBox}>
            <div className={s.bars}>
              {step.bars.map((bar, idx) => (
                <div key={idx} className={s.barCol}>
                  <span className={`${s.barLabel} ${s[bar.state]}`}>{bar.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 컨트롤 */}
          <div className={s.controls}>
            {/* 상단: 숫자 바꾸기 / 역순 */}
            <div className={s.btnRow}>
              <CtrlBtn onClick={randomize} title="새 숫자로 바꾸기" className={s.ctrlBtn}>
                🔢 숫자 바꾸기
              </CtrlBtn>
              <CtrlBtn onClick={reverse} title="오름차순/내림차순 전환" active={isReversed} className={s.ctrlBtn} activeClassName={s.ctrlBtnActive}>
                🔄 {isReversed ? "내림차순" : "오름차순"}
              </CtrlBtn>
            </div>
            {/* 하단: 재생 컨트롤 */}
            <div className={s.btnRow}>
              <CtrlBtn onClick={reset} disabled={isFirst} title="처음으로" className={s.ctrlBtn}>
                ⏮
              </CtrlBtn>
              <CtrlBtn onClick={prev} disabled={isFirst} title="이전 단계" className={s.ctrlBtn}>
                ◀
              </CtrlBtn>

              {isPlaying ? (
                <button className={`${s.playBtn} ${s.pause}`} onClick={pause} title="일시정지">
                  ⏸
                </button>
              ) : (
                <button className={`${s.playBtn} ${s.play}`} onClick={play} disabled={isLast} title="재생">
                  ▶
                </button>
              )}

              <CtrlBtn onClick={next} disabled={isLast} title="다음 단계" className={s.ctrlBtn}>
                ▶
              </CtrlBtn>
              <CtrlBtn
                onClick={() => {
                  const { steps: st } = useBubbleSortStore.getState();
                  useBubbleSortStore.setState({ currentStep: st.length - 1, isPlaying: false });
                }}
                disabled={isLast}
                title="끝으로"
                className={s.ctrlBtn}
              >
                ⏭
              </CtrlBtn>
            </div>
          </div>

          {/* 범례 */}
          <div className={s.legend}>
            {LEGEND.map(({ bg, label }) => (
              <div key={label} className={s.legendItem}>
                <div className={s.legendDot} style={{ background: bg }} />
                <span className={s.legendLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 오른쪽 사이드바 ── */}
        <div className={s.right}>
          {/* 통계 */}
          <div className={s.card}>
            <div className={s.statsGrid}>
              <div className={s.statBox}>
                <p className={s.statLabel}>비교 횟수</p>
                <p className={`${s.statValue} ${s.yellow}`}>{comparisons}</p>
              </div>
              <div className={s.statBox}>
                <p className={s.statLabel}>교환 횟수</p>
                <p className={`${s.statValue} ${s.rose}`}>{swaps}</p>
              </div>
              <div className={s.statBox}>
                <p className={s.statLabel}>완료된 요소</p>
                <p className={`${s.statValue} ${s.green}`}>
                  {step.sortedCount} / {step.bars.length}
                </p>
              </div>
              <div className={s.statBox}>
                <p className={s.statLabel}>현재 단계</p>
                <p className={`${s.statValue} ${s.cyan}`}>{currentStep + 1}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
