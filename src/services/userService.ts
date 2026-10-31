import { db } from './firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { BADGES } from './badgeService';

export const userService = {
  /**
   * Safely updates user profile fields related to milestones.
   * This is intended to be called from backend functions or secure contexts.
   */
  async updateMilestoneProgress(
    uid: string,
    updates: {
      level?: number;
      badges?: string[];
      activeTitle?: string;
    }
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const updateData: any = { updatedAt: new Date().toISOString() };
      if (updates.level !== undefined) updateData.level = updates.level;
      if (updates.badges !== undefined) updateData.badges = updates.badges;
      if (updates.activeTitle !== undefined) updateData.title = updates.activeTitle;

      await updateDoc(userRef, updateData);
    } catch (err) {
      console.error('[userService] Error updating milestone:', err);
      throw err;
    }
  },

  /**
   * Checks user activity counts and awards badges automatically if milestones are reached.
   */
  async checkAndAwardBadges(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return;
      const data = userSnap.data();
      
      const postCount = data.postCount || 0;
      const badges = data.badges || [];
      const newBadges = [...badges];
      let changed = false;

      // Logic: Post 10 = Newbie escape
      if (postCount >= 10 && !newBadges.includes(BADGES.NEWBIE_ESCAPE.id)) {
        newBadges.push(BADGES.NEWBIE_ESCAPE.id);
        changed = true;
      }

      if (changed) {
        await updateDoc(userRef, { badges: newBadges, updatedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.error('[userService] Error checking/awarding badges:', err);
      throw err;
    }
  },
};
