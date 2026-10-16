import React, { useState, useEffect } from 'react';
import { Megaphone, Save, Globe, AlertCircle, BarChart2 } from 'lucide-react';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebase';

interface AdConfig {
  active: boolean;
  text: string;
  link: string;
  contactEmail: string;
  contactPhone: string;
}

interface AdStats {
  impressions: number;
  clicks: number;
}

export const AdminAdsTab: React.FC = () => {
  const [config, setConfig] = useState<AdConfig>({ 
    active: false, 
    text: '광고 문의', 
    link: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [stats, setStats] = useState<Record<string, AdStats>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdData = async () => {
      try {
        const docRef = doc(db, 'systemConfig', 'ads');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as AdConfig);
        }

        const statsSnap = await getDocs(collection(db, 'adStats'));
        const statsData: Record<string, AdStats> = {};
        statsSnap.forEach((doc) => {
          statsData[doc.id] = doc.data() as AdStats;
        });
        setStats(statsData);
      } catch (e) {
        console.error('Error fetching ad data:', e);
      }
      setLoading(false);
    };
    fetchAdData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'systemConfig', 'ads'), config);
      alert('광고 설정이 성공적으로 저장되었습니다.');
    } catch (e) {
      console.error('Error saving ad config:', e);
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-sm text-slate-500">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#0d111a] rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-600 rounded-xl text-white">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">광고 배너 관리</h2>
          <p className="text-xs text-slate-500">홈 화면 및 주요 배너 영역에 표시될 광고 정보를 설정합니다.</p>
        </div>
      </div>

      <div className="grid gap-4">
        <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
          <input 
            type="checkbox" 
            checked={config.active} 
            onChange={e => setConfig({...config, active: e.target.checked})}
            className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <span className="font-bold text-slate-700 dark:text-slate-200">배너 활성화</span>
        </label>
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">배너 문구</label>
          <input 
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131722] focus:ring-2 focus:ring-rose-500/20" 
            value={config.text} 
            onChange={e => setConfig({...config, text: e.target.value})}
            placeholder="예: 여기는 귀하의 광고가 들어갈 자리입니다."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">클릭 시 이동 URL</label>
          <input 
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131722] focus:ring-2 focus:ring-rose-500/20" 
            value={config.link} 
            onChange={e => setConfig({...config, link: e.target.value})}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">문의 이메일</label>
            <input 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131722]" 
              value={config.contactEmail} 
              onChange={e => setConfig({...config, contactEmail: e.target.value})}
              placeholder="advertisement@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">문의 전화번호</label>
            <input 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131722]" 
              value={config.contactPhone} 
              onChange={e => setConfig({...config, contactPhone: e.target.value})}
              placeholder="010-0000-0000"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        <Save className="w-4 h-4" /> {saving ? '저장 중...' : '설정 저장하기'}
      </button>

      {/* Analytics Dashboard */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-rose-500" />
          <h3 className="text-md font-black text-slate-900 dark:text-white">광고 성과 통계</h3>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500">
              <tr>
                <th className="p-3">배너 ID</th>
                <th className="p-3 text-center">노출 수</th>
                <th className="p-3 text-center">클릭 수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {Object.entries(stats).length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-400">데이터가 없습니다.</td>
                </tr>
              ) : (
                Object.entries(stats).map(([id, s]) => (
                  <tr key={id}>
                    <td className="p-3 font-mono">{id}</td>
                    <td className="p-3 text-center font-bold">{s.impressions || 0}</td>
                    <td className="p-3 text-center font-bold text-rose-500">{s.clicks || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 text-[11px]">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p>배너 활성화 시 모든 광고 영역에 해당 내용이 반영됩니다. 문의처 정보를 정확히 입력해 주세요.</p>
      </div>
    </div>
  );
};
