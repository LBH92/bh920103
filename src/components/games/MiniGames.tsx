import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Users,
  Utensils,
  ChevronLeft,
  Award,
  Sparkles,
  HelpCircle,
  Briefcase,
  History,
  Grid,
  Lock,
} from 'lucide-react';
import { LadderGame } from './LadderGame';
import { LunchSelector } from './LunchSelector';
import { WorkLifeSimulation } from './WorkLifeSimulation';
import { GomokuGame } from './GomokuGame';
import { JanggiGame } from './JanggiGame';
import { HoldemGame } from './HoldemGame';
import { useApp } from '../../context/AppContext';
import { firebaseRepository } from '../../services/firebaseRepository';

export type MiniGameId = 'ladder' | 'lunch' | 'work' | 'gomoku' | 'janggi' | 'holdem';

interface GameMetadata {
  id: MiniGameId;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  shortDesc: string;
  rules: string[];
}

const GAME_CATALOG: GameMetadata[] = [
  {
    id: 'work',
    title: '랜덤입사 인생 시뮬레이션',
    badge: '메인 시뮬레이터',
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    icon: <Briefcase className="w-6 h-6" />,
    shortDesc: '랜덤 캐릭터로 첫 직장에 입사해 60세 정년 또는 40대 파이어족 은퇴까지의 긴 여정을 플레이합니다.',
    rules: [
      '학력·전공에 따른 가중치로 첫 직장(대기업·스타트업·공기업 등)이 무작위 배정됩니다.',
      '매년 발생하는 직장·투자·인생 사건에서 최선의 선택을 내려 능력치와 자산을 키우세요.',
      '연봉 실수령액에서 생활비·세금이 자동 결산되며, 남은 자금으로 주식·부동산 투자를 할 수 있습니다.',
      '스트레스 100% 도달 시 번아웃 퇴사, 순자산 20억+ 달성 시 조기 은퇴 등 15종 이상의 결말이 기다립니다.',
    ],
  },
  {
    id: 'ladder',
    title: '사다리타기',
    badge: '다인원 추첨',
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    icon: <Users className="w-6 h-6" />,
    shortDesc: '2명부터 24명까지 정확한 아미다쿠지 경로 계산과 블라인드 긴장감 추첨을 지원합니다.',
    rules: [
      '참가자와 도착 결과를 원하는 인원수만큼 자유롭게 추가하고 편집할 수 있습니다.',
      '빠른 프리셋(당첨 1명, 커피 쏘기 1명, 당첨 N명 지정 등)을 즉시 적용할 수 있습니다.',
      '시작 전에는 사다리 가로선이 가려지는 블라인드 모드로 진행되며, 참가자 클릭 시 경로를 따라 결과가 공개됩니다.',
      '추첨 결과는 1:1로 고유 매핑되며, 요약 표를 클릭 한 번으로 복사하여 공유할 수 있습니다.',
    ],
  },
  {
    id: 'lunch',
    title: '점심 메뉴 고르기',
    badge: '스마트 룰렛',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: <Utensils className="w-6 h-6" />,
    shortDesc: '예산·카테고리·맵기 필터와 어제 먹은 메뉴 제외. 실제 지도 검색 연동까지 완벽 지원합니다.',
    rules: [
      '한식, 중식, 일식, 양식, 분식, 건강식 등 45가지 이상의 다채로운 직장인 점심 메뉴 풀이 제공됩니다.',
      '1인 예산 한도와 맵기 선호도를 조절하고, 제외할 메뉴를 직접 태그로 추가할 수 있습니다.',
      '최근 선택한 메뉴 3회 반복 방지 옵션으로 매일 새로운 메뉴를 추천받을 수 있습니다.',
      '현재 GPS 위치 또는 주변 동네/역명을 입력하면 카카오맵/네이버지도 실제 맛집 검색으로 즉시 연결됩니다.',
    ],
  },
  {
    id: 'gomoku',
    title: '실시간 1:1 오목',
    badge: '정식 대전',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: <Grid className="w-6 h-6" />,
    shortDesc: '정석 규칙의 15x15 오목. AI 4단계 난이도와 친구 대전을 지원합니다.',
    rules: [
      '흑백 돌을 번갈아 놓아 가로·세로·대각선 5개를 먼저 연결하면 승리합니다.',
      'AI 난이도별 실력을 테스트하고, 친구와 방을 만들어 실시간으로 대전하세요.',
    ],
  },
  {
    id: 'janggi',
    title: '전통 장기 (Janggi)',
    badge: '정식 대전',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: <Grid className="w-6 h-6" />,
    shortDesc: '전통 규칙의 9x10 장기. 전술 수싸움의 진수를 경험하세요.',
    rules: [
      '차, 포, 마, 상, 사, 졸, 궁을 이용해 상대 궁을 먼저 장군(외통수) 치면 승리합니다.',
      'AI 난이도별 실력을 테스트하고, 친구와 방을 만들어 실시간으로 대전하세요.',
    ],
  },
  {
    id: 'holdem',
    title: '텍사스 홀덤',
    badge: '정식 대전',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: <Grid className="w-6 h-6" />,
    shortDesc: '전략과 심리전의 정수, 텍사스 홀덤.',
    rules: [
      '52장 카드로 진행되는 포커 게임입니다.',
      '자신의 카드와 공유 카드를 조합하여 가장 높은 족보를 만드세요.',
    ],
  },
];

