import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { firebaseRepository } from '../../services/firebaseRepository';
import {
  CharacterBackground,
  Company,
  JobRole,
  JobLevel,
  JOB_LEVEL_LIST,
  JOB_LEVEL_SALARY_MULTIPLIER,
  PlayerStats,
  PlayerAssets,
  InvestmentStrategy,
  LifeEvent,
  TimelineEntry,
  Ending,
  COMPANY_POOL,
  JOB_ROLES,
  LIFE_EVENTS,
  generateRandomCharacter,
  assignInitialCompany,
  determineEnding,
} from './workLifeData';
import {
  Briefcase,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Users,
  Award,
  DollarSign,
  Home,
  RefreshCw,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  History,
  Play,
  RotateCcw,
  BadgeAlert,
  ArrowUpRight,
  Coins,
} from 'lucide-react';

type GameStep = 'LOBBY' | 'OFFER_REVEAL' | 'PLAYING' | 'ENDING';

interface ActiveGameState {
  character: CharacterBackground;
  company: Company;
  role: JobRole;
  level: JobLevel;
  currentSalary: number; // 만 원
  totalEarnings: number; // 누적 수입 (만 원)
  age: number;
  year: number; // 1년차, 2년차...
  stats: PlayerStats;
  assets: PlayerAssets;
  jobHopCount: number;
  timeline: TimelineEntry[];
  currentEvent: LifeEvent | null;
  lastEventResult: { text: string; success: boolean; changesText?: string } | null;
  annualSettlement: {
    salaryEarned: number;
    taxes: number;
    livingExpenses: number;
    investmentProfit: number;
    debtPaid: number;
    netSavings: number;
  } | null;
}

const LOCAL_STORAGE_KEY = 'stock_insight_worklife_active_game';

