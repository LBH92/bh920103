// 16개 업종, 각 20개 표본 종목 매핑 (샘플 예시)
export const SECTOR_STOCK_MAPPING: Record<string, Array<{symbol: string, name: string, exchange: 'KOSPI' | 'KOSDAQ', approxCapKRWTrillion: number}>> = {
  '반도체': [
    { symbol: '005930', name: '삼성전자', exchange: 'KOSPI', approxCapKRWTrillion: 420 },
    { symbol: '000660', name: 'SK하이닉스', exchange: 'KOSPI', approxCapKRWTrillion: 135 },
    { symbol: '042700', name: '한미반도체', exchange: 'KOSPI', approxCapKRWTrillion: 15 },
    { symbol: '058470', name: '리노공업', exchange: 'KOSDAQ', approxCapKRWTrillion: 3 },
    { symbol: '039030', name: '이오테크닉스', exchange: 'KOSDAQ', approxCapKRWTrillion: 2.5 },
    // ... 더 많은 종목 추가 ...
    { symbol: '280360', name: '원익IPS', exchange: 'KOSDAQ', approxCapKRWTrillion: 1.8 },
    { symbol: '000680', name: 'LS ELECTRIC', exchange: 'KOSPI', approxCapKRWTrillion: 4 },
  ],
  '빅테크': [
    { symbol: '035420', name: 'NAVER', exchange: 'KOSPI', approxCapKRWTrillion: 26 },
    { symbol: '035720', name: '카카오', exchange: 'KOSPI', approxCapKRWTrillion: 18 },
    // ...
  ],
  // ... 나머지 14개 업종 동일하게 ...
};
