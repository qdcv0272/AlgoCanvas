"use client";

import { useEffect, useState } from "react";
import { useDijkstraStore } from "@/store/dijkstraStore";
import Link from "next/link";
import s from "@/app/sort-page.module.css";
import ds from "@/components/dijkstra/dijkstra.module.css";
import GuideModal from "@/components/GuideModal";
import DijkstraGraph from "@/components/dijkstra/DijkstraGraph";
import DijkstraDistancePanel from "@/components/dijkstra/DijkstraDistancePanel";
import DijkstraLegend from "@/components/dijkstra/DijkstraLegend";
import DfsControls from "@/components/dfs/DfsControls";
import { useAlgorithmTracker } from "@/hooks/useAlgorithmTracker";

export default function DijkstraPage() {
  const { steps, currentStep, isPlaying, init, play, pause, next, prev, reset, ending } = useDijkstraStore();

  const [showGuide, setShowGuide] = useState(true);

  useAlgorithmTracker("dijkstra");

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
        <GuideModal title="🗺️ Dijkstra 사용 가이드" onClose={() => setShowGuide(false)}>
          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>📌 다익스트라 알고리즘이란?</h3>
            <ul className={s.guideList}>
              <li>가중 그래프에서 한 시작 노드부터 모든 노드까지의 최단 경로를 구합니다.</li>
              <li>
                <strong>우선순위 큐(min-heap)</strong>을 사용해 현재 거리가 가장 짧은 노드를 먼저 처리합니다.
              </li>
              <li>한 번 확정된 노드의 거리는 변하지 않습니다.</li>
              <li>음수 가중치 간선이 없는 경우에만 정확하게 동작합니다.</li>
            </ul>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>⚙️ 동작 순서</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>1단계</span>
                <span className={s.guideRowDesc}>시작 노드 거리를 0으로, 나머지는 ∞로 초기화하고 큐에 삽입합니다.</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>2단계</span>
                <span className={s.guideRowDesc}>큐에서 거리가 가장 짧은 노드를 꺼냅니다. (노란색)</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>3단계</span>
                <span className={s.guideRowDesc}>인접 노드들의 거리를 갱신합니다. 더 짧은 경로가 있으면 업데이트합니다. (청록색 간선)</span>
              </div>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>4단계</span>
                <span className={s.guideRowDesc}>노드를 확정하고 (초록색), 큐가 빌 때까지 반복합니다.</span>
              </div>
            </div>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>🎨 노드 색상</h3>
            <div className={s.guideBtnList}>
              <div className={s.guideBtnRow}>
                <span className={s.guideBtnKey}>⬜ 회색</span>
                <span className={s.guideBtnDesc}>아직 방문하지 않은 미방문 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.purple}`}>🟣 보라색</span>
                <span className={s.guideBtnDesc}>우선순위 큐에 추가된 대기 중 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.yellow}`}>🟡 노란색</span>
                <span className={s.guideBtnDesc}>현재 처리 중인 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.green}`}>🟢 초록색</span>
                <span className={s.guideBtnDesc}>최단 거리가 확정된 노드</span>
              </div>
              <div className={s.guideBtnRow}>
                <span className={`${s.guideBtnKey} ${s.cyan}`}>— 황금 선</span>
                <span className={s.guideBtnDesc}>최단 경로 트리에 포함된 간선</span>
              </div>
            </div>
          </div>

          <div className={s.guideSection}>
            <h3 className={s.guideSectionTitle}>⏱ 시간 복잡도</h3>
            <div className={s.guideRows}>
              <div className={s.guideRow}>
                <span className={`${s.guideTag} ${s.cyan}`}>O((V+E) log V)</span>
                <span className={s.guideRowDesc}>V: 노드 수, E: 간선 수. 우선순위 큐(이진 힙) 사용 시.</span>
              </div>
            </div>
          </div>
        </GuideModal>
      )}

      {/* 헤더 */}
      <div className={s.header}>
        <Link href="/" className={s.backLink}>
          ← 홈
        </Link>
        <div className={s.divider} />
        <h1 className={s.headerTitle}>🗺️ Dijkstra</h1>
        <span className={s.headerSub}>최단 경로 알고리즘</span>
        <button className={s.guideBtn} onClick={() => setShowGuide(true)}>
          ? 가이드
        </button>
      </div>

      {/* 진행 배너 */}
      <div className={ds.descBanner}>
        <div className={`${ds.descDot} ${isLast ? ds.done : currentStep > 0 ? ds.active : ""}`} />
        <span className={ds.descText}>{step.description}</span>
        <div className={ds.descProgress}>
          <div className={ds.progressTrack}>
            <div className={ds.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={ds.stepLabel}>
            {currentStep} / {steps.length - 1}
          </span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className={s.content}>
        <div className={s.left}>
          <DijkstraGraph nodeStates={step.nodeStates} distances={step.distances} prevNode={step.prevNode} examiningEdge={step.examiningEdge} />
          <DijkstraLegend />
        </div>
        <div className={s.right}>
          <DijkstraDistancePanel pqSnapshot={step.pqSnapshot} distances={step.distances} prevNode={step.prevNode} nodeStates={step.nodeStates} />
        </div>
      </div>

      {/* 컨트롤 */}
      <DfsControls isPlaying={isPlaying} isFirst={isFirst} isLast={isLast} onPlay={play} onPause={pause} onNext={next} onPrev={prev} onReset={reset} onEnding={ending} />
    </main>
  );
}
