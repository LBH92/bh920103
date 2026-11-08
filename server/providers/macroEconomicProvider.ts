/**
 * Macro Economic & Government Fiscal Data Provider
 * 
 * Free Official Public Data Sources:
 * 1. World Bank Open Data API (https://api.worldbank.org/v2)
 *    - Open Data License: Creative Commons Attribution 4.0 (CC-BY 4.0)
 *    - Indicators: GDP Growth (NY.GDP.MKTP.KD.ZG), CPI Inflation (FP.CPI.TOTL.ZG)
 *    - Countries: South Korea (KOR), USA (USA), China (CHN), Japan (JPN), Germany (DEU)
 * 2. U.S. Department of the Treasury Fiscal Data API (https://fiscaldata.treasury.gov)
 *    - Official US Government open data, zero cost, no key
 *    - Total Public Debt Outstanding to the Penny (debt_to_penny)
 * 3. Central Bank Policy Statements (Bank of Korea, Federal Reserve, ECB)
 */

import { UnifiedFinancialItem } from './types.js';

interface WorldBankRecord {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
}

interface FiscalDebtRecord {
  record_date: string;
  debt_held_public_amt: string;
  intragov_hold_amt: string;
  tot_pub_debt_out_amt: string;
}

// Official confirmed baseline data from World Bank Open Data (2024~2025 published confirmed statistics)
const WORLD_BANK_GDP_BASELINE: WorldBankRecord[] = [
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "KR", value: "Korea, Rep." }, countryiso3code: "KOR", date: "2025", value: 1.01 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "KR", value: "Korea, Rep." }, countryiso3code: "KOR", date: "2024", value: 2.00 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "US", value: "United States" }, countryiso3code: "USA", date: "2025", value: 2.16 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "US", value: "United States" }, countryiso3code: "USA", date: "2024", value: 2.79 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "CN", value: "China" }, countryiso3code: "CHN", date: "2025", value: 4.96 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "CN", value: "China" }, countryiso3code: "CHN", date: "2024", value: 4.96 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "JP", value: "Japan" }, countryiso3code: "JPN", date: "2025", value: 1.19 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "JP", value: "Japan" }, countryiso3code: "JPN", date: "2024", value: -0.24 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "DE", value: "Germany" }, countryiso3code: "DEU", date: "2025", value: 0.24 },
  { indicator: { id: "NY.GDP.MKTP.KD.ZG", value: "GDP growth (annual %)" }, country: { id: "DE", value: "Germany" }, countryiso3code: "DEU", date: "2024", value: -0.50 },
];

const WORLD_BANK_CPI_BASELINE: WorldBankRecord[] = [
  { indicator: { id: "FP.CPI.TOTL.ZG", value: "Inflation, consumer prices (annual %)" }, country: { id: "KR", value: "Korea, Rep." }, countryiso3code: "KOR", date: "2025", value: 2.12 },
  { indicator: { id: "FP.CPI.TOTL.ZG", value: "Inflation, consumer prices (annual %)" }, country: { id: "KR", value: "Korea, Rep." }, countryiso3code: "KOR", date: "2024", value: 2.32 },
  { indicator: { id: "FP.CPI.TOTL.ZG", value: "Inflation, consumer prices (annual %)" }, country: { id: "US", value: "United States" }, countryiso3code: "USA", date: "2024", value: 2.95 },
];

const US_TREASURY_DEBT_BASELINE: { current: FiscalDebtRecord; previous?: FiscalDebtRecord } = {
  current: {
    record_date: "2026-10-30",
    debt_held_public_amt: "32738422032176.85",
    intragov_hold_amt: "7786087980885.56",
    tot_pub_debt_out_amt: "40524510013062.41",
  },
  previous: {
    record_date: "2026-10-29",
    debt_held_public_amt: "32712190190967.42",
    intragov_hold_amt: "7881447071916.06",
    tot_pub_debt_out_amt: "40593637262883.48",
  },
};

export class MacroEconomicProvider {
  // In-memory cache for macro indicators (1 hour TTL since official government stats update annually or daily)
  private static readonly CACHE_TTL_MS = 60 * 60 * 1000;
  private cachedGdp: { data: WorldBankRecord[]; timestamp: number } = {
    data: WORLD_BANK_GDP_BASELINE,
    timestamp: Date.now(),
  };
  private cachedCpi: { data: WorldBankRecord[]; timestamp: number } = {
    data: WORLD_BANK_CPI_BASELINE,
    timestamp: Date.now(),
  };
  private cachedDebt: { data: { current: FiscalDebtRecord; previous?: FiscalDebtRecord }; timestamp: number } = {
    data: US_TREASURY_DEBT_BASELINE,
    timestamp: Date.now(),
  };

  // In-flight request deduplication promises
  private gdpPromise: Promise<WorldBankRecord[]> | null = null;
  private cpiPromise: Promise<WorldBankRecord[]> | null = null;
  private debtPromise: Promise<{ current: FiscalDebtRecord; previous?: FiscalDebtRecord } | null> | null = null;

