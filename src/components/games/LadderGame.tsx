import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { firebaseRepository } from '../../services/firebaseRepository';
import {
  Users,
  Plus,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Share2,
  CheckCircle2,
  Shuffle,
  ChevronDown,
  Award,
  Play,
  Settings2,
} from 'lucide-react';

interface HorizontalLine {
  id: string;
  x: number; // column index: line goes from column x to x + 1
  y: number; // vertical position in pixels
}

interface PathResult {
  participantIndex: number;
  participant: string;
  finalCol: number;
  result: string;
  waypoints: { x: number; y: number }[];
}

const DEFAULT_PARTICIPANTS = ['참가자 1', '참가자 2', '참가자 3', '참가자 4'];
const DEFAULT_RESULTS = ['당첨', '꽝', '꽝', '꽝'];
const LADDER_HEIGHT = 380;
const COL_WIDTH = 90;
const TOP_MARGIN = 40;
const BOTTOM_MARGIN = 40;

export const LadderGame: React.FC = () => {
  const { user } = useApp();

  const [participants, setParticipants] = useState<string[]>(DEFAULT_PARTICIPANTS);
  const [results, setResults] = useState<string[]>(DEFAULT_RESULTS);

  // Ladder structural state
  const [horizontalLines, setHorizontalLines] = useState<HorizontalLine[]>([]);
  const [pathResults, setPathResults] = useState<PathResult[] | null>(null);

  // UI & Interaction states
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isBlindMode, setIsBlindMode] = useState<boolean>(true); // Hide horizontal lines until traced
  const [selectedParticipantIdx, setSelectedParticipantIdx] = useState<number | null>(null);
  const [revealedResults, setRevealedResults] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Unmount & timeout cleanup refs
  const isMountedRef = useRef(true);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Preset modal / popover
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [winCount, setWinCount] = useState<number>(1);
  const [loseCount, setLoseCount] = useState<number>(1);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const numCols = participants.length;
  const svgWidth = Math.max(480, numCols * COL_WIDTH + 80);
  const svgHeight = LADDER_HEIGHT + TOP_MARGIN + BOTTOM_MARGIN;

  // 1. Participant Management
  const handleAddParticipant = () => {
    if (participants.length >= 24) {
      alert('최대 24명까지 참여 가능합니다.');
      return;
    }
    const nextIdx = participants.length + 1;
    setParticipants(prev => [...prev, `참가자 ${nextIdx}`]);
    setResults(prev => [...prev, '꽝']);
    resetLadder();
  };

  const handleRemoveParticipant = (index: number) => {
    if (participants.length <= 2) {
      alert('사다리타기는 최소 2명 이상 필요합니다.');
      return;
    }
    setParticipants(prev => prev.filter((_, i) => i !== index));
    setResults(prev => prev.filter((_, i) => i !== index));
    resetLadder();
  };

  const handleParticipantChange = (index: number, val: string) => {
    const updated = [...participants];
    updated[index] = val;
    setParticipants(updated);
    if (isGenerated) resetLadder();
  };

  const handleResultChange = (index: number, val: string) => {
    const updated = [...results];
    updated[index] = val;
    setResults(updated);
    if (isGenerated) resetLadder();
  };

  const resetLadder = () => {
    setIsGenerated(false);
    setHorizontalLines([]);
    setPathResults(null);
    setSelectedParticipantIdx(null);
    setRevealedResults(new Set());
  };

  // 2. Preset Rules
  const applyPreset = (type: 'win1' | 'lose1' | 'custom_win' | 'custom_lose' | 'ranks') => {
    const count = participants.length;
    let newRes: string[] = [];

    if (type === 'win1') {
      newRes = Array(count).fill('꽝');
      newRes[0] = '🎉 당첨';
    } else if (type === 'lose1') {
      newRes = Array(count).fill('통과');
      newRes[0] = '💣 벌칙/커피';
    } else if (type === 'custom_win') {
      const safeWins = Math.max(1, Math.min(count - 1, winCount));
      newRes = [
        ...Array(safeWins).fill('🎉 당첨'),
        ...Array(count - safeWins).fill('꽝'),
      ];
    } else if (type === 'custom_lose') {
      const safeLoses = Math.max(1, Math.min(count - 1, loseCount));
      newRes = [
        ...Array(safeLoses).fill('💣 벌칙'),
        ...Array(count - safeLoses).fill('통과'),
      ];
    } else if (type === 'ranks') {
      newRes = participants.map((_, i) => `${i + 1}등`);
    }

    // Shuffle results so preset isn't always in column 0
    for (let i = newRes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newRes[i], newRes[j]] = [newRes[j], newRes[i]];
    }

    setResults(newRes);
    setShowPresets(false);
    resetLadder();
  };

  // 3. Generate Valid Mathematical Amidakuji Ladder
  const generateLadder = () => {
    if (participants.length !== results.length) {
      alert('참가자 수와 결과 수가 일치해야 합니다.');
      return;
    }

    const n = participants.length;
    const lines: HorizontalLine[] = [];

    // We distribute rungs across vertical levels (tiers)
    // To ensure no overlapping or adjacent collision at the exact same level:
    const numLevels = Math.max(12, n * 3);
    const levelHeight = (LADDER_HEIGHT - 60) / numLevels;

    for (let lvl = 0; lvl < numLevels; lvl++) {
      const y = TOP_MARGIN + 30 + lvl * levelHeight + (Math.random() * 8 - 4);
      // For each level, we randomly place horizontal lines without adjacent collisions
      const availableCols = Array.from({ length: n - 1 }, (_, i) => i);
      // Shuffle available columns
      for (let i = availableCols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableCols[i], availableCols[j]] = [availableCols[j], availableCols[i]];
      }

      const occupied = new Set<number>();
      for (const col of availableCols) {
        if (!occupied.has(col - 1) && !occupied.has(col) && !occupied.has(col + 1)) {
          if (Math.random() < 0.55) {
            lines.push({
              id: `line_${lvl}_${col}`,
              x: col,
              y,
            });
            occupied.add(col);
          }
        }
      }
    }

    // Guaranteed connection: ensure every pair of adjacent columns has at least 1 rung
    for (let col = 0; col < n - 1; col++) {
      const hasRung = lines.some(l => l.x === col);
      if (!hasRung) {
        const y = TOP_MARGIN + 40 + Math.random() * (LADDER_HEIGHT - 80);
        lines.push({
          id: `line_extra_${col}`,
          x: col,
          y,
        });
      }
    }

    // Sort all lines vertically top-to-bottom
    lines.sort((a, b) => a.y - b.y);

    // Compute 100% accurate Amidakuji paths
    const computedPaths: PathResult[] = participants.map((p, startCol) => {
      let currentCol = startCol;
      const waypoints: { x: number; y: number }[] = [
        { x: currentCol, y: TOP_MARGIN },
      ];

      for (const line of lines) {
        if (line.x === currentCol) {
          // Cross right
          waypoints.push({ x: currentCol, y: line.y });
          currentCol = currentCol + 1;
          waypoints.push({ x: currentCol, y: line.y });
        } else if (line.x + 1 === currentCol) {
          // Cross left
          waypoints.push({ x: currentCol, y: line.y });
          currentCol = currentCol - 1;
          waypoints.push({ x: currentCol, y: line.y });
        }
      }

      waypoints.push({ x: currentCol, y: TOP_MARGIN + LADDER_HEIGHT });

      return {
        participantIndex: startCol,
        participant: p,
        finalCol: currentCol,
        result: results[currentCol],
        waypoints,
      };
    });

    setHorizontalLines(lines);
    setPathResults(computedPaths);
    setIsGenerated(true);
    setSelectedParticipantIdx(null);
    setRevealedResults(new Set());

    // Save to Firestore history with deduplication
    if (user?.id) {
      setIsProcessing(true);
      firebaseRepository
        .saveGameHistory(
          user.id,
          'ladder',
          { participants, results },
          computedPaths.map(cp => ({ participant: cp.participant, result: cp.result }))
        )
        .catch(console.warn)
        .finally(() => {
          if (isMountedRef.current) setIsProcessing(false);
        });
    }
  };

  // 4. Trace Individual Participant Path
  const handleSelectParticipant = (idx: number) => {
    setSelectedParticipantIdx(idx);
    setRevealedResults(prev => new Set([...prev, idx]));
  };

  // 5. Reveal All Results
  const handleRevealAll = () => {
    setIsBlindMode(false);
    if (pathResults) {
      setRevealedResults(new Set(participants.map((_, i) => i)));
    }
  };

  // 6. Share Results to Clipboard
  const handleCopyResults = () => {
    if (!pathResults) return;

    const lines = [
      '🎯 [병돌 인베스트먼트 사다리타기 결과]',
      '--------------------------------',
      ...pathResults.map(p => `• ${p.participant} ➔ ${p.result}`),
      '--------------------------------',
      '병돌 인베스트먼트에서 진행되었습니다.',
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopyFeedback(true);
    copyTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) setCopyFeedback(false);
    }, 2500);
  };

  // Calculate SVG column X coordinate
  const getColX = (colIdx: number) => 50 + colIdx * COL_WIDTH;

  // Selected participant path SVG d attribute
  const activePathD = useMemo(() => {
    if (selectedParticipantIdx === null || !pathResults) return null;
    const pResult = pathResults.find(pr => pr.participantIndex === selectedParticipantIdx);
    if (!pResult) return null;

    return pResult.waypoints
      .map((wp, i) => `${i === 0 ? 'M' : 'L'} ${getColX(wp.x)} ${wp.y}`)
      .join(' ');
  }, [selectedParticipantIdx, pathResults]);

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 mb-2">
              <Users className="w-3.5 h-3.5" />
              다인원 실시간 추첨
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              사다리타기 (2~24명 지원)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              정확한 아미다쿠지 경로 계산과 블라인드 긴장감 추첨. 결과는 자동으로 개인 기록에 보관됩니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5 text-rose-500" />
              결과 프리셋 설정
            </button>
            <button
              onClick={resetLadder}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
              title="사다리 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset Settings Dropdown */}
        {showPresets && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3 animate-in fade-in">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              빠른 결과 프리셋 선택
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyPreset('win1')}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 font-semibold text-slate-800 dark:text-slate-200 text-left"
              >
                당첨 1명 / 나머지 꽝
              </button>
              <button
                onClick={() => applyPreset('lose1')}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 font-semibold text-slate-800 dark:text-slate-200 text-left"
              >
                커피 쏘기 (벌칙 1명)
              </button>
              <button
                onClick={() => applyPreset('ranks')}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 font-semibold text-slate-800 dark:text-slate-200 text-left"
              >
                1등부터 {participants.length}등 순위
              </button>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-1">
                <span className="text-[11px] text-slate-500">당첨 N명:</span>
                <input
                  type="number"
                  min={1}
                  max={participants.length - 1}
                  value={winCount}
                  onChange={e => setWinCount(Number(e.target.value))}
                  className="w-10 px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-center font-bold"
                />
                <button
                  onClick={() => applyPreset('custom_win')}
                  className="px-2 py-1 rounded bg-rose-500 text-white font-bold text-[10px]"
                >
                  적용
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Participant & Result Input Editor */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-500" />
            참가자 & 결과 입력 ({participants.length}명)
          </div>
          <button
            onClick={handleAddParticipant}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs flex items-center gap-1 hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 참가자 추가
          </button>
        </div>

        {/* Scrollable inputs container */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {participants.map((p, idx) => (
              <div
                key={idx}
                className="w-28 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shrink-0"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>#{idx + 1}</span>
                  {participants.length > 2 && (
                    <button
                      onClick={() => handleRemoveParticipant(idx)}
                      className="text-slate-400 hover:text-rose-500 p-0.5"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Participant Name */}
                <input
                  type="text"
                  value={p}
                  onChange={e => handleParticipantChange(idx, e.target.value)}
                  placeholder="참가자"
                  className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />

                <div className="text-[10px] text-slate-400 text-center font-medium">⬇ 도달할 결과</div>

                {/* Destination Result */}
                <input
                  type="text"
                  value={results[idx] || ''}
                  onChange={e => handleResultChange(idx, e.target.value)}
                  placeholder="결과"
                  className={`w-full px-2 py-1 rounded-lg border text-xs font-bold text-center focus:outline-none focus:border-rose-500 ${
                    results[idx]?.includes('당첨') || results[idx]?.includes('1등')
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {!isGenerated ? (
            <button
              onClick={generateLadder}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              사다리 생성 및 게임 시작
            </button>
          ) : (
            <div className="w-full flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsBlindMode(!isBlindMode)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {isBlindMode ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                {isBlindMode ? '사다리 선 전체 보기' : '블라인드 가리기'}
              </button>

              <button
                onClick={handleRevealAll}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                모든 결과 즉시 공개
              </button>

              <button
                onClick={generateLadder}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                다시 타기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Interactive SVG Ladder Display */}
      {isGenerated && pathResults && (
        <div className="bg-white dark:bg-[#131722] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              💡 <span className="font-semibold text-slate-900 dark:text-white">참가자 버튼</span>을 클릭하면 경로를 따라 내려가 결과가 공개됩니다.
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                공개됨: {revealedResults.size} / {participants.length}
              </span>
            </div>
          </div>

          {/* SVG Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-4"
          >
            <div style={{ minWidth: `${svgWidth}px` }} className="relative mx-auto">
              {/* Participant Clickable Top Headers */}
              <div className="flex justify-between relative z-10 px-[50px] mb-2" style={{ width: `${svgWidth}px` }}>
                {participants.map((p, idx) => {
                  const isSelected = selectedParticipantIdx === idx;
                  const isRevealed = revealedResults.has(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectParticipant(idx)}
                      style={{
                        position: 'absolute',
                        left: `${getColX(idx)}px`,
                        transform: 'translateX(-50%)',
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                        isSelected
                          ? 'bg-rose-600 text-white scale-110 ring-4 ring-rose-500/20 z-20'
                          : isRevealed
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-rose-500'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* The SVG Canvas */}
              <svg width={svgWidth} height={svgHeight} className="block select-none mt-6">
                {/* 1. Vertical Rails */}
                {participants.map((_, colIdx) => (
                  <line
                    key={`rail_${colIdx}`}
                    x1={getColX(colIdx)}
                    y1={TOP_MARGIN}
                    x2={getColX(colIdx)}
                    y2={TOP_MARGIN + LADDER_HEIGHT}
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="dark:stroke-slate-700"
                  />
                ))}

                {/* 2. Horizontal Rungs */}
                {horizontalLines.map(line => {
                  const x1 = getColX(line.x);
                  const x2 = getColX(line.x + 1);

                  if (isBlindMode) {
                    // In blind mode, show mysterious frosted dashed rungs or hidden
                    return (
                      <g key={line.id}>
                        <line
                          x1={x1}
                          y1={line.y}
                          x2={x2}
                          y2={line.y}
                          stroke="#cbd5e1"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="dark:stroke-slate-800/80"
                        />
                      </g>
                    );
                  }

                  return (
                    <line
                      key={line.id}
                      x1={x1}
                      y1={line.y}
                      x2={x2}
                      y2={line.y}
                      stroke="#64748b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="dark:stroke-slate-500"
                    />
                  );
                })}

                {/* 3. Active Traced Path (Highlighted in bright rose red) */}
                {activePathD && (
                  <path
                    d={activePathD}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-in fade-in"
                  />
                )}
              </svg>

              {/* Destination Bottom Results */}
              <div className="flex justify-between relative z-10 px-[50px] mt-2" style={{ width: `${svgWidth}px` }}>
                {results.map((res, colIdx) => {
                  // Find which participant landed on this col
                  const landingParticipant = pathResults.find(pr => pr.finalCol === colIdx);
                  const isDestinationRevealed =
                    !isBlindMode || (landingParticipant && revealedResults.has(landingParticipant.participantIndex));
                  const isWinning = res.includes('당첨') || res.includes('1등') || res.includes('통과');

                  return (
                    <div
                      key={colIdx}
                      style={{
                        position: 'absolute',
                        left: `${getColX(colIdx)}px`,
                        transform: 'translateX(-50%)',
                      }}
                      className="text-center"
                    >
                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          !isDestinationRevealed
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700'
                            : isWinning
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {isDestinationRevealed ? res : '???'}
                      </div>
                      {isDestinationRevealed && landingParticipant && (
                        <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                          {landingParticipant.participant}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Complete Results Table & Copy Share */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                추첨 결과 요약 표
              </h3>
              <button
                onClick={handleCopyResults}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                {copyFeedback ? '결과 복사 완료!' : '결과 복사하기'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {pathResults.map((pr, idx) => {
                const isRevealed = !isBlindMode || revealedResults.has(pr.participantIndex);
                const isWin = pr.result.includes('당첨') || pr.result.includes('1등') || pr.result.includes('통과');
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectParticipant(pr.participantIndex)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      selectedParticipantIdx === pr.participantIndex
                        ? 'border-rose-500 bg-rose-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-900/40'
                    }`}
                  >
                    <span className="font-bold text-slate-900 dark:text-white truncate">{pr.participant}</span>
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-md shrink-0 ${
                        !isRevealed
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          : isWin
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {isRevealed ? pr.result : '?'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
