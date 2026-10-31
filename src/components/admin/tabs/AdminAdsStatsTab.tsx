import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { BarChart3, TrendingUp, MousePointerClick, Eye } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface AdStats {
  impressions: number;
  clicks: number;
}

export const AdminAdsStatsTab: React.FC = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, AdStats>>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adsSnap = await getDocs(collection(db, 'advertisements'));
        const adsData = adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsData);

        const statsSnap = await getDocs(collection(db, 'adStats'));
        const statsData: Record<string, AdStats> = {};
        
        statsSnap.docs.forEach(doc => {
          const { adId, type } = doc.data();
          if (!statsData[adId]) statsData[adId] = { impressions: 0, clicks: 0 };
          if (type === 'impression') statsData[adId].impressions++;
          if (type === 'click') statsData[adId].clicks++;
        });
        setStats(statsData);
      } catch (e) {
        console.error(e);
        showToast('통계 데이터를 불러오는데 실패했습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const processedAds = useMemo(() => {
    return ads.map(ad => {
      const adStats = stats[ad.id] || { impressions: 0, clicks: 0 };
      const ctr = adStats.impressions > 0 ? (adStats.clicks / adStats.impressions) * 100 : 0;
      return {
        ...ad,
        ...adStats,
        ctr: ctr.toFixed(2)
      };
    });
  }, [ads, stats]);

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <BarChart3 className="w-5 h-5" /> 광고 성과 통계
      </h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">광고명</th>
              <th className="px-6 py-4"><Eye className="w-4 h-4 inline mr-1"/>노출</th>
              <th className="px-6 py-4"><MousePointerClick className="w-4 h-4 inline mr-1"/>클릭</th>
              <th className="px-6 py-4"><TrendingUp className="w-4 h-4 inline mr-1"/>CTR (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {processedAds.map(ad => (
              <tr key={ad.id}>
                <td className="px-6 py-4 font-bold">{ad.name}</td>
                <td className="px-6 py-4">{ad.impressions}</td>
                <td className="px-6 py-4">{ad.clicks}</td>
                <td className="px-6 py-4 font-mono">{ad.ctr}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
