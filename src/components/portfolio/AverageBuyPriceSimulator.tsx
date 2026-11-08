import React, { useState } from 'react';
import { Calculator, ArrowDownRight, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { useApp } from '../../context/AppContext';

interface Props {
  uid?: string;
  holdingId?: string;
  symbol: string;
  name?: string;
  currency?: 'KRW' | 'USD';
  currentQty: number;
  currentAvgPrice: number;
  currentPrice?: number;
  commissionRate?: number;
  taxRate?: number;
  onBuySuccess?: () => void;
  onClose?: () => void;
}

export const AverageBuyPriceSimulator: React.FC<Props> = ({
  uid,
  holdingId,
  symbol,
  name,
  currency = 'KRW',
  currentQty,
  currentAvgPrice,
  currentPrice,
  commissionRate = 0.00015, // 0.015%
  taxRate = 0.0018, // 0.18%
  onBuySuccess,
  onClose,
}) => {
  const { showToast } = useApp();

  const isUSD = currency === 'USD';
  const defaultPrice = currentPrice && currentPrice > 0 ? currentPrice : currentAvgPrice;

  const [addQty, setAddQty] = useState<string>('10');
  const [addPrice, setAddPrice] = useState<string>(defaultPrice.toString());
  const [targetROI, setTargetROI] = useState<string>('10');
  const [memo, setMemo] = useState<string>('분할 매수 (물타기)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const numAddQty = Math.max(0, parseFloat(addQty) || 0);
  const numAddPrice = Math.max(0, parseFloat(addPrice) || 0);
  const numTargetROI = parseFloat(targetROI) || 0;

  // 1. Calculations
  const totalQty = currentQty + numAddQty;
  const prevTotalCost = currentQty * currentAvgPrice;
  const addTotalCost = numAddQty * numAddPrice;
  const newTotalAmount = prevTotalCost + addTotalCost;
  const newAvgPrice = totalQty > 0 ? newTotalAmount / totalQty : currentAvgPrice;

  // Price change vs current average price
  const avgPriceDiff = newAvgPrice - currentAvgPrice;
  const avgPriceDiffPercent = currentAvgPrice > 0 ? (avgPriceDiff / currentAvgPrice) * 100 : 0;

  // Estimated fees
  const addCommission = addTotalCost * commissionRate;

  // Break-even price considering roundtrip commission + tax
  // sellValue * (1 - commissionRate - taxRate) = totalBuyCost * (1 + commissionRate)
  const breakEvenPrice = totalQty > 0
    ? (newAvgPrice * (1 + commissionRate)) / Math.max(0.001, (1 - commissionRate - taxRate))
    : newAvgPrice;

  // Target price based on target ROI
  const targetPrice = newAvgPrice * (1 + (numTargetROI / 100));
  const expectedGrossProfit = (targetPrice * totalQty) - newTotalAmount;
  const estimatedSellFeeAndTax = (targetPrice * totalQty) * (commissionRate + taxRate);
  const expectedNetProfit = expectedGrossProfit - (newTotalAmount * commissionRate) - estimatedSellFeeAndTax;

  // 2. Execute Real Addition / Water-Down Buy
  const handleExecuteBuy = async () => {
    if (numAddQty <= 0) {
      setErrorMsg('추가 매수 수량은 1 이상이어야 합니다.');
      return;
    }
    if (numAddPrice <= 0) {
      setErrorMsg('추가 매수 가격을 0보다 크게 입력해주세요.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      let targetHoldingId = holdingId;

      // If holdingId not passed, resolve from existing holdings by symbol
      if (!targetHoldingId) {
        const holdings = await portfolioService.getVirtualHoldings(uid);
        const match = holdings.find(h => h.symbol === symbol);
        if (match) {
          targetHoldingId = match.id;
        } else {
          // If no existing holding, register as new holding
          const created = await portfolioService.saveVirtualHolding(uid, {
            symbol,
            name: name || symbol,
            market: isUSD ? 'US' : 'KOSPI',
            currency,
            quantity: numAddQty,
            avgBuyPrice: numAddPrice,
            buyDate: new Date().toISOString().slice(0, 10),
            memo: memo || '최초 매수',
          });
          targetHoldingId = created.id;
        }
      }

      if (targetHoldingId && holdingId) {
        // Execute addBuyVirtualHolding with weighted average price calculation
        await portfolioService.addBuyVirtualHolding(
          uid,
          targetHoldingId,
          numAddQty,
          numAddPrice,
          new Date().toISOString().slice(0, 10),
          memo || `물타기 추가매수 (${numAddQty}주 @ ${numAddPrice.toLocaleString()}${isUSD ? '$' : '원'})`
        );
      }

      showToast(`${name || symbol} ${numAddQty.toLocaleString()}주 물타기(추가 매수)가 반영되었습니다.`, 'success');
      onBuySuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error('[AverageBuyPriceSimulator] Execute buy failed:', err);
      setErrorMsg(err?.message || '추가 매수 처리에 실패했습니다. 다시 시도해주세요.');
      showToast('추가 매수 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMoney = (val: number) => {
    if (isUSD) {
      return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${Math.round(val).toLocaleString()}원`;
  };

  return (
    <div className="p-5 bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{name || symbol}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                {symbol}
              </span>
              <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                물타기 평단가 계산기
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              현재 보유: {currentQty.toLocaleString()}주 · 평균단가 {formatMoney(currentAvgPrice)}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            닫기 ✕
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            추가 매수 수량 (주)
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={addQty}
              onChange={(e) => setAddQty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="예: 10"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">주</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            추가 매수 단가 ({isUSD ? 'USD $' : '원'})
          </label>
          <div className="relative">
            <input
              type="number"
              step={isUSD ? '0.01' : '1'}
              min="0"
              value={addPrice}
              onChange={(e) => setAddPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder={isUSD ? '예: 150.00' : '예: 70000'}
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
              {isUSD ? '$' : '원'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            목표 수익률 (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              value={targetROI}
              onChange={(e) => setTargetROI(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="예: 10"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">%</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          매매 메모 / 사유
        </label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="예: 지지선 도달 분할 매수"
        />
      </div>

      {/* Recalculated Results Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>물타기 후 예상 포트폴리오 변화</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            가중평균 공식: ((기존금액 + 추가금액) / 총수량)
          </span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* 1. New Average Price */}
          <div className="p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              새로운 평균 매입단가
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
              {formatMoney(newAvgPrice)}
            </span>
            <span className={`text-[10px] font-mono flex items-center gap-0.5 mt-0.5 ${
              avgPriceDiff < 0 ? 'text-blue-500' : avgPriceDiff > 0 ? 'text-rose-500' : 'text-slate-400'
            }`}>
              {avgPriceDiff < 0 ? (
                <>
                  <ArrowDownRight className="w-3 h-3" />
                  <span>단가 {formatMoney(Math.abs(avgPriceDiff))} 인하 ({avgPriceDiffPercent.toFixed(2)}%)</span>
                </>
              ) : avgPriceDiff > 0 ? (
                <>
                  <ArrowUpRight className="w-3 h-3" />
                  <span>단가 {formatMoney(avgPriceDiff)} 상승 (+{avgPriceDiffPercent.toFixed(2)}%)</span>
                </>
              ) : (
                <span>변동 없음</span>
              )}
            </span>
          </div>

          {/* 2. Total Quantity */}
          <div className="p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              합산 총 보유 수량
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white block">
              {totalQty.toLocaleString()}주
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              기존 {currentQty}주 + 추가 {numAddQty}주
            </span>
          </div>

          {/* 3. Break-Even Price */}
          <div className="p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              손익분기점 (수수료·세금 포함)
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white block">
              {formatMoney(breakEvenPrice)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              수수료 {(commissionRate * 100).toFixed(3)}% · 세금 {(taxRate * 100).toFixed(2)}%
            </span>
          </div>

          {/* 4. Target Return & Net Profit */}
          <div className="p-3 rounded-lg bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
              목표({numTargetROI}%) 순익
            </span>
            <span className={`text-sm sm:text-base font-bold font-mono block ${
              expectedNetProfit >= 0 ? 'text-rose-500' : 'text-blue-500'
            }`}>
              {expectedNetProfit >= 0 ? '+' : ''}{formatMoney(expectedNetProfit)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              목표가 {formatMoney(targetPrice)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80">
          <span>이번 추가 매수 필요 금액: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatMoney(addTotalCost)}</strong></span>
          <span>예상 수수료: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatMoney(addCommission)}</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
          >
            취소
          </button>
        )}

        <button
          type="button"
          disabled={isSubmitting || numAddQty <= 0 || numAddPrice <= 0}
          onClick={handleExecuteBuy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>물타기 자산 반영 중...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>물타기(추가 매수) 실행 및 자산 반영</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
