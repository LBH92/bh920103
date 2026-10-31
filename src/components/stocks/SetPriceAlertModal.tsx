import React, { useState, useEffect } from 'react';
import { Bell, X, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SetPriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  symbolName: string;
  currentPrice: number;
}

export const SetPriceAlertModal: React.FC<SetPriceAlertModalProps> = ({
  isOpen,
  onClose,
  symbol,
  symbolName,
  currentPrice,
}) => {
  const { addPriceAlert, requireAuth, firebaseUser } = useApp();
  const [targetPrice, setTargetPrice] = useState<number>(currentPrice);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTargetPrice(currentPrice);
      setCondition('above');
      setNote('');
    }
  }, [isOpen, currentPrice]);

  if (!isOpen) return null;

  const handleQuickPercent = (pct: number) => {
    const calculated = Math.round(currentPrice * (1 + pct / 100));
    setTargetPrice(calculated);
    setCondition(pct >= 0 ? 'above' : 'below');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth('가격 알림 설정')) return;
    if (!targetPrice || targetPrice <= 0) return;

    setIsSubmitting(true);
    try {
      await addPriceAlert({
        symbol,
        symbolName,
        targetPrice,
        condition,
        note: note.trim() || undefined,
      });
      onClose();
    } catch {
      // Error toast is handled inside addPriceAlert
    } finally {
      setIsSubmitting(false);
    }
  };

  const diffPercent = currentPrice > 0 ? ((targetPrice - currentPrice) / currentPrice) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Bell className="w-4 h-4" />
            </span>
            목표가 알림 설정
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 대상 종목 & 현재가 정보 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">대상 종목</span>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {symbolName} <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-normal">({symbol})</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400">현재가</span>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                  {currentPrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* 알림 도달 조건 (이상 vs 이하) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              도달 조건
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  condition === 'above' 
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>상승 돌파 (이상)</span>
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  condition === 'below' 
                    ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>하락 도달 (이하)</span>
              </button>
            </div>
          </div>

          {/* 목표가 입력 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                목표 가격 (원)
              </label>
              {diffPercent !== 0 && (
                <span className={`text-[11px] font-bold font-mono ${diffPercent > 0 ? 'text-rose-500' : 'text-blue-500'}`}>
                  {diffPercent > 0 ? `+${diffPercent.toFixed(1)}%` : `${diffPercent.toFixed(1)}%`}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                min={1}
                step={1}
                value={targetPrice || ''}
                onChange={(e) => setTargetPrice(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                placeholder="목표 가격을 입력하세요"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                원
              </span>
            </div>
          </div>

          {/* 퀵 비율 설정 버튼 */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">현재가 대비 빠른 설정</span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickPercent(3)}
                className="py-1 px-2 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors"
              >
                +3%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercent(5)}
                className="py-1 px-2 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors"
              >
                +5%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercent(-3)}
                className="py-1 px-2 rounded-lg text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-colors"
              >
                -3%
              </button>
              <button
                type="button"
                onClick={() => handleQuickPercent(-5)}
                className="py-1 px-2 rounded-lg text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-colors"
              >
                -5%
              </button>
            </div>
          </div>

          {/* 메모 (선택사항) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              메모 <span className="text-[10px] text-slate-400 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              maxLength={40}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 1차 익절 라인, 손절 기준가"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting || targetPrice <= 0}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Firestore 저장 중...' : '목표가 알림 등록'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              실시간 시세가 목표 가격에 도달하면 즉시 화면 상단 토스트 알림이 발생합니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
