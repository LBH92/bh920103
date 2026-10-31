import { useState, useEffect } from 'react';
import { WatchlistBuyEntry } from '../types';
import { firebaseRepository } from '../services/firebaseRepository';

export const useStockPurchases = (uid?: string) => {
  const [purchases, setPurchases] = useState<Record<string, WatchlistBuyEntry[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uid) {
      setLoading(true);
      firebaseRepository.getUserStockPurchases(uid).then(data => {
        setPurchases(data);
        setLoading(false);
      });
    }
  }, [uid]);

  const savePurchases = async (symbol: string, entries: WatchlistBuyEntry[]) => {
    if (uid) {
      await firebaseRepository.saveUserStockPurchases(uid, symbol, entries);
      setPurchases(prev => ({ ...prev, [symbol]: entries }));
    }
  };

  return { purchases, savePurchases, loading };
};
