"use client";

import { useEffect, useState } from "react";
import { useBfsStore, BFS_NODES } from "@/store/bfsStore";
import Link from "next/link";
import s from "@/app/sort-page.module.css";
import GuideModal from "@/components/GuideModal";
import SortProgressBanner from "@/components/sort/SortProgressBanner";
import BfsGraph from "@/components/bfs/BfsGraph";
import BfsQueuePanel from "@/components/bfs/BfsQueuePanel";
import DfsControls from "@/components/dfs/DfsControls";
import BfsLegend from "@/components/bfs/BfsLegend";
import { useAlgorithmTracker } from "@/hooks/useAlgorithmTracker";

export default function BfsPage() {
  const { steps, currentStep, isPlaying, init, play, pause, next, prev, reset, ending } = useBfsStore();

  const [showGuide, setShowGuide] = useState(true);

  useAlgorithmTracker("bfs");

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
        <GuideModal title="🌊 BFS 사용 가이드" onClose={() => setShowGuide(false)}>
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 너비 우선 탐색이란?</h3>
            <ul className={s.guideList}>
              <li>시작 노드에서 가까운 노드부터 순서대로 탐색하는 알고리즘입니다.</li>
              <li>
                <strong>큐(Queue)</strong>를 이용해 방문할 노드를 관리합니다.
              </li>
              <li>같은 레벨(깊이)의 노드를 모두 방문한 뒤 다음 레벨로 이동합니다.</li>
              <li>최단 경로 탐색에 자주 사용됩니다.</li>
            </ul>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>⚙️ 동작 순서</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>1단계</span>
                <span className={s.guideRowDesc}>시작 노드를 큐에 추가합니다.</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>2단계</span>
                <span className={s.guideRowDesc}>큐 FRONT에서 노드를 꺼냅니다. (노란색)</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>3단계</span>
                <span className={s.guideRowDesc}>방문 완료 표시 후 인접 노드를 큐 뒤에 추가합니다. (보라색)</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>4단계</span>
                <span className={s.guideRowDesc}>큐가 빌 때까지 2~3단계를 반복합니다.</span>
              </div>
            </div>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🔄 DFS vs BFS</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>DFS</span>
                <span className={s.guideRowDesc}>스택 사용. 깊이 방향으로 탐색. 방문 순서: 1→2→4→8→9→5→3→6→10→7</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>BFS</span>
                <span className={s.guideRowDesc}>큐 사용. 넓이 방향으로 탐색. 방문 순서: 1→2→3→4→5→6→7→8→9→10</span>
              </div>
            </div>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🎨 노드 색상</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⬜ 회색</span>
                <span className={s.guideBtnDesc}>아직 큐에 들어가지 않은 미방문 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.purple}`}>🟣 보라색</span>
                <span className={s.guideBtnDesc}>큐에 추가되어 대기 중인 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.yellow}`}>🟡 노란색</span>
                <span className={s.guideBtnDesc}>큐에서 꺼내 탐색 중인 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.green}`}>🟢 초록색</span>
                <span className={s.guideBtnDesc}>방문이 완료된 노드</span>
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
        <h1 className={s.headerTitle}>🌊 BFS</h1>
        <span className={s.headerSub}>— 너비 우선 탐색</span>
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
          <BfsGraph nodeStates={step.nodeStates} currentNode={step.currentNode} />
          <DfsControls isPlaying={isPlaying} isFirst={isFirst} isLast={isLast} onPlay={play} onPause={pause} onNext={next} onPrev={prev} onReset={reset} onEnding={ending} />
          <BfsLegend />
        </div>
        <div className={s.right}>
          <BfsQueuePanel queue={step.queue} visitOrder={step.visitOrder} totalNodes={BFS_NODES.length} />
        </div>
      </div>
    </main>
  );
}
