/**
 * English name and alias dictionary for major KOSPI / KOSDAQ stocks
 * Enables English search queries (e.g., "Samsung Electronics", "SK Hynix", "Alteogen")
 * without altering krxMasterStocks.json schema.
 */

export interface KrStockEnMeta {
  nameEn: string;
  aliases: string[];
}

export const KR_STOCK_EN_META: Record<string, KrStockEnMeta> = {
  '005930': { nameEn: 'Samsung Electronics', aliases: ['samsung', 'samsung electronics', 'sec'] },
  '005935': { nameEn: 'Samsung Electronics Pref', aliases: ['samsung pref'] },
  '000660': { nameEn: 'SK Hynix', aliases: ['sk hynix', 'hynix'] },
  '373220': { nameEn: 'LG Energy Solution', aliases: ['lg energy', 'lges', 'lg energy solution'] },
  '207940': { nameEn: 'Samsung Biologics', aliases: ['samsung biologics', 'biologics'] },
  '005380': { nameEn: 'Hyundai Motor', aliases: ['hyundai', 'hyundai motor'] },
  '000270': { nameEn: 'Kia Corp', aliases: ['kia', 'kia motors'] },
  '068270': { nameEn: 'Celltrion', aliases: ['celltrion'] },
  '005490': { nameEn: 'POSCO Holdings', aliases: ['posco', 'posco holdings'] },
  '105560': { nameEn: 'KB Financial Group', aliases: ['kb financial', 'kbfg'] },
  '055550': { nameEn: 'Shinhan Financial Group', aliases: ['shinhan', 'shinhan financial'] },
  '035420': { nameEn: 'NAVER', aliases: ['naver'] },
  '051910': { nameEn: 'LG Chem', aliases: ['lg chem'] },
  '035720': { nameEn: 'Kakao', aliases: ['kakao'] },
  '028260': { nameEn: 'Samsung C&T', aliases: ['samsung c&t', 'samsung cnt'] },
  '006400': { nameEn: 'Samsung SDI', aliases: ['samsung sdi', 'sdi'] },
  '066570': { nameEn: 'LG Electronics', aliases: ['lg electronics', 'lge'] },
  '012450': { nameEn: 'Hanwha Aerospace', aliases: ['hanwha', 'hanwha aerospace'] },
  '064350': { nameEn: 'Hyundai Rotem', aliases: ['rotem', 'hyundai rotem'] },
  '034020': { nameEn: 'Doosan Enerbility', aliases: ['doosan', 'doosan enerbility'] },
  '042700': { nameEn: 'HANMI Semiconductor', aliases: ['hanmi', 'hanmi semiconductor'] },
  '003670': { nameEn: 'POSCO Future M', aliases: ['posco future', 'posco future m'] },
  '329180': { nameEn: 'HD Hyundai Heavy Industries', aliases: ['hd hyundai', 'hyundai heavy'] },
  '259960': { nameEn: 'KRAFTON', aliases: ['krafton'] },
  '003490': { nameEn: 'Korean Air', aliases: ['korean air', 'kal'] },
  '015760': { nameEn: 'KEPCO', aliases: ['kepco', 'korea electric power'] },
  '017670': { nameEn: 'SK Telecom', aliases: ['skt', 'sk telecom'] },
  '030200': { nameEn: 'KT Corp', aliases: ['kt'] },
  '032830': { nameEn: 'Samsung Life Insurance', aliases: ['samsung life'] },
  '086790': { nameEn: 'Hana Financial Group', aliases: ['hana financial'] },
  '316140': { nameEn: 'Woori Financial Group', aliases: ['woori financial'] },
  '009540': { nameEn: 'HD Korea Shipbuilding', aliases: ['hd ksoe', 'korea shipbuilding'] },
  '010140': { nameEn: 'Samsung Heavy Industries', aliases: ['samsung heavy'] },
  '042660': { nameEn: 'Hanwha Ocean', aliases: ['hanwha ocean'] },
  '012330': { nameEn: 'Hyundai Mobis', aliases: ['mobis', 'hyundai mobis'] },
  '096770': { nameEn: 'SK Innovation', aliases: ['sk innovation'] },
  '010950': { nameEn: 'S-Oil', aliases: ['s-oil', 'soil'] },
  '000810': { nameEn: 'Samsung Fire & Marine', aliases: ['samsung fire'] },
  '033780': { nameEn: 'KT&G', aliases: ['kt&g', 'ktng'] },
  '352820': { nameEn: 'HYBE', aliases: ['hybe', 'bts'] },
  '041510': { nameEn: 'SM Entertainment', aliases: ['sm entertainment', 'sm'] },
  '035900': { nameEn: 'JYP Entertainment', aliases: ['jyp', 'jyp entertainment'] },
  // KOSDAQ Leaders
  '196170': { nameEn: 'Alteogen', aliases: ['alteogen'] },
  '247540': { nameEn: 'EcoPro BM', aliases: ['ecopro bm', 'ecoprobm'] },
  '086520': { nameEn: 'EcoPro', aliases: ['ecopro'] },
  '028300': { nameEn: 'HLB', aliases: ['hlb'] },
  '277810': { nameEn: 'Rainbow Robotics', aliases: ['rainbow robotics', 'rainbow'] },
  '058470': { nameEn: 'LEENO Industrial', aliases: ['leeno', 'leeno industrial'] },
  '403870': { nameEn: 'HPSP', aliases: ['hpsp'] },
  '145020': { nameEn: 'Hugel', aliases: ['hugel'] },
  '214150': { nameEn: 'Classys', aliases: ['classys'] },
  '263750': { nameEn: 'Pearl Abyss', aliases: ['pearl abyss'] },
  '293490': { nameEn: 'Kakao Games', aliases: ['kakao games'] },
  '035760': { nameEn: 'CJ ENM', aliases: ['cj enm'] },
  '039030': { nameEn: 'EO Technics', aliases: ['eo technics'] },
  '005290': { nameEn: 'Dongjin Semichem', aliases: ['dongjin', 'dongjin semichem'] },
};

export function getKrStockEnMeta(code: string): KrStockEnMeta | undefined {
  return KR_STOCK_EN_META[code];
}
