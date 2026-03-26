"use client";

import { useEffect, useRef, useState } from "react";
import { useDfsStore, NODES } from "@/store/dfsStore";
import Link from "next/link";
import s from "@/app/sort-page.module.css";
import GuideModal from "@/components/GuideModal";
import SortProgressBanner from "@/components/sort/SortProgressBanner";
import DfsGraph from "@/components/dfs/DfsGraph";
import DfsControls from "@/components/dfs/DfsControls";
import DfsStackPanel from "@/components/dfs/DfsStackPanel";
import DfsLegend from "@/components/dfs/DfsLegend";

export default function DfsPage() {
  const { steps, currentStep, isPlaying, init, play, pause, next, prev, reset, ending } = useDfsStore();

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

  if (!step) return null;

  return (
    <main className={s.page}>
      {/* ── 가이드 모달 ── */}
      {showGuide && (
        <GuideModal title="🌲 DFS 사용 가이드" onClose={() => setShowGuide(false)}>
          {/* 개념 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 깊이 우선 탐색이란?</h3>
            <ul className={s.guideList}>
              <li>한 방향으로 끝까지 파고든 뒤 되돌아오며 탐색하는 알고리즘입니다.</li>
              <li>
                <strong>스택(Stack)</strong>을 이용해 방문할 노드를 관리합니다.
              </li>
              <li>스택에서 노드를 꺼내고, 방문하지 않은 인접 노드를 스택에 추가합니다.</li>
              <li>스택이 빌 때까지 반복하면 연결된 모든 노드를 방문합니다.</li>
            </ul>
          </div>

          {/* 동작 순서 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>⚙️ 동작 순서</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>1단계</span>
                <span className={s.guideRowDesc}>시작 노드를 스택에 추가합니다.</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>2단계</span>
                <span className={s.guideRowDesc}>스택 TOP에서 노드를 꺼냅니다. (노란색)</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>3단계</span>
                <span className={s.guideRowDesc}>방문 완료로 표시하고 인접 노드를 스택에 추가합니다. (초록색)</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>4단계</span>
                <span className={s.guideRowDesc}>스택이 빌 때까지 2~3단계를 반복합니다.</span>
              </div>
            </div>
          </div>

          {/* 색상 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🎨 노드 색상</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⬜ 회색</span>
                <span className={s.guideBtnDesc}>아직 스택에 들어가지 않은 미방문 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.purple}`}>🟣 보라색</span>
                <span className={s.guideBtnDesc}>스택에 추가되어 대기 중인 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.yellow}`}>🟡 노란색</span>
                <span className={s.guideBtnDesc}>스택에서 꺼내 탐색 중인 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.green}`}>🟢 초록색</span>
                <span className={s.guideBtnDesc}>방문이 완료된 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.cyan}`}>🔵 시안 테두리</span>
                <span className={s.guideBtnDesc}>현재 단계에서 처리 중인 노드 (글로우 효과)</span>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🕹 버튼 설명</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⏮ 처음으로</span>
                <span className={s.guideBtnDesc}>탐색 과정을 첫 단계로 되돌립니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>◀ 이전 단계</span>
                <span className={s.guideBtnDesc}>한 단계씩 뒤로 이동합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>▶ / ⏸</span>
                <span className={s.guideBtnDesc}>자동 재생 / 일시정지.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>▶ 다음 단계</span>
                <span className={s.guideBtnDesc}>한 단계씩 앞으로 이동합니다.</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⏭ 끝으로</span>
                <span className={s.guideBtnDesc}>탐색이 완료된 마지막 단계로 바로 이동합니다.</span>
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
        <h1 className={s.headerTitle}>🌲 DFS</h1>
        <span className={s.headerSub}>— 깊이 우선 탐색</span>
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
            comparingIndices={step.currentNode !== null ? [step.currentNode, step.currentNode] : null}
          />
          <DfsGraph nodeStates={step.nodeStates} currentNode={step.currentNode} />
          <DfsControls isPlaying={isPlaying} isFirst={isFirst} isLast={isLast} onPlay={play} onPause={pause} onNext={next} onPrev={prev} onReset={reset} onEnding={ending} />
          <DfsLegend />
        </div>

        <div className={s.right}>
          <DfsStackPanel stack={step.stack} visitOrder={step.visitOrder} currentNode={step.currentNode} totalNodes={NODES.length} />
        </div>
      </div>
    </main>
  );
}
