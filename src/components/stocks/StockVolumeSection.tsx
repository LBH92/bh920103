import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart3, Users, DollarSign, Zap } from 'lucide-react';
import { Stock } from '../../types';
import { VolumeAnalysisData, stockRepository } from '../../services/stockRepository';
import { isVolumeSurge } from '../../utils/marketThresholds';

interface StockVolumeSectionProps {
  stock: Stock;
}

export const StockVolumeSection: React.FC<StockVolumeSectionProps> = ({ stock }) => {
  const [data, setData] = useState<VolumeAnalysisData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'amount' | 'quantity'>('amount');

  useEffect(() => {
    let isSubscribed = true;
    stockRepository.getVolumeAnalysis(stock.symbol).then(res => {
      if (isSubscribed) {
        if (res) setData(res);
        else setError(true);
      }
    }).catch(() => {
      if (isSubscribed) setError(true);
    });
    return () => {
      isSubscribed = false;
    };
  }, [stock.symbol]);

  if (error) {
    return <div className="p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 text-slate-500 text-xs text-center">수급 분석 데이터를 불러올 수 없습니다.</div>;
  }

  if (!data) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 animate-pulse h-48" />
    );
  }

  const isSurge = isVolumeSurge(data.volumeRatio);
  const hasAmountData = data.foreignNetBuy !== null && data.instNetBuy !== null;
  const hasQtyData = (data.foreignNetBuyQty ?? null) !== null && (data.instNetBuyQty ?? null) !== null;
  const canShowInvestor = Boolean(data.investorDataAvailable && (hasAmountData || hasQtyData));
  const activeMode: 'amount' | 'quantity' =
    displayMode === 'quantity' && hasQtyData
      ? 'quantity'
      : hasAmountData
      ? 'amount'
      : 'quantity';

  const foreignValue = activeMode === 'quantity' ? (data.foreignNetBuyQty ?? null) : data.foreignNetBuy;
  const instValue = activeMode === 'quantity' ? (data.instNetBuyQty ?? null) : data.instNetBuy;
  const individualValue = activeMode === 'quantity' ? (data.individualNetBuyQty ?? null) : data.individualNetBuy;
  const activeUnitLabel = activeMode === 'quantity' ? (data.investorQtyUnit || '주') : '억 원';
  const activeShortUnit = activeMode === 'quantity' ? (data.investorQtyUnit || '주') : '억';

  const formatSignedInvestorValue = (val: number | null | undefined) => {
    if (val === null || val === undefined || !Number.isFinite(val)) {
      return { text: '데이터 없음', colorClass: 'text-slate-400' };
    }
    if (val === 0) {
      return { text: `0${activeShortUnit}`, colorClass: 'text-slate-500 dark:text-slate-300' };
    }
    return {
      text: `${val > 0 ? '+' : ''}${val.toLocaleString()}${activeShortUnit}`,
      colorClass: val > 0 ? 'text-rose-500' : 'text-blue-500',
    };
  };

  const foreignFormatted = formatSignedInvestorValue(foreignValue);
  const instFormatted = formatSignedInvestorValue(instValue);
  const individualFormatted = formatSignedInvestorValue(individualValue);
  const individualLabel = data.isDirectInvestorIndividual === false ? '개인 (역산)' : '개인';

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              거래량 및 수급 분석 정보
            </h3>
            <p className="text-xs text-slate-400">
              당일 거래량 대비 이평선 배율, 거래대금, 외인·기관 투자자별 매매동향
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSurge ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              <span>거래량 급증 (200% 이상: {data.volumeRatio}%)</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              거래량 정상 (평균 대비 {data.volumeRatio}%)
            </span>
          )}
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-sans text-[11px] block mb-1">당일 누적 거래량</span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {data.volume.toLocaleString()} <span className="text-xs font-sans text-slate-400">주</span>
          </span>
          <span className="text-[11px] text-slate-400 font-sans block mt-1">
            20일 평균: {data.avgVolume20d.toLocaleString()}주
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-sans text-[11px] block mb-1">당일 거래대금</span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {data.tradingValue >= 10000 
              ? `${(data.tradingValue / 10000).toFixed(1)}조 원`
              : `${data.tradingValue.toLocaleString()}억 원`}
          </span>
          <span className="text-[11px] text-slate-400 font-sans block mt-1">
            시가총액 대비: {((data.tradingValue / (stock.marketCap || 1)) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-sans text-[11px] block mb-1">체결강도 (Execution)</span>
          <span className={`text-base font-black ${data.executionStrength >= 100 ? 'text-rose-500' : 'text-blue-500'}`}>
            {data.executionStrength}%
          </span>
          <span className="text-[11px] text-slate-400 font-sans block mt-1">
            {data.executionStrength >= 100 ? '매수 체결 우세' : '매도 체결 우세'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-sans text-[11px] block mb-1">주식 회전율 (Turnover)</span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {data.turnoverRatio}%
          </span>
          <span className="text-[11px] text-slate-400 font-sans block mt-1">
            5일 평균: {data.avgVolume5d.toLocaleString()}주
          </span>
        </div>
      </div>

      {/* Investor Trading Trends (외인/기관/개인 수급) */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            투자자별 당일 순매수 현황 <span className="text-[10px] text-slate-400 font-normal">({data.investorDataSource || '수급 데이터 미수신'})</span>
          </span>
          <div className="flex items-center gap-2">
            {canShowInvestor && hasAmountData && hasQtyData && (
              <div className="inline-flex rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setDisplayMode('amount')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${activeMode === 'amount' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  금액(억 원)
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('quantity')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${activeMode === 'quantity' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  수량(주)
                </button>
              </div>
            )}
            <span className="text-slate-400 text-[11px] font-mono">단위: {activeUnitLabel}</span>
          </div>
        </div>

        {canShowInvestor ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <span className="font-sans font-medium text-slate-500">외국인</span>
                <span className={`font-bold ${foreignFormatted.colorClass}`}>
                  {foreignFormatted.text}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <span className="font-sans font-medium text-slate-500">기관계</span>
                <span className={`font-bold ${instFormatted.colorClass}`}>
                  {instFormatted.text}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <span className="font-sans font-medium text-slate-500">{individualLabel}</span>
                <span className={`font-bold ${individualFormatted.colorClass}`}>
                  {individualFormatted.text}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
              <span>출처: {data.investorDataSource || '공식 API'} {data.investorBaseDate ? `(기준일: ${data.investorBaseDate})` : ''}</span>
              <span>갱신: {data.investorUpdateTime || '미확인'}</span>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              데이터 없음 <span className="text-[10px] font-normal text-slate-400">({data.investorDataSource || '수급 데이터 미수신'})</span>
            </p>
            <p className="text-[10px] text-slate-400">
              {stock.market === 'US'
                ? '미국 주식 시장은 국내 기관·외국인 수급 집계 대상이 아닙니다.'
                : stock.market === 'COIN'
                ? '가상자산 마켓은 국내 기관·외국인 수급 집계 대상이 아닙니다.'
                : '거래소 공식 수급 데이터가 수신되지 않았거나 장외/미연결 상태입니다. (임의 추정치는 표시되지 않습니다)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
