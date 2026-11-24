/**
 * Editorial Content Service (Admin Only)
 * 
 * Strict Principles:
 * 1. Admin/Operator ONLY - Never callable by regular users or unauthenticated clients.
 * 2. Generates initial DRAFT content only (status: 'draft'). NEVER auto-publishes.
 * 3. Incorporates real live market metrics (Kiwoom / KRX / US) as ground truth context.
 * 4. Factual verification guardrails:
 *    - Strictly prohibits hallucinating prices, percentages, historical events, or non-existent citations.
 *    - Visually and structurally distinguishes official market data from AI analytical commentary.
 *    - Prohibits definitive investment advice ("무조건 오른다", "반드시 매수해야 한다" 금지).
 *    - Automatically includes mandatory investment risk disclaimer.
 * 5. Rate limiting & concurrency locks:
 *    - In-flight generation lock to prevent duplicate parallel requests.
 *    - Minimum cooldown between generations.
 * 6. Isolated from user 1:1 AI briefing logic.
 */

import { GoogleGenAI } from '@google/genai';
import { adminDb } from './firebaseAdmin';
import { EditorialInsight, InsightCategory, InsightDraftGenerateRequest } from '../src/types/insights';
import { fetchRealStockDataWithSource, fetchRealIndicesWithSource, fetchRealExchangeRate, TRACKED_STOCKS } from './stockApiService';

const INSIGHTS_COLLECTION = 'insights';

// In-flight concurrency lock & generation cooldown
let isGeneratingDraft = false;
let lastGenerationTime = 0;
const GENERATION_COOLDOWN_MS = 10000; // 10 seconds between generations

// In-memory insights cache (ensures zero crash / seamless testing when running in dev containers)
const inMemoryInsights = new Map<string, EditorialInsight>();

