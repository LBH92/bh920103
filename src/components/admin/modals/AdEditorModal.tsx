import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AdEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ad: any) => void;
  ad?: any;
}

export const AdEditorModal: React.FC<AdEditorModalProps> = ({ isOpen, onClose, onSave, ad }) => {
  const [formData, setFormData] = useState({
    name: '',
    advertiser: '',
    type: 'image',
    location: 'top_banner',
    imageUrl: '',
    url: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  useEffect(() => {
    if (ad) {
      setFormData(ad);
    } else {
      setFormData({
        name: '',
        advertiser: '',
        type: 'image',
        location: 'top_banner',
        imageUrl: '',
        url: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        isActive: true,
      });
    }
  }, [ad, isOpen]);

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{ad ? '광고 수정' : '광고 등록'}</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="광고명" className="w-full p-2 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="text" placeholder="광고주" className="w-full p-2 border rounded-lg" value={formData.advertiser} onChange={e => setFormData({...formData, advertiser: e.target.value})} required />
          <select className="w-full p-2 border rounded-lg" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value as any})}>
            <option value="top_banner">상단 배너 (권장: 1200x200px)</option>
            <option value="sidebar">사이드바 (권장: 300x600px)</option>
            <option value="content_card">콘텐츠 카드 (권장: 600x400px)</option>
          </select>
          <input type="text" placeholder="이미지 URL" className="w-full p-2 border rounded-lg" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          <input type="text" placeholder="클릭 URL" className="w-full p-2 border rounded-lg" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} required />
          <div className="flex gap-2">
            <input type="date" className="w-full p-2 border rounded-lg" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            <input type="date" className="w-full p-2 border rounded-lg" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-2 bg-rose-600 text-white rounded-lg font-bold" disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </form>
      </div>
    </div>
  );
};
