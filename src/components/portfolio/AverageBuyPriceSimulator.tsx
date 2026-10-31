import React, { useState } from 'react';

interface SimulatorResult {
  newAvgPrice: number;
  totalQuantity: number;
  totalAmount: number;
  breakEvenPrice: number;
  expectedProfit: number;
  expectedROI: number;
}

export const AverageBuyPriceSimulator: React.FC<{
  symbol: string;
  currentQty: number;
  currentAvgPrice: number;
  commissionRate: number;
  taxRate: number;
}> = ({ symbol, currentQty, currentAvgPrice, commissionRate, taxRate }) => {
  const [addQty, setAddQty] = useState<string>('0');
  const [addPrice, setAddPrice] = useState<string>('0');
  const [targetROI, setTargetROI] = useState<string>('10');
  const [result, setResult] = useState<SimulatorResult | null>(null);

  const calculate = () => {
    const q = parseFloat(addQty);
    const p = parseFloat(addPrice);
    const roi = parseFloat(targetROI);

    const totalQty = currentQty + q;
    const totalBuyAmount = (currentQty * currentAvgPrice) + (q * p);
    const newAvgPrice = totalQty > 0 ? totalBuyAmount / totalQty : 0;
    
    // Break-even considering commission on buy and sell, and tax on sell
    // Simplified simulation calculation
    const breakEvenPrice = newAvgPrice * (1 + commissionRate + commissionRate + taxRate);
    
    const targetPrice = newAvgPrice * (1 + (roi / 100));
    const expectedProfit = (targetPrice * totalQty) - totalBuyAmount;

    setResult({
      newAvgPrice,
      totalQuantity: totalQty,
      totalAmount: totalBuyAmount,
      breakEvenPrice,
      expectedProfit,
      expectedROI: roi,
    });
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-lg font-bold mb-4">{symbol} 추가 매수 시뮬레이터</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">추가 수량</label>
          <input type="number" value={addQty} onChange={(e) => setAddQty(e.target.value)} className="w-full border p-1" />
        </div>
        <div>
          <label className="block text-sm">추가 가격</label>
          <input type="number" value={addPrice} onChange={(e) => setAddPrice(e.target.value)} className="w-full border p-1" />
        </div>
        <div>
          <label className="block text-sm">목표 수익률 (%)</label>
          <input type="number" value={targetROI} onChange={(e) => setTargetROI(e.target.value)} className="w-full border p-1" />
        </div>
      </div>
      <button onClick={calculate} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm">계산하기</button>
      
      {result && (
        <div className="mt-4 p-2 bg-gray-50 text-sm">
          <p>새 평균단가: {result.newAvgPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p>총 수량: {result.totalQuantity}</p>
          <p>손익분기점: {result.breakEvenPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p>목표 수익({result.expectedROI}%): {result.expectedProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      )}
    </div>
  );
};