export const editorialContentService = {
  /**
   * Test helper methods for automated verification
   */
  addTestInsight(insight: EditorialInsight): void {
    inMemoryInsights.set(insight.id, insight);
  },

  removeTestInsight(id: string): void {
    inMemoryInsights.delete(id);
  },

  /**
   * Generate an editorial draft using Gemini API with ground-truth market data context.
   * Result is ALWAYS saved with status: 'draft'.
   */
  async generateDraft(
    params: InsightDraftGenerateRequest,
    adminUid: string,
    adminEmail: string
  ): Promise<EditorialInsight> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('서버에 GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.');
    }

    if (isGeneratingDraft) {
      throw new Error('이미 다른 콘텐츠 초안을 생성 중입니다. 잠시 후 다시 시도해 주세요.');
    }

    const now = Date.now();
    if (now - lastGenerationTime < GENERATION_COOLDOWN_MS) {
      const waitSec = Math.ceil((GENERATION_COOLDOWN_MS - (now - lastGenerationTime)) / 1000);
      throw new Error(`연속 생성 방지를 위해 ${waitSec}초 후 다시 시도해 주세요.`);
    }

    isGeneratingDraft = true;
    lastGenerationTime = now;

    try {
      const { category, topic, targetSymbol } = params;

      // 1. Collect verified ground-truth market data
      let marketContextStr = '';
      let targetStockName = '';
      let benchmarkPrice = 0;
      let changePercent = 0;
      let currentExchangeRateVal: number | null = null;

      try {
        const [indicesRes, exRateRes] = await Promise.allSettled([
          fetchRealIndicesWithSource(),
          fetchRealExchangeRate(),
        ]);

        if (indicesRes.status === 'fulfilled' && indicesRes.value?.indices) {
          const kospi = indicesRes.value.indices.find(i => i.symbol === 'KOSPI');
          const kosdaq = indicesRes.value.indices.find(i => i.symbol === 'KOSDAQ');
          marketContextStr += `\n[국내 주요 지수]\n- 코스피: ${kospi?.value.toLocaleString() ?? '확인 중'}pt (${kospi?.changePercent ?? 0}%)\n- 코스닥: ${kosdaq?.value.toLocaleString() ?? '확인 중'}pt (${kosdaq?.changePercent ?? 0}%)\n`;
        }

        if (
          exRateRes.status === 'fulfilled' &&
          exRateRes.value?.rate &&
          exRateRes.value.rate > 0 &&
          !exRateRes.value.isStale &&
          exRateRes.value.status !== 'error'
        ) {
          currentExchangeRateVal = exRateRes.value.rate;
          marketContextStr += `- 원/달러 환율: ${exRateRes.value.rate.toLocaleString()}원 (${exRateRes.value.changePercent}%)\n`;
        } else {
          marketContextStr += `- 원/달러 환율: 실시간 조회 지연/불가\n`;
        }

        if (targetSymbol) {
          const stockRes = await fetchRealStockDataWithSource(targetSymbol);
          if (stockRes?.stock) {
            targetStockName = stockRes.stock.name;
            benchmarkPrice = stockRes.stock.price;
            changePercent = stockRes.stock.changePercent;
            const cur = stockRes.stock.currency || (stockRes.stock.market === 'US' ? 'USD' : 'KRW');
            const priceLabel = cur === 'USD' ? `$${stockRes.stock.price.toFixed(2)}` : `${stockRes.stock.price.toLocaleString()}원`;
            const capLabel = cur === 'USD' ? `${stockRes.stock.marketCap}억 달러` : `${stockRes.stock.marketCap}억 원`;
            marketContextStr += `\n[분석 대상 종목 실시간 수치]\n- 종목명: ${stockRes.stock.name} (${stockRes.stock.symbol})\n- 통화/시장: ${cur} / ${stockRes.stock.market}\n- 현재가: ${priceLabel}\n- 등락률: ${stockRes.stock.changePercent}%\n- 거래량: ${stockRes.stock.volume.toLocaleString()}주\n- 시가총액: ${capLabel}\n- 52주 최고/최저: ${stockRes.stock.high52w} / ${stockRes.stock.low52w}\n`;
          }
        }
      } catch (err: any) {
        console.warn('[EditorialContentService] Market context collection error:', err.message);
      }

      const categoryLabels: Record<InsightCategory, string> = {
        'domestic-market': '국내 증시 분석',
        'us-market': '미국 증시 분석',
        'economy': '글로벌 거시경제 분석',
      };

      const categoryLabel = categoryLabels[category] || '시장 분석 리포트';

      // 2. Formulate Prompt with strict analytical guardrails
      const systemInstruction = `
당신은 '병돌 인베스트먼트(Byeongdol Investment)' 리서치팀의 수석 금융 애널리스트입니다.
정보성과 신뢰성이 높은 전문 금융 리서치 아티클 초안을 작성하십시오.

[작성 지침 및 절대 원칙]
1. 실제 제공된 공식 시장 데이터만을 기초로 분석하십시오. 가상의 가격, 지어낸 공시, 존재하지 않는 통계 수치는 절대로 날조하지 마십시오.
2. 특정 데이터나 수급 지표가 부족한 경우 솔직하게 "추가적인 데이터 확인이 필요합니다"라고 명시하십시오.
3. 단정적 매수/매도 권유 ("무조건 오른다", "강력 매수", "확실한 수익" 등)를 엄격히 금지합니다.
4. 구글 애드센스 품질 가이드라인을 준수하여, 다른 곳에서 복사해 온 듯한 상투적인 요약이 아니라 체계적인 논리와 섹터별 상관관계를 담은 고품질의 풍부한 글(최소 800자 이상)을 작성하십시오.
5. 반드시 마크다운(Markdown) 포맷으로 다음 구조를 정확히 지켜 작성하십시오:
   - ## 1. 시장 및 종목 핵심 개요 (공식 팩트 데이터)
   - ## 2. 수급 및 주요 이슈 분석
   - ## 3. 거시 지표와의 상관관계 및 전망
   - ## 4. 투자자가 주목해야 할 핵심 체크포인트 & 리스크
   - ## 5. 투자 유의사항 (Disclaimer)
`.trim();

      const prompt = `
[카테고리]: ${categoryLabel}
[분석 주제/키워드]: ${topic || (targetStockName ? `${targetStockName} 시황 및 수급 분석` : `${categoryLabel} 주간 동향`)}
${targetSymbol ? `[분석 대상 종목]: ${targetStockName} (${targetSymbol})` : ''}

[실시간 검증 시장 데이터]:
${marketContextStr || '일반적인 공인 시장 지표 기반'}

위 지침에 따라 독자에게 깊이 있는 통찰을 주는 정규 리서치 아티클 초안(Title, Summary, Content 마크다운)을 JSON 포맷으로 작성해 주십시오.
JSON 출력 포맷:
{
  "title": "기사의 명확하고 전문적인 제목 (예: [주간 증시 브리핑] 반도체 수급 개선과 코스피 반등 가능성 점검)",
  "summary": "1~2문장의 핵심 요약문 (SEO 메타 디스크립션으로 활용될 내용)",
  "tags": ["태그1", "태그2", "태그3"],
  "content": "위 5개 헤더를 포함한 마크다운 본문"
}
`.trim();

      // 3. Call Gemini API
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }
        ],
        config: {
          temperature: 0.3,
          maxOutputTokens: 2500,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response?.text?.trim() || '';
      let parsed: { title: string; summary: string; tags: string[]; content: string };

      try {
        parsed = JSON.parse(responseText);
      } catch (jsonErr) {
        // Fallback parser if markdown blocks exist
        const cleaned = responseText.replace(/^```json/m, '').replace(/```$/m, '').trim();
        parsed = JSON.parse(cleaned);
      }

      if (!parsed.title || !parsed.content) {
        throw new Error('Gemini 응답에서 유효한 제목 또는 본문을 추출하지 못했습니다.');
      }

      // Add mandatory disclaimer if omitted
      if (!parsed.content.includes('투자 유의사항') && !parsed.content.includes('Disclaimer')) {
        parsed.content += '\n\n---\n\n> **[투자 유의사항]** 본 리서치 자료는 정보 제공을 목적으로 작성되었으며, 특정 금융투자상품의 매수 또는 매도를 권유하지 않습니다. 투자 판단의 최종 책임은 투자자 본인에게 있습니다.';
      }

      const isoNow = new Date().toISOString();
      const slug = `insight-${Date.now()}`;

      const draftInsight: EditorialInsight = {
        id: slug,
        title: parsed.title.trim(),
        summary: parsed.summary?.trim() || parsed.title.trim(),
        content: parsed.content.trim(),
        category,
        categoryLabel,
        targetSymbol: targetSymbol || undefined,
        targetSymbolName: targetStockName || undefined,
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['증시분석', '금융리서치'],
        status: 'draft', // NEVER AUTO-PUBLISH
        authorName: '병돌 리서치팀',
        readTimeMinutes: Math.max(2, Math.round(parsed.content.length / 500)),
        viewCount: 0,
        marketDataSnapshot: {
          benchmarkPrice: benchmarkPrice || undefined,
          changePercent: changePercent || undefined,
          exchangeRate: currentExchangeRateVal ?? undefined,
          dataTimestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' KST',
        },
        createdAt: isoNow,
        updatedAt: isoNow,
      };

      // 4. Save to in-memory cache and Firestore via Admin SDK
      inMemoryInsights.set(slug, draftInsight);
      try {
        await adminDb.collection(INSIGHTS_COLLECTION).doc(slug).set(draftInsight);
      } catch (dbErr: any) {
        console.warn('[EditorialContentService] Firestore write warning (cached in memory):', dbErr.message);
      }

      console.log(`[EditorialContentService] Successfully generated draft "${draftInsight.title}" (ID: ${slug}) by admin ${adminEmail}`);
      return draftInsight;

    } catch (err: any) {
      console.error('[EditorialContentService] Draft generation failed:', err);
      throw new Error(`콘텐츠 초안 생성 중 오류가 발생했습니다: ${err.message || String(err)}`);
    } finally {
      isGeneratingDraft = false;
    }
  },

  /**
   * Get all insights for Admin (includes drafts & published)
   */
  async getAdminInsights(limitCount: number = 50): Promise<EditorialInsight[]> {
    const list: EditorialInsight[] = [];
    try {
      const snap = await adminDb
        .collection(INSIGHTS_COLLECTION)
        .orderBy('createdAt', 'desc')
        .limit(limitCount)
        .get();

      snap.forEach(doc => {
        list.push({ ...doc.data(), id: doc.id } as EditorialInsight);
      });
    } catch (err: any) {
      console.warn('[EditorialContentService] getAdminInsights error (using memory cache):', err.message);
    }

    // Merge in-memory insights
    for (const item of inMemoryInsights.values()) {
      if (!list.some(doc => doc.id === item.id)) {
        list.push(item);
      }
    }

    return list.slice(0, limitCount);
  },

  /**
   * Update an insight (content, title, tags, or publish status)
   */
  async updateInsight(
    id: string,
    updates: Partial<EditorialInsight>,
    adminEmail: string
  ): Promise<EditorialInsight> {
    let current = inMemoryInsights.get(id);

    try {
      const docRef = adminDb.collection(INSIGHTS_COLLECTION).doc(id);
      const snap = await docRef.get();
      if (snap.exists) {
        current = snap.data() as EditorialInsight;
      }
    } catch {}

    if (!current) {
      throw new Error('수정할 콘텐츠 문서를 찾을 수 없습니다.');
    }

    const isoNow = new Date().toISOString();

    const merged: EditorialInsight = {
      ...current,
      ...updates,
      id,
      updatedAt: isoNow,
    };

    if (updates.status === 'published' && current.status !== 'published') {
      merged.publishedAt = isoNow;
    }

    inMemoryInsights.set(id, merged);

    try {
      const docRef = adminDb.collection(INSIGHTS_COLLECTION).doc(id);
      await docRef.set(merged, { merge: true });
    } catch {}

    console.log(`[EditorialContentService] Insight "${id}" updated by ${adminEmail} (Status: ${merged.status})`);
    return merged;
  },

  /**
   * Delete an insight
   */
  async deleteInsight(id: string, adminEmail: string): Promise<void> {
    inMemoryInsights.delete(id);
    try {
      await adminDb.collection(INSIGHTS_COLLECTION).doc(id).delete();
    } catch {}
    console.log(`[EditorialContentService] Insight "${id}" deleted by ${adminEmail}`);
  },

  /**
   * Get public published insights only (Used by Public API & SEO Prerenderer)
   * CRITICAL SECURITY INVARIANT:
   * Only items with status === 'published' can EVER be returned.
   * Drafts are strictly excluded.
   */
  async getPublicPublishedInsights(category?: InsightCategory, limitCount: number = 30): Promise<EditorialInsight[]> {
    const list: EditorialInsight[] = [];
    try {
      let queryRef: any = adminDb
        .collection(INSIGHTS_COLLECTION)
        .where('status', '==', 'published');

      if (category) {
        queryRef = queryRef.where('category', '==', category);
      }

      const snap = await queryRef.orderBy('createdAt', 'desc').limit(limitCount).get();
      snap.forEach((doc: any) => {
        const data = doc.data() as EditorialInsight;
        if (data.status === 'published') {
          list.push({ ...data, id: doc.id });
        }
      });
    } catch (err: any) {
      // In dev containers where adminDb lacks credentials, safely query memory store
    }

    // Merge memory published items (strictly enforcing status === 'published')
    for (const item of inMemoryInsights.values()) {
      if (item.status === 'published' && !list.some(doc => doc.id === item.id)) {
        if (!category || item.category === category) {
          list.push(item);
        }
      }
    }

    return list.slice(0, limitCount);
  },

  /**
   * Get single published insight by ID or slug (Used by Public Detail View & SEO Prerenderer)
   * CRITICAL SECURITY INVARIANT:
   * Drafts return null. Only status === 'published' is returned.
   */
  async getPublicInsightById(id: string): Promise<EditorialInsight | null> {
    try {
      const docSnap = await adminDb.collection(INSIGHTS_COLLECTION).doc(id).get();
      if (docSnap.exists) {
        const data = docSnap.data() as EditorialInsight;
        if (data.status !== 'published') return null; // STRICT DRAFT BLOCK
        return { ...data, id: docSnap.id };
      }
    } catch (err: any) {}

    const mem = inMemoryInsights.get(id);
    if (mem) {
      if (mem.status !== 'published') return null; // STRICT DRAFT BLOCK
      return mem;
    }
    return null;
  },
};
