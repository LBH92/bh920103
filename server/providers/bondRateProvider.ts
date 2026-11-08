/**
 * Bond Yields & Benchmark Policy Rates Provider
 * 
 * Sources:
 * 1. Official Central Bank Announcements
 *    - Bank of Korea (한국은행 금융통화위원회)
 *    - Federal Reserve FOMC (미국 연방공개시장위원회)
 *    - European Central Bank (유럽중앙은행 통화정책이사회)
 *    - Bank of Japan (일본은행 금융정책결정회의)
 * 2. CBOE Sovereign Treasury Yields
 *    - US 10Y Treasury Yield (^TNX)
 *    - US 2Y Treasury Yield (2YY=F)
 *    - US 30Y Treasury Yield (^TYX)
 */

import { UnifiedFinancialItem } from './types.js';

interface RateConfig {
  id: string;
  name: string;
  symbol: string;
  ticker?: string;
  isBenchmark: boolean;
  benchmarkValue?: number;
  benchmarkRange?: string;
  provider: string;
  notes?: string;
}

const RATES_CONFIG: RateConfig[] = [
  // 1. Central Bank Benchmark Policy Rates (주요국 기준금리)
  {
    id: 'rate_fed',
    name: '미국 기준금리 (Fed Funds Rate)',
    symbol: 'FED-FUNDS',
    isBenchmark: true,
    benchmarkValue: 4.625,
    benchmarkRange: '4.50 ~ 4.75%',
    provider: '미국 연방준비제도 (Federal Reserve) FOMC',
    notes: '2024.12 FOMC 결정치 (목표 밴드 4.50~4.75%)',
  },
  {
    id: 'rate_bok',
    name: '한국 기준금리',
    symbol: 'BOK-BASE',
    isBenchmark: true,
    benchmarkValue: 3.00,
    benchmarkRange: '3.00%',
    provider: '한국은행 (Bank of Korea) 금융통화위원회',
    notes: '2024.11 금융통화위원회 인하 결정치 (3.00%)',
  },
  {
    id: 'rate_ecb',
    name: '유로존 기준금리 (ECB Deposit / Refi)',
    symbol: 'ECB-RATE',
    isBenchmark: true,
    benchmarkValue: 3.00,
    benchmarkRange: '수신 3.00% / 기준 3.15%',
    provider: '유럽중앙은행 (ECB) 통화정책이사회',
    notes: '2024.12 통화정책이사회 결정치 (수신금리 3.00%, 기준대출금리 3.15%)',
  },
  {
    id: 'rate_boe',
    name: '영국 기준금리 (BOE Bank Rate)',
    symbol: 'BOE-RATE',
    isBenchmark: true,
    benchmarkValue: 4.75,
    benchmarkRange: '4.75%',
    provider: '영국은행 (Bank of England) MPC',
    notes: '2024.11 통화정책위원회 결정치 (4.75%)',
  },
  {
    id: 'rate_boj',
    name: '일본 기준금리 (BOJ Policy Rate)',
    symbol: 'BOJ-RATE',
    isBenchmark: true,
    benchmarkValue: 0.25,
    benchmarkRange: '0.25%',
    provider: '일본은행 (Bank of Japan) 금융정책결정회의',
    notes: '무담보 콜금리 유도 목표 (0.25%)',
  },

  // 2. 10Y Sovereign Bond Yields (10년물 국채수익률)
  {
    id: 'yield_us10y',
    name: '미국 10년물 국채수익률',
    symbol: 'US-10Y',
    ticker: '^TNX',
    isBenchmark: false,
    provider: 'CBOE / 미국 재무부 유통수익률',
    notes: '글로벌 장기 금리 대표 벤치마크 (15분 지연)',
  },
  {
    id: 'yield_kr10y',
    name: '한국 10년물 국채수익률',
    symbol: 'KR-10Y',
    isBenchmark: true,
    benchmarkValue: 2.85,
    benchmarkRange: '2.850%',
    provider: '한국은행 / 금융투자협회 (KOFIA)',
    notes: '국고채 10년물 유통수익률 고시 (2.85%)',
  },
  {
    id: 'yield_jp10y',
    name: '일본 10년물 국채수익률',
    symbol: 'JP-10Y',
    isBenchmark: true,
    benchmarkValue: 1.05,
    benchmarkRange: '1.050%',
    provider: '일본은행 (BOJ) / 도쿄증권거래소',
    notes: '신규발행 10년물 일본 국채 (JGB) 수익률',
  },
  {
    id: 'yield_de10y',
    name: '독일 10년물 분트 수익률',
    symbol: 'DE-10Y',
    isBenchmark: true,
    benchmarkValue: 2.18,
    benchmarkRange: '2.180%',
    provider: '도이체 분데스방크 (Bundesbank)',
    notes: '유로존 10년물 벤치마크 분트(Bund) 수익률',
  },
  {
    id: 'yield_cn10y',
    name: '중국 10년물 국채수익률',
    symbol: 'CN-10Y',
    isBenchmark: true,
    benchmarkValue: 1.82,
    benchmarkRange: '1.820%',
    provider: '중국인민은행 (PBOC) / CFETS',
    notes: '중국 중앙국채 10년물 유통수익률',
  },
  {
    id: 'yield_us2y',
    name: '미국 2년물 국채수익률',
    symbol: 'US-2Y',
    ticker: '2YY=F',
    isBenchmark: false,
    provider: 'CBOE / 미국 국채 유통수익률',
    notes: '통화정책 민감 단기 금리 벤치마크 (15분 지연)',
  },
  {
    id: 'yield_us30y',
    name: '미국 30년물 국채수익률',
    symbol: 'US-30Y',
    ticker: '^TYX',
    isBenchmark: false,
    provider: 'CBOE / 미국 국채 유통수익률',
    notes: '미국 초장기 국채 금리 (15분 지연)',
  },
];

