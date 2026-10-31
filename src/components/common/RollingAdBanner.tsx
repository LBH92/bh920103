import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { firebaseRepository } from '../../services/firebaseRepository';
import { adService } from '../../services/adService';
interface Advertisement {
  id: string;
  name: string;
  imageUrl?: string;
  url: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export const RollingAdBanner: React.FC<{ location: string }> = ({ location }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      const q = query(collection(db, 'advertisements'), where('isActive', '==', true), where('location', '==', location));
      const snapshot = await getDocs(q);
      const today = new Date().toISOString().split('T')[0];
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Advertisement))
        .filter(ad => ad.startDate <= today && ad.endDate >= today);
      setAds(data);
    };
    fetchAds();
  }, [location]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads]);

  const ad = ads[currentIndex];

  useEffect(() => {
    if (ad) {
      adService.logImpression(ad.id);
    }
  }, [ad]);

  if (ads.length === 0) return null;

  return (
    <a 
      href={ad.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={() => adService.logClick(ad.id)}
      className="block my-4 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center overflow-hidden"
    >
      {ad.imageUrl ? (
        <img 
          src={ad.imageUrl} 
          alt={ad.name} 
          className="w-full h-auto rounded-lg" 
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <div className="w-full h-20 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-400">이미지 없음</div>
      )}
      <p className="text-sm font-bold p-2">{ad.name}</p>
    </a>
  );
};