export const WorkLifeSimulation: React.FC = () => {
  const { user } = useApp();

  const [step, setStep] = useState<GameStep>('LOBBY');
  const [activeGame, setActiveGame] = useState<ActiveGameState | null>(null);
  const [candidateCharacter, setCandidateCharacter] = useState<CharacterBackground | null>(null);
  const [candidateOffer, setCandidateOffer] = useState<{ company: Company; role: JobRole } | null>(null);

  const [pastRecords, setPastRecords] = useState<any[]>([]);
  const [viewingPastRecords, setViewingPastRecords] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Modal / Tab States for actions in PLAYING step
  const [activeActionModal, setActiveActionModal] = useState<'INVEST' | 'HOUSING' | 'JOB_HOP' | 'REST' | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Unmount & timeout cleanup refs
  const isMountedRef = useRef<boolean>(true);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const showActionMessage = useCallback((msg: string, durationMs: number = 3000) => {
    if (!isMountedRef.current) return;
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setActionMessage(msg);
    messageTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) setActionMessage(null);
    }, durationMs);
  }, []);

  // Load existing game state and past records
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Load active game from Firestore if logged in, or localStorage
      let loadedActive: ActiveGameState | null = null;
      if (user?.id) {
        try {
          const remoteState = await firebaseRepository.getActiveOfficeGame(user.id);
          if (remoteState && remoteState.character && remoteState.company) {
            loadedActive = remoteState;
          }
          const records = await firebaseRepository.getOfficeGameRecords(user.id);
          if (isMountedRef.current) setPastRecords(records);
        } catch (err) {
          console.warn('[WorkLifeSimulation] Error loading remote game:', err);
        }
      }

      if (!loadedActive) {
        try {
          const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (cached) {
            loadedActive = JSON.parse(cached);
          }
        } catch (e) {
          console.warn('Local storage parse error:', e);
        }
      }

      if (isMountedRef.current && loadedActive) {
        setActiveGame(loadedActive);
      }
    };

    loadInitialData();
  }, [user?.id]);

  // Save active game to both localStorage and Firestore (debounced/on update)
  const persistActiveGame = useCallback(
    async (state: ActiveGameState | null) => {
      if (!state) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        if (user?.id) {
          await firebaseRepository.clearActiveOfficeGame(user.id).catch(() => {});
        }
        return;
      }

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }

      if (user?.id) {
        try {
          await firebaseRepository.saveActiveOfficeGame(user.id, state);
        } catch (e) {
          console.warn('Failed to save active game to Firebase:', e);
        }
      }
    },
    [user?.id]
  );

  // 1. Start New Game - Generate Random Character & Offer
  const handleInitiateNewGame = () => {
    const char = generateRandomCharacter();
    const offer = assignInitialCompany(char.education);

    setCandidateCharacter(char);
    setCandidateOffer(offer);
    setStep('OFFER_REVEAL');
  };

  // 2. Accept Offer & Begin Career (Year 1)
  const handleAcceptOffer = () => {
    if (!candidateCharacter || !candidateOffer) return;

    const { company, role } = candidateOffer;
    const initialSalary = Math.round(company.baseSalary * JOB_LEVEL_SALARY_MULTIPLIER['신입']);

    const initialStats: PlayerStats = {
      skill: 45 + (role.bonusSkill === 'skill' ? 15 : 0),
      reputation: 50 + (role.bonusSkill === 'reputation' ? 15 : 0),
      health: 85,
      stress: 20 + company.stressLevel * 4,
      bossTrust: 50 + (role.bonusSkill === 'bossTrust' ? 15 : 0),
      colleagueRelation: 50 + (role.bonusSkill === 'colleagueRelation' ? 15 : 0),
    };

    const initialAssets: PlayerAssets = {
      cash: candidateCharacter.initialCash,
      investments: 0,
      realEstate: 0,
      debt: candidateCharacter.initialDebt,
      housingTier: '월세 원룸',
      investmentStrategy: 'stock_portfolio',
    };

    const initialTimeline: TimelineEntry[] = [
      {
        year: 1,
        age: candidateCharacter.age,
        level: '신입',
        companyName: company.name,
        title: `${company.name} 입사`,
        description: `${candidateCharacter.education} / ${candidateCharacter.major} 졸업 후 ${company.name} ${role.name}(신입)으로 입사! (초봉 ${initialSalary.toLocaleString()}만 원)`,
        badge: '랜덤 입사',
        netWorth: initialAssets.cash - initialAssets.debt,
      },
    ];

    // Pick first event
    const firstEvent = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)];

    const newGame: ActiveGameState = {
      character: candidateCharacter,
      company,
      role,
      level: '신입',
      currentSalary: initialSalary,
      totalEarnings: initialSalary,
      age: candidateCharacter.age,
      year: 1,
      stats: initialStats,
      assets: initialAssets,
      jobHopCount: 0,
      timeline: initialTimeline,
      currentEvent: firstEvent,
      lastEventResult: null,
      annualSettlement: null,
    };

    setActiveGame(newGame);
    persistActiveGame(newGame);
    setStep('PLAYING');
  };

  // 3. Make Event Choice
  const handleSelectEventOption = (optionIndex: number) => {
    if (!activeGame || !activeGame.currentEvent || isProcessing) return;
    setIsProcessing(true);

    const event = activeGame.currentEvent;
    const option = event.options[optionIndex];
    if (!option) {
      setIsProcessing(false);
      return;
    }

    const isSuccess = Math.random() < (option.probabilitySuccess ?? 1);
    const appliedEffect = isSuccess ? option.effect : option.failEffect || option.effect;
    const resultText = isSuccess ? option.successResultText : option.failResultText || option.successResultText;

    // Apply stat changes
    const updatedStats: PlayerStats = {
      skill: Math.max(0, Math.min(100, activeGame.stats.skill + (appliedEffect.statChanges?.skill ?? 0))),
      reputation: Math.max(0, Math.min(100, activeGame.stats.reputation + (appliedEffect.statChanges?.reputation ?? 0))),
      health: Math.max(0, Math.min(100, activeGame.stats.health + (appliedEffect.statChanges?.health ?? 0))),
      stress: Math.max(0, Math.min(100, activeGame.stats.stress + (appliedEffect.statChanges?.stress ?? 0))),
      bossTrust: Math.max(0, Math.min(100, activeGame.stats.bossTrust + (appliedEffect.statChanges?.bossTrust ?? 0))),
      colleagueRelation: Math.max(
        0,
        Math.min(100, activeGame.stats.colleagueRelation + (appliedEffect.statChanges?.colleagueRelation ?? 0))
      ),
    };

    // Apply asset / cash changes
    const updatedAssets: PlayerAssets = {
      ...activeGame.assets,
      cash: Math.max(0, activeGame.assets.cash + (appliedEffect.cashChange ?? 0)),
      investments: Math.max(0, activeGame.assets.investments + (appliedEffect.investmentsChange ?? 0)),
      debt: Math.max(0, activeGame.assets.debt + (appliedEffect.debtChange ?? 0)),
    };

    const updatedSalary = Math.max(2400, activeGame.currentSalary + (appliedEffect.salaryChange ?? 0));

    // Changes summary text
    const diffs: string[] = [];
    if (appliedEffect.cashChange) diffs.push(`현금 ${appliedEffect.cashChange > 0 ? '+' : ''}${appliedEffect.cashChange}만`);
    if (appliedEffect.salaryChange) diffs.push(`연봉 ${appliedEffect.salaryChange > 0 ? '+' : ''}${appliedEffect.salaryChange}만`);
    if (appliedEffect.statChanges?.stress) diffs.push(`스트레스 ${appliedEffect.statChanges.stress > 0 ? '+' : ''}${appliedEffect.statChanges.stress}%`);
    if (appliedEffect.statChanges?.health) diffs.push(`건강 ${appliedEffect.statChanges.health > 0 ? '+' : ''}${appliedEffect.statChanges.health}%`);
    if (appliedEffect.statChanges?.reputation) diffs.push(`평판 ${appliedEffect.statChanges.reputation > 0 ? '+' : ''}${appliedEffect.statChanges.reputation}%`);

    const updatedTimeline = [
      ...activeGame.timeline,
      {
        year: activeGame.year,
        age: activeGame.age,
        level: activeGame.level,
        companyName: activeGame.company.name,
        title: event.title,
        description: `${option.text} 선택 → ${resultText}`,
        netWorth: updatedAssets.cash + updatedAssets.investments + updatedAssets.realEstate - updatedAssets.debt,
      },
    ];

    const nextState: ActiveGameState = {
      ...activeGame,
      stats: updatedStats,
      assets: updatedAssets,
      currentSalary: updatedSalary,
      currentEvent: null, // Event resolved
      lastEventResult: {
        text: resultText,
        success: isSuccess,
        changesText: diffs.join(' | '),
      },
      timeline: updatedTimeline,
    };

    // Check ending condition immediately
    const immediateEnding = checkGameOverCondition(nextState);
    if (immediateEnding) {
      handleTriggerEnding(nextState, immediateEnding);
      setIsProcessing(false);
      return;
    }

    setActiveGame(nextState);
    persistActiveGame(nextState);
    setIsProcessing(false);
  };

  // 4. Advance to Next Year & Financial Settlement
  const handleAdvanceYear = () => {
    if (!activeGame || isProcessing) return;
    
    // 멱등성 확보: 연도 체크
    // 마지막 처리된 연도가 현재 연도와 같으면 이미 처리된 것으로 간주
    const lastProcessedYear = activeGame.timeline[activeGame.timeline.length - 1]?.year || 0;
    if (lastProcessedYear >= activeGame.year) {
      return; 
    }
    
    setIsProcessing(true);

    const nextAge = activeGame.age + 1;
    const nextYear = activeGame.year + 1;

    // --- Financial Calculations ---
    // 1. Salary & Taxes
    const grossSalary = activeGame.currentSalary;
    const taxes = Math.round(grossSalary * 0.15); // 약 15% 세금/4대보험
    const netSalary = grossSalary - taxes;

    // 2. Living Expenses based on housing tier & age
    let livingCost = 1600; // 기본 식비/교통/생활비 1,600만
    if (activeGame.assets.housingTier === '월세 원룸') livingCost += 800; // 월세 800만
    else if (activeGame.assets.housingTier === '전세 오피스텔') livingCost += 300; // 관리비 등 300만
    else livingCost += 500; // 아파트 재산세/관리비 500만

    // 3. Debt Interest / Repayment
    let debtPayment = 0;
    let newDebt = activeGame.assets.debt;
    if (newDebt > 0) {
      const interest = Math.round(newDebt * 0.05); // 5% 이자
      const principalPay = Math.min(newDebt, 1000); // 1,000만 원 원금 상환 시도
      debtPayment = interest + principalPay;
      newDebt -= principalPay;
    }

    // 4. Investment Returns based on Strategy
    let investmentProfit = 0;
    let newInvestments = activeGame.assets.investments;
    if (newInvestments > 0) {
      let returnRate = 0.03; // safe
      if (activeGame.assets.investmentStrategy === 'stock_portfolio') {
        // Random return between -15% to +30%
        returnRate = (Math.floor(Math.random() * 46) - 15) / 100;
      } else if (activeGame.assets.investmentStrategy === 'crypto_growth') {
        // Random return between -35% to +60%
        returnRate = (Math.floor(Math.random() * 96) - 35) / 100;
      } else if (activeGame.assets.investmentStrategy === 'real_estate_focus') {
        // Steady 5% to 15%
        returnRate = (Math.floor(Math.random() * 11) + 5) / 100;
      }
      investmentProfit = Math.round(newInvestments * returnRate);
      newInvestments = Math.max(0, newInvestments + investmentProfit);
    }

    // 5. Net Cash flow to savings
    const netSavings = netSalary - livingCost - debtPayment;
    let newCash = Math.max(0, activeGame.assets.cash + netSavings);

    // If negative cash, debt increases
    if (activeGame.assets.cash + netSavings < 0) {
      newDebt += Math.abs(activeGame.assets.cash + netSavings);
      newCash = 0;
    }

    // Auto-allocate 30% of remaining cash to investments if cash > 2,000만
    if (newCash > 2000) {
      const autoInvest = Math.round((newCash - 1500) * 0.4);
      newInvestments += autoInvest;
      newCash -= autoInvest;
    }

    const updatedAssets: PlayerAssets = {
      ...activeGame.assets,
      cash: newCash,
      investments: newInvestments,
      debt: newDebt,
    };

    // --- Career & Promotion Assessment ---
    let newLevel = activeGame.level;
    let salaryIncrease = Math.round(activeGame.currentSalary * 0.05); // 기본 호봉 5% 상승
    let promotionOccurred = false;

    const currentLevelIndex = JOB_LEVEL_LIST.indexOf(activeGame.level);
    const isEligibleForPromotion =
      currentLevelIndex < JOB_LEVEL_LIST.length - 1 &&
      activeGame.stats.skill >= 60 + currentLevelIndex * 5 &&
      activeGame.stats.bossTrust >= 60 &&
      activeGame.stats.reputation >= 60;

    if (isEligibleForPromotion && Math.random() < 0.65) {
      newLevel = JOB_LEVEL_LIST[currentLevelIndex + 1];
      promotionOccurred = true;
      salaryIncrease += 800 + currentLevelIndex * 300;
    }

    const updatedSalary = activeGame.currentSalary + salaryIncrease;

    // Pick next event
    const nextEvent = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)];

    const updatedTimeline: TimelineEntry[] = [
      ...activeGame.timeline,
      {
        year: nextYear,
        age: nextAge,
        level: newLevel,
        companyName: activeGame.company.name,
        title: promotionOccurred ? `🎉 ${newLevel} 승진!` : `${nextYear}년차 연말 결산`,
        description: promotionOccurred
          ? `${activeGame.company.name}에서 ${newLevel}으로 승진! 연봉이 ${updatedSalary.toLocaleString()}만 원으로 인상되었습니다.`
          : `1년 근속 완료. (연간 소득: +${grossSalary.toLocaleString()}만 / 지출: -${livingCost.toLocaleString()}만 / 투자손익: ${investmentProfit >= 0 ? '+' : ''}${investmentProfit.toLocaleString()}만)`,
        badge: promotionOccurred ? '승진' : undefined,
        netWorth: updatedAssets.cash + updatedAssets.investments + updatedAssets.realEstate - updatedAssets.debt,
      },
    ];

    const nextState: ActiveGameState = {
      ...activeGame,
      age: nextAge,
      year: nextYear,
      level: newLevel,
      currentSalary: updatedSalary,
      totalEarnings: activeGame.totalEarnings + grossSalary,
      assets: updatedAssets,
      timeline: updatedTimeline,
      currentEvent: nextEvent,
      lastEventResult: null,
      annualSettlement: {
        salaryEarned: grossSalary,
        taxes,
        livingExpenses: livingCost,
        investmentProfit,
        debtPaid: debtPayment,
        netSavings,
      },
    };

    // Check ending after advance
    const ending = checkGameOverCondition(nextState);
    if (ending) {
      handleTriggerEnding(nextState, ending);
      setIsProcessing(false);
      return;
    }

    setActiveGame(nextState);
    persistActiveGame(nextState);
    setIsProcessing(false);
  };

  // 5. Actions: Change Investment Strategy
  const handleUpdateInvestmentStrategy = (strategy: InvestmentStrategy) => {
    if (!activeGame) return;
    const updated = {
      ...activeGame,
      assets: {
        ...activeGame.assets,
        investmentStrategy: strategy,
      },
    };
    setActiveGame(updated);
    persistActiveGame(updated);
    setActiveActionModal(null);
    showActionMessage('투자 전략이 성공적으로 변경되었습니다.');
  };

  // 6. Actions: Upgrade Housing
  const handleUpgradeHousing = (tier: '전세 오피스텔' | '수도권 아파트' | '상급지 아파트') => {
    if (!activeGame) return;

    let requiredCash = 0;
    let addedDebt = 0;
    let addedRealEstate = 0;

    if (tier === '전세 오피스텔') {
      requiredCash = 8000;
      if (activeGame.assets.cash < requiredCash) {
        alert(`보증금 8,000만 원이 필요합니다. (현재 현금: ${activeGame.assets.cash.toLocaleString()}만)`);
        return;
      }
    } else if (tier === '수도권 아파트') {
      requiredCash = 20000;
      addedDebt = 35000;
      addedRealEstate = 55000;
      if (activeGame.assets.cash < requiredCash) {
        alert(`자기자본 2억 원이 필요합니다. (현재 현금: ${activeGame.assets.cash.toLocaleString()}만)`);
        return;
      }
    } else if (tier === '상급지 아파트') {
      requiredCash = 50000;
      addedDebt = 70000;
      addedRealEstate = 120000;
      if (activeGame.assets.cash < requiredCash) {
        alert(`자기자본 5억 원이 필요합니다. (현재 현금: ${activeGame.assets.cash.toLocaleString()}만)`);
        return;
      }
    }

    const updatedAssets: PlayerAssets = {
      ...activeGame.assets,
      cash: activeGame.assets.cash - requiredCash,
      debt: activeGame.assets.debt + addedDebt,
      realEstate: activeGame.assets.realEstate + addedRealEstate,
      housingTier: tier,
    };

    const updatedTimeline: TimelineEntry[] = [
      ...activeGame.timeline,
      {
        year: activeGame.year,
        age: activeGame.age,
        level: activeGame.level,
        companyName: activeGame.company.name,
        title: `🏠 ${tier} 입주 성공!`,
        description: `내 집 마련 테크트리 달성! 주거 환경이 ${tier}(으)로 업그레이드되었습니다.`,
        badge: '주거 업그레이드',
        netWorth: updatedAssets.cash + updatedAssets.investments + updatedAssets.realEstate - updatedAssets.debt,
      },
    ];

    const nextState: ActiveGameState = {
      ...activeGame,
      assets: updatedAssets,
      timeline: updatedTimeline,
      stats: {
        ...activeGame.stats,
        reputation: Math.min(100, activeGame.stats.reputation + 15),
        stress: Math.max(0, activeGame.stats.stress - 15),
      },
    };

    setActiveGame(nextState);
    persistActiveGame(nextState);
    setActiveActionModal(null);
    showActionMessage(`축하합니다! ${tier}(으)로 이사했습니다.`);
  };

  // 7. Actions: Attempt Career Job Hop (이직 도전)
  const handleAttemptJobHop = () => {
    if (!activeGame || isProcessing) return;
    setIsProcessing(true);

    // Pick another company
    const otherCompanies = COMPANY_POOL.filter(c => c.name !== activeGame.company.name);
    const targetCompany = otherCompanies[Math.floor(Math.random() * otherCompanies.length)];

    const successChance = (activeGame.stats.skill * 0.5 + activeGame.stats.reputation * 0.5) / 100;
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
      const salaryBump = Math.round(activeGame.currentSalary * 0.2); // +20%
      const newSalary = activeGame.currentSalary + salaryBump;

      const updatedTimeline: TimelineEntry[] = [
        ...activeGame.timeline,
        {
          year: activeGame.year,
          age: activeGame.age,
          level: activeGame.level,
          companyName: targetCompany.name,
          title: `🚀 ${targetCompany.name} 경력 이직 성공`,
          description: `${activeGame.company.name}에서 ${targetCompany.name}(으)로 이직! 연봉이 ${salaryBump.toLocaleString()}만 원 인상되었습니다.`,
          badge: '경력 이직',
          netWorth: activeGame.assets.cash + activeGame.assets.investments + activeGame.assets.realEstate - activeGame.assets.debt,
        },
      ];

      const nextState: ActiveGameState = {
        ...activeGame,
        company: targetCompany,
        currentSalary: newSalary,
        jobHopCount: activeGame.jobHopCount + 1,
        stats: {
          ...activeGame.stats,
          stress: Math.max(0, activeGame.stats.stress - 10),
          reputation: Math.min(100, activeGame.stats.reputation + 10),
          bossTrust: 50, // Reset boss trust in new company
        },
        timeline: updatedTimeline,
      };

      setActiveGame(nextState);
      persistActiveGame(nextState);
      setActiveActionModal(null);
      showActionMessage(`이직 성공! ${targetCompany.name}에 합류했습니다. (연봉 +${salaryBump.toLocaleString()}만)`);
    } else {
      const nextState: ActiveGameState = {
        ...activeGame,
        stats: {
          ...activeGame.stats,
          stress: Math.min(100, activeGame.stats.stress + 10),
          bossTrust: Math.max(0, activeGame.stats.bossTrust - 10),
        },
      };
      setActiveGame(nextState);
      persistActiveGame(nextState);
      setActiveActionModal(null);
      showActionMessage('이직 면접에서 탈락했습니다. 회사에 소문이 살짝 돌아 스트레스가 올랐습니다.', 3500);
    }

    if (isMountedRef.current) setIsProcessing(false);
  };

  // 8. Actions: Rest & Health Recovery (휴식과 재충전)
  const handleTakeRest = () => {
    if (!activeGame) return;
    if (activeGame.assets.cash < 150) {
      alert('휴식 및 요가/마사지 비용 150만 원이 부족합니다.');
      return;
    }

    const nextState: ActiveGameState = {
      ...activeGame,
      assets: {
        ...activeGame.assets,
        cash: activeGame.assets.cash - 150,
      },
      stats: {
        ...activeGame.stats,
        health: Math.min(100, activeGame.stats.health + 20),
        stress: Math.max(0, activeGame.stats.stress - 25),
      },
    };

    setActiveGame(nextState);
    persistActiveGame(nextState);
    setActiveActionModal(null);
    showActionMessage('주말 힐링 스파와 여행으로 스트레스를 풀고 건강을 회복했습니다! (-150만)');
  };

  // Helper: Check Ending
  const checkGameOverCondition = (state: ActiveGameState): Ending | null => {
    const netWorth = state.assets.cash + state.assets.investments + state.assets.realEstate - state.assets.debt;

    if (state.stats.stress >= 100) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
    if (state.stats.health <= 10) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
    if (netWorth < -15000) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
    if (state.age >= 60) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);
    if (state.age <= 48 && netWorth >= 200000) return determineEnding(state.stats, state.assets, state.level, state.age, state.company, state.jobHopCount);

    return null;
  };

  // 9. Trigger Ending Screen and Archive to Firestore
  const handleTriggerEnding = async (finalState: ActiveGameState, ending: Ending) => {
    setStep('ENDING');

    const netWorth = finalState.assets.cash + finalState.assets.investments + finalState.assets.realEstate - finalState.assets.debt;

    const archiveRecord = {
      characterName: finalState.character.name,
      education: finalState.character.education,
      finalAge: finalState.age,
      yearsPlayed: finalState.year,
      finalCompany: finalState.company.name,
      finalRole: finalState.role.name,
      finalLevel: finalState.level,
      finalSalary: finalState.currentSalary,
      finalNetWorth: netWorth,
      totalEarnings: finalState.totalEarnings,
      endingTitle: ending.title,
      endingSubtitle: ending.subtitle,
      endingCategory: ending.category,
      timeline: finalState.timeline,
      timestamp: new Date().toISOString(),
    };

    // Save to Firestore permanent history and clear active game
    if (user?.id) {
      await firebaseRepository.saveOfficeGameRecord(user.id, archiveRecord).catch(console.warn);
      await firebaseRepository.clearActiveOfficeGame(user.id).catch(console.warn);
      const updatedList = await firebaseRepository.getOfficeGameRecords(user.id).catch(() => []);
      setPastRecords(updatedList);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // Reset to Lobby
  const handleBackToLobby = () => {
    setStep('LOBBY');
  };

  // Copy share result card
  const handleShareResult = () => {
    if (!activeGame) return;
    const netWorth = activeGame.assets.cash + activeGame.assets.investments + activeGame.assets.realEstate - activeGame.assets.debt;
    const ending = determineEnding(
      activeGame.stats,
      activeGame.assets,
      activeGame.level,
      activeGame.age,
      activeGame.company,
      activeGame.jobHopCount
    );

    const shareText = `[병돌 인베스트먼트 직장인 인생 시뮬레이션]\n\n🏆 결과: ${ending.title}\n👤 캐릭터: ${activeGame.character.name} (${activeGame.character.education})\n💼 마지막 직장: ${activeGame.company.name} (${activeGame.level})\n🎂 최종 나이: ${activeGame.age}세 (${activeGame.year}년차)\n💰 최종 순자산: ${(netWorth / 10000).toFixed(2)}억 원\n💵 최종 연봉: ${activeGame.currentSalary.toLocaleString()}만 원\n\n지금 바로 플레이해보세요!`;

    navigator.clipboard.writeText(shareText);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopyFeedback(true);
    copyTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) setCopyFeedback(false);
    }, 2500);
  };

  // Net worth calculation
  const currentNetWorth = useMemo(() => {
    if (!activeGame) return 0;
    return activeGame.assets.cash + activeGame.assets.investments + activeGame.assets.realEstate - activeGame.assets.debt;
  }, [activeGame]);

  // ================= RENDER STEPS =================

  // STEP 1: LOBBY
  if (step === 'LOBBY') {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                장기 커리어 & 자산 시뮬레이터
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                랜덤입사 인생 시뮬레이션
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                첫 직장 무작위 배정부터 연도별 커리어, 자산 투자, 부동산, 이직, 그리고 은퇴까지.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewingPastRecords(!viewingPastRecords)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                {viewingPastRecords ? '게임으로' : `명예의 전당 (${pastRecords.length})`}
              </button>
            </div>
          </div>

          {viewingPastRecords ? (
            <div className="mt-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                완료된 인생 기록 보관소
              </h2>
              {pastRecords.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  아직 완료된 인생 시뮬레이션 기록이 없습니다. 새로운 인생을 시작해보세요!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastRecords.map((rec, idx) => {
                    const data = rec.resultData || rec;
                    return (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {data.endingTitle || '인생 마감'}
                          </span>
                          <span className="text-slate-400">
                            {data.timestamp ? new Date(data.timestamp).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {data.characterName} ({data.education}) | {data.finalCompany} ({data.finalLevel})
                        </div>
                        <div className="flex items-center gap-3 pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          <span>최종 나이: {data.finalAge}세</span>
                          <span>순자산: {((data.finalNetWorth || 0) / 10000).toFixed(1)}억 원</span>
                          <span>최종 연봉: {(data.finalSalary || 0).toLocaleString()}만</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Game Card (if available) */}
              {activeGame && (
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/40 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500 text-white">
                        진행 중인 인생
                      </span>
                      <span className="text-xs text-slate-400">
                        {activeGame.year}년차 ({activeGame.age}세)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                      {activeGame.character.name} ({activeGame.company.name})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activeGame.role.name} / 직급: {activeGame.level} | 연봉: {activeGame.currentSalary.toLocaleString()}만 원
                    </p>
                    <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
                      <span className="text-slate-500">순자산</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {(currentNetWorth / 10000).toFixed(2)}억 원 ({currentNetWorth.toLocaleString()}만 원)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('PLAYING')}
                    className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    이어서 진행하기
                  </button>
                </div>
              )}

              {/* New Game Card */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">새로운 인생 시작하기</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    랜덤으로 캐릭터 스펙(이름, 학력, 전공, 초기 자산/부채)이 주어지고, 대기업/스타트업/공기업/중견기업 중 한 곳에 첫 입사합니다.
                  </p>
                </div>

                <button
                  onClick={handleInitiateNewGame}
                  className="mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  새 인생 시작 (랜덤 주사위 굴리기)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 2: OFFER REVEAL (합격 통지서 화면)
  if (step === 'OFFER_REVEAL' && candidateCharacter && candidateOffer) {
    const { company, role } = candidateOffer;
    const startSalary = Math.round(company.baseSalary * JOB_LEVEL_SALARY_MULTIPLIER['신입']);

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-[#131722] border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Watermark style badge */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 opacity-15 pointer-events-none">
            <Building2 className="w-32 h-32 text-indigo-500" />
          </div>

          <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Award className="w-3.5 h-3.5" />
              최종 합격 통지서 (OFFER LETTER)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              축하합니다! 합격을 알립니다
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              치열한 채용 전형을 거쳐 귀하를 신입사원으로 정식 채용합니다.
            </p>
          </div>

          {/* Character Profile */}
          <div className="mt-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">지원자 프로필</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">이름 (수정 가능)</span>
                <input
                  type="text"
                  value={candidateCharacter.name}
                  onChange={e => setCandidateCharacter({ ...candidateCharacter, name: e.target.value })}
                  className="font-bold text-slate-900 dark:text-white text-sm bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500 w-24"
                />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">나이</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidateCharacter.age}세</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">최종 학력</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidateCharacter.education}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">전공</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidateCharacter.major}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">초기 보유 자산</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                현금 {candidateCharacter.initialCash}만 원 / 학자금 부채 {candidateCharacter.initialDebt}만 원
              </span>
            </div>
          </div>

          {/* Company & Offer Details */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${company.badgeColor}`}>
                  {company.tier} · {company.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{company.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">계약 초봉</span>
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {startSalary.toLocaleString()}만 원
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
              {company.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">배정 직무</span>
                <span className="font-bold text-slate-900 dark:text-white">{role.name}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">고용 안정성</span>
                <span className="font-bold text-emerald-500">{'★'.repeat(company.stability)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">사내 복지</span>
                <span className="font-bold text-amber-500">{'★'.repeat(company.welfare)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block">야근/스트레스</span>
                <span className="font-bold text-rose-500">{'★'.repeat(company.stressLevel)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleInitiateNewGame}
              className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다른 조건으로 다시 뽑기
            </button>
            <button
              onClick={handleAcceptOffer}
              className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              입사 승락하고 첫 출근하기!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: MAIN GAMEPLAY LOOP (PLAYING)
  if (step === 'PLAYING' && activeGame) {
    return (
      <div className="space-y-6">
        {/* Toast / Notification Banner */}
        {actionMessage && (
          <div className="p-4 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg animate-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* 1. Header Profile & Career Card */}
        <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xl shrink-0">
                {activeGame.character.name.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {activeGame.character.name}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {activeGame.age}세 ({activeGame.year}년차)
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${activeGame.company.badgeColor}`}>
                    {activeGame.company.name} · {activeGame.company.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  직무: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeGame.role.name}</span> | 직급:{' '}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeGame.level}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">계약 연봉</span>
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  {activeGame.currentSalary.toLocaleString()}만
                </span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[11px]">월 예상 수령</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  약 {Math.round((activeGame.currentSalary * 0.85) / 12).toLocaleString()}만
                </span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[11px]">누적 총수입</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {activeGame.totalEarnings.toLocaleString()}만
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar (6 Metrics) */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Skill */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Target className="w-3.5 h-3.5 text-blue-500" /> 업무역량
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{activeGame.stats.skill}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${activeGame.stats.skill}%` }} />
              </div>
            </div>

            {/* Reputation */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> 사내평판
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{activeGame.stats.reputation}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${activeGame.stats.reputation}%` }} />
              </div>
            </div>

            {/* Health */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> 건강
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{activeGame.stats.health}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    activeGame.stats.health < 30 ? 'bg-rose-600 animate-pulse' : 'bg-rose-500'
                  }`}
                  style={{ width: `${activeGame.stats.health}%` }}
                />
              </div>
            </div>

            {/* Stress */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Zap className="w-3.5 h-3.5 text-orange-500" /> 스트레스
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{activeGame.stats.stress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    activeGame.stats.stress > 70 ? 'bg-orange-600 animate-pulse' : 'bg-orange-500'
                  }`}
                  style={{ width: `${activeGame.stats.stress}%` }}
                />
              </div>
            </div>

            {/* Boss Trust */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" /> 상사신뢰
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{activeGame.stats.bossTrust}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${activeGame.stats.bossTrust}%` }} />
              </div>
            </div>

            {/* Colleague Relation */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-emerald-500" /> 동료관계
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{activeGame.stats.colleagueRelation}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${activeGame.stats.colleagueRelation}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Financial Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-medium block">순자산 (Net Worth)</span>
            <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {(currentNetWorth / 10000).toFixed(2)}억
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {currentNetWorth.toLocaleString()}만 원
            </span>
          </div>

          <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" /> 보유 현금
            </span>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {activeGame.assets.cash.toLocaleString()}만
            </div>
          </div>

          <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> 투자 자산
            </span>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {activeGame.assets.investments.toLocaleString()}만
            </div>
          </div>

          <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-emerald-500" /> 부동산/주거
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
              {activeGame.assets.housingTier}
            </div>
            <span className="text-[10px] text-slate-400">
              {activeGame.assets.realEstate > 0 ? `${(activeGame.assets.realEstate / 10000).toFixed(1)}억` : '자가 없음'}
            </span>
          </div>

          <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <BadgeAlert className="w-3.5 h-3.5 text-rose-500" /> 총 부채
            </span>
            <div className="text-base font-bold text-rose-500 mt-1">
              {activeGame.assets.debt.toLocaleString()}만
            </div>
          </div>
        </div>

        {/* 3. Action Command Bar (Career & Investment Decisions) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveActionModal('INVEST')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            투자 전략 ({activeGame.assets.investmentStrategy === 'safe_savings' ? '안전예금' : activeGame.assets.investmentStrategy === 'stock_portfolio' ? '우량주' : activeGame.assets.investmentStrategy === 'crypto_growth' ? '하이리스크코인' : '부동산집중'})
          </button>

          <button
            onClick={() => setActiveActionModal('HOUSING')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5 text-emerald-500" />
            주거 업그레이드
          </button>

          <button
            onClick={() => setActiveActionModal('JOB_HOP')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            이직 시장 탐색
          </button>

          <button
            onClick={() => setActiveActionModal('REST')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            휴식 & 재충전 (-150만)
          </button>
        </div>

        {/* Modals for Strategic Actions */}
        {activeActionModal === 'INVEST' && (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                가상 투자 전략 설정
              </h3>
              <button onClick={() => setActiveActionModal(null)} className="text-xs text-slate-400 hover:text-slate-600">닫기</button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              매년 결산 시 투자 자산에 적용될 포트폴리오를 선택하세요.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleUpdateInvestmentStrategy('safe_savings')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  activeGame.assets.investmentStrategy === 'safe_savings'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white">안전 예적금 올인</div>
                <div className="text-[11px] text-slate-500 mt-1">원금 보장, 연 3% 안정적인 확정 금리. 원금 손실 0%.</div>
              </button>

              <button
                onClick={() => handleUpdateInvestmentStrategy('stock_portfolio')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  activeGame.assets.investmentStrategy === 'stock_portfolio'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white">국내외 우량주 분산투자 (추천)</div>
                <div className="text-[11px] text-slate-500 mt-1">연간 수익률 -15% ~ +30%. 적절한 리스크와 복리 성장.</div>
              </button>

              <button
                onClick={() => handleUpdateInvestmentStrategy('crypto_growth')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  activeGame.assets.investmentStrategy === 'crypto_growth'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white">하이리스크 코인 & 성장주</div>
                <div className="text-[11px] text-slate-500 mt-1">연간 수익률 -35% ~ +60%. 대박 아니면 쪽박의 롤러코스터.</div>
              </button>

              <button
                onClick={() => handleUpdateInvestmentStrategy('real_estate_focus')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  activeGame.assets.investmentStrategy === 'real_estate_focus'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white">부동산 펀드 및 리츠</div>
                <div className="text-[11px] text-slate-500 mt-1">연간 5% ~ 15% 꾸준한 배당과 완만한 시세 차익.</div>
              </button>
            </div>
          </div>
        )}

        {activeActionModal === 'HOUSING' && (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Home className="w-4 h-4 text-emerald-500" />
                주거 업그레이드 (내 집 마련)
              </h3>
              <button onClick={() => setActiveActionModal(null)} className="text-xs text-slate-400 hover:text-slate-600">닫기</button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              현재 주거: <span className="font-bold text-slate-900 dark:text-white">{activeGame.assets.housingTier}</span> | 보유 현금:{' '}
              <span className="font-bold text-indigo-600">{activeGame.assets.cash.toLocaleString()}만 원</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleUpgradeHousing('전세 오피스텔')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left text-xs space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white">전세 오피스텔 이사</div>
                <div className="text-emerald-500 font-semibold">필요 현금: 8,000만 원</div>
                <div className="text-slate-400 text-[11px]">월세 지출을 대폭 줄이고 쾌적한 1인 주거 환경.</div>
              </button>

              <button
                onClick={() => handleUpgradeHousing('수도권 아파트')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left text-xs space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white">수도권 25평 신축 아파트</div>
                <div className="text-emerald-500 font-semibold">자기자본 2억 / 대출 3.5억</div>
                <div className="text-slate-400 text-[11px]">자가 보유 뱃지 획득! 평판 +15, 스트레스 -15.</div>
              </button>

              <button
                onClick={() => handleUpgradeHousing('상급지 아파트')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left text-xs space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white">강남/마용성 랜드마크 아파트</div>
                <div className="text-emerald-500 font-semibold">자기자본 5억 / 대출 7억</div>
                <div className="text-slate-400 text-[11px]">대한민국 최고 부촌 입성. 엄청난 자산 가치 상승.</div>
              </button>
            </div>
          </div>
        )}

        {activeActionModal === 'JOB_HOP' && (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                경력직 이직 시장 도전
              </h3>
              <button onClick={() => setActiveActionModal(null)} className="text-xs text-slate-400 hover:text-slate-600">닫기</button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              현재 스펙(업무역량 {activeGame.stats.skill}%, 평판 {activeGame.stats.reputation}%)을 기반으로 다른 회사로의 경력 이직을 시도합니다.
              성공 시 연봉이 20% 인상되며 새로운 커리어가 열립니다.
            </p>
            <div className="pt-2 flex gap-3">
              <button
                onClick={handleAttemptJobHop}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
                이직 면접 응시하기
              </button>
            </div>
          </div>
        )}

        {/* 4. Main Event Card & Selection Area */}
        <div className="bg-white dark:bg-[#131722] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          {activeGame.currentEvent ? (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                  {activeGame.year}년차 ({activeGame.age}세) 주요 사건
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeGame.company.name} 사내 뉴스
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {activeGame.currentEvent.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {activeGame.currentEvent.situation}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {activeGame.currentEvent.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={isProcessing}
                    onClick={() => handleSelectEventOption(idx)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 hover:border-indigo-500/50 transition-all group flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {opt.text}
                      </div>
                      {opt.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {opt.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* When current event is resolved: Show result feedback and "Advance Year" button */
            <div className="space-y-6 text-center py-4">
              {activeGame.lastEventResult && (
                <div
                  className={`p-6 rounded-2xl border text-left space-y-2 ${
                    activeGame.lastEventResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {activeGame.lastEventResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                    )}
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      선택 결과: {activeGame.lastEventResult.success ? '성공' : '예기치 못한 결과'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    {activeGame.lastEventResult.text}
                  </p>
                  {activeGame.lastEventResult.changesText && (
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                      변동: {activeGame.lastEventResult.changesText}
                    </div>
                  )}
                </div>
              )}

              {/* Annual Settlement Summary (if just completed) */}
              {activeGame.annualSettlement && (
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left text-xs space-y-2">
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    연간 경제 결산 보고서
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">연봉 수령</span>
                      <span className="font-bold text-emerald-500">+{activeGame.annualSettlement.salaryEarned.toLocaleString()}만</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">생활비 & 세금</span>
                      <span className="font-bold text-rose-500">
                        -{(activeGame.annualSettlement.livingExpenses + activeGame.annualSettlement.taxes).toLocaleString()}만
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">투자 손익</span>
                      <span className={`font-bold ${activeGame.annualSettlement.investmentProfit >= 0 ? 'text-blue-500' : 'text-rose-500'}`}>
                        {activeGame.annualSettlement.investmentProfit >= 0 ? '+' : ''}
                        {activeGame.annualSettlement.investmentProfit.toLocaleString()}만
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">순 저축/잉여금</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {activeGame.annualSettlement.netSavings >= 0 ? '+' : ''}
                        {activeGame.annualSettlement.netSavings.toLocaleString()}만
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleAdvanceYear}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-lg shadow-indigo-600/20 inline-flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  다음 해로 넘어가기 ({activeGame.age + 1}세, {activeGame.year + 1}년차)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Life Timeline History (Accordion / Timeline) */}
        <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              인생 연표 (타임라인)
            </h3>
            <span className="text-xs text-slate-400">{activeGame.timeline.length}개의 주요 기록</span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {activeGame.timeline
              .slice()
              .reverse()
              .map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {item.age}세 ({item.year}년차)
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                      {item.badge && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">
                    {(item.netWorth / 10000).toFixed(1)}억
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // STEP 4: ENDING SUMMARY
  if (step === 'ENDING' && activeGame) {
    const ending = determineEnding(
      activeGame.stats,
      activeGame.assets,
      activeGame.level,
      activeGame.age,
      activeGame.company,
      activeGame.jobHopCount
    );

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#131722] border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          {/* Header Trophy & Title */}
          <div className="text-center space-y-3 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                LIFE SIMULATION ENDING
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {ending.title}
              </h2>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {ending.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed pt-2">
              {ending.description}
            </p>
          </div>

          {/* Final Metrics Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">최종 나이</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{activeGame.age}세</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{activeGame.year}년 완주</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">최종 순자산</span>
              <span className="text-lg font-black text-emerald-500">
                {(currentNetWorth / 10000).toFixed(2)}억
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{currentNetWorth.toLocaleString()}만 원</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">최종 직급</span>
              <span className="text-lg font-black text-indigo-500">{activeGame.level}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{activeGame.company.name}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">누적 총소득</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {(activeGame.totalEarnings / 10000).toFixed(1)}억
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">평생 번 월급</span>
            </div>
          </div>

          {/* Life Timeline Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              주요 인생 사건 연표
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {activeGame.timeline.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs flex justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">
                      {entry.age}세
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{entry.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{(entry.netWorth / 10000).toFixed(1)}억</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Share & New Game */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleShareResult}
              className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-indigo-500" />
              {copyFeedback ? '결과 복사 완료!' : '결과 카드 텍스트 복사'}
            </button>

            <button
              onClick={handleInitiateNewGame}
              className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              새로운 인생 시작하기
            </button>

            <button
              onClick={handleBackToLobby}
              className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              로비로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
