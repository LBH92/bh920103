import React, { useEffect, useState, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  Plus, 
  Layers, 
  RefreshCw, 
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { portfolioAnalyzerService } from '../../services/portfolioAnalyzerService';
import { PortfolioSummary, PortfolioHolding } from '../../types';
import { AverageBuyPriceSimulator } from './AverageBuyPriceSimulator';
import { useApp } from '../../context/AppContext';
import { formatMoney, inferStockExchange } from '../../utils/currency';

interface Props {
  uid: string;
  onUpdated?: () => void;
  onSelectStock?: (symbol: string) => void;
}

export const PortfolioAnalyzer: React.FC<Props> = ({ uid, onUpdated, onSelectStock }) => {
  const { exchangeRate } = useApp();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await portfolioAnalyzerService.getPortfolioSummary(uid, exchangeRate);
      setSummary(data);
    } catch (err) {
      console.warn('[PortfolioAnalyzer] fetchData error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [uid, exchangeRate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleHoldingUpdate = () => {
    fetchData(true);
    onUpdated?.();
  };

  if (loading) {
    return (
      <div className="p-8 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center gap-3 text-slate-500 text-xs">
        <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
        <span>포트폴리오 자산 분석 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-8 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
        <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          포트폴리오 자산 데이터를 불러오지 못했습니다.
        </p>
        <button
          onClick={() => fetchData()}
          className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const isProfit = summary.totalPnL >= 0;

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              포트폴리오 자산 분석 요약
            </h2>
            <p className="text-xs text-slate-400">
              가상 보유 자산과 모의투자 잔고를 종합 분석한 실시간 포트폴리오 지표입니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-rose-500' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards (Separated KRW & USD + FX-converted Total) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 통합 원화 환산 총자산 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>기준통화(KRW) 환산 총자산</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          {summary.fxValid ? (
            <>
              <p className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
                {formatMoney(summary.totalAssets, 'KRW')}
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                현금 {formatMoney(summary.totalCash, 'KRW')} · 환율 ₩{summary.fxRate?.toLocaleString('ko-KR', { maximumFractionDigits: 2 })} ({summary.fxTimestamp})
              </span>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-rose-500">환율 미확인 (원화 환산 보류)</p>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">
                KRW {formatMoney(summary.krw?.totalAssets ?? 0, 'KRW')} / USD {formatMoney(summary.usd?.totalAssets ?? 0, 'USD')}
              </span>
            </>
          )}
        </div>

        {/* 총 평가손익 (종목 손익 vs 환율 변동 손익) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>통합 손익 (종목 / 환차익)</span>
            {isProfit ? (
              <TrendingUp className="w-4 h-4 text-rose-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-blue-500" />
            )}
          </div>
          {summary.fxValid ? (
            <>
              <p className={`text-lg sm:text-xl font-black font-mono ${isProfit ? 'text-rose-500' : 'text-blue-500'}`}>
                {formatMoney(summary.totalPnL, 'KRW', { showSign: true })}
              </p>
              <span className="text-[10px] font-mono text-slate-500 block">
                종목 {formatMoney(summary.stockPnLKRW ?? 0, 'KRW', { showSign: true })} · 환율 {formatMoney(summary.fxPnLKRW ?? 0, 'KRW', { showSign: true })} ({isProfit ? '+' : ''}{summary.roi.toFixed(2)}%)
              </span>
            </>
          ) : (
            <p className="text-xs font-bold text-rose-500">환율 오류로 통합 손익 계산 보류</p>
          )}
        </div>

        {/* KRW 포트폴리오 요약 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
            국내(KRW) 자산 ({summary.krw?.holdingsCount ?? 0}종목)
          </span>
          <p className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
            {formatMoney(summary.krw?.evaluationAmount ?? 0, 'KRW')}
          </p>
          <span className="text-[10px] text-slate-400 font-mono block">
            현금 {formatMoney(summary.krw?.totalCash ?? 0, 'KRW')} · 손익 {formatMoney(summary.krw?.unrealizedPnL ?? 0, 'KRW', { showSign: true })}
          </span>
        </div>

        {/* USD 포트폴리오 요약 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
            해외(USD) 자산 ({summary.usd?.holdingsCount ?? 0}종목)
          </span>
          <p className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
            {formatMoney(summary.usd?.evaluationAmount ?? 0, 'USD')}
          </p>
          <span className="text-[10px] text-slate-400 font-mono block">
            현금 {formatMoney(summary.usd?.totalCash ?? 0, 'USD')} · 손익 {formatMoney(summary.usd?.unrealizedPnL ?? 0, 'USD', { showSign: true })}
          </span>
        </div>
      </div>

      {/* 3. Holdings Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>보유 종목 현황</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              총 {summary.holdings.length}종목
            </span>
          </h3>
          <span className="text-[11px] text-slate-400">
            물타기(추가 매수) 버튼을 클릭하여 단가를 재계산하고 즉시 반영하세요.
          </span>
        </div>

        {summary.holdings.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">등록된 보유 종목이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  <th className="py-3 px-4">종목코드 / 종목명</th>
                  <th className="py-3 px-3 text-right">보유 수량</th>
                  <th className="py-3 px-3 text-right">평균 매입단가</th>
                  <th className="py-3 px-3 text-right">현재가</th>
                  <th className="py-3 px-3 text-right">현재 평가금액</th>
                  <th className="py-3 px-3 text-right">평가손익 (수익률)</th>
                  <th className="py-3 px-3 text-right">자산 비중</th>
                  <th className="py-3 px-4 text-center">관리 / 물타기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {summary.holdings.map(h => {
                  const isHoldingProfit = h.unrealizedPnL >= 0;
                  const isSelected = selectedHolding?.symbol === h.symbol;

                  return (
                    <tr
                      key={h.symbol}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors ${
                        isSelected ? 'bg-emerald-500/5 dark:bg-emerald-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-sans">
                        <button
                          onClick={() => onSelectStock?.(h.symbol)}
                          className="font-bold text-slate-900 dark:text-white hover:text-rose-500 flex items-center gap-1 group text-left"
                        >
                          <span>{h.name}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rose-500" />
                        </button>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">{h.symbol}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                            {inferStockExchange(h.symbol, h.market, h.exchange)} · {h.currency}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {h.quantity.toLocaleString()}주
                      </td>

                      <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                        {formatMoney(h.avgBuyPrice, h.currency)}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatMoney(h.currentPrice, h.currency)}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatMoney(h.marketValue, h.currency)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className={isHoldingProfit ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                          <span>
                            {formatMoney(h.unrealizedPnL, h.currency, { showSign: true })}
                          </span>
                          <span className="text-[10px] block">
                            ({isHoldingProfit ? '+' : ''}{h.unrealizedPnLRate.toFixed(2)}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-slate-600 dark:text-slate-300">
                        {summary.fxValid || (summary.usd?.holdingsCount ?? 0) === 0 ? `${h.weight.toFixed(1)}%` : '-'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedHolding(isSelected ? null : h)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}
                          title="물타기 시뮬레이션 및 추가 매수 실행"
                        >
                          {isSelected ? '닫기' : '물타기 (추가 매수)'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Active Simulator Drawer / Card */}
      {selectedHolding && (
        <div className="pt-2">
          <AverageBuyPriceSimulator
            uid={uid}
            holdingId={selectedHolding.id}
            symbol={selectedHolding.symbol}
            name={selectedHolding.name}
            currency={selectedHolding.currency}
            currentQty={selectedHolding.quantity}
            currentAvgPrice={selectedHolding.avgBuyPrice}
            currentPrice={selectedHolding.currentPrice}
            commissionRate={0.00015}
            taxRate={0.0018}
            onBuySuccess={handleHoldingUpdate}
            onClose={() => setSelectedHolding(null)}
          />
        </div>
      )}
    </div>
  );
};
