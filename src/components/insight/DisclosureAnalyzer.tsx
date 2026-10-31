import React, { useState, useEffect } from 'react';
import { disclosureService } from '../../services/disclosureService';
import { DisclosureEvent } from '../../types';

export const DisclosureAnalyzer: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [disclosures, setDisclosures] = useState<DisclosureEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await disclosureService.getDisclosures(symbol);
      setDisclosures(data);
      setLoading(false);
    };
    fetchData();
  }, [symbol]);

  const summarize = async (index: number) => {
    const d = disclosures[index];
    if (d.summary) return;
    const summary = await disclosureService.summarize(d.title, d.link);
    setDisclosures(prev => prev.map((item, i) => i === index ? { ...item, summary } : item));
  };

  if (loading) return <div>공시 정보 로딩 중...</div>;

  return (
    <div className="p-4 bg-white rounded shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">{symbol} 공시 및 위험 분석</h2>
      <div className="space-y-4">
        {disclosures.map((d, i) => (
          <div key={d.id} className="border p-3 rounded">
            <div className="flex justify-between">
              <span className={`font-bold ${d.riskLevel === 'high' ? 'text-red-500' : 'text-slate-700'}`}>
                [{d.type}] {d.title}
              </span>
              <span>{d.date}</span>
            </div>
            <button onClick={() => summarize(i)} className="text-blue-500 text-sm mt-2">AI 요약 보기</button>
            {d.summary && <p className="text-sm mt-2 bg-slate-100 p-2">{d.summary}</p>}
            <a href={d.link} target="_blank" rel="noreferrer" className="text-xs text-slate-400 block mt-2">원문 보기</a>
          </div>
        ))}
      </div>
    </div>
  );
};
