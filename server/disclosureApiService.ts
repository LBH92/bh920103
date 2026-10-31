import { GoogleGenerativeAI } from '@google/generative-ai';

// Disclosure API Proxy Service (Placeholder for DART integration)
// Note: Actual DART API requires a registered API key. This implementation
// provides the structure for proxying data and summarizing with Gemini.

export interface DisclosureEvent {
  id: string;
  symbol: string;
  title: string;
  date: string;
  type: '유상증자' | '전환사채' | '신주인수권부사채' | '자사주' | '계약' | '실적' | '기타';
  link: string;
  summary?: string;
  riskLevel: 'high' | 'medium' | 'low';
}

// In a production environment, use environment variable for DART API Key
// const DART_API_KEY = process.env.DART_API_KEY;

export const disclosureApiService = {
  async getDisclosures(symbol: string): Promise<DisclosureEvent[]> {
    // Placeholder logic for DART API integration
    // In production, fetch from DART Open API: https://opendart.fss.or.kr/
    
    // Simulating returned data based on the request
    return [
      {
        id: '1',
        symbol,
        title: '주요사항보고서(유상증자결정)',
        date: '2026-10-30',
        type: '유상증자',
        link: 'https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20261030000001',
        riskLevel: 'high',
      },
      {
        id: '2',
        symbol,
        title: '연결재무제표기준영업(잠정)실적공시',
        date: '2026-10-29',
        type: '실적',
        link: 'https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20261029000002',
        riskLevel: 'low',
      }
    ];
  },

  async summarizeDisclosure(title: string, link: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `공시 제목: ${title}\n링크: ${link}\n위 공시 내용을 3줄 이내로 핵심만 요약해줘. 투자자 입장에서 위험 요인과 긍정 요인을 구분해서 명확히 기술해.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error('Error summarizing disclosure:', err);
      return '공시 내용을 요약할 수 없습니다.';
    }
  }
};
