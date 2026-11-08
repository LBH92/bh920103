import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ArrowUpRight, 
  Info, 
  RefreshCw,
  Wallet
} from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { dividendService, CalculatedDividendResult } from '../../services/dividendService';
import { useApp } from '../../context/AppContext';

export const DividendCalculator: React.FC<{ uid: string }> = ({ uid }) => {
  const { exchangeRate, navigateToStock } = useApp();
  const currentRate = exchangeRate?.rate || 1400;

  const [dividendResults, setDividendResults] = useState<CalculatedDividendResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const holdings = await portfolioService.getVirtualHoldings(uid);
      const results: CalculatedDividendResult[] = holdings.map(h => {
        return dividendService.calculateDividend(
          h.symbol,
          h.quantity,
          h.name,
          h.currency,
          currentRate
        );
      });

      setDividendResults(results);
    } catch (err) {
      console.warn('[DividendCalculator] Load data error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [uid, currentRate]);

  // Aggregate totals in KRW
  const totals = dividendResults.reduce(
    (acc, item) => {
      acc.preTaxKRW += item.annualPreTaxKRW;
      acc.postTaxKRW += item.annualPostTaxKRW;
      acc.taxKRW += (item.annualPreTaxKRW - item.annualPostTaxKRW);
      if (item.hasDividend) acc.dividendStockCount += 1;
      return acc;
    },
    { preTaxKRW: 0, postTaxKRW: 0, taxKRW: 0, dividendStockCount: 0 }
  );

  const monthlyAveragePostTaxKRW = Math.round(totals.postTaxKRW / 12);

  if (loading) {
    return (
      <div className="p-8 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center gap-3 text-slate-500 text-xs">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
        <span>실제 공시 기반 배당 수익 데이터를 분석하는 중...</span>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                배당 수익 계산기 (실제 공시 연동)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                15.4% 원천징수 반영
              </span>
            </div>
            <p className="text-xs text-slate-400">
              한국예탁결제원(SEIBro) 및 미국 SEC 공식 공시 주당배당금(DPS)을 보유 수량에 연동한 실수령액 분석입니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-500' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 연간 예상 배당금 (세전) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
            연간 총 배당금 (세전)
          </span>
          <p className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
            {totals.preTaxKRW.toLocaleString()}원
          </p>
          <span className="text-[10px] text-slate-400">
            보유 종목 연간 DPS × 수량 합산
          </span>
        </div>

        {/* 연간 실수령 배당금 (세후) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
            연간 실수령 배당금 (세후)
          </span>
          <p className="text-lg sm:text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {totals.postTaxKRW.toLocaleString()}원
          </p>
          <span className="text-[10px] text-slate-400">
            원천징수세액 -{totals.taxKRW.toLocaleString()}원 (15.4%)
          </span>
        </div>

        {/* 월평균 실수령 배당금 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>월평균 실수령액</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
            {monthlyAveragePostTaxKRW.toLocaleString()}원 / 월
          </p>
          <span className="text-[10px] text-slate-400">
            매월 연금형 현금 흐름 환산치
          </span>
        </div>

        {/* 배당 지급 종목 수 */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-xs block mb-1">
            배당 지급 종목
          </span>
          <p className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white">
            {totals.dividendStockCount} / {dividendResults.length}종목
          </p>
          <span className="text-[10px] text-slate-400">
            기준 환율 {currentRate.toLocaleString()}원/달러 적용
          </span>
        </div>
      </div>

      {/* 3. Dividend Detail Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>종목별 공시 배당 상세</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              총 {dividendResults.length}종목
            </span>
          </h3>
          <span className="text-[11px] text-slate-400">
            기준 사업연도 및 공식 공시 출처 표기
          </span>
        </div>

        {dividendResults.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">등록된 보유 종목이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  <th className="py-3 px-4">종목명 / 심볼</th>
                  <th className="py-3 px-3 text-right">보유수량</th>
                  <th className="py-3 px-3 text-right">주당 배당금 (DPS)</th>
                  <th className="py-3 px-3 text-center">지급 주기</th>
                  <th className="py-3 px-3 text-center">공시 상태</th>
                  <th className="py-3 px-3 text-right">연간 배당금 (세전)</th>
                  <th className="py-3 px-3 text-right">연간 실수령 (세후 15.4%)</th>
                  <th className="py-3 px-3 text-center">배당락일 / 지급일</th>
                  <th className="py-3 px-4">공식 출처</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {dividendResults.map(item => {
                  const isUSD = item.currency === 'USD';
                  const isConfirmed = item.status === 'CONFIRMED';
                  const isEstimated = item.status === 'ESTIMATED';
                  const isNone = item.status === 'NONE';

                  return (
                    <tr
                      key={item.symbol}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* 종목명 / 심볼 */}
                      <td className="py-3 px-4 font-sans">
                        <button
                          onClick={() => navigateToStock?.(item.symbol)}
                          className="font-bold text-slate-900 dark:text-white hover:text-rose-500 flex items-center gap-1 group text-left"
                        >
                          <span>{item.name}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rose-500" />
                        </button>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">{item.symbol}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                            {item.market}
                          </span>
                        </div>
                      </td>

                      {/* 보유 수량 */}
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {item.quantity.toLocaleString()}주
                      </td>

                      {/* 주당 배당금 (DPS) */}
                      <td className="py-3 px-3 text-right">
                        {item.hasDividend ? (
                          <span className="font-bold text-slate-900 dark:text-white">
                            {isUSD ? `$${item.annualDPS.toFixed(2)}` : `${item.annualDPS.toLocaleString()}원`}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans text-[11px]">-</span>
                        )}
                      </td>

                      {/* 지급 주기 */}
                      <td className="py-3 px-3 text-center font-sans">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.frequencyLabel}
                        </span>
                      </td>

                      {/* 공시 상태 */}
                      <td className="py-3 px-3 text-center font-sans">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : isEstimated
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : isNone
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {item.statusLabel}
                        </span>
                      </td>

                      {/* 연간 배당금 (세전) */}
                      <td className="py-3 px-3 text-right">
                        {item.hasDividend ? (
                          <>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {isUSD ? `$${item.annualPreTaxDividend.toFixed(2)}` : `${item.annualPreTaxDividend.toLocaleString()}원`}
                            </span>
                            {isUSD && (
                              <span className="text-[10px] text-slate-400 block">
                                ≈ {item.annualPreTaxKRW.toLocaleString()}원
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 font-sans text-[11px]">무배당</span>
                        )}
                      </td>

                      {/* 연간 실수령액 (세후 15.4%) */}
                      <td className="py-3 px-3 text-right">
                        {item.hasDividend ? (
                          <>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                              {isUSD ? `$${item.annualPostTaxDividend.toFixed(2)}` : `${item.annualPostTaxDividend.toLocaleString()}원`}
                            </span>
                            {isUSD && (
                              <span className="text-[10px] text-slate-400 block">
                                ≈ {item.annualPostTaxKRW.toLocaleString()}원
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 font-sans text-[11px]">-</span>
                        )}
                      </td>

                      {/* 배당락일 / 지급일 */}
                      <td className="py-3 px-3 text-center text-[10px] text-slate-500 dark:text-slate-400">
                        {item.exDividendDate ? (
                          <div>
                            <span className="block">락일: {item.exDividendDate}</span>
                            {item.payDate && <span className="block text-slate-400">지급: {item.payDate}</span>}
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </td>

                      {/* 공식 출처 */}
                      <td className="py-3 px-4 font-sans text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={item.source}>
                        {item.source}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Tax & Source Notice Disclaimer Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-sans">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>배당소득 원천징수세율 및 데이터 기준 안내</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
          <li>
            <strong>세율 적용:</strong> 국내 주식 배당 시 일반 배당소득세율 <strong>15.4%</strong>(배당소득세 14% + 지방소득세 1.4%)가 원천징수됩니다.
          </li>
          <li>
            <strong>미국 주식:</strong> 한미 조세조약에 따라 미국 현지에서 15%가 원천징수되며, 국내 추가 원천징수는 면제됩니다. (본 계산기는 15.4% 기준 보수적 계산)
          </li>
          <li>
            <strong>출처 기준:</strong> 한국 주식은 <strong>한국예탁결제원(SEIBro)</strong> 및 금융감독원 DART 공시, 미국 주식은 <strong>SEC Form 8-K/10-K</strong> 및 각 기업 공식 IR 데이터를 기반으로 연동됩니다.
          </li>
          <li>
            배당을 지급하지 않는 성장주(예: TSLA, AMZN 등) 및 가상자산은 자동으로 <strong>'배당 미지급'</strong>으로 분류하여 왜곡 없는 정확한 자산 분석을 제공합니다.
          </li>
        </ul>
      </div>
    </div>
  );
};
