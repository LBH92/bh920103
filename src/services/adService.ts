import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Advertisement } from '../types';

const COLLECTION_NAME = 'advertisements';
const STATS_COLLECTION = 'adStats';

// Helper to get current date in KST (YYYY-MM-DD)
const getKSTDate = (): string => {
    const now = new Date();
    // UTC to KST (UTC + 9)
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + kstOffset);
    return kstTime.toISOString().split('T')[0];
};

export const adService = {
  async getAds(): Promise<Advertisement[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('priority', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement));
    } catch (err) {
      console.error('Error getting ads:', err);
      return [];
    }
  },

  /**
   * Returns active ads for a specific location, filtered by KST date range and priority.
   */
  async getActiveAds(location: Advertisement['location']): Promise<Advertisement[]> {
    const ads = await this.getAds();
    const today = getKSTDate();
    
    return ads.filter(ad =>
        ad.isActive &&
        ad.location === location &&
        today >= ad.startDate &&
        today <= ad.endDate
    ).sort((a, b) => b.priority - a.priority);
  },

  async addAd(ad: Omit<Advertisement, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...ad,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding ad:', err);
      throw err;
    }
  },

  async updateAd(id: string, ad: Partial<Advertisement>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), ad as any);
    } catch (err) {
      console.error('Error updating ad:', err);
      throw err;
    }
  },

  async deleteAd(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (err) {
      console.error('Error deleting ad:', err);
      throw err;
    }
  },

  // Logging
  async logImpression(adId: string): Promise<void> {
    try {
        await addDoc(collection(db, STATS_COLLECTION), {
            adId,
            type: 'impression',
            timestamp: serverTimestamp()
        });
    } catch (err) {
        console.error('Error logging impression:', err);
    }
  },

  async logClick(adId: string): Promise<void> {
    try {
        await addDoc(collection(db, STATS_COLLECTION), {
            adId,
            type: 'click',
            timestamp: serverTimestamp()
        });
    } catch (err) {
        console.error('Error logging click:', err);
    }
  }
};
