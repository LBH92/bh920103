import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from './firebaseAdmin';
import { BADGES } from '../src/services/badgeService';

export interface ActivityAwardResult {
  awarded: boolean;
  reason?: string;
}

export const verifyAndAward = async (
  uid: string,
  activityType: 'post' | 'comment'
): Promise<ActivityAwardResult> => {
  if (!uid || (activityType !== 'post' && activityType !== 'comment')) {
    return { awarded: false, reason: 'invalid_parameters' };
  }

  try {
    const userRef = adminDb.collection('users').doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      return { awarded: false, reason: 'user_not_found' };
    }

    const data = snap.data() || {};
    const currentLevel = Number(data.level) || 1;
    const currentBadges: string[] = Array.isArray(data.badges) ? [...data.badges] : [];
    const currentPostCount = Number(data.postCount) || 0;
    const currentCommentCount = Number(data.commentCount) || 0;

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (activityType === 'post') {
      updateData.postCount = FieldValue.increment(1);
    } else {
      updateData.commentCount = FieldValue.increment(1);
    }

    // Logic: Post 10 = Newbie escape
    if (
      activityType === 'post' &&
      currentPostCount + 1 >= 10 &&
      !currentBadges.includes(BADGES.NEWBIE_ESCAPE.id)
    ) {
      updateData.badges = Array.from(new Set([...currentBadges, BADGES.NEWBIE_ESCAPE.id]));
      updateData.activeTitle = BADGES.NEWBIE_ESCAPE.name;
      updateData.title = BADGES.NEWBIE_ESCAPE.name;
    }

    // Logic: Level up based on total activity
    const newTotalActivity = currentPostCount + currentCommentCount + 1;
    const newLevel = Math.floor(newTotalActivity / 5) + 1;
    if (newLevel > currentLevel) {
      updateData.level = newLevel;
    }

    await userRef.update(updateData);
    return { awarded: true };
  } catch (err: any) {
    const msg = err?.message || String(err);
    const isCredentialUnavailable =
      msg.includes('Could not load the default credentials') ||
      msg.includes('Unable to detect a Project Id') ||
      msg.includes('metadata.google.internal') ||
      msg.includes('ENOTFOUND') ||
      msg.includes('DECODER routines');

    if (isCredentialUnavailable) {
      console.warn('[Server] Activity verification skipped (Admin SDK credentials unavailable in local dev):', msg);
      return { awarded: false, reason: 'credentials_unavailable' };
    }

    console.warn('[Server] Activity verification notice:', msg);
    return { awarded: false, reason: 'admin_write_error' };
  }
};

