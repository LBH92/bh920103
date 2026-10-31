import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight, Megaphone } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useApp } from '../../../context/AppContext';
import { AdEditorModal } from '../modals/AdEditorModal';

interface Advertisement {
  id: string;
  name: string;
  advertiser: string;
  type: 'image' | 'text';
  location: 'top_banner' | 'sidebar' | 'content_card';
  imageUrl?: string;
  url: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const AdminAdsTab: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const { showToast } = useApp();

  const fetchAds = async () => {
    try {
      const q = query(collection(db, 'advertisements'), orderBy('startDate', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement));
      setAds(data);
    } catch (e) {
      console.error(e);
      showToast('광고 목록을 불러오는데 실패했습니다.', 'error');
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleSave = async (adData: any) => {
    try {
      const { id, ...dataToSave } = adData;
      if (editingAd) {
        await updateDoc(doc(db, 'advertisements', editingAd.id), dataToSave);
        showToast('광고가 수정되었습니다.', 'success');
      } else {
        await addDoc(collection(db, 'advertisements'), dataToSave);
        showToast('광고가 등록되었습니다.', 'success');
      }
      fetchAds();
      setEditingAd(null);
    } catch (e) {
      showToast('저장에 실패했습니다.', 'error');
      throw e;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'advertisements', id));
      fetchAds();
      showToast('광고가 삭제되었습니다.', 'success');
    } catch (e) {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const toggleActive = async (ad: Advertisement) => {
    try {
      await updateDoc(doc(db, 'advertisements', ad.id), { isActive: !ad.isActive });
      fetchAds();
      showToast('광고 상태가 변경되었습니다.', 'success');
    } catch (e) {
      showToast('상태 변경에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> 광고 관리
        </h2>
        <button 
          onClick={() => { setEditingAd(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-600/20 hover:bg-rose-700"
        >
          <Plus className="w-4 h-4" /> 광고 등록
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">광고명</th>
              <th className="px-6 py-4">광고주</th>
              <th className="px-6 py-4">위치</th>
              <th className="px-6 py-4">기간</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {ads.map(ad => (
              <tr key={ad.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{ad.name}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ad.advertiser}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ad.location}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ad.startDate} ~ {ad.endDate}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActive(ad)}>
                    {ad.isActive ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                  </button>
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button 
                    onClick={() => { setEditingAd(ad); setIsModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-indigo-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(ad.id)}
                    className="p-2 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdEditorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        ad={editingAd} 
      />
    </div>
  );
};

