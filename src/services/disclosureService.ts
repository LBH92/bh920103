import { DisclosureEvent } from '../types';

export const disclosureService = {
  async getDisclosures(symbol: string): Promise<DisclosureEvent[]> {
    try {
      const res = await fetch(`/api/disclosures/${symbol}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('[DisclosureService] Fetch error:', err);
    }
    return [];
  },

  async summarize(title: string, link: string): Promise<string> {
    try {
      const res = await fetch('/api/disclosures/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.summary;
      }
    } catch (err) {
      console.error('[DisclosureService] Summarize error:', err);
    }
    return '요약에 실패했습니다.';
  }
};
