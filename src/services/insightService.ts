import { EditorialInsight, InsightCategory, InsightDraftGenerateRequest, InsightUpdateRequest } from '../types/insights';
import { auth } from './firebase';

async function getAuthHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};
  try {
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`,
      'x-user-uid': user.uid,
      'x-user-email': user.email || '',
    };
  } catch (e) {
    console.warn('[InsightService] Failed to retrieve ID token:', e);
    return {};
  }
}

export const insightService = {
  /**
   * Fetch published insights for public view
   */
  async fetchPublicInsights(category?: InsightCategory): Promise<EditorialInsight[]> {
    try {
      const url = category 
        ? `/api/insights/public?category=${encodeURIComponent(category)}`
        : '/api/insights/public';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('[InsightService] fetchPublicInsights error:', err.message);
      return [];
    }
  },

  /**
   * Fetch a single published insight by slug/ID
   */
  async fetchPublicInsightById(id: string): Promise<EditorialInsight | null> {
    try {
      const res = await fetch(`/api/insights/public/${encodeURIComponent(id)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('[InsightService] fetchPublicInsightById error:', err.message);
      return null;
    }
  },

  /**
   * Admin: Fetch all insights (drafts & published)
   */
  async fetchAdminInsights(): Promise<EditorialInsight[]> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/admin/insights', { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Admin: Request AI draft generation based on real live market data
   */
  async generateDraft(params: InsightDraftGenerateRequest): Promise<EditorialInsight> {
    const headers = {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    };
    const res = await fetch('/api/admin/insights/generate-draft', {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || '초안 생성에 실패했습니다.');
    }
    return data.draft;
  },

  /**
   * Admin: Update insight content, metadata, or status ('draft' | 'published')
   */
  async updateInsight(id: string, updates: Partial<EditorialInsight>): Promise<EditorialInsight> {
    const headers = {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    };
    const res = await fetch(`/api/admin/insights/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || '인사이트 수정에 실패했습니다.');
    }
    return data.insight;
  },

  /**
   * Admin: Delete an insight
   */
  async deleteInsight(id: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/admin/insights/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || '인사이트 삭제에 실패했습니다.');
    }
  },
};
