import { db } from '../src/services/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { BADGES, LEVELS } from '../src/services/badgeService';
import { UserProfile } from '../src/types';
import { userService } from '../src/services/userService';

export const verifyAndAward = async (uid: string, activityType: 'post' | 'comment') => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const currentLevel = data.level || 1;
    const currentBadges = data.badges || [];
    
    // Increment counts
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };
    
    if (activityType === 'post') {
      updateData.postCount = increment(1);
    } else if (activityType === 'comment') {
      updateData.commentCount = increment(1);
    }

    // Logic: Post 10 = Newbie escape
    if (activityType === 'post' && (data.postCount || 0) + 1 >= 10 && !currentBadges.includes(BADGES.NEWBIE_ESCAPE.id)) {
        updateData.badges = [...(updateData.badges || currentBadges), BADGES.NEWBIE_ESCAPE.id];
        updateData.activeTitle = BADGES.NEWBIE_ESCAPE.name;
    }

    // Logic: Level up based on total activity
    const newTotalActivity = (data.postCount || 0) + (data.commentCount || 0) + 1;
    const newLevel = Math.floor(newTotalActivity / 5) + 1;
    if (newLevel > currentLevel) {
        updateData.level = newLevel;
        // Check for level-based title updates if needed
    }

    await userService.updateMilestoneProgress(uid, updateData);
  } catch (err) {
    console.error('[Server] Activity verification failed:', err);
  }
};
