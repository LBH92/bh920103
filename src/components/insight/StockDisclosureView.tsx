import React, { useState } from 'react';
import { DisclosureAnalyzer } from './DisclosureAnalyzer';
import { useApp } from '../../context/AppContext';

export const StockDisclosureView: React.FC = () => {
  const [symbol, setSymbol] = useState('005930');
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">공시·종목 위험 분석</h2>
      <input 
        type="text" 
        value={symbol} 
        onChange={(e) => setSymbol(e.target.value)} 
        className="border p-2 mb-4 w-full"
        placeholder="종목 코드를 입력하세요 (예: 005930)"
      />
      <DisclosureAnalyzer symbol={symbol} />
    </div>
  );
};