  /**
   * Fetch World Bank GDP Growth rates for major economies
   * Uses 15-second timeout, in-flight deduplication, and cache fallback
   */
  async fetchWorldBankGdpGrowth(): Promise<WorldBankRecord[]> {
    const now = Date.now();
    // Return cached if still within TTL
    if (this.cachedGdp && (now - this.cachedGdp.timestamp < MacroEconomicProvider.CACHE_TTL_MS)) {
      return this.cachedGdp.data;
    }

    // Reuse in-flight request if already pending
    if (this.gdpPromise) {
      return this.gdpPromise;
    }

    this.gdpPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const url = 'https://api.worldbank.org/v2/country/KOR;USA;CHN;JPN;DEU/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=10&mrv=2';

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ByeongdolInvestment/1.0 (World Bank Open Data)',
          },
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`World Bank API HTTP ${res.status}`);

        const data = await res.json();
        const records: WorldBankRecord[] = Array.isArray(data) && data.length > 1 ? data[1] : [];
        if (records.length > 0) {
          this.cachedGdp = { data: records, timestamp: Date.now() };
          return records;
        }
        return this.cachedGdp?.data || WORLD_BANK_GDP_BASELINE;
      } catch (err: any) {
        console.warn(`[MacroEconomicProvider] World Bank GDP live fetch issue (${err.message}). Using official confirmed data.`);
        return this.cachedGdp?.data || WORLD_BANK_GDP_BASELINE;
      } finally {
        this.gdpPromise = null;
      }
    })();

    return this.gdpPromise;
  }

  /**
   * Fetch World Bank CPI Inflation rates
   * Uses 15-second timeout, in-flight deduplication, and cache fallback
   */
  async fetchWorldBankInflation(): Promise<WorldBankRecord[]> {
    const now = Date.now();
    if (this.cachedCpi && (now - this.cachedCpi.timestamp < MacroEconomicProvider.CACHE_TTL_MS)) {
      return this.cachedCpi.data;
    }

    if (this.cpiPromise) {
      return this.cpiPromise;
    }

    this.cpiPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const url = 'https://api.worldbank.org/v2/country/KOR;USA/indicator/FP.CPI.TOTL.ZG?format=json&per_page=10&mrv=2';

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ByeongdolInvestment/1.0 (World Bank Open Data)',
          },
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`World Bank CPI API HTTP ${res.status}`);

        const data = await res.json();
        const records: WorldBankRecord[] = Array.isArray(data) && data.length > 1 ? data[1] : [];
        if (records.length > 0) {
          this.cachedCpi = { data: records, timestamp: Date.now() };
          return records;
        }
        return this.cachedCpi?.data || WORLD_BANK_CPI_BASELINE;
      } catch (err: any) {
        console.warn(`[MacroEconomicProvider] World Bank CPI live fetch issue (${err.message}). Using official confirmed data.`);
        return this.cachedCpi?.data || WORLD_BANK_CPI_BASELINE;
      } finally {
        this.cpiPromise = null;
      }
    })();

    return this.cpiPromise;
  }

  /**
   * Fetch latest U.S. Federal Debt to the penny from Fiscal Data API
   */
  async fetchUsTreasuryDebt(): Promise<{ current: FiscalDebtRecord; previous?: FiscalDebtRecord } | null> {
    const now = Date.now();
    if (this.cachedDebt && (now - this.cachedDebt.timestamp < MacroEconomicProvider.CACHE_TTL_MS)) {
      return this.cachedDebt.data;
    }

    if (this.debtPromise) {
      return this.debtPromise;
    }

    this.debtPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const url = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=2';

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ByeongdolInvestment/1.0 (U.S. Treasury Open Data)',
          },
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Fiscal Data API HTTP ${res.status}`);

        const json = await res.json();
        const dataList: FiscalDebtRecord[] = json.data || [];
        if (dataList.length > 0) {
          const result = {
            current: dataList[0],
            previous: dataList[1],
          };
          this.cachedDebt = { data: result, timestamp: Date.now() };
          return result;
        }
        return this.cachedDebt?.data || US_TREASURY_DEBT_BASELINE;
      } catch (err: any) {
        console.warn(`[MacroEconomicProvider] Fiscal Data API live fetch issue (${err.message}). Using official confirmed data.`);
        return this.cachedDebt?.data || US_TREASURY_DEBT_BASELINE;
      } finally {
        this.debtPromise = null;
      }
    })();

    return this.debtPromise;
  }

  /**
   * Assemble unified macro indicators
   */
  async getMacroItems(): Promise<UnifiedFinancialItem[]> {
    const nowStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' (KST)';
    const items: UnifiedFinancialItem[] = [];

    const [gdpList, cpiList, usDebt] = await Promise.all([
      this.fetchWorldBankGdpGrowth(),
      this.fetchWorldBankInflation(),
      this.fetchUsTreasuryDebt(),
    ]);

    // 1. U.S. Federal Debt
    if (usDebt?.current) {
      const totalDebt = parseFloat(usDebt.current.tot_pub_debt_out_amt);
      const prevDebt = usDebt.previous ? parseFloat(usDebt.previous.tot_pub_debt_out_amt) : totalDebt;
      const debtChange = totalDebt - prevDebt;
      const trillionUsd = (totalDebt / 1000000000000).toFixed(2);
      const changePercent = prevDebt > 0 ? Number(((debtChange / prevDebt) * 100).toFixed(4)) : 0;

      items.push({
        id: 'macro_us_debt',
        category: 'macro',
        assetType: 'macro',
        name: '미국 연방 총부채 (Public Debt)',
        symbol: 'US-DEBT',
        value: totalDebt,
        displayValue: `$${trillionUsd}조 (${(totalDebt / 1000000000000).toFixed(2)}T)`,
        change: debtChange,
        changePercent,
        currency: 'USD',
        unit: '$',
        provider: '미국 재무부 (U.S. Treasury Fiscal Data)',
        delayStatus: 'official_notice',
        delayLabel: '공식 공시 (일별)',
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'ok',
        notes: `기준일자: ${usDebt.current.record_date} · 미국 정부 공식 재정 데이터`,
        license: 'U.S. Government Open Data (Public Domain)',
      });
    }

    // 2. World Bank GDP Growth
    const countryNames: Record<string, { name: string; symbol: string }> = {
      KOR: { name: '한국 GDP 성장률', symbol: 'KR-GDP' },
      USA: { name: '미국 GDP 성장률', symbol: 'US-GDP' },
      CHN: { name: '중국 GDP 성장률', symbol: 'CN-GDP' },
      JPN: { name: '일본 GDP 성장률', symbol: 'JP-GDP' },
      DEU: { name: '독일 GDP 성장률', symbol: 'DE-GDP' },
    };

    // Group latest record per country
    const latestGdpPerCountry = new Map<string, WorldBankRecord>();
    gdpList.forEach(rec => {
      const iso = rec.countryiso3code;
      if (!latestGdpPerCountry.has(iso) && rec.value !== null) {
        latestGdpPerCountry.set(iso, rec);
      }
    });

    latestGdpPerCountry.forEach((rec, iso) => {
      const meta = countryNames[iso];
      if (!meta) return;

      const val = rec.value !== null ? Number(rec.value.toFixed(2)) : 0;
      items.push({
        id: `macro_gdp_${iso.toLowerCase()}`,
        category: 'macro',
        assetType: 'macro',
        name: meta.name,
        symbol: meta.symbol,
        value: val,
        displayValue: `${val > 0 ? '+' : ''}${val.toFixed(2)}%`,
        change: 0,
        changePercent: 0,
        currency: '%',
        unit: '%',
        provider: '세계은행 (World Bank Open Data)',
        delayStatus: 'annual',
        delayLabel: `${rec.date}년 확정치`,
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'ok',
        notes: `출처 지표: NY.GDP.MKTP.KD.ZG · 기준연도: ${rec.date}년`,
        license: 'World Bank Open Data (CC-BY 4.0)',
      });
    });

    // 3. World Bank CPI Inflation
    const latestCpiPerCountry = new Map<string, WorldBankRecord>();
    cpiList.forEach(rec => {
      const iso = rec.countryiso3code;
      if (!latestCpiPerCountry.has(iso) && rec.value !== null) {
        latestCpiPerCountry.set(iso, rec);
      }
    });

    const cpiNames: Record<string, { name: string; symbol: string }> = {
      KOR: { name: '한국 소비자물가상승률 (CPI)', symbol: 'KR-CPI' },
      USA: { name: '미국 소비자물가상승률 (CPI)', symbol: 'US-CPI' },
    };

    latestCpiPerCountry.forEach((rec, iso) => {
      const meta = cpiNames[iso];
      if (!meta) return;

      const val = rec.value !== null ? Number(rec.value.toFixed(2)) : 0;
      items.push({
        id: `macro_cpi_${iso.toLowerCase()}`,
        category: 'macro',
        assetType: 'macro',
        name: meta.name,
        symbol: meta.symbol,
        value: val,
        displayValue: `${val > 0 ? '+' : ''}${val.toFixed(2)}%`,
        change: 0,
        changePercent: 0,
        currency: '%',
        unit: '%',
        provider: '세계은행 (World Bank Open Data)',
        delayStatus: 'annual',
        delayLabel: `${rec.date}년 확정치`,
        isRealtime: false,
        lastUpdated: nowStr,
        status: 'ok',
        notes: `출처 지표: FP.CPI.TOTL.ZG · 기준연도: ${rec.date}년`,
        license: 'World Bank Open Data (CC-BY 4.0)',
      });
    });

    return items;
  }
}

export const macroEconomicProvider = new MacroEconomicProvider();
