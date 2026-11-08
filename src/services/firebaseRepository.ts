import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { UserProfile, UserRole, CommunityPost, CommentItem, ChatMessage, PriceAlert, AdminReport, ReportItem, ChatRoomInfo, WatchlistBuyEntry, Stock } from '../types';
import { formatChatTime, parseToDate } from '../utils/dateUtils';

function extractTimestampIso(raw: any, fallbackServerRaw?: any): string {
  // Try fallback first, then raw. If both fail, try to parse raw as string as last resort.
  const attemptParse = (val: any): string | null => {
    if (!val) return null;
    if (typeof val === 'object' && typeof val.toDate === 'function') {
      try { return val.toDate().toISOString(); } catch {}
    }
    if (typeof val.seconds === 'number') {
      return new Date(val.seconds * 1000).toISOString();
    }
    if (typeof val === 'string') {
      const parsed = parseToDate(val);
      return parsed ? parsed.toISOString() : null;
    }
    return null;
  };

  const fallbackResult = attemptParse(fallbackServerRaw);
  if (fallbackResult) return fallbackResult;
  
  const rawResult = attemptParse(raw);
  if (rawResult) return rawResult;

  return '';
}

export const firebaseRepository = {
  // 1. Users
  async syncUserProfile(uid: string, email: string, displayName?: string, photoURL?: string): Promise<UserProfile> {
    const userRef = doc(db, 'users', uid);
    try {
      const snap = await getDoc(userRef);
      const isOwnerAdmin = email === 'byunghyunlim92@gmail.com' || uid === 'lr018vf8CcW5fAv707vsl77qJy53';
      if (!snap.exists()) {
        const newUser: UserProfile = {
          id: uid,
          email,
          name: displayName || (isOwnerAdmin ? '총괄관리자 (임병현)' : email.split('@')[0]),
          avatar: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          role: isOwnerAdmin ? 'superadmin' : 'user',
          tier: isOwnerAdmin ? '최고 관리자' : '일반회원',
          joinedDate: new Date().toLocaleDateString('ko-KR'),
          bio: isOwnerAdmin ? '병돌 인베스트먼트 총괄 시스템 관리자' : '스마트한 가치 투자를 지향합니다.',
          postCount: 0,
          commentCount: 0,
          winRate: 70,
          level: 1,
          title: '주린이',
          badge: '',
          badges: [],
          status: 'active',
          chatRestricted: false,
        };
        await setDoc(userRef, {
          uid,
          email,
          nickname: newUser.name,
          displayName: newUser.name,
          photoURL: newUser.avatar,
          role: newUser.role,
          tier: newUser.tier,
          level: 1,
          title: '주린이',
          badge: '',
          badges: [],
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          status: 'active',
          chatRestricted: false,
        });
        return newUser;
      } else {
        const data = snap.data();
        
        // Auto-heal superadmin account: ensure chat restrictions are permanently removed
        if (isOwnerAdmin) {
          if (data.chatRestricted || data.chatMutedUntil) {
            await updateDoc(userRef, {
              chatRestricted: false,
              chatMutedUntil: null,
              lastLoginAt: new Date().toISOString(),
            }).catch(() => {});
          } else {
            await updateDoc(userRef, {
              lastLoginAt: new Date().toISOString(),
            }).catch(() => {});
          }
          // Ensure any lingering restriction document is deleted
          await Promise.allSettled([
            deleteDoc(doc(db, 'chatRestrictions', uid)),
            deleteDoc(doc(db, 'chat_restrictions', uid)),
          ]);
        } else {
          await updateDoc(userRef, {
            lastLoginAt: new Date().toISOString(),
          }).catch(() => {});
        }

        return {
          id: uid,
          email: data.email || email,
          name: data.nickname || data.displayName || (isOwnerAdmin ? '총괄관리자 (임병현)' : '투자자'),
          avatar: data.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          role: isOwnerAdmin ? 'superadmin' : (data.role || 'user'),
          tier: isOwnerAdmin ? '최고 관리자' : (data.tier || '일반회원'),
          joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('ko-KR') : '2026.01.15',
          bio: data.bio || (isOwnerAdmin ? '병돌 인베스트먼트 총괄 시스템 관리자' : '스마트한 가치 투자를 지향합니다.'),
          postCount: data.postCount || 0,
          commentCount: data.commentCount || 0,
          winRate: data.winRate || 70,
          status: data.status || 'active',
          chatRestricted: isOwnerAdmin ? false : Boolean(data.chatRestricted),
          chatMutedUntil: isOwnerAdmin ? undefined : data.chatMutedUntil,
          level: data.level || 1,
          title: data.title || '주린이',
          badge: data.badge || '',
          badges: data.badges || [],
        };
      }
    } catch (err) {
      console.warn('Firebase user sync failed, using local profile:', err);
      const isOwnerAdmin = email === 'byunghyunlim92@gmail.com' || uid === 'lr018vf8CcW5fAv707vsl77qJy53';
      return {
        id: uid,
        email,
        name: displayName || (isOwnerAdmin ? '총괄관리자 (임병현)' : '병돌투자자'),
        avatar: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: isOwnerAdmin ? 'superadmin' : 'user',
        tier: isOwnerAdmin ? '최고 관리자' : '일반회원',
        joinedDate: '2026.01.01',
        bio: '스마트한 가치 투자를 지향합니다.',
        postCount: 0,
        commentCount: 0,
        winRate: 70,
        status: 'active',
        chatRestricted: false,
        level: 1,
        title: '주린이',
        badge: '',
        badges: [],
      };
    }
  },

  subscribeUsers(callback: (users: UserProfile[]) => void, onError?: (err: any) => void): () => void {
    try {
      const q = query(collection(db, 'users'), limit(300));
      return onSnapshot(q, snap => {
        const list: UserProfile[] = [];
        let hasRootAdmin = false;
        snap.forEach(d => {
          const data = d.data();
          const uid = d.id;
          if (uid === 'lr018vf8CcW5fAv707vsl77qJy53' || data.email === 'byunghyunlim92@gmail.com') {
            hasRootAdmin = true;
          }
          list.push({
            id: uid,
            email: data.email || '',
            name: data.nickname || data.displayName || data.name || '회원',
            avatar: data.photoURL || data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            role: (uid === 'lr018vf8CcW5fAv707vsl77qJy53' || data.email === 'byunghyunlim92@gmail.com') ? 'superadmin' : (data.role || 'user'),
            tier: data.tier || ((uid === 'lr018vf8CcW5fAv707vsl77qJy53') ? '최고 관리자' : '일반회원'),
            joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('ko-KR') : '2026.01.01',
            createdAt: data.createdAt || new Date().toISOString(),
            bio: data.bio || '',
            postCount: data.postCount || 0,
            commentCount: data.commentCount || 0,
            status: data.status || 'active',
            suspendedReason: data.suspendedReason,
            chatRestricted: Boolean(data.chatRestricted),
            chatMutedUntil: data.chatMutedUntil,
            lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString('ko-KR') : undefined,
            reportedCount: data.reportedCount || 0,
            reportSubmitCount: data.reportSubmitCount || 0,
            level: data.level || 1,
            title: data.title || '주린이',
            badge: data.badge || '',
            badges: data.badges || [],
          });
        });
        // Guarantee root superadmin presence
        if (!hasRootAdmin) {
          list.unshift({
            id: 'lr018vf8CcW5fAv707vsl77qJy53',
            name: '총괄관리자 (임병현)',
            email: 'byunghyunlim92@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            role: 'superadmin',
            tier: '최고 관리자',
            joinedDate: '2026.01.01',
            createdAt: '2026-01-01T00:00:00.000Z',
            bio: '병돌 인베스트먼트 총괄 시스템 관리자',
            postCount: 0,
            commentCount: 0,
            status: 'active',
            chatRestricted: false,
            lastLoginAt: new Date().toLocaleString('ko-KR'),
            reportedCount: 0,
            reportSubmitCount: 0,
            level: 99,
            title: '시스템 총괄',
            badge: '최고 관리자',
            badges: ['superadmin'],
          });
        }
        callback(list);
      }, err => {
        if (err.code === 'cancelled') {
          console.debug('[Firebase] Users listener cancelled');
        } else {
          console.warn('[firebaseRepository] subscribeUsers onSnapshot error:', err);
          handleFirestoreError(err, OperationType.LIST, 'users');
          if (onError) onError(err);
        }
      });
    } catch (err) {
      console.warn('[firebaseRepository] subscribeUsers exception:', err);
      handleFirestoreError(err, OperationType.LIST, 'users');
      if (onError) onError(err);
      return () => {};
    }
  },

  async updateUserStatus(uid: string, status: 'active' | 'suspended', reason?: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        status,
        suspendedReason: reason || null,
        chatRestricted: status === 'suspended',
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[firebaseRepository] updateUserStatus error:', err);
    }
  },

  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role,
        tier: role === 'superadmin' ? '최고 관리자' : (role === 'admin' ? '운영자' : (role === 'moderator' ? '운영진 (Moderator)' : '일반회원')),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[firebaseRepository] updateUserRole error:', err);
    }
  },

  async updateUserChatRestricted(uid: string, restricted: boolean, durationDesc?: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        chatRestricted: restricted,
        chatMutedUntil: restricted ? (durationDesc || '1시간') : null,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[firebaseRepository] updateUserChatRestricted error:', err);
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      console.warn('[firebaseRepository] deleteUser error:', err);
    }
  },


  // 2. Watchlists
  async getUserWatchlists(uid: string): Promise<string[]> {
    const path = 'watchlists';
    try {
      const q = query(collection(db, path), where('uid', '==', uid));
      const snap = await getDocs(q);
      const items: { symbol: string; orderIndex: number; createdAt: string }[] = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        if (d.symbol) {
          items.push({
            symbol: d.symbol,
            orderIndex: typeof d.orderIndex === 'number' ? d.orderIndex : 9999,
            createdAt: d.createdAt || '',
          });
        }
      });
      // Sort by orderIndex, then by createdAt
      items.sort((a, b) => (a.orderIndex - b.orderIndex) || a.createdAt.localeCompare(b.createdAt));
      return items.map(i => i.symbol);
    } catch (err) {
      console.warn('Firebase get watchlists failed:', err);
      handleFirestoreError(err, OperationType.LIST, path);
      return [];
    }
  },

  subscribeUserWatchlists(uid: string, callback: (symbols: string[]) => void): () => void {
    const path = 'watchlists';
    try {
      const q = query(collection(db, path), where('uid', '==', uid));
      console.log(`[Firebase] Creating watchlist listener for user: ${uid}`);
      const unsubscribe = onSnapshot(q, snap => {
        const items: { symbol: string; orderIndex: number; createdAt: string }[] = [];
        snap.forEach(docSnap => {
          const d = docSnap.data();
          if (d.symbol) {
            items.push({
              symbol: d.symbol,
              orderIndex: typeof d.orderIndex === 'number' ? d.orderIndex : 9999,
              createdAt: d.createdAt || '',
            });
          }
        });
        items.sort((a, b) => (a.orderIndex - b.orderIndex) || a.createdAt.localeCompare(b.createdAt));
        callback(items.map(i => i.symbol));
      }, err => {
        if (err.code === 'cancelled') {
          console.debug('[Firebase] Watchlists listener cancelled');
        } else {
          console.warn('Watchlists onSnapshot error:', err);
          handleFirestoreError(err, OperationType.GET, path);
        }
      });
      return () => {
        console.log(`[Firebase] Cleaning up watchlist listener for user: ${uid}`);
        unsubscribe();
      };
    } catch (err) {
      console.warn('subscribeUserWatchlists exception:', err);
      handleFirestoreError(err, OperationType.GET, path);
      return () => {};
    }
  },

  // Safe document ID generator satisfying firestore.rules: ^[a-zA-Z0-9_\-]+$
  getWatchlistDocId(uid: string, market: string, symbol: string): string {
    const safeMarket = (market || 'ALL').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeSymbol = (symbol || '').replace(/[^a-zA-Z0-9_-]/g, (c) => `_${c.charCodeAt(0).toString(16)}_`);
    return `${uid}_${safeMarket}_${safeSymbol}`.slice(0, 120);
  },

  async addWatchlist(uid: string, symbol: string, orderIndex?: number, market: string = 'UNKNOWN', stockData?: Partial<Stock>): Promise<void> {
    const docId = this.getWatchlistDocId(uid, market, symbol);
    try {
      await setDoc(doc(db, 'watchlists', docId), {
        uid,
        symbol,
        market,
        name: stockData?.name || symbol,
        exchange: stockData?.exchange || '',
        productType: stockData?.productType || '',
        orderIndex: typeof orderIndex === 'number' ? orderIndex : Date.now(),
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firebase add watchlist error:', err);
      handleFirestoreError(err, OperationType.WRITE, `watchlists/${docId}`);
    }
  },

  async removeWatchlist(uid: string, symbol: string, market: string = 'UNKNOWN'): Promise<void> {
    const docId = this.getWatchlistDocId(uid, market, symbol);
    try {
      await deleteDoc(doc(db, 'watchlists', docId)).catch(() => {});
      // Also query and delete all watchlist documents matching this user and symbol to prevent orphan entries
      const q = query(collection(db, 'watchlists'), where('uid', '==', uid), where('symbol', '==', symbol));
      const snap = await getDocs(q);
      const deletes = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.allSettled(deletes);
    } catch (err) {
      console.warn('Firebase remove watchlist error:', err);
      handleFirestoreError(err, OperationType.DELETE, `watchlists/${docId}`);
    }
  },

  async updateWatchlistOrder(uid: string, orders: { symbol: string, market: string, orderIndex: number }[]): Promise<void> {
    const path = 'watchlists';
    try {
      const promises = orders.map((order) => {
        const docId = this.getWatchlistDocId(uid, order.market, order.symbol);
        return updateDoc(doc(db, 'watchlists', docId), {
          orderIndex: order.orderIndex,
        }).catch(() => {
          // If doc doesn't exist, create it
          return setDoc(doc(db, 'watchlists', docId), {
            uid,
            symbol: order.symbol,
            market: order.market,
            orderIndex: order.orderIndex,
            createdAt: new Date().toISOString(),
          }, { merge: true });
        });
      });
      await Promise.allSettled(promises);
    } catch (err) {
      console.warn('Firebase update watchlist order error:', err);
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  },

  // 3. Community Posts & Comments
  async getPosts(): Promise<CommunityPost[]> {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: CommunityPost[] = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        if (d.isDeleted) return;
        list.push({
          id: docSnap.id,
          author: {
            id: d.authorId || 'anon',
            name: d.authorName || '투자자',
            avatar: d.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            badge: d.authorBadge || '정회원',
            tier: d.authorTier || '골드',
            level: d.authorLevel || 0,
            title: d.authorTitle || '주린이',
          },
          category: d.category || 'free',
          title: d.title || '제목 없음',
          content: d.content || '',
          symbol: d.stockSymbol,
          symbolName: d.stockName || d.stockSymbolName,
          likes: d.likeCount || 0,
          likedBy: d.likedBy || [],
          views: d.viewCount || 0,
          commentsCount: d.commentCount || (d.comments ? d.comments.length : 0),
          createdAt: extractTimestampIso(d.createdAt, d.serverCreatedAt),
          updatedAt: extractTimestampIso(d.updatedAt, d.serverUpdatedAt) || undefined,
          tags: d.tags || [],
          isHot: (d.likeCount || 0) >= 10,
          comments: Array.isArray(d.comments) ? d.comments.map((c: any) => ({
            ...c,
            createdAt: extractTimestampIso(c.createdAt, c.serverCreatedAt) || c.createdAt || '',
            updatedAt: extractTimestampIso(c.updatedAt, c.serverUpdatedAt) || c.updatedAt,
          })) : [],
        });
      });
      return list;
    } catch (err) {
      console.warn('Firebase get posts failed:', err);
      return [];
    }
  },

  subscribePosts(
    callback: (posts: CommunityPost[]) => void,
    errorCallback?: (error: any) => void
  ): () => void {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100));
      return onSnapshot(
        q,
        snap => {
          const list: CommunityPost[] = [];
          snap.forEach(docSnap => {
            const d = docSnap.data();
            if (d.isDeleted) return;
            list.push({
              id: docSnap.id,
              author: {
                id: d.authorId || 'anon',
                name: d.authorName || '투자자',
                avatar: d.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
                badge: d.authorBadge || '정회원',
                tier: d.authorTier || '골드',
                level: d.authorLevel || 0,
                title: d.authorTitle || '주린이',
              },
              category: d.category || 'free',
              title: d.title || '제목 없음',
              content: d.content || '',
              symbol: d.stockSymbol,
              symbolName: d.stockName || d.stockSymbolName,
              likes: d.likeCount || 0,
              likedBy: d.likedBy || [],
              views: d.viewCount || 0,
              commentsCount: d.commentCount || (d.comments ? d.comments.length : 0),
              createdAt: extractTimestampIso(d.createdAt, d.serverCreatedAt),
              updatedAt: extractTimestampIso(d.updatedAt, d.serverUpdatedAt) || undefined,
              tags: d.tags || [],
              isHot: (d.likeCount || 0) >= 10,
              status: d.status || 'published',
              isNotice: Boolean(d.isNotice || d.category === 'notice'),
              comments: Array.isArray(d.comments) ? d.comments.map((c: any) => ({
                ...c,
                createdAt: extractTimestampIso(c.createdAt, c.serverCreatedAt) || c.createdAt || '',
                updatedAt: extractTimestampIso(c.updatedAt, c.serverUpdatedAt) || c.updatedAt,
              })) : [],
            });
          });
          callback(list);
        },
        err => {
          if (err.code === 'cancelled') {
            console.debug('[Firebase] Posts listener cancelled');
          } else {
            console.warn('subscribePosts onSnapshot error:', err);
            handleFirestoreError(err, OperationType.LIST, 'posts');
            if (errorCallback) {
              errorCallback(err);
            }
          }
        }
      );
    } catch (err) {
      console.warn('subscribePosts exception:', err);
      handleFirestoreError(err, OperationType.LIST, 'posts');
      if (errorCallback) {
        errorCallback(err);
      }
      return () => {};
    }
  },

  async getPostById(postId: string): Promise<CommunityPost | undefined> {
    try {
      const snap = await getDoc(doc(db, 'posts', postId));
      if (!snap.exists()) return undefined;
      const d = snap.data();
      return {
        id: snap.id,
        author: {
          id: d.authorId,
          name: d.authorName || '투자자',
          avatar: d.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          badge: d.authorBadge || '정회원',
          tier: d.authorTier || '골드',
          level: d.authorLevel || 0,
          title: d.authorTitle || '주린이',
        },
        category: d.category || 'free',
        title: d.title,
        content: d.content,
        symbol: d.stockSymbol,
        symbolName: d.stockName || d.stockSymbolName,
        likes: d.likeCount || 0,
        likedBy: d.likedBy || [],
        views: d.viewCount || 0,
        commentsCount: d.commentCount || (d.comments ? d.comments.length : 0),
        createdAt: extractTimestampIso(d.createdAt, d.serverCreatedAt),
        updatedAt: extractTimestampIso(d.updatedAt, d.serverUpdatedAt) || undefined,
        tags: d.tags || [],
        isHot: (d.likeCount || 0) >= 10,
        comments: Array.isArray(d.comments) ? d.comments.map((c: any) => ({
          ...c,
          createdAt: extractTimestampIso(c.createdAt, c.serverCreatedAt) || c.createdAt || '',
          updatedAt: extractTimestampIso(c.updatedAt, c.serverUpdatedAt) || c.updatedAt,
        })) : [],
      };
    } catch (err) {
      console.warn('Firebase getPostById failed:', err);
      return undefined;
    }
  },

  async createPost(post: Omit<CommunityPost, 'id' | 'likes' | 'views' | 'commentsCount' | 'createdAt'>): Promise<string> {
    try {
      const col = collection(db, 'posts');
      const docRef = doc(col);
      await setDoc(docRef, {
        id: docRef.id,
        authorId: post.author.id,
        authorName: post.author.name,
        authorAvatar: post.author.avatar,
        authorBadge: post.author.badge,
        authorTier: post.author.tier,
        authorLevel: post.author.level,
        authorTitle: post.author.title,
        category: post.category,
        title: post.title,
        content: post.content,
        stockSymbol: post.symbol || '',
        stockName: post.symbolName || '',
        viewCount: 1,
        likeCount: 0,
        likedBy: [],
        commentCount: 0,
        comments: [],
        createdAt: serverTimestamp(),
        createdAtIso: new Date().toISOString(),
        serverCreatedAt: serverTimestamp(),
        updatedAt: null,
        serverUpdatedAt: null,
        status: 'published',
        isDeleted: false,
        tags: post.tags || [],
      });
      // Server-side verification
      fetch('/api/user/verify-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: post.author.id, activityType: 'post' }),
      }).catch(console.error);
      return docRef.id;
    } catch (err) {
      console.warn('Firebase create post failed:', err);
      return `local-${Date.now()}`;
    }
  },

  async updatePost(postId: string, updates: Partial<CommunityPost>): Promise<void> {
    try {
      const updateData: any = {
        updatedAt: new Date().toISOString(),
        serverUpdatedAt: serverTimestamp(),
      };
      // CRITICAL: createdAt is immutable and must NEVER be overwritten during post update
      delete (updates as any).createdAt;
      delete (updates as any).serverCreatedAt;
      delete (updates as any).createdAtIso;

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.symbol !== undefined) updateData.stockSymbol = updates.symbol;
      if (updates.symbolName !== undefined) updateData.stockName = updates.symbolName;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      await updateDoc(doc(db, 'posts', postId), updateData);
    } catch (err) {
      console.warn('Firebase update post failed:', err);
    }
  },

  async deletePost(postId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'posts', postId), { isDeleted: true, deletedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firebase soft-delete post failed:', err);
    }
  },

  async updatePostStatus(postId: string, status: 'published' | 'hidden' | 'deleted'): Promise<void> {
    try {
      if (status === 'deleted') {
        await updateDoc(doc(db, 'posts', postId), { isDeleted: true, deletedAt: new Date().toISOString() });
      } else {
        await updateDoc(doc(db, 'posts', postId), {
          status,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Firebase updatePostStatus failed:', err);
    }
  },

  async incrementPostView(postId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        const curViews = snap.data().viewCount || 0;
        await updateDoc(postRef, { viewCount: curViews + 1 });
      }
    } catch (err) {
      console.warn('Firebase incrementPostView failed:', err);
    }
  },

  async togglePostLike(postId: string, userId: string): Promise<{ likes: number; likedBy: string[] } | null> {
    try {
      const postRef = doc(db, 'posts', postId);
      const snap = await getDoc(postRef);
      if (!snap.exists()) return null;

      const d = snap.data();
      let likedBy: string[] = d.likedBy || [];
      let likeCount: number = d.likeCount || 0;

      if (likedBy.includes(userId)) {
        likedBy = likedBy.filter(id => id !== userId);
        likeCount = Math.max(0, likeCount - 1);
      } else {
        likedBy.push(userId);
        likeCount += 1;
      }

      await updateDoc(postRef, {
        likedBy,
        likeCount,
      });

      return { likes: likeCount, likedBy };
    } catch (err) {
      console.warn('Firebase togglePostLike failed:', err);
      return null;
    }
  },

  async addComment(postId: string, comment: CommentItem): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        const curComments: CommentItem[] = snap.data().comments || [];
        curComments.push(comment);
        await updateDoc(postRef, {
          comments: curComments,
          commentCount: curComments.length,
        });
        // Server-side verification
        fetch('/api/user/verify-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: comment.author.id, activityType: 'comment' }),
        }).catch(console.error);
      }
    } catch (err) {
      console.warn('Firebase addComment failed:', err);
    }
  },

  async updateComment(postId: string, commentId: string, newContent: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        const curComments: CommentItem[] = snap.data().comments || [];
        const target = curComments.find(c => c.id === commentId);
        if (target) {
          target.content = newContent;
          target.updatedAt = new Date().toISOString();
          await updateDoc(postRef, { comments: curComments });
        }
      }
    } catch (err) {
      console.warn('Firebase updateComment failed:', err);
    }
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        const curComments: CommentItem[] = snap.data().comments || [];
        const filtered = curComments.filter(c => c.id !== commentId);
        await updateDoc(postRef, {
          comments: filtered,
          commentCount: filtered.length,
        });
      }
    } catch (err) {
      console.warn('Firebase deleteComment failed:', err);
    }
  },

  async createReport(report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const col = collection(db, 'reports');
      const docRef = doc(col);
      await setDoc(docRef, {
        id: docRef.id,
        reporterId: report.reporterId,
        reporterName: report.reporterName,
        targetType: report.targetType,
        targetId: report.targetId,
        postId: report.postId || '',
        targetContent: report.targetContent,
        targetAuthorName: report.targetAuthorName,
        reason: report.reason,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });
      return docRef.id;
    } catch (err) {
      console.warn('Firebase createReport failed:', err);
      return `rep-${Date.now()}`;
    }
  },

  subscribeReports(callback: (reports: AdminReport[]) => void, onError?: (err: any) => void): () => void {
    try {
      const q = query(collection(db, 'reports'), limit(150));
      return onSnapshot(q, snap => {
        const list: AdminReport[] = [];
        snap.forEach(d => {
          const data = d.data();
          list.push({
            id: d.id,
            type: data.type || data.targetType || 'post',
            targetId: data.targetId || '',
            targetTitle: data.targetTitle || data.targetContent?.slice(0, 30) || '신고 대상',
            targetContent: data.targetContent || data.details || '',
            targetAuthorId: data.targetAuthorId || '',
            targetAuthorName: data.targetAuthorName || '사용자',
            reporterId: data.reporterId || '',
            reportedBy: data.reportedBy || data.reporterName || '익명회원',
            reason: data.reason || '사유 미기재',
            status: data.status || 'pending',
            handlerName: data.handlerName || data.reviewedBy,
            handledAt: data.handledAt || (data.reviewedAt ? new Date(data.reviewedAt).toLocaleString('ko-KR') : undefined),
            actionTaken: data.actionTaken,
            createdAt: data.createdAt ? (data.createdAt.length < 20 ? data.createdAt : new Date(data.createdAt).toLocaleString('ko-KR')) : '방금 전',
          });
        });
        callback(list);
      }, err => {
        if (err.code === 'cancelled') {
          console.debug('[Firebase] Reports listener cancelled');
        } else {
          console.warn('[firebaseRepository] subscribeReports onSnapshot error:', err);
          handleFirestoreError(err, OperationType.LIST, 'reports');
          if (onError) onError(err);
        }
      });
    } catch (err) {
      console.warn('[firebaseRepository] subscribeReports exception:', err);
      handleFirestoreError(err, OperationType.LIST, 'reports');
      if (onError) onError(err);
      return () => {};
    }
  },

  async resolveReport(reportId: string, status: 'resolved' | 'dismissed', actionTaken?: string, reviewerName?: string): Promise<void> {
    try {
      const repRef = doc(db, 'reports', reportId);
      await updateDoc(repRef, {
        status,
        actionTaken: actionTaken || (status === 'resolved' ? '운영 조치 완료' : '기각 처리'),
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerName || '운영관리자',
      });
    } catch (err) {
      console.warn('[firebaseRepository] resolveReport failed:', err);
    }
  },

  // 4. Chat Rooms & Messages Real-time Subscription
  async getChatRooms(): Promise<ChatRoomInfo[]> {
    try {
      const snap = await getDocs(collection(db, 'chatRooms'));
      const rooms: ChatRoomInfo[] = [];
      snap.forEach(d => {
        const data = d.data();
        rooms.push({
          id: d.id,
          name: data.name,
          desc: data.desc,
          icon: data.icon || '💬',
          count: data.count || 0,
          category: data.category,
          creatorId: data.creatorId,
          creatorName: data.creatorName,
          symbol: data.symbol,
          createdAt: data.createdAt,
        });
      });
      return rooms;
    } catch (err) {
      console.warn('Firebase getChatRooms error:', err);
      return [];
    }
  },

  subscribeChatRooms(callback: (rooms: ChatRoomInfo[]) => void): () => void {
    try {
      const q = query(collection(db, 'chatRooms'), limit(50));
      return onSnapshot(q, snap => {
        const rooms: ChatRoomInfo[] = [];
        snap.forEach(d => {
          const data = d.data();
          rooms.push({
            id: d.id,
            name: data.name,
            desc: data.desc,
            icon: data.icon || '💬',
            count: data.count || 0,
            category: data.category,
            creatorId: data.creatorId,
            creatorName: data.creatorName,
            symbol: data.symbol,
            createdAt: data.createdAt,
          });
        });
        callback(rooms);
      }, err => {
        if (err.code === 'cancelled') {
          console.debug('[Firebase] Chat rooms listener cancelled:', err.message);
        } else {
          console.error('subscribeChatRooms snapshot error:', err);
          handleFirestoreError(err, OperationType.LIST, 'chatRooms');
        }
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'chatRooms');
      return () => {};
    }
  },

  async createChatRoom(room: Omit<ChatRoomInfo, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(db, 'chatRooms'));
      await setDoc(docRef, {
        ...room,
        id: docRef.id,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (err) {
      console.warn('Firebase createChatRoom error:', err);
      return `custom-${Date.now()}`;
    }
  },

  async deleteChatRoom(roomId: string, adminUid: string): Promise<void> {
    try {
      if (!(await this.isAdmin(adminUid))) {
        throw new Error('Unauthorized: Admin access required.');
      }
      await deleteDoc(doc(db, 'chatRooms', roomId));
    } catch (err) {
      console.warn('Firebase deleteChatRoom error:', err);
      throw err;
    }
  },

  subscribeChat(
    roomId: string, 
    callback: (messages: ChatMessage[]) => void, 
    messageLimit: number = 50,
    onError?: (err: any) => void
  ): () => void {
    try {
      const q = query(
        collection(db, 'chatMessages'),
        where('roomId', '==', roomId),
        orderBy('serverCreatedAt', 'desc'),
        limit(messageLimit)
      );
      console.log(`[Firebase] Creating chat listener for room: ${roomId} (limit: ${messageLimit})`);
      const unsubscribe = onSnapshot(q, snap => {
        const list: ChatMessage[] = [];
        snap.forEach(docSnap => {
          const d = docSnap.data();
          if (d.isDeleted) return; // Client-side filtering
          
          let time = '--:--';
          let createdAtIso = '';
          let sortTime = 0;

          if (d.serverCreatedAt && typeof d.serverCreatedAt.toMillis === 'function') {
            const dt = d.serverCreatedAt.toDate();
            time = formatChatTime(dt);
            createdAtIso = dt.toISOString();
            sortTime = d.serverCreatedAt.toMillis();
          } else if (d.createdAt) {
            const dt = parseToDate(d.createdAt);
            if (dt) {
              time = formatChatTime(dt);
              createdAtIso = dt.toISOString();
              sortTime = dt.getTime();
            } else if (typeof d.createdAt === 'string') {
              createdAtIso = d.createdAt;
              time = formatChatTime(d.createdAt);
            }
          }

          if (!time || time === '--:--') {
            time = typeof d.timestamp === 'string' && d.timestamp ? formatChatTime(d.timestamp) : '--:--';
          }

          list.push({
            id: docSnap.id,
            roomId: d.roomId || roomId,
            author: {
              id: d.authorId || '',
              name: d.authorName || '투자자',
              avatar: d.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
              role: d.authorRole,
            },
            message: d.content || '',
            imageUrl: d.imageUrl || '',
            tempId: d.tempId || undefined,
            timestamp: time,
            createdAt: createdAtIso,
            sentiment: d.sentiment,
            likes: 0,
            _sortTime: sortTime,
            status: 'sent',
          });
        });
        // Sort chronologically ascending (oldest first -> newest last)
        list.sort((a: any, b: any) => (a._sortTime || 0) - (b._sortTime || 0));
        callback(list);
      }, err => {
        if (err.code === 'cancelled') {
          console.debug(`[Firebase] Chat listener cancelled for room ${roomId}:`, err.message);
        } else {
          console.error('Firestore onSnapshot error in subscribeChat:', err);
          handleFirestoreError(err, OperationType.LIST, 'chatMessages');
          if (onError) onError(err);
        }
      });
      return () => {
        console.log(`[Firebase] Cleaning up chat listener for room: ${roomId}`);
        unsubscribe();
      };
    } catch (err) {
      console.warn('subscribeChat exception:', err);
      handleFirestoreError(err, OperationType.LIST, 'chatMessages');
      if (onError) onError(err);
      return () => {};
    }
  },

  subscribeAllChat(
    callback: (messages: ChatMessage[]) => void,
    messageLimit: number = 100,
    onError?: (err: any) => void
  ): () => void {
    try {
      const q = query(
        collection(db, 'chatMessages'),
        limit(messageLimit)
      );
      return onSnapshot(q, snap => {
        const list: ChatMessage[] = [];
        snap.forEach(docSnap => {
          const d = docSnap.data();
          if (d.isDeleted) return; // Client-side filtering

          let time = '--:--';
          let createdAtIso = '';
          let sortTime = 0;
          if (d.serverCreatedAt && typeof d.serverCreatedAt.toMillis === 'function') {
            const dt = d.serverCreatedAt.toDate();
            time = formatChatTime(dt);
            createdAtIso = dt.toISOString();
            sortTime = d.serverCreatedAt.toMillis();
          } else if (d.createdAt) {
            const dt = parseToDate(d.createdAt);
            if (dt) {
              time = formatChatTime(dt);
              createdAtIso = dt.toISOString();
              sortTime = dt.getTime();
            } else if (typeof d.createdAt === 'string') {
              createdAtIso = d.createdAt;
              time = formatChatTime(d.createdAt);
            }
          }

          if (!time || time === '--:--') {
            time = typeof d.timestamp === 'string' && d.timestamp ? formatChatTime(d.timestamp) : '--:--';
          }

          list.push({
            id: docSnap.id,
            roomId: d.roomId || 'all',
            author: {
              id: d.authorId || '',
              name: d.authorName || '투자자',
              avatar: d.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
              role: d.authorRole,
            },
            message: d.content || '',
            imageUrl: d.imageUrl || '',
            tempId: d.tempId || undefined,
            timestamp: time,
            createdAt: createdAtIso,
            sentiment: d.sentiment,
            likes: 0,
            _sortTime: sortTime,
            status: 'sent',
          });
        });
        // Sort newest first for admin monitoring
        list.sort((a: any, b: any) => (b._sortTime || 0) - (a._sortTime || 0));
        callback(list);
      }, err => {
        if (err.code === 'cancelled') {
          console.debug('[Firebase] AllChat listener cancelled');
        } else {
          console.warn('Firestore subscribeAllChat error:', err);
          handleFirestoreError(err, OperationType.LIST, 'chatMessages');
          if (onError) onError(err);
        }
      });
    } catch (err) {
      console.warn('subscribeAllChat exception:', err);
      handleFirestoreError(err, OperationType.LIST, 'chatMessages');
      if (onError) onError(err);
      return () => {};
    }
  },

  async sendChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp' | 'likes'>, tempId?: string): Promise<string> {
    const col = collection(db, 'chatMessages');
    const docRef = doc(col);
    const nowIso = new Date().toISOString();
    await setDoc(docRef, {
      id: docRef.id,
      tempId: tempId || null,
      roomId: msg.roomId,
      authorId: msg.author.id,
      authorName: msg.author.name,
      authorAvatar: msg.author.avatar,
      authorRole: msg.author.role || '회원',
      content: msg.message,
      imageUrl: msg.imageUrl || '',
      sentiment: msg.sentiment || 'neutral',
      createdAt: nowIso,
      serverCreatedAt: serverTimestamp(),
      status: 'active',
      isDeleted: false,
    });
    return docRef.id;
  },

  async deleteChatMessage(messageId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'chatMessages', messageId), { isDeleted: true, deletedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firebase soft-delete chat message failed:', err);
    }
  },

  async restrictChatUser(uid: string, reason: string, adminUid: string): Promise<void> {
    if (uid === 'lr018vf8CcW5fAv707vsl77qJy53') {
      throw new Error('최고 운영자 계정은 채팅을 제한할 수 없습니다.');
    }
    const docRef = doc(db, 'chatRestrictions', uid);
    const userRef = doc(db, 'users', uid);
    await Promise.all([
      setDoc(docRef, {
        uid,
        reason,
        restrictedBy: adminUid,
        createdAt: new Date().toISOString(),
      }),
      updateDoc(userRef, {
        chatRestricted: true,
        chatMutedUntil: reason || '24시간 발언 제한',
        updatedAt: new Date().toISOString(),
      }).catch(() => {})
    ]);
  },

  async unrestrictChatUser(uid: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await Promise.allSettled([
      deleteDoc(doc(db, 'chatRestrictions', uid)),
      deleteDoc(doc(db, 'chat_restrictions', uid)),
      updateDoc(userRef, {
        chatRestricted: false,
        chatMutedUntil: null,
        updatedAt: new Date().toISOString(),
      })
    ]);
  },

  async isUserChatRestricted(uid: string): Promise<boolean> {
    if (uid === 'lr018vf8CcW5fAv707vsl77qJy53') return false;
    try {
      const snap = await getDoc(doc(db, 'chatRestrictions', uid));
      return snap.exists();
    } catch (err) {
      console.warn('Firebase isUserChatRestricted check failed:', err);
      return false;
    }
  },

  subscribeChatRestrictions(callback: (restrictedUids: string[]) => void): () => void {
    try {
      const col = collection(db, 'chatRestrictions');
      const colLegacy = collection(db, 'chat_restrictions');
      
      const unsub = onSnapshot(col, snap => {
        const uids: string[] = [];
        snap.forEach(d => {
          if (d.id !== 'lr018vf8CcW5fAv707vsl77qJy53') {
            uids.push(d.id);
          }
        });
        
        // Check legacy
        getDocs(colLegacy).then(snapLegacy => {
          if (!snapLegacy.empty) {
            snapLegacy.forEach(d => {
              if (d.id !== 'lr018vf8CcW5fAv707vsl77qJy53' && !uids.includes(d.id)) {
                uids.push(d.id);
              }
            });
          }
          callback(uids);
        }).catch(() => {
          callback(uids);
        });
      }, err => {
        if (err.code === 'cancelled') {
          console.debug('[Firebase] Restrictions listener cancelled');
        } else {
          console.warn('subscribeChatRestrictions error:', err);
          handleFirestoreError(err, OperationType.LIST, 'chatRestrictions');
        }
      });
      return unsub;
    } catch (err) {
      console.warn('subscribeChatRestrictions exception:', err);
      handleFirestoreError(err, OperationType.LIST, 'chatRestrictions');
      return () => {};
    }
  },

  // 5. Price Alerts (Target Price Thresholds in Firestore)
  subscribeUserPriceAlerts(uid: string, onUpdate: (alerts: PriceAlert[]) => void): () => void {
    if (!uid) return () => {};
    try {
      const q = query(collection(db, 'alerts'), where('uid', '==', uid));
      console.log(`[Firebase] Creating price alert listener for user: ${uid}`);
      const unsubscribe = onSnapshot(q, (snap) => {
        const list: PriceAlert[] = [];
        snap.forEach(docSnap => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            uid: d.uid,
            symbol: d.symbol,
            symbolName: d.symbolName || d.symbol,
            targetPrice: Number(d.targetPrice ?? d.value ?? 0),
            condition: d.condition || 'above',
            createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR'),
            isTriggered: Boolean(d.isTriggered),
            triggeredAt: d.triggeredAt,
            triggeredPrice: d.triggeredPrice ? Number(d.triggeredPrice) : undefined,
            enabled: d.enabled !== false,
            note: d.note || '',
          });
        });
        // Sort: active first, then by createdAt desc
        list.sort((a, b) => {
          if (a.isTriggered !== b.isTriggered) return a.isTriggered ? 1 : -1;
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        });
        onUpdate(list);
      }, (err) => {
        if (err.code === 'cancelled') {
          console.debug('[Firebase] Price alerts listener cancelled (likely idle/reconnecting):', err.message);
        } else {
          console.error('[Firebase] Price alerts listener error:', err);
          handleFirestoreError(err, OperationType.LIST, 'alerts');
        }
      });
      return () => {
        console.log(`[Firebase] Cleaning up price alert listener for user: ${uid}`);
        unsubscribe();
      };
    } catch (err) {
      console.warn('Firebase subscribeUserPriceAlerts init error:', err);
      handleFirestoreError(err, OperationType.LIST, 'alerts');
      return () => {};
    }
  },

  async getUserAlerts(uid: string): Promise<PriceAlert[]> {
    try {
      const q = query(collection(db, 'alerts'), where('uid', '==', uid));
      const snap = await getDocs(q);
      const list: PriceAlert[] = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          uid: d.uid,
          symbol: d.symbol,
          symbolName: d.symbolName || d.symbol,
          targetPrice: Number(d.targetPrice ?? d.value ?? 0),
          condition: d.condition,
          createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR'),
          isTriggered: Boolean(d.isTriggered),
          triggeredAt: d.triggeredAt,
          triggeredPrice: d.triggeredPrice ? Number(d.triggeredPrice) : undefined,
          enabled: d.enabled !== false,
          note: d.note || '',
        });
      });
      return list;
    } catch (err) {
      console.warn('Firebase get alerts failed:', err);
      return [];
    }
  },

  async createAlert(uid: string, alert: { symbol: string; symbolName: string; targetPrice: number; condition: 'above' | 'below'; note?: string }): Promise<string> {
    try {
      const docRef = doc(collection(db, 'alerts'));
      const targetVal = Number(alert.targetPrice);
      await setDoc(docRef, {
        id: docRef.id,
        uid,
        symbol: alert.symbol,
        symbolName: alert.symbolName,
        type: 'price_target',
        condition: alert.condition,
        targetPrice: targetVal,
        value: targetVal,
        enabled: true,
        isTriggered: false,
        note: alert.note || '',
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (err) {
      console.warn('Firebase create alert failed:', err);
      throw err;
    }
  },

  async markAlertTriggered(alertId: string, triggeredPrice: number): Promise<void> {
    try {
      await updateDoc(doc(db, 'alerts', alertId), {
        isTriggered: true,
        triggeredAt: new Date().toISOString(),
        triggeredPrice: Number(triggeredPrice),
      });
    } catch (err) {
      console.warn('Firebase markAlertTriggered failed:', err);
    }
  },

  async toggleAlertEnabled(alertId: string, enabled: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, 'alerts', alertId), { enabled });
    } catch (err) {
      console.warn('Firebase toggleAlertEnabled failed:', err);
    }
  },

  async deleteAlert(alertId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'alerts', alertId));
    } catch (err) {
      console.warn('Firebase delete alert failed:', err);
    }
  },

  // 6. Admin Data Cleansing Operations
  async clearAllReports(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      const batchPromises = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(batchPromises);
    } catch (err) {
      console.warn('[firebaseRepository] clearAllReports failed:', err);
    }
  },

  async clearAllSanctions(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, 'chatRestrictions'));
      const batchPromises = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(batchPromises);
    } catch (err) {
      console.warn('[firebaseRepository] clearAllSanctions failed:', err);
    }
  },

  async clearAllAdminLogs(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, 'adminAuditLogs'));
      const batchPromises = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(batchPromises);
    } catch (err) {
      console.warn('[firebaseRepository] clearAllAdminLogs failed:', err);
    }
  },
  async pinMessage(messageId: string, roomId: string, pinned: boolean): Promise<void> {
    try {
      const msgRef = doc(db, 'chatMessages', messageId);
      await updateDoc(msgRef, {
        isPinned: pinned,
        pinnedAt: pinned ? new Date().toISOString() : null,
      });
    } catch (err) {
      console.warn('Firebase pinMessage failed:', err);
    }
  },

  async logAdminAction(adminUid: string, adminName: string, action: string, details: string): Promise<void> {
    try {
      await setDoc(doc(collection(db, 'adminLogs')), {
        adminUid,
        adminName,
        action,
        details,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firebase logAdminAction failed:', err);
    }
  },

  async isAdmin(uid: string): Promise<boolean> {
    try {
      const userSnap = await getDoc(doc(db, 'users', uid));
      return userSnap.exists() && (userSnap.data().role === 'admin' || userSnap.data().role === 'superadmin');
    } catch {
      return false;
    }
  },

  async clearRoomChatHistory(roomId: string, adminUid: string): Promise<void> {
    try {
      if (!(await this.isAdmin(adminUid))) {
        throw new Error('Unauthorized: Admin access required.');
      }
      const q = query(collection(db, 'chatMessages'), where('roomId', '==', roomId));
      const snap = await getDocs(q);
      
      const batch = writeBatch(db);
      snap.docs.forEach(d => {
        batch.update(d.ref, { isDeleted: true, deletedAt: new Date().toISOString() });
      });
      await batch.commit();
    } catch (err) {
      console.warn('[firebaseRepository] clearRoomChatHistory failed:', err);
      throw err;
    }
  },

  async incrementAdStats(adId: string, type: 'impressions' | 'clicks'): Promise<void> {
    try {
      const docRef = doc(db, 'adStats', adId);
      await setDoc(docRef, {
        [type]: increment(1)
      }, { merge: true });
    } catch (err) {
      console.warn('Firebase incrementAdStats failed:', err);
    }
  },

  async awardBadge(uid: string, badgeId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const badges = data.badges || [];
        if (!badges.includes(badgeId)) {
          await updateDoc(userRef, {
            badges: [...badges, badgeId],
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.warn('[firebaseRepository] awardBadge failed:', err);
    }
  },

  // 6. User Stock Purchases
  async getUserStockPurchases(uid: string): Promise<Record<string, WatchlistBuyEntry[]>> {
    const path = 'userStockPurchases';
    try {
      const q = query(collection(db, path), where('uid', '==', uid));
      const snap = await getDocs(q);
      const purchases: Record<string, WatchlistBuyEntry[]> = {};
      snap.forEach(docSnap => {
        const d = docSnap.data();
        purchases[d.symbol] = d.buyEntries || [];
      });
      return purchases;
    } catch (err) {
      console.warn('Firebase get user stock purchases failed:', err);
      return {};
    }
  },

  async saveUserStockPurchases(uid: string, symbol: string, entries: WatchlistBuyEntry[]): Promise<void> {
    const docId = `${uid}_${symbol}`;
    try {
      await setDoc(doc(db, 'userStockPurchases', docId), {
        uid,
        symbol,
        buyEntries: entries,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firebase save user stock purchases error:', err);
    }
  },
  async markInitializedWatchlist(uid: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        hasInitializedWatchlist: true,
      });
    } catch (err) {
      console.warn('Firebase markInitializedWatchlist error:', err);
    }
  },

  async hasInitializedWatchlist(uid: string): Promise<boolean> {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() && Boolean(snap.data().hasInitializedWatchlist);
    } catch (err) {
      console.warn('Firebase hasInitializedWatchlist error:', err);
      return false;
    }
  },

  // 7. Mini Games
  async saveGameHistory(uid: string, gameType: 'ladder' | 'lunch' | 'office', inputData: any, resultData: any): Promise<void> {
    try {
      const col = collection(db, 'gameHistory');
      const docRef = doc(col);
      await setDoc(docRef, {
        id: docRef.id,
        uid,
        gameType,
        inputData,
        resultData,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firebase saveGameHistory failed:', err);
    }
  },

  async getUserGameHistory(uid: string, gameType?: 'ladder' | 'lunch' | 'office'): Promise<any[]> {
    try {
      let q = query(collection(db, 'gameHistory'), where('uid', '==', uid), orderBy('createdAt', 'desc'));
      if (gameType) {
        q = query(q, where('gameType', '==', gameType));
      }
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id }));
      return list;
    } catch (err) {
      console.warn('Firebase getUserGameHistory failed:', err);
      return [];
    }
  },

  async updateOfficeGameState(uid: string, stats: any, day: number, status: string): Promise<void> {
    try {
      await setDoc(doc(db, 'officeGameState', uid), {
        uid,
        stats,
        day,
        status,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firebase updateOfficeGameState failed:', err);
    }
  },

  async getOfficeGameState(uid: string): Promise<any | null> {
    try {
      const snap = await getDoc(doc(db, 'officeGameState', uid));
      if (!snap.exists()) return null;
      return snap.data();
    } catch (err) {
      console.warn('Firebase getOfficeGameState failed:', err);
      return null;
    }
  },

  async saveActiveOfficeGame(uid: string, gameState: any): Promise<void> {
    try {
      await setDoc(doc(db, 'officeGameState', uid), {
        uid,
        ...gameState,
        updatedAt: new Date().toISOString(),
      }, { merge: false });
    } catch (err) {
      console.warn('Firebase saveActiveOfficeGame failed:', err);
    }
  },

  async getActiveOfficeGame(uid: string): Promise<any | null> {
    try {
      const snap = await getDoc(doc(db, 'officeGameState', uid));
      if (!snap.exists()) return null;
      return snap.data();
    } catch (err) {
      console.warn('Firebase getActiveOfficeGame failed:', err);
      return null;
    }
  },

  async clearActiveOfficeGame(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'officeGameState', uid));
    } catch (err) {
      console.warn('Firebase clearActiveOfficeGame failed:', err);
    }
  },

  async saveOfficeGameRecord(uid: string, recordData: any): Promise<void> {
    try {
      const col = collection(db, 'gameHistory');
      const docRef = doc(col);
      await setDoc(docRef, {
        id: docRef.id,
        uid,
        gameType: 'office',
        resultData: recordData,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firebase saveOfficeGameRecord failed:', err);
    }
  },

  async getOfficeGameRecords(uid: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'gameHistory'),
        where('uid', '==', uid),
        where('gameType', '==', 'office'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id }));
      return list;
    } catch (err) {
      console.warn('Firebase getOfficeGameRecords failed:', err);
      return [];
    }
  },
};