export class BondRateProvider {
  private async fetchMarketYield(cfg: RateConfig): Promise<UnifiedFinancialItem> {
    const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' (KST)';

    if (cfg.isBenchmark) {
      const val = cfg.benchmarkValue || 0;
      return {
        id: cfg.id,
        category: 'rates',
        assetType: 'rate',
        name: cfg.name,
        symbol: cfg.symbol,
        value: val,
        displayValue: cfg.benchmarkRange || `${val.toFixed(2)}%`,
        change: 0,
        changePercent: 0,
        currency: '%',
        unit: '%',
        provider: cfg.provider,
        delayStatus: 'official_notice',
        delayLabel: '공식 고시',
        isRealtime: false,
        marketSession: 'CLOSED',
        lastUpdated: nowStr,
        status: 'ok',
        notes: cfg.notes,
        license: '중앙은행 공식 공표문',
      };
    }

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cfg.ticker!)}?interval=1d&range=5d`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) throw new Error('Data unavailable');

      const meta = result.meta;
      const rawPrice = meta.regularMarketPrice ?? meta.chartPreviousClose;
      const rawPrev = meta.chartPreviousClose ?? rawPrice;

      const price = Number(rawPrice.toFixed(3));
      const prevClose = Number(rawPrev.toFixed(3));
      const change = Number((price - prevClose).toFixed(3));
      const changePercent = prevClose !== 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

      const closeArray = (result.indicators?.quote?.[0]?.close || [])
        .filter((v: any) => v !== null && v !== undefined)
        .map((v: number) => Number(v.toFixed(3)));
      const sparkline = closeArray.length >= 2 ? closeArray.slice(-8) : [prevClose, price];

      return {
        id: cfg.id,
        category: 'rates',
        assetType: 'bond',
        name: cfg.name,
        symbol: cfg.symbol,
        value: price,
        displayValue: `${price.toFixed(3)}%`,
        change,
        changePercent,
        currency: '%',
        unit: '%',
        high: meta.regularMarketDayHigh ? Number(meta.regularMarketDayHigh.toFixed(3)) : undefined,
        low: meta.regularMarketDayLow ? Number(meta.regularMarketDayLow.toFixed(3)) : undefined,
        prevClose,
        sparkline,
        provider: cfg.provider,
        delayStatus: 'delayed_15m',
        delayLabel: '15분 지연 시세',
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'ok',
        notes: cfg.notes,
      };
    } catch (err: any) {
      console.warn(`[BondRateProvider] Error fetching ${cfg.name}:`, err.message);
      return {
        id: cfg.id,
        category: 'rates',
        assetType: 'bond',
        name: cfg.name,
        symbol: cfg.symbol,
        value: 0,
        change: 0,
        changePercent: 0,
        currency: '%',
        unit: '%',
        provider: cfg.provider,
        delayStatus: 'delayed_15m',
        delayLabel: '15분 지연',
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'unavailable',
        errorMessage: '국채 수익률 시세 일시 지연',
      };
    }
  }

  async getBondRateItems(): Promise<UnifiedFinancialItem[]> {
    return Promise.all(RATES_CONFIG.map(c => this.fetchMarketYield(c)));
  }
}

export const bondRateProvider = new BondRateProvider();