export const MiniGames: React.FC = () => {
  const { user } = useApp();
  const [activeGame, setActiveGame] = useState<'main' | MiniGameId>('main');
  const [showRulesFor, setShowRulesFor] = useState<MiniGameId | null>(null);

  // Arcade User Stats
  const [stats, setStats] = useState({
    ladderCount: 0,
    lunchCount: 0,
    officeActive: false,
    officeYears: 0,
    officeEndingCount: 0,
  });

  useEffect(() => {
    // Only load arcade stats on main hub view to avoid background queries during active gameplay
    if (!user?.id || activeGame !== 'main') return;
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [ladderHist, lunchHist, officeRecords, activeOffice] = await Promise.all([
          firebaseRepository.getUserGameHistory(user.id, 'ladder').catch(() => []),
          firebaseRepository.getUserGameHistory(user.id, 'lunch').catch(() => []),
          firebaseRepository.getOfficeGameRecords(user.id).catch(() => []),
          firebaseRepository.getActiveOfficeGame(user.id).catch(() => null),
        ]);

        if (isMounted) {
          setStats({
            ladderCount: ladderHist.length,
            lunchCount: lunchHist.length,
            officeActive: Boolean(activeOffice),
            officeYears: activeOffice?.year || 0,
            officeEndingCount: officeRecords.length,
          });
        }
      } catch (e) {
        console.warn('Failed to load arcade stats:', e);
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [user?.id, activeGame]);

  const handleSelectGame = (gameId: MiniGameId | 'main') => {
    setShowRulesFor(null);
    setActiveGame(gameId);
  };

  // Current active game meta
  const currentMeta = GAME_CATALOG.find(g => g.id === activeGame);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-150">
      {/* 1. Unified Arcade Navigation Header */}
      {activeGame !== 'main' ? (
        <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveGame('main')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              아케이드 홈
            </button>
            <div className="h-4 w-px bg-slate-200 dark:border-slate-800" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {currentMeta?.title}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${currentMeta?.badgeColor}`}>
                {currentMeta?.badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRulesFor(showRulesFor === activeGame ? null : activeGame)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              {showRulesFor === activeGame ? '규칙 닫기' : '이용 방법 & 규칙'}
            </button>
          </div>
        </div>
      ) : (
        /* Main Arcade Hub Header */
        <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Gamepad2 className="w-3.5 h-3.5" />
                STOCK INSIGHT ARCADE
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                직장인 힐링 미니게임 라운지
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                바쁜 증시 분석과 업무 속에서 잠시 쉬어가는 시간. 사다리 추첨, 점심 룰렛, 그리고 인생 역전 시뮬레이션까지 모든 플레이 기록은 안전하게 보관됩니다.
              </p>
            </div>

            {/* Quick Stats Pill Cards */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shrink-0">
              <div className="px-3 py-1">
                <span className="text-[10px] text-slate-400 block font-medium">사다리 추첨</span>
                <span className="text-base font-black text-rose-500">{stats.ladderCount}회</span>
              </div>
              <div className="px-3 py-1 border-x border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">점심 픽</span>
                <span className="text-base font-black text-amber-500">{stats.lunchCount}회</span>
              </div>
              <div className="px-3 py-1">
                <span className="text-[10px] text-slate-400 block font-medium">인생 엔딩</span>
                <span className="text-base font-black text-indigo-500">{stats.officeEndingCount}회</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Rules Accordion Modal / Banner */}
      {showRulesFor && (
        <div className="bg-indigo-50/80 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-5 text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {GAME_CATALOG.find(g => g.id === showRulesFor)?.title} 가이드 & 규칙
            </h3>
            <button onClick={() => setShowRulesFor(null)} className="text-slate-400 hover:text-slate-600">
              닫기
            </button>
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
            {GAME_CATALOG.find(g => g.id === showRulesFor)?.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Main Catalog Cards View */}
      {activeGame === 'main' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAME_CATALOG.map(game => (
              <div
                key={game.id}
                className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-slate-400/50 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-105 transition-transform">
                      {game.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${game.badgeColor}`}>
                      {game.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {game.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs leading-relaxed">
                    {game.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => handleSelectGame(game.id)}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    시작하기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Extensible Coming Soon Section (장기) */}
          <div className="bg-slate-50/60 dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Grid className="w-4 h-4" />
                확장 게임 라인업 (출시 준비 중)
              </span>
              <span className="text-[11px] text-slate-400">2인 보드게임 엔진 준비 중</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-70">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    전통 장기 (Janggi)
                  </div>
                  <p className="text-[11px] text-slate-400">두뇌 회전과 전술 수싸움의 진수</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                  오픈 예정
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Game Component Render (Explicit keys ensure complete unmount/remount isolation) */}
      {activeGame === 'ladder' && <LadderGame key="ladder" />}
      {activeGame === 'lunch' && <LunchSelector key="lunch" />}
      {activeGame === 'work' && <WorkLifeSimulation key="work" />}
      {activeGame === 'gomoku' && <GomokuGame key="gomoku" />}
      {activeGame === 'janggi' && <JanggiGame key="janggi" />}
      {activeGame === 'holdem' && <HoldemGame key="holdem" />}
    </div>
  );
};

export default MiniGames;
