import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Plus,
  RefreshCw,
  Sliders,
  RotateCcw,
  AlertTriangle,
  Info,
  Calendar,
  History,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  ShieldAlert,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  VirtualHolding,
  VirtualHoldingTrade,
  MockAccount,
  MockPosition,
  MockOrder,
  Stock
} from '../../types';
import { portfolioService } from '../../services/portfolioService';
import { VirtualHoldingModal } from './VirtualHoldingModal';
import { MockTradeModal } from './MockTradeModal';
import { FeeSettingsModal } from './FeeSettingsModal';
import { PortfolioCharts } from './PortfolioCharts';
import { PortfolioAnalyzer } from './PortfolioAnalyzer';
import { DividendCalculator } from './DividendCalculator';
import { stockRepository } from '../../services/stockRepository';
import {
  aggregateMultiCurrencyPortfolio,
  convertToKRW,
  formatMoney,
  inferFiatCurrency,
  inferStockExchange,
  validateExchangeRate,
} from '../../utils/currency';


export const PortfolioView: React.FC = () => {
  const { user, isAuthenticated, showToast, exchangeRate, stocks, navigateToStock, setActiveTab } = useApp();

  const [mainTab, setMainTab] = useState<'virtual' | 'mock'>('virtual');

  // Virtual Holdings State
  const [virtualHoldings, setVirtualHoldings] = useState<VirtualHolding[]>([]);
  const [virtualTrades, setVirtualTrades] = useState<VirtualHoldingTrade[]>([]);
  const [holdingModalOpen, setHoldingModalOpen] = useState<boolean>(false);
  const [holdingModalMode, setHoldingModalMode] = useState<'create' | 'add_buy' | 'sell' | 'edit'>('create');
  const [activeHolding, setActiveHolding] = useState<VirtualHolding | null>(null);

  // Mock Trading State
  const [mockAccount, setMockAccount] = useState<MockAccount | null>(null);
  const [mockPositions, setMockPositions] = useState<MockPosition[]>([]);
  const [mockOrders, setMockOrders] = useState<MockOrder[]>([]);
  const [feeModalOpen, setFeeModalOpen] = useState<boolean>(false);
  const [tradeModalOpen, setTradeModalOpen] = useState<boolean>(false);
  const [tradeModalSymbol, setTradeModalSymbol] = useState<string>('005930');
  const [tradeModalType, setTradeModalType] = useState<'BUY' | 'SELL'>('BUY');

  // Loading & Live Quote Cache
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [quotesMap, setQuotesMap] = useState<Map<string, {
    price: number;
    change: number;
    changePercent: number;
    currency: 'KRW' | 'USD';
    delayLabel: string;
    status: 'ok' | 'delayed' | 'error';
    asOf: string;
  }>>(new Map());

  // Load all data
  const loadData = async () => {
    try {
      const [vHoldings, vTrades, mAccount, mPositions, mOrders] = await Promise.all([
        portfolioService.getVirtualHoldings(user?.id),
        portfolioService.getVirtualHoldingTrades(user?.id),
        portfolioService.getMockAccount(user?.id),
        portfolioService.getMockPositions(user?.id),
        portfolioService.getMockOrders(user?.id),
      ]);

      setVirtualHoldings(vHoldings);
      setVirtualTrades(vTrades);
      setMockAccount(mAccount);
      setMockPositions(mPositions);
      setMockOrders(mOrders);

      // Fetch quotes for all symbols in holdings & positions
      const allSymbols = Array.from(new Set([
        ...vHoldings.map(h => h.symbol),
        ...mPositions.map(p => p.symbol),
      ]));

      if (allSymbols.length > 0) {
        const newMap = new Map();
        await Promise.all(
          allSymbols.map(async sym => {
            const q = await portfolioService.resolveQuote(sym);
            if (q) {
              newMap.set(sym, q);
            }
          })
        );
        setQuotesMap(newMap);
      }
    } catch (err) {
      console.warn('[PortfolioView] loadData error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    showToast('보유 종목 시세 및 자산 현황을 갱신했습니다.', 'info');
  };

  const fxCheck = useMemo(() => validateExchangeRate(exchangeRate), [exchangeRate]);

  // ==========================================
  // Virtual Holdings Calculations (KRW / USD Separated + FX Conversion)
  // ==========================================
  const virtualAgg = useMemo(() => {
    return aggregateMultiCurrencyPortfolio({
      positions: virtualHoldings.map(h => ({
        symbol: h.symbol,
        currency: inferFiatCurrency(h.symbol, h.market, h.currency),
        market: h.market,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        totalCost: h.totalBuyAmount,
        currentPrice: quotesMap.get(h.symbol)?.price ?? null,
        entryExchangeRate: h.entryExchangeRate,
      })),
      realizedTrades: virtualTrades
        .filter(t => t.tradeType === 'SELL' && t.realizedProfit !== undefined)
        .map(t => ({
          symbol: t.symbol,
          currency: inferFiatCurrency(t.symbol, undefined, t.currency ?? quotesMap.get(t.symbol)?.currency),
          realizedProfit: t.realizedProfit,
          exchangeRate: t.exchangeRate,
        })),
      fx: exchangeRate,
      fallbackValuationToCost: false,
    });
  }, [virtualHoldings, virtualTrades, quotesMap, exchangeRate]);

  // ==========================================
  // Mock Trading Calculations (KRW / USD Separated + FX Conversion)
  // ==========================================
  const mockAgg = useMemo(() => {
    return aggregateMultiCurrencyPortfolio({
      positions: mockPositions.map(p => ({
        symbol: p.symbol,
        currency: inferFiatCurrency(p.symbol, p.market, p.currency),
        market: p.market,
        quantity: p.quantity,
        avgBuyPrice: p.avgBuyPrice,
        totalCost: p.totalInvested,
        currentPrice: quotesMap.get(p.symbol)?.price ?? null,
        entryExchangeRate: p.entryExchangeRate,
      })),
      realizedTrades: mockOrders
        .filter(o => o.orderType === 'SELL' && o.status !== 'PENDING' && o.status !== 'CANCELLED' && o.realizedProfit !== undefined)
        .map(o => ({
          symbol: o.symbol,
          currency: inferFiatCurrency(o.symbol, undefined, o.currency ?? quotesMap.get(o.symbol)?.currency),
          realizedProfit: o.realizedProfit,
          exchangeRate: o.exchangeRate,
        })),
      cashKRW: mockAccount?.currentCash ?? 100000000,
      initialCashKRW: mockAccount?.initialBalance ?? 100000000,
      cashUSD: mockAccount?.currentCashUsd ?? 100000,
      initialCashUSD: mockAccount?.initialBalanceUsd ?? 100000,
      fx: exchangeRate,
      fallbackValuationToCost: true,
    });
  }, [mockAccount, mockPositions, mockOrders, quotesMap, exchangeRate]);

  const handleResetMockAccount = async () => {
    if (!window.confirm('가상 모의투자 계좌를 초기 자금(₩100,000,000 / $100,000.00)으로 리셋하시겠습니까?\n모든 보유 종목과 주문 내역이 초기화됩니다.')) {
      return;
    }
    try {
      const newAcc = await portfolioService.resetMockAccount(user?.id);
      setMockAccount(newAcc);
      setMockPositions([]);
      setMockOrders([]);
      showToast('모의투자 계좌가 KRW ₩100,000,000 / USD $100,000.00으로 초기화되었습니다.', 'info');
    } catch (err: any) {
      showToast('계좌 초기화 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleDeleteVirtualHolding = async (holdingId: string, name: string) => {
    if (!window.confirm(`'${name}' 가상 보유 기록을 삭제하시겠습니까?`)) return;
    try {
      await portfolioService.deleteVirtualHolding(user?.id, holdingId);
      setVirtualHoldings(prev => prev.filter(h => h.id !== holdingId));
      showToast(`'${name}' 보유 기록이 삭제되었습니다.`, 'info');
    } catch (err) {
      showToast('삭제 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleOpenTradeForStock = (symbol: string, type: 'BUY' | 'SELL' = 'BUY') => {
    setTradeModalSymbol(symbol);
    setTradeModalType(type);
    setTradeModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Header Card & Main Tab Switcher */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  가상 보유 관리 & 모의투자
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-500">
                  SIMULATOR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                직접 입력 가상 포트폴리오 관리와 실시간 시세 기반 모의 트레이딩을 안전하게 진행하세요.
              </p>
            </div>
          </div>

          {/* Action buttons: Refresh & Settings */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="시세 갱신"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
              <span className="hidden sm:inline">시세 갱신</span>
            </button>

            {mainTab === 'mock' && (
              <button
                onClick={() => setFeeModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-rose-500" />
                <span>수수료·세금 설정</span>
              </button>
            )}
          </div>
        </div>

        {/* Top 2 Primary Tabs */}
        <div className="flex items-center gap-2 mt-5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setMainTab('virtual')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mainTab === 'virtual'
                ? 'bg-white dark:bg-[#131722] text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>가상 보유 내역 기록</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-500 font-mono">
              {virtualHoldings.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab('mock')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mainTab === 'mock'
                ? 'bg-white dark:bg-[#131722] text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>실전 모의 투자 (가상 자금)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 font-mono">
              {mockPositions.length}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. 가상 보유 내역 탭 (Virtual Holdings Tab) */}
      {/* ============================================================== */}
      {mainTab === 'virtual' && (
        <div className="space-y-6">
          {/* Statutory Clear Disclaimer Alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-sm block">
                ⚠️ [가상 보유 내역 안내 및 구분 고지]
              </span>
              <p className="leading-relaxed">
                본 화면은 <strong>실제 증권사 실계좌와 연결되지 않은 사용자 직접 입력 가상 포트폴리오</strong>입니다.
                보유 종목, 매수가, 수량을 직접 기록하여 현재가 연동 평가손익과 추가 매수 평균단가, 매도 시 실현손익을 분석하는 목적입니다.
              </p>
            </div>
          </div>

          {/* FX Status Alert when FX is missing / stale / error */}
          {!fxCheck.valid && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">실시간 USD/KRW 환율 검증 불가 — 원화 통합 환산 중단</span>
                <span className="text-[11px] opacity-90">
                  {fxCheck.reason || '환율 정보를 확인할 수 없어 임의 환산 없이 KRW와 USD 자산을 각각 분리 표기합니다.'}
                </span>
              </div>
            </div>
          )}

          {/* Virtual Metrics Summary Cards (KRW / USD Native Separation + FX Converted Total) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. KRW Native Assets */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">국내 주식 (KRW 기준)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold">
                  {virtualAgg.krw.holdingsCount}종목
                </span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block">
                  {formatMoney(virtualAgg.krw.evaluationAmount, 'KRW')}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  매입 {formatMoney(virtualAgg.krw.investedCost, 'KRW')}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className={virtualAgg.krw.unrealizedPnL >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                  {formatMoney(virtualAgg.krw.unrealizedPnL, 'KRW', { showSign: true })} ({virtualAgg.krw.returnRatePercent >= 0 ? '+' : ''}{virtualAgg.krw.returnRatePercent.toFixed(2)}%)
                </span>
                <span className="text-slate-400">실현 {formatMoney(virtualAgg.krw.realizedPnL, 'KRW', { showSign: true })}</span>
              </div>
            </div>

            {/* 2. USD Native Assets */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">미국 주식 (USD 기준)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono font-bold">
                  {virtualAgg.usd.holdingsCount}종목
                </span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block">
                  {formatMoney(virtualAgg.usd.evaluationAmount, 'USD')}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  매입 {formatMoney(virtualAgg.usd.investedCost, 'USD')}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className={virtualAgg.usd.unrealizedPnL >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                  {formatMoney(virtualAgg.usd.unrealizedPnL, 'USD', { showSign: true })} ({virtualAgg.usd.returnRatePercent >= 0 ? '+' : ''}{virtualAgg.usd.returnRatePercent.toFixed(2)}%)
                </span>
                <span className="text-slate-400">실현 {formatMoney(virtualAgg.usd.realizedPnL, 'USD', { showSign: true })}</span>
              </div>
            </div>

            {/* 3. FX-Converted KRW Total (with Stock P&L vs FX P&L Distinction) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">기준통화(KRW) 환산 통합</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  fxCheck.valid ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {fxCheck.valid && fxCheck.rate ? `₩${fxCheck.rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}` : '환율 오류'}
                </span>
              </div>
              {virtualAgg.convertedKRW ? (
                <>
                  <div>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block">
                      {formatMoney(virtualAgg.convertedKRW.evaluationAmount, 'KRW')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      총손익 {formatMoney(virtualAgg.convertedKRW.totalPnL, 'KRW', { showSign: true })} ({virtualAgg.convertedKRW.returnRatePercent >= 0 ? '+' : ''}{virtualAgg.convertedKRW.returnRatePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>종목손익 {formatMoney(virtualAgg.convertedKRW.stockPnLKRW, 'KRW', { showSign: true })}</span>
                    <span>환차익 {formatMoney(virtualAgg.convertedKRW.fxPnLKRW, 'KRW', { showSign: true })}</span>
                  </div>
                </>
              ) : (
                <div className="py-1">
                  <span className="text-xs font-bold text-rose-500 block">환산 보류 (유효 환율 없음)</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    KRW {formatMoney(virtualAgg.krw.evaluationAmount, 'KRW')} / USD {formatMoney(virtualAgg.usd.evaluationAmount, 'USD')}
                  </span>
                </div>
              )}
            </div>

            {/* 4. Holdings Count & Add Stock CTA */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between lg:flex-col lg:items-start lg:justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-sans block mb-1">보유 종목 수</span>
                <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                  {virtualHoldings.length}개 종목
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  환율 시각: {fxCheck.lastUpdated}
                </span>
                {virtualAgg.missingQuoteCount > 0 && (
                  <span className="text-[10px] text-amber-500 font-bold block mt-0.5">
                    ({virtualAgg.missingQuoteCount}개 시세 미확인)
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setActiveHolding(null);
                  setHoldingModalMode('create');
                  setHoldingModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 active:scale-95 lg:w-full lg:justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>종목 추가 등록</span>
              </button>
            </div>
          </div>

          {/* Portfolio Charts */}
          <PortfolioCharts
            holdings={virtualHoldings}
            quotesMap={quotesMap}
            exchangeRate={exchangeRate ?? undefined}
            onSelectStock={navigateToStock}
          />
          {user?.id && (
            <>
              <PortfolioAnalyzer
                uid={user.id}
                onUpdated={loadData}
                onSelectStock={navigateToStock}
              />
              <DividendCalculator uid={user.id} />
            </>
          )}

          {/* Virtual Holdings Table / Card List */}
          <div className="rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  가상 보유 종목 목록
                </h3>
              </div>
              <span className={`text-xs font-mono ${fxCheck.valid ? 'text-slate-400' : 'text-rose-500 font-semibold'}`}>
                {fxCheck.valid && fxCheck.rate
                  ? `적용 환율: $1 = ₩${fxCheck.rate.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${fxCheck.lastUpdated})`
                  : '적용 환율: 수신 오류/지연 — 원화 환산 보류'}
              </span>
            </div>

            {virtualHoldings.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  등록된 가상 보유 종목이 없습니다.
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  실제 보유 중인 국내/해외 주식을 등록하여 실시간 손익과 분할 매수 평단가를 체계적으로 계산해보세요.
                </p>
                <button
                  onClick={() => {
                    setActiveHolding(null);
                    setHoldingModalMode('create');
                    setHoldingModalOpen(true);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>첫 종목 등록하기</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                      <th className="py-3 px-4 font-semibold">종목명 / 코드</th>
                      <th className="py-3 px-3 font-semibold text-right">보유수량</th>
                      <th className="py-3 px-3 font-semibold text-right">평균 매입단가</th>
                      <th className="py-3 px-3 font-semibold text-right">현재가 (시세상태)</th>
                      <th className="py-3 px-3 font-semibold text-right">평가금액</th>
                      <th className="py-3 px-3 font-semibold text-right">평가손익 (수익률)</th>
                      <th className="py-3 px-4 font-semibold text-center">관리 액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                    {virtualHoldings.map(h => {
                      const quote = quotesMap.get(h.symbol);
                      const cur = inferFiatCurrency(h.symbol, h.market, h.currency);
                      const isUSD = cur === 'USD';
                      const exchangeLabel = inferStockExchange(h.symbol, h.market, h.exchange);

                      // Price & P&L calculations strictly in native currency
                      const curPrice = quote?.price ?? 0;
                      const hasQuote = curPrice > 0;
                      const valuation = hasQuote ? curPrice * h.quantity : h.totalBuyAmount;
                      const profit = hasQuote ? (curPrice - h.avgBuyPrice) * h.quantity : 0;
                      const returnPct = h.avgBuyPrice > 0 && hasQuote ? ((curPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100 : 0;
                      const convVal = isUSD ? convertToKRW(valuation, 'USD', exchangeRate) : null;
                      const convBuy = isUSD ? convertToKRW(h.avgBuyPrice, 'USD', exchangeRate) : null;

                      return (
                        <tr key={h.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-sans">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => navigateToStock(h.symbol)}
                                className="font-bold text-slate-900 dark:text-white hover:text-rose-500 text-left transition-colors flex items-center gap-1 group"
                              >
                                <span>{h.name}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-rose-500" />
                              </button>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                                {h.symbol}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${isUSD ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {exchangeLabel} · {cur}
                              </span>
                            </div>
                            {h.memo && (
                              <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
                                💬 {h.memo}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                            {h.quantity.toLocaleString()}주
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <span className="text-slate-900 dark:text-white font-semibold">
                              {formatMoney(h.avgBuyPrice, cur)}
                            </span>
                            {isUSD && (
                              <span className="text-[10px] text-slate-400 block">
                                {convBuy?.valid && convBuy.valueKRW !== null
                                  ? `≈ ${formatMoney(convBuy.valueKRW, 'KRW')}`
                                  : '환율 미확인'}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            {quote && quote.price > 0 ? (
                              <>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {formatMoney(curPrice, cur)}
                                </span>
                                <span className={`text-[10px] block ${quote.delayLabel.includes('실시간') ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  {quote.delayLabel} ({quote.asOf})
                                </span>
                              </>
                            ) : (
                              <span className="text-[11px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-sans">
                                시세 확인 중
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                            <span>{formatMoney(valuation, cur)}</span>
                            {isUSD && (
                              <span className="text-[10px] text-slate-400 block font-normal">
                                {convVal?.valid && convVal.valueKRW !== null
                                  ? `≈ ${formatMoney(convVal.valueKRW, 'KRW')}`
                                  : '원화 환산 보류'}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            {hasQuote ? (
                              <div className={profit >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                                <span>
                                  {formatMoney(profit, cur, { showSign: true })}
                                </span>
                                <span className="text-[11px] block">
                                  ({profit >= 0 ? '+' : ''}{returnPct.toFixed(2)}%)
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 font-sans">
                              {/* 추가 매수 버튼 */}
                              <button
                                onClick={() => {
                                  setActiveHolding(h);
                                  setHoldingModalMode('add_buy');
                                  setHoldingModalOpen(true);
                                }}
                                className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition-colors"
                                title="추가 매수 기록 및 평단가 재계산"
                              >
                                +추가매수
                              </button>

                              {/* 매도 기록 버튼 */}
                              <button
                                onClick={() => {
                                  setActiveHolding(h);
                                  setHoldingModalMode('sell');
                                  setHoldingModalOpen(true);
                                }}
                                className="px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold transition-colors"
                                title="매도 기록 및 실현손익 확정"
                              >
                                매도기록
                              </button>

                              {/* 수정 버튼 */}
                              <button
                                onClick={() => {
                                  setActiveHolding(h);
                                  setHoldingModalMode('edit');
                                  setHoldingModalOpen(true);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                title="수정"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* 삭제 버튼 */}
                              <button
                                onClick={() => handleDeleteVirtualHolding(h.id, h.name)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                                title="삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Virtual Holding Trades History (매수 / 추가매수 / 매도 내역) */}
          <div className="rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  가상 포트폴리오 거래 및 매도 실현 내역
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                총 {virtualTrades.length}건
              </span>
            </div>

            {virtualTrades.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                기록된 거래 내역이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 uppercase">
                      <th className="py-2.5 px-4 font-semibold">거래일자</th>
                      <th className="py-2.5 px-3 font-semibold">구분</th>
                      <th className="py-2.5 px-3 font-semibold">종목명</th>
                      <th className="py-2.5 px-3 font-semibold text-right">체결단가</th>
                      <th className="py-2.5 px-3 font-semibold text-right">수량</th>
                      <th className="py-2.5 px-3 font-semibold text-right">거래총액</th>
                      <th className="py-2.5 px-3 font-semibold text-right">실현손익</th>
                      <th className="py-2.5 px-4 font-semibold">메모 / 사유</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                    {virtualTrades.map(t => {
                      const isSell = t.tradeType === 'SELL';
                      const isAdd = t.tradeType === 'ADD_BUY';
                      const tCur = inferFiatCurrency(t.symbol, undefined, t.currency ?? quotesMap.get(t.symbol)?.currency);

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20">
                          <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                            {t.tradeDate}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isSell
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : isAdd
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {isSell ? '매도' : isAdd ? '추가매수' : '최초매수'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                            <span>{t.name}</span>
                            <span className="ml-1.5 text-[10px] font-mono text-slate-400">{tCur}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {formatMoney(t.price, tCur)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold">
                            {t.quantity.toLocaleString()}주
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {formatMoney(t.totalAmount, tCur)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {isSell && t.realizedProfit !== undefined ? (
                              <span className={t.realizedProfit >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                                {formatMoney(t.realizedProfit, tCur, { showSign: true })}
                                <span className="text-[10px] block">
                                  ({t.realizedProfitRate && t.realizedProfitRate >= 0 ? '+' : ''}{t.realizedProfitRate?.toFixed(2)}%)
                                </span>
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-500 text-[11px] truncate max-w-xs">
                            {t.memo || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. 모의 투자 탭 (Mock Paper Trading Tab) */}
      {/* ============================================================== */}
      {mainTab === 'mock' && (
        <div className="space-y-6">
          {/* Mock Trading Simulator Banner */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-sm block">
                🎮 [실시간 가상 자금 모의 트레이딩 시뮬레이터 — KRW / USD 계좌 분리]
              </span>
              <p className="leading-relaxed">
                실제 증권 거래나 금융 비용 청구 없이, <strong>원화 가상 자금 ₩100,000,000</strong>과 <strong>외화 가상 자금 $100,000.00</strong>으로 통화별 분리 체결 및 수익률 검증을 진행합니다.
              </p>
            </div>
          </div>

          {!fxCheck.valid && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">USD/KRW 환율 수신 지연·오류 — 기준통화(KRW) 통합 환산 보류</span>
                <span className="text-[11px] opacity-90">{fxCheck.reason || 'KRW와 USD 자산은 각 통화 단위로만 정확히 집계됩니다.'}</span>
              </div>
            </div>
          )}

          {/* Account Metrics Bar (KRW Account / USD Account / Converted KRW Total / Actions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* KRW Sub-account */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">KRW 원화 모의 계좌</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-300">KRW</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block">
                  {formatMoney(mockAgg.krw.totalAssets, 'KRW')}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  현금 {formatMoney(mockAgg.krw.cash, 'KRW')} · 주식 {formatMoney(mockAgg.krw.evaluationAmount, 'KRW')}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className={mockAgg.krw.unrealizedPnL >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                  평가 {formatMoney(mockAgg.krw.unrealizedPnL, 'KRW', { showSign: true })}
                </span>
                <span className={mockAgg.krw.returnRatePercent >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                  {mockAgg.krw.returnRatePercent >= 0 ? '+' : ''}{mockAgg.krw.returnRatePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* USD Sub-account */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">USD 달러 모의 계좌</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 font-mono font-bold text-blue-500">USD</span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block">
                  {formatMoney(mockAgg.usd.totalAssets, 'USD')}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  현금 {formatMoney(mockAgg.usd.cash, 'USD')} · 주식 {formatMoney(mockAgg.usd.evaluationAmount, 'USD')}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className={mockAgg.usd.unrealizedPnL >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                  평가 {formatMoney(mockAgg.usd.unrealizedPnL, 'USD', { showSign: true })}
                </span>
                <span className={mockAgg.usd.returnRatePercent >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                  {mockAgg.usd.returnRatePercent >= 0 ? '+' : ''}{mockAgg.usd.returnRatePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Converted KRW Combined Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">원화 환산 총자산</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  fxCheck.valid ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {fxCheck.valid && fxCheck.rate ? `₩${fxCheck.rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}` : '환산 보류'}
                </span>
              </div>
              {mockAgg.convertedKRW ? (
                <>
                  <div>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block">
                      {formatMoney(mockAgg.convertedKRW.totalAssets, 'KRW')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      총수익 {formatMoney(mockAgg.convertedKRW.totalPnL, 'KRW', { showSign: true })} ({mockAgg.convertedKRW.returnRatePercent >= 0 ? '+' : ''}{mockAgg.convertedKRW.returnRatePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>종목손익 {formatMoney(mockAgg.convertedKRW.stockPnLKRW, 'KRW', { showSign: true })}</span>
                    <span>환차익 {formatMoney(mockAgg.convertedKRW.fxPnLKRW, 'KRW', { showSign: true })}</span>
                  </div>
                </>
              ) : (
                <div className="py-1">
                  <span className="text-xs font-bold text-rose-500 block">환율 미확인으로 합산 보류</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    시각: {fxCheck.lastUpdated}
                  </span>
                </div>
              )}
            </div>

            {/* Action Card */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between lg:flex-col lg:justify-center gap-2">
              <button
                onClick={() => handleOpenTradeForStock('005930', 'BUY')}
                className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>새 모의 주문</span>
              </button>
              <button
                onClick={handleResetMockAccount}
                className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1"
                title="원화 1억원 / 달러 $100,000 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span>계좌 초기화</span>
              </button>
            </div>
          </div>

          {/* Mock Holdings Table */}
          <div className="rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  모의투자 보유 종목 포지션
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                수수료: {((mockAccount?.commissionRate ?? 0.00015) * 100).toFixed(3)}% | 거래세: {((mockAccount?.taxRate ?? 0.0018) * 100).toFixed(2)}%
              </span>
            </div>

            {mockPositions.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  현재 체결된 모의 보유 종목이 없습니다.
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  종목 상세, 관심종목, 검색창에서 즉시 가상 매수를 실행해보세요.
                </p>
                <button
                  onClick={() => handleOpenTradeForStock('005930', 'BUY')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>삼성전자 모의 매수해보기</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 uppercase">
                      <th className="py-3 px-4 font-semibold">종목명 / 코드</th>
                      <th className="py-3 px-3 font-semibold text-right">보유수량</th>
                      <th className="py-3 px-3 font-semibold text-right">평균 매입단가</th>
                      <th className="py-3 px-3 font-semibold text-right">현재가 (시세상태)</th>
                      <th className="py-3 px-3 font-semibold text-right">평가금액</th>
                      <th className="py-3 px-3 font-semibold text-right">평가손익 (수익률)</th>
                      <th className="py-3 px-4 font-semibold text-center">주문 실행</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                    {mockPositions.map(p => {
                      const quote = quotesMap.get(p.symbol);
                      const pCur = inferFiatCurrency(p.symbol, p.market, p.currency);
                      const isUSD = pCur === 'USD';
                      const exchangeLabel = inferStockExchange(p.symbol, p.market, p.exchange);
                      const curPrice = quote?.price ?? 0;
                      const hasQuote = curPrice > 0;
                      const valuation = hasQuote ? curPrice * p.quantity : p.totalInvested;
                      const profit = hasQuote ? (curPrice - p.avgBuyPrice) * p.quantity : 0;
                      const returnPct = p.avgBuyPrice > 0 && hasQuote ? ((curPrice - p.avgBuyPrice) / p.avgBuyPrice) * 100 : 0;
                      const convVal = isUSD ? convertToKRW(valuation, 'USD', exchangeRate) : null;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-sans">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => navigateToStock(p.symbol)}
                                className="font-bold text-slate-900 dark:text-white hover:text-rose-500 text-left transition-colors flex items-center gap-1 group"
                              >
                                <span>{p.name}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-rose-500" />
                              </button>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                                {p.symbol}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${isUSD ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {exchangeLabel} · {pCur}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                            {p.quantity.toLocaleString()}주
                          </td>

                          <td className="py-3.5 px-3 text-right font-semibold text-slate-900 dark:text-white">
                            {formatMoney(p.avgBuyPrice, pCur)}
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            {quote && quote.price > 0 ? (
                              <>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {formatMoney(curPrice, pCur)}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {quote.delayLabel}
                                </span>
                              </>
                            ) : (
                              <span className="text-amber-500 text-[11px]">확인 중</span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                            <span>{formatMoney(valuation, pCur)}</span>
                            {isUSD && (
                              <span className="text-[10px] text-slate-400 block font-normal">
                                {convVal?.valid && convVal.valueKRW !== null
                                  ? `≈ ${formatMoney(convVal.valueKRW, 'KRW')}`
                                  : '원화 환산 보류'}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            {hasQuote ? (
                              <div className={profit >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                                <span>{formatMoney(profit, pCur, { showSign: true })}</span>
                                <span className="text-[11px] block">
                                  ({profit >= 0 ? '+' : ''}{returnPct.toFixed(2)}%)
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center font-sans">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenTradeForStock(p.symbol, 'BUY')}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[11px] font-bold transition-colors"
                              >
                                추가 매수
                              </button>
                              <button
                                onClick={() => handleOpenTradeForStock(p.symbol, 'SELL')}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors shadow-sm"
                              >
                                가상 매도
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mock Orders History */}
          <div className="rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  모의 주문 체결 내역
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                총 {mockOrders.length}건
              </span>
            </div>

            {mockOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                체결된 모의 주문 내역이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 uppercase">
                      <th className="py-2.5 px-4 font-semibold">주문/체결일시</th>
                      <th className="py-2.5 px-3 font-semibold">구분</th>
                      <th className="py-2.5 px-3 font-semibold">상태</th>
                      <th className="py-2.5 px-3 font-semibold">종목명</th>
                      <th className="py-2.5 px-3 font-semibold text-right">체결단가</th>
                      <th className="py-2.5 px-3 font-semibold text-right">체결/주문수량</th>
                      <th className="py-2.5 px-3 font-semibold text-right">정산금액</th>
                      <th className="py-2.5 px-3 font-semibold text-right">실현손익</th>
                      <th className="py-2.5 px-4 font-semibold">매매 전략/사유</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                    {mockOrders.map(o => {
                      const isSell = o.orderType === 'SELL';
                      const oCur = inferFiatCurrency(o.symbol, undefined, o.currency ?? quotesMap.get(o.symbol)?.currency);
                      const status = o.status || 'FILLED';

                      return (
                        <tr key={o.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20">
                          <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                            {new Date(o.executedAt).toLocaleString('ko-KR')}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isSell
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {isSell ? '가상 매도' : '가상 매수'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              status === 'FILLED'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : status === 'PARTIALLY_FILLED'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : status === 'CANCELLED'
                                ? 'bg-slate-500/10 text-slate-500'
                                : 'bg-indigo-500/10 text-indigo-500'
                            }`}>
                              {status === 'FILLED'
                                ? '체결완료'
                                : status === 'PARTIALLY_FILLED'
                                ? `부분체결 (${o.filledQuantity ?? o.quantity}/${o.requestedQuantity ?? o.quantity})`
                                : status === 'CANCELLED'
                                ? '주문취소'
                                : '대기(미체결)'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                            <span>{o.name}</span>
                            <span className="ml-1.5 text-[10px] font-mono text-slate-400">{oCur}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {status === 'PENDING' && (o.filledQuantity ?? 0) === 0 ? (
                              <span className="text-slate-400 text-[11px]">미체결 대기</span>
                            ) : (
                              formatMoney(o.price, oCur)
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold">
                            {status === 'PARTIALLY_FILLED'
                              ? `${(o.filledQuantity ?? 0).toLocaleString()}주 / ${(o.requestedQuantity ?? o.quantity).toLocaleString()}주`
                              : `${o.quantity.toLocaleString()}주`}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {status === 'PENDING' && (o.filledQuantity ?? 0) === 0
                              ? '-'
                              : formatMoney(o.settledAmount, oCur)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {isSell && o.realizedProfit !== undefined && status !== 'PENDING' ? (
                              <span className={o.realizedProfit >= 0 ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                                {formatMoney(o.realizedProfit, oCur, { showSign: true })}
                                <span className="text-[10px] block">
                                  ({o.realizedProfitRate && o.realizedProfitRate >= 0 ? '+' : ''}{o.realizedProfitRate?.toFixed(2)}%)
                                </span>
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-500 text-[11px] truncate max-w-xs">
                            {o.reason || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modals */}
      {/* ============================================================== */}
      <VirtualHoldingModal
        isOpen={holdingModalOpen}
        onClose={() => setHoldingModalOpen(false)}
        mode={holdingModalMode}
        holding={activeHolding}
        onSuccess={loadData}
        uid={user?.id}
      />

      <MockTradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        symbol={tradeModalSymbol}
        initialType={tradeModalType}
        onTradeSuccess={loadData}
      />

      <FeeSettingsModal
        isOpen={feeModalOpen}
        onClose={() => setFeeModalOpen(false)}
        currentCommissionPercent={(mockAccount?.commissionRate ?? 0.00015) * 100}
        currentTaxPercent={(mockAccount?.taxRate ?? 0.0018) * 100}
        onSave={async (c, t) => {
          const updated = await portfolioService.updateFeeSettings(user?.id, c, t);
          setMockAccount(updated);
          showToast(`수수료율(${c}%)과 거래세율(${t}%)이 적용되었습니다.`, 'success');
        }}
      />
    </div>
  );
};
