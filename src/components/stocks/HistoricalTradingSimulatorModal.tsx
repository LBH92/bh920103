import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Check,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Sliders,
  Save,
  Trash2,
  Bookmark,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Compass,
  History
} from 'lucide-react';
import { CandleData, Stock, HistoricalSimulationRecord, HistoricalSimulationScenario } from '../../types';
import { StockListView } from '../stocks/StockListView';
import { SideChatPanel } from '../chat/SideChatPanel';
import { historicalSimulationService } from '../../services/historicalSimulationService';
import { portfolioService } from '../../services/portfolioService';
import { useApp } from '../../context/AppContext';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { stockRepository } from '../../services/stockRepository';

interface HistoricalTradingSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  stockName: string;
  market?: string;
  candles?: CandleData[];
  mode?: 'modal' | 'view'; // Added mode
}

export const HistoricalTradingSimulatorModal: React.FC<HistoricalTradingSimulatorModalProps> = ({
  isOpen,
  onClose,
  symbol,
  stockName,
  market = 'KOSPI',
  candles: initialCandles = [],
  mode = 'modal', // Default to modal
}) => {
  const { user, showToast, selectedSymbol: contextSelectedSymbol } = useApp();
  const activeSymbol = contextSelectedSymbol || symbol;

  // Available candles state
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [isLoadingCandles, setIsLoadingCandles] = useState<boolean>(false);

  // Simulation Parameters
  const [entryDateIndex, setEntryDateIndex] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('10');
  const [investmentBudget, setInvestmentBudget] = useState<string>('');
  const [investmentType, setInvestmentType] = useState<'LUMP_SUM' | 'RECURRING'>('LUMP_SUM');
  const [recurringFrequency, setRecurringFrequency] = useState<'MONTHLY'>('MONTHLY');
  const [targetRate, setTargetRate] = useState<string>('10'); // +10%
  const [stopLossRate, setStopLossRate] = useState<string>('-5'); // -5%
  const [notes, setNotes] = useState<string>('');

  // Replay Cursor (0 to candles.length - 1)
  // Look-ahead bias prevention: Only candles up to replayIndex are revealed!
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual exit point chosen during replay
  const [manualExitIndex, setManualExitIndex] = useState<number | null>(null);

  // Fee rates (pulled from mock account settings)
  const [commissionRate, setCommissionRate] = useState<number>(0.00015);
  const [taxRate, setTaxRate] = useState<number>(0.0018);

  // Saved simulations history
  const [savedSimulations, setSavedSimulations] = useState<HistoricalSimulationRecord[]>([]);

  // Load candles and fee settings
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setManualExitIndex(null);

      // Load fee settings
      portfolioService.getMockAccount(user?.id).then(acc => {
        if (acc) {
          setCommissionRate(acc.commissionRate || 0.00015);
          setTaxRate(acc.taxRate || 0.0018);
        }
      });

      // Load saved simulations
      historicalSimulationService.getSimulations(user?.id).then(setSavedSimulations);

      // Resolve candles
      setIsLoadingCandles(true);
      stockRepository.getChartCandles(activeSymbol, 'day')
        .then((candles: CandleData[]) => {
          if (candles && candles.length > 0) {
            setCandles(candles);
            const defaultEntry = Math.max(0, Math.floor(candles.length * 0.3));
            setEntryDateIndex(defaultEntry);
            setReplayIndex(defaultEntry);
            setBuyPrice(String(candles[defaultEntry].close));
          } else {
            setCandles([]);
          }
        })
        .catch((err: any) => {
          console.warn('[HistoricalSimulator] Fetch candles failed:', err);
          setCandles([]);
        })
        .finally(() => setIsLoadingCandles(false));
    }
  }, [isOpen, activeSymbol, user?.id]);

  // Clean timer on unmount / close
  useEffect(() => {
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, []);

  // Sync buyPrice when entryDateIndex changes
  useEffect(() => {
    if (candles.length > 0 && entryDateIndex >= 0 && entryDateIndex < candles.length) {
      const candle = candles[entryDateIndex];
      setBuyPrice(String(candle.close));
      if (replayIndex < entryDateIndex) {
        setReplayIndex(entryDateIndex);
      }
      setManualExitIndex(null);
    }
  }, [entryDateIndex, candles]);

  // Calculate quantity from budget if budget changes
  const handleBudgetChange = (val: string) => {
    setInvestmentBudget(val);
    const numBudget = parseFloat(val);
    const numPrice = parseFloat(buyPrice);
    if (!isNaN(numBudget) && !isNaN(numPrice) && numPrice > 0) {
      const q = Math.floor(numBudget / numPrice);
      if (q > 0) setQuantity(String(q));
    }
  };

  // Replay playback controller
  const togglePlay = () => {
    if (isPlaying) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playTimerRef.current = setInterval(() => {
        setReplayIndex(prev => {
          if (prev >= candles.length - 1) {
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
  };

  const stepForward = () => {
    if (replayIndex < candles.length - 1) {
      setReplayIndex(prev => prev + 1);
    }
  };

  const stepBack = () => {
    if (replayIndex > entryDateIndex) {
      setReplayIndex(prev => prev - 1);
    }
  };

  if (!activeSymbol) {
    console.error("SimulatorModal: Missing symbol!", { activeSymbol, symbol, contextSelectedSymbol });
    return null;
  }

  if (!isOpen) return null;

  // Selected Entry & Replay Candle
  const entryCandle = candles[entryDateIndex];
  const replayCandle = candles[replayIndex];
  const numBuyPrice = parseFloat(buyPrice) || (entryCandle?.close ?? 0);
  const numQty = parseInt(quantity, 10) || 1;
  const numTargetRate = parseFloat(targetRate) || 10;
  const numStopLossRate = parseFloat(stopLossRate) || -5;
  const totalInvestment = Math.round(numBuyPrice * numQty);

  // Look-ahead bias prevention: visible candles for the chart
  // Only candles from 0 to replayIndex are visible!
  const visibleCandles = candles.slice(0, replayIndex + 1);

  // Current Replay P&L (Unrealized at the replay cursor date)
  let replayUnrealizedProfit = 0;
  let replayReturnRate = 0;
  let replayHoldingDays = 0;
  if (replayCandle && numBuyPrice > 0) {
    const curVal = Math.round(replayCandle.close * numQty);
    replayUnrealizedProfit = curVal - totalInvestment;
    replayReturnRate = totalInvestment > 0 ? (replayUnrealizedProfit / totalInvestment) * 100 : 0;
    replayHoldingDays = Math.max(0, replayIndex - entryDateIndex);
  }

  // Scenarios Configuration & Evaluation
  const scenariosConfig = useMemo(() => {
    const list = [
      {
        id: 'sc_conservative',
        name: '시나리오 1: 보수적 (목표 +5% / 손절 -3%)',
        targetRate: 5,
        stopLossRate: -3,
      },
      {
        id: 'sc_standard',
        name: `시나리오 2: 표준 (목표 +${numTargetRate}% / 손절 ${numStopLossRate}%)`,
        targetRate: numTargetRate,
        stopLossRate: numStopLossRate,
      },
      {
        id: 'sc_aggressive',
        name: '시나리오 3: 공격적 (목표 +20% / 손절 -8%)',
        targetRate: 20,
        stopLossRate: -8,
      },
    ];

    if (manualExitIndex !== null && candles[manualExitIndex]) {
      const exitCandle = candles[manualExitIndex];
      list.push({
        id: 'sc_manual',
        name: `시나리오 4: 선택 시점 매도 (${exitCandle.time})`,
        customExitDate: exitCandle.time,
        customExitPrice: exitCandle.close,
      } as any);
    } else if (replayIndex > entryDateIndex && replayCandle) {
      list.push({
        id: 'sc_current_replay',
        name: `시나리오 4: 현재 재생 시점 매도 (${replayCandle.time})`,
        customExitDate: replayCandle.time,
        customExitPrice: replayCandle.close,
      } as any);
    }

    return list;
  }, [numTargetRate, numStopLossRate, manualExitIndex, replayIndex, entryDateIndex, candles, replayCandle]);

  const evaluatedScenarios = useMemo(() => {
    if (!entryCandle || candles.length === 0 || numBuyPrice <= 0 || numQty <= 0) {
      return [];
    }
    return historicalSimulationService.evaluateScenarios({
      entryDate: entryCandle.time,
      entryPrice: numBuyPrice,
      quantity: numQty,
      candles,
      scenariosConfig,
      commissionRate,
      taxRate,
      investmentType,
      recurringAmount: investmentType === 'RECURRING' ? parseFloat(investmentBudget) : undefined,
    });
  }, [entryCandle, numBuyPrice, numQty, candles, scenariosConfig, commissionRate, taxRate]);

  // Handle Save Simulation
  const handleSaveSimulation = async () => {
    if (!entryCandle) return;
    try {
      const record = await historicalSimulationService.saveSimulation(
        {
          uid: user?.id || 'guest',
          symbol,
          stockName,
          market,
          entryDate: entryCandle.time,
          entryPrice: numBuyPrice,
          quantity: numQty,
          totalInvestment,
          investmentType: 'LUMP_SUM', // Add required investmentType
          selectedExitDate: replayCandle?.time,
          selectedExitPrice: replayCandle?.close,
          netProfit: evaluatedScenarios[1]?.netProfit ?? replayUnrealizedProfit,
          returnRate: evaluatedScenarios[1]?.returnRate ?? replayReturnRate,
          holdingDays: replayHoldingDays,
          scenarios: evaluatedScenarios,
          notes,
        },
        user?.id
      );

      setSavedSimulations(prev => [record, ...prev]);
      showToast('시뮬레이션 결과가 안전하게 저장되었습니다.', 'success');
      setActiveTab('history');
    } catch (err: any) {
      showToast('시뮬레이션 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleDeleteSimulation = async (id: string) => {
    if (!window.confirm('이 시뮬레이션 기록을 삭제하시겠습니까?')) return;
    await historicalSimulationService.deleteSimulation(id, user?.id);
    setSavedSimulations(prev => prev.filter(s => s.id !== id));
    showToast('시뮬레이션 기록이 삭제되었습니다.', 'info');
  };

  const [activeTab, setActiveTab] = useState<'simulate' | 'history'>('simulate');
  const [mobileTab, setMobileTab] = useState<'list' | 'simulate' | 'chat'>('simulate');

  useLayoutEffect(() => {
    if (isOpen) {
      console.log("SimulatorModal: Rendered", {
        isOpen,
        activeSymbol,
        wrapper: document.querySelector(".modal-wrapper")?.getBoundingClientRect(),
        content: document.querySelector(".modal-content")?.getBoundingClientRect()
      });
    }
  }, [isOpen]);

  return (
    <div className="modal-wrapper fixed inset-0 z-50 w-screen h-screen bg-black/40 animate-in fade-in duration-150">
      <div className="modal-content w-full h-full bg-white dark:bg-[#131722] flex overflow-hidden">
        {/* Left: Stock List */}
        <div className={`w-80 border-r dark:border-slate-800 flex-shrink-0 overflow-y-auto bg-slate-50/50 dark:bg-[#111520] ${mobileTab !== 'list' ? 'hidden md:block' : ''}`}>
          <ErrorBoundary fallbackTitle="종목 목록 오류">
            <StockListView />
          </ErrorBoundary>
        </div>

        {/* Center: Simulator */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileTab !== 'simulate' ? 'hidden md:flex' : ''}`}>
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-[#111520]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  과거 차트 매매 시뮬레이터
                </h2>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {activeSymbol}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <ErrorBoundary fallbackTitle="시뮬레이터 UI 오류">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">⚠️ [과거 시뮬레이션 및 데이터 정확성 고지]</span>
                  <p className="text-[11px] leading-relaxed">
                    • 본 시뮬레이션은 <strong>실제 수집된 과거 일봉 시세(수정주가 기준, KST 정규장)</strong>만 사용하며, 데이터가 없는 구간은 임의 추정하지 않습니다.
                    • 미래 시점 데이터 참조 방지(Look-ahead bias 방지)를 위해 시뮬레이션 진행 커서 이전의 캔들만 노출됩니다.
                  </p>
                </div>
              </div>
              {/* Simulation Controls */}
              <div className="text-sm p-4 bg-white dark:bg-[#131722] border rounded-xl">
                 시뮬레이터 제어 UI (통합 진행 중)
              </div>
            </ErrorBoundary>
          </div>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden flex border-t dark:border-slate-800 bg-slate-50 dark:bg-[#111520] p-2 gap-2">
            <button onClick={() => setMobileTab('list')} className={`flex-1 p-2 rounded-lg text-xs font-bold ${mobileTab === 'list' ? 'bg-white dark:bg-slate-800' : ''}`}>종목</button>
            <button onClick={() => setMobileTab('simulate')} className={`flex-1 p-2 rounded-lg text-xs font-bold ${mobileTab === 'simulate' ? 'bg-white dark:bg-slate-800' : ''}`}>시뮬레이터</button>
            <button onClick={() => setMobileTab('chat')} className={`flex-1 p-2 rounded-lg text-xs font-bold ${mobileTab === 'chat' ? 'bg-white dark:bg-slate-800' : ''}`}>채팅</button>
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className={`w-[340px] border-l dark:border-slate-800 flex-shrink-0 overflow-y-auto ${mobileTab !== 'chat' ? 'hidden md:block' : ''}`}>
          <ErrorBoundary fallbackTitle="채팅 패널 오류">
            <SideChatPanel />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
