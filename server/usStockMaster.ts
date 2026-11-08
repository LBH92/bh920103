/**
 * US Stock Search Master Service
 * 
 * Provides:
 * - Extensive master list of NASDAQ & NYSE listed companies (equities, ETFs, index trackers)
 * - Ticker, English name, and Korean alias (한글 종목명) mappings
 * - On-demand real-time search with Yahoo Finance query integration
 * - Server-side caching and pagination support
 * - Ticker case-insensitive & partial match support
 */

export interface USStockMasterItem {
  symbol: string;
  name: string; // Korean name or English name
  nameEn: string; // Official English company name
  exchange: 'NASDAQ' | 'NYSE' | 'AMEX' | 'BATS';
  type: 'EQUITY' | 'ETF' | 'ADR' | 'INDEX';
  sector: string;
  currency: 'USD';
  aliases: string[]; // Alternate keywords / aliases for search
}

// Curated comprehensive master database of major NASDAQ & NYSE traded stocks, ADRs, and ETFs
export const US_STOCK_MASTER: USStockMasterItem[] = [
  // 0. Major US Market Indices (NASDAQ Composite, NASDAQ 100, Dow Jones, S&P 500, Russell 2000)
  { symbol: '^IXIC', name: '나스닥 종합지수', nameEn: 'NASDAQ Composite Index', exchange: 'NASDAQ', type: 'INDEX', sector: '미국 대표 기술주 지수', currency: 'USD', aliases: ['나스닥', 'nasdaq', 'ixic', '나스닥종합', 'ㄴㅅㄷ'] },
  { symbol: '^NDX', name: '나스닥 100 지수', nameEn: 'NASDAQ 100 Index', exchange: 'NASDAQ', type: 'INDEX', sector: '나스닥 상위 100 기술주 지수', currency: 'USD', aliases: ['나스닥100', 'ndx', 'qqq지수'] },
  { symbol: '^DJI', name: '다우존스 산업평균지수', nameEn: 'Dow Jones Industrial Average', exchange: 'NYSE', type: 'INDEX', sector: '미국 30대 대표 우량기업 지수', currency: 'USD', aliases: ['다우', '다우존스', 'dji', 'dow', 'ㄷㅇ'] },
  { symbol: '^GSPC', name: 'S&P 500 지수', nameEn: 'S&P 500 Index', exchange: 'NYSE', type: 'INDEX', sector: '미국 대형주 500 대표 지수', currency: 'USD', aliases: ['에스앤피', 'sp500', 's&p', 's&p500', 'gspc', '스파이지수'] },
  { symbol: '^RUT', name: '러셀 2000 지수', nameEn: 'Russell 2000 Index', exchange: 'NYSE', type: 'INDEX', sector: '미국 중소형주 대표 지수', currency: 'USD', aliases: ['러셀', '러셀2000', 'rut', '소형주지수', 'ㄹㅅ'] },

  // Mega-cap Tech & High Profile Equities
  { symbol: 'AAPL', name: '애플', nameEn: 'Apple Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '빅테크 / IT', currency: 'USD', aliases: ['사과', '아이폰', 'mac'] },
  { symbol: 'NVDA', name: '엔비디아', nameEn: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'EQUITY', sector: '반도체 / AI', currency: 'USD', aliases: ['지포스', '황사장', 'cuda'] },
  { symbol: 'MSFT', name: '마이크로소프트', nameEn: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'EQUITY', sector: '클라우드 / AI', currency: 'USD', aliases: ['윈도우', 'azure', 'ms'] },
  { symbol: 'TSLA', name: '테슬라', nameEn: 'Tesla, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '전기차 / 자율주행', currency: 'USD', aliases: ['일론머스크', '모델3', 'ev'] },
  { symbol: 'AMZN', name: '아마존', nameEn: 'Amazon.com, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '전자상거래 / 클라우드', currency: 'USD', aliases: ['aws', '프라임'] },
  { symbol: 'GOOGL', name: '알파벳 A', nameEn: 'Alphabet Inc. Class A', exchange: 'NASDAQ', type: 'EQUITY', sector: '검색 / AI', currency: 'USD', aliases: ['구글', 'google', '안드로이드', '유튜브'] },
  { symbol: 'GOOG', name: '알파벳 C', nameEn: 'Alphabet Inc. Class C', exchange: 'NASDAQ', type: 'EQUITY', sector: '검색 / AI', currency: 'USD', aliases: ['구글C', 'google'] },
  { symbol: 'META', name: '메타 플랫폼스', nameEn: 'Meta Platforms, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: 'SNS / 메타버스', currency: 'USD', aliases: ['페이스북', '인스타그램', 'facebook', 'instagram'] },
  { symbol: 'AVGO', name: '브로드컴', nameEn: 'Broadcom Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '반도체 / 통신', currency: 'USD', aliases: ['broadcom'] },
  { symbol: 'AMD', name: 'AMD (어드밴스드 마이크로 디바이스)', nameEn: 'Advanced Micro Devices, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '반도체 / CPU', currency: 'USD', aliases: ['라이젠', '라데온', '리사수'] },
  { symbol: 'QCOM', name: '퀄컴', nameEn: 'QUALCOMM Incorporated', exchange: 'NASDAQ', type: 'EQUITY', sector: '통신 / 반도체', currency: 'USD', aliases: ['스냅드래곤'] },
  { symbol: 'INTC', name: '인텔', nameEn: 'Intel Corporation', exchange: 'NASDAQ', type: 'EQUITY', sector: '반도체 / 파운드리', currency: 'USD', aliases: ['intel'] },
  { symbol: 'TXN', name: '텍사스 인스트루먼트', nameEn: 'Texas Instruments Incorporated', exchange: 'NASDAQ', type: 'EQUITY', sector: '아날로그 반도체', currency: 'USD', aliases: ['ti'] },
  { symbol: 'MU', name: '마이크론 테크놀로지', nameEn: 'Micron Technology, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '메모리 반도체', currency: 'USD', aliases: ['micron', 'dram'] },
  { symbol: 'ARM', name: 'ARM 홀딩스 ADR', nameEn: 'Arm Holdings plc ADR', exchange: 'NASDAQ', type: 'ADR', sector: '반도체 IP', currency: 'USD', aliases: ['arm'] },
  { symbol: 'ASML', name: 'ASML 홀딩 ADR', nameEn: 'ASML Holding N.V. ADR', exchange: 'NASDAQ', type: 'ADR', sector: '반도체 노광장비', currency: 'USD', aliases: ['euv', '슈퍼을'] },
  { symbol: 'TSM', name: 'TSMC ADR', nameEn: 'Taiwan Semiconductor Manufacturing Co. ADR', exchange: 'NYSE', type: 'ADR', sector: '파운드리', currency: 'USD', aliases: ['대만반도체', '파운드리'] },
  { symbol: 'BABA', name: '알리바바 ADR', nameEn: 'Alibaba Group Holding Limited ADR', exchange: 'NYSE', type: 'ADR', sector: '전자상거래 / 클라우드', currency: 'USD', aliases: ['알리바바', '마윈'] },
  { symbol: 'PDD', name: 'PDD 홀딩스 (핀둬둬/테무) ADR', nameEn: 'PDD Holdings Inc. ADR', exchange: 'NASDAQ', type: 'ADR', sector: '이커머스 / 테무', currency: 'USD', aliases: ['테무', '핀둬둬'] },
  { symbol: 'JD', name: '징둥닷컴 ADR', nameEn: 'JD.com, Inc. ADR', exchange: 'NASDAQ', type: 'ADR', sector: '전자상거래', currency: 'USD', aliases: ['징둥'] },
  { symbol: 'NIO', name: '니오 ADR', nameEn: 'NIO Inc. ADR', exchange: 'NYSE', type: 'ADR', sector: '전기차 / EV', currency: 'USD', aliases: ['니오', '전기차'] },
  { symbol: 'SE', name: '씨 리미티드 ADR', nameEn: 'Sea Limited ADR', exchange: 'NYSE', type: 'ADR', sector: '동남아 IT / 쇼피', currency: 'USD', aliases: ['쇼피', '가레나'] },
  { symbol: 'AZN', name: '아스트라제네카 ADR', nameEn: 'AstraZeneca PLC ADR', exchange: 'NASDAQ', type: 'ADR', sector: '제약 / 바이오', currency: 'USD', aliases: ['아스트라제네카'] },
  { symbol: 'SAP', name: 'SAP SE ADR', nameEn: 'SAP SE ADR', exchange: 'NYSE', type: 'ADR', sector: 'ERP 소프트웨어', currency: 'USD', aliases: ['sap'] },
  { symbol: 'SONY', name: '소니 그룹 ADR', nameEn: 'Sony Group Corporation ADR', exchange: 'NYSE', type: 'ADR', sector: '가전 / 엔터테인먼트', currency: 'USD', aliases: ['소니', '플스'] },

  // Software & Cloud & FinTech
  { symbol: 'ORCL', name: '오라클', nameEn: 'Oracle Corporation', exchange: 'NYSE', type: 'EQUITY', sector: '엔터프라이즈 SW', currency: 'USD', aliases: ['oracle'] },
  { symbol: 'CRM', name: '세일즈포스', nameEn: 'Salesforce, Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '클라우드 CRM', currency: 'USD', aliases: ['salesforce'] },
  { symbol: 'ADBE', name: '어도비', nameEn: 'Adobe Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '소프트웨어 / 디자인', currency: 'USD', aliases: ['포토샵', 'adobe'] },
  { symbol: 'NOW', name: '서비스나우', nameEn: 'ServiceNow, Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '클라우드 워크플로우', currency: 'USD', aliases: ['servicenow'] },
  { symbol: 'PLTR', name: '팔란티어 테크놀로지스', nameEn: 'Palantir Technologies Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '빅데이터 / AI', currency: 'USD', aliases: ['팔란티어', '고담'] },
  { symbol: 'SNOW', name: '스노우플레이크', nameEn: 'Snowflake Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '클라우드 데이터', currency: 'USD', aliases: ['snowflake'] },
  { symbol: 'UBER', name: '우버 테크놀로지스', nameEn: 'Uber Technologies, Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '모빌리티 / 배달', currency: 'USD', aliases: ['우버', '택시'] },
  { symbol: 'ABNB', name: '에어비앤비', nameEn: 'Airbnb, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '숙박 / 여행', currency: 'USD', aliases: ['에어비앤비', '숙박'] },
  { symbol: 'NFLX', name: '넷플릭스', nameEn: 'Netflix, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '엔터테인먼트 / OTT', currency: 'USD', aliases: ['netflix', 'ott'] },
  { symbol: 'DIS', name: '월트 디즈니', nameEn: 'The Walt Disney Company', exchange: 'NYSE', type: 'EQUITY', sector: '엔터테인먼트 / 미디어', currency: 'USD', aliases: ['디즈니', 'disney'] },
  { symbol: 'SPOT', name: '스포티파이', nameEn: 'Spotify Technology S.A.', exchange: 'NYSE', type: 'EQUITY', sector: '음악 스트리밍', currency: 'USD', aliases: ['스포티파이'] },
  { symbol: 'PYPL', name: '페이팔 홀딩스', nameEn: 'PayPal Holdings, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '핀테크 / 결제', currency: 'USD', aliases: ['paypal'] },
  { symbol: 'SQ', name: '블록 (스퀘어)', nameEn: 'Block, Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '핀테크 / 비트코인', currency: 'USD', aliases: ['스퀘어', '잭도시'] },
  { symbol: 'COIN', name: '코인베이스 글로벌', nameEn: 'Coinbase Global, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '가상자산 거래소', currency: 'USD', aliases: ['코인베이스', '크립토'] },

  // Financial & Banking
  { symbol: 'BRK.B', name: '버크셔 해서웨이 B', nameEn: 'Berkshire Hathaway Inc. Class B', exchange: 'NYSE', type: 'EQUITY', sector: '지주사 / 금융', currency: 'USD', aliases: ['워런버핏', '버크셔'] },
  { symbol: 'JPM', name: 'JP모건 체이스', nameEn: 'JPMorgan Chase & Co.', exchange: 'NYSE', type: 'EQUITY', sector: '투자은행 / 금융', currency: 'USD', aliases: ['제이피모간', 'jp모건'] },
  { symbol: 'BAC', name: '뱅크오브아메리카', nameEn: 'Bank of America Corporation', exchange: 'NYSE', type: 'EQUITY', sector: '상업은행', currency: 'USD', aliases: ['boa'] },
  { symbol: 'WFC', name: '웰스파고', nameEn: 'Wells Fargo & Company', exchange: 'NYSE', type: 'EQUITY', sector: '은행', currency: 'USD', aliases: ['wellsfargo'] },
  { symbol: 'GS', name: '골드만삭스', nameEn: 'The Goldman Sachs Group, Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '투자은행', currency: 'USD', aliases: ['goldman'] },
  { symbol: 'MS', name: '모건스탠리', nameEn: 'Morgan Stanley', exchange: 'NYSE', type: 'EQUITY', sector: '투자은행', currency: 'USD', aliases: ['morganstanley'] },
  { symbol: 'V', name: '비자', nameEn: 'Visa Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '결제 네트워크', currency: 'USD', aliases: ['visa'] },
  { symbol: 'MA', name: '마스터카드', nameEn: 'Mastercard Incorporated', exchange: 'NYSE', type: 'EQUITY', sector: '결제 네트워크', currency: 'USD', aliases: ['mastercard'] },

  // Healthcare & Bio
  { symbol: 'LLY', name: '일라이 릴리', nameEn: 'Eli Lilly and Company', exchange: 'NYSE', type: 'EQUITY', sector: '제약 / 비만치료제', currency: 'USD', aliases: ['마운자로', '젭바운드', '릴리'] },
  { symbol: 'NVO', name: '노보 노디스크 ADR', nameEn: 'Novo Nordisk A/S ADR', exchange: 'NYSE', type: 'ADR', sector: '제약 / 비만치료제', currency: 'USD', aliases: ['위고비', '오젬픽'] },
  { symbol: 'JNJ', name: '존슨앤드존슨', nameEn: 'Johnson & Johnson', exchange: 'NYSE', type: 'EQUITY', sector: '제약 / 의료기기', currency: 'USD', aliases: ['jnj'] },
  { symbol: 'PFE', name: '화이자', nameEn: 'Pfizer Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '제약 / 백신', currency: 'USD', aliases: ['pfizer'] },
  { symbol: 'MRK', name: '머크', nameEn: 'Merck & Co., Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '항암제 / 바이오', currency: 'USD', aliases: ['키트루다'] },
  { symbol: 'ABBV', name: '애브비', nameEn: 'AbbVie Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '면역질환 / 바이오', currency: 'USD', aliases: ['휴미라'] },
  { symbol: 'ISRG', name: '인튜이티브 서지컬', nameEn: 'Intuitive Surgical, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '수술로봇 / 의료기기', currency: 'USD', aliases: ['다빈치'] },

  // Consumer, Retail & Industrial
  { symbol: 'WMT', name: '월마트', nameEn: 'Walmart Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '유통 / 리테일', currency: 'USD', aliases: ['walmart'] },
  { symbol: 'COST', name: '코스트코 홀세일', nameEn: 'Costco Wholesale Corporation', exchange: 'NASDAQ', type: 'EQUITY', sector: '창고형 할인점', currency: 'USD', aliases: ['코스트코', 'costco'] },
  { symbol: 'TGT', name: '타깃', nameEn: 'Target Corporation', exchange: 'NYSE', type: 'EQUITY', sector: '리테일', currency: 'USD', aliases: ['target'] },
  { symbol: 'HD', name: '홈디포', nameEn: 'The Home Depot, Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '건축 자재', currency: 'USD', aliases: ['homedepot'] },
  { symbol: 'PG', name: '프록터 앤 갬블 (P&G)', nameEn: 'The Procter & Gamble Company', exchange: 'NYSE', type: 'EQUITY', sector: '생활용품', currency: 'USD', aliases: ['피앤지', '다우니'] },
  { symbol: 'KO', name: '코카콜라', nameEn: 'The Coca-Cola Company', exchange: 'NYSE', type: 'EQUITY', sector: '음료 / 필수소비재', currency: 'USD', aliases: ['콜라', '코카콜라'] },
  { symbol: 'PEP', name: '펩시코', nameEn: 'PepsiCo, Inc.', exchange: 'NASDAQ', type: 'EQUITY', sector: '음료 / 스낵', currency: 'USD', aliases: ['펩시', '프리토레이'] },
  { symbol: 'MCD', name: '맥도날드', nameEn: 'McDonald\'s Corporation', exchange: 'NYSE', type: 'EQUITY', sector: '패스트푸드', currency: 'USD', aliases: ['맥도날드', '빅맥'] },
  { symbol: 'SBUX', name: '스타벅스', nameEn: 'Starbucks Corporation', exchange: 'NASDAQ', type: 'EQUITY', sector: '커피 / 음료', currency: 'USD', aliases: ['스벅', '스타벅스'] },
  { symbol: 'NKE', name: '나이키', nameEn: 'NIKE, Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '스포츠 의류 / 신발', currency: 'USD', aliases: ['조던', '나이키'] },
  { symbol: 'CAT', name: '캐터필러', nameEn: 'Caterpillar Inc.', exchange: 'NYSE', type: 'EQUITY', sector: '건설 기계 / 중장비', currency: 'USD', aliases: ['caterpillar'] },
  { symbol: 'BA', name: '보잉', nameEn: 'The Boeing Company', exchange: 'NYSE', type: 'EQUITY', sector: '항공 / 방위산업', currency: 'USD', aliases: ['boeing', '항공기'] },
  { symbol: 'GE', name: 'GE 에어로스페이스', nameEn: 'GE Aerospace', exchange: 'NYSE', type: 'EQUITY', sector: '항공 엔진 / 우주', currency: 'USD', aliases: ['ge', '제너럴일렉트릭'] },
  { symbol: 'XOM', name: '엑슨모빌', nameEn: 'Exxon Mobil Corporation', exchange: 'NYSE', type: 'EQUITY', sector: '에너지 / 석유화학', currency: 'USD', aliases: ['원유', '정유'] },
  { symbol: 'CVX', name: '셰브론', nameEn: 'Chevron Corporation', exchange: 'NYSE', type: 'EQUITY', sector: '에너지 / 정유', currency: 'USD', aliases: ['chevron'] },

  // Major US ETFs (Index Trackers, Leveraged, Bonds, Commodities, Dividends)
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', nameEn: 'SPDR S&P 500 ETF Trust', exchange: 'NYSE', type: 'ETF', sector: 'S&P 500 지수 ETF', currency: 'USD', aliases: ['스파이', 'sp500'] },
  { symbol: 'VOO', name: '뱅가드 S&P 500 ETF', nameEn: 'Vanguard S&P 500 ETF', exchange: 'NYSE', type: 'ETF', sector: 'S&P 500 지수 ETF', currency: 'USD', aliases: ['뱅가드', 'sp500'] },
  { symbol: 'IVV', name: 'iShares Core S&P 500 ETF', nameEn: 'iShares Core S&P 500 ETF', exchange: 'NYSE', type: 'ETF', sector: 'S&P 500 지수 ETF', currency: 'USD', aliases: ['블랙록', 'ivv'] },
  { symbol: 'QQQ', name: '인베스코 QQQ 트러스트', nameEn: 'Invesco QQQ Trust Series 1', exchange: 'NASDAQ', type: 'ETF', sector: '나스닥 100 지수 ETF', currency: 'USD', aliases: ['큐큐큐', '나스닥100'] },
  { symbol: 'TQQQ', name: '프로셰어즈 울트라프로 QQQ (3X)', nameEn: 'ProShares UltraPro QQQ', exchange: 'NASDAQ', type: 'ETF', sector: '나스닥 100 3배 레버리지 ETF', currency: 'USD', aliases: ['티큐큐큐', '3배레버리지', '나스닥3배'] },
  { symbol: 'SQQQ', name: '프로셰어즈 울트라프로 숏 QQQ (-3X)', nameEn: 'ProShares UltraPro Short QQQ', exchange: 'NASDAQ', type: 'ETF', sector: '나스닥 100 3배 인버스 ETF', currency: 'USD', aliases: ['숏큐큐', '인버스3배', '곱버스'] },
  { symbol: 'DIA', name: 'SPDR 다우존스 산업평균 ETF', nameEn: 'SPDR Dow Jones Industrial Average ETF Trust', exchange: 'NYSE', type: 'ETF', sector: '다우존스 30 지수 ETF', currency: 'USD', aliases: ['다우', 'dia'] },
  { symbol: 'IWM', name: 'iShares 러셀 2000 ETF', nameEn: 'iShares Russell 2000 ETF', exchange: 'NYSE', type: 'ETF', sector: '미국 중소형주 지수 ETF', currency: 'USD', aliases: ['러셀2000', '소형주'] },
  { symbol: 'SOXX', name: 'iShares 반도체 ETF', nameEn: 'iShares Semiconductor ETF', exchange: 'NASDAQ', type: 'ETF', sector: '필라델피아 반도체 지수 ETF', currency: 'USD', aliases: ['반도체etf', '필반'] },
  { symbol: 'SMH', name: '반에크 반도체 ETF', nameEn: 'VanEck Semiconductor ETF', exchange: 'NASDAQ', type: 'ETF', sector: '반도체 대표기업 ETF', currency: 'USD', aliases: ['반에크반도체', 'smh'] },
  { symbol: 'SOXL', name: '디렉시온 데일리 반도체 불 3X ETF', nameEn: 'Direxion Daily Semiconductor Bull 3X Shares', exchange: 'NYSE', type: 'ETF', sector: '반도체 3배 레버리지 ETF', currency: 'USD', aliases: ['속슬', '반도체3배'] },
  { symbol: 'SOXS', name: '디렉시온 데일리 반도체 베어 3X ETF', nameEn: 'Direxion Daily Semiconductor Bear 3X Shares', exchange: 'NYSE', type: 'ETF', sector: '반도체 3배 인버스 ETF', currency: 'USD', aliases: ['속스', '반도체인버스'] },
  { symbol: 'SCHD', name: '슈왑 미국 배당 다우존스 ETF', nameEn: 'Schwab U.S. Dividend Equity ETF', exchange: 'NYSE', type: 'ETF', sector: '미국 배당성장 ETF', currency: 'USD', aliases: ['슈드', '배당etf'] },
  { symbol: 'JEPI', name: 'JP모건 미국 주식 프리미엄 인컴 ETF', nameEn: 'JPMorgan Equity Premium Income ETF', exchange: 'NYSE', type: 'ETF', sector: '월배당 커버드콜 ETF', currency: 'USD', aliases: ['제피', '월배당'] },
  { symbol: 'JEPQ', name: 'JP모건 나스닥 주식 프리미엄 인컴 ETF', nameEn: 'JPMorgan Nasdaq Equity Premium Income ETF', exchange: 'NASDAQ', type: 'ETF', sector: '나스닥 월배당 커버드콜 ETF', currency: 'USD', aliases: ['제피큐', '나스닥월배당'] },
  { symbol: 'TLT', name: 'iShares 20년 이상 미국 국채 ETF', nameEn: 'iShares 20+ Year Treasury Bond ETF', exchange: 'NASDAQ', type: 'ETF', sector: '미국 장기채 ETF', currency: 'USD', aliases: ['미국채', '장기채'] },
  { symbol: 'TMF', name: '디렉시온 데일리 20년+ 미국채 불 3X', nameEn: 'Direxion Daily 20+ Year Treasury Bull 3X Shares', exchange: 'NYSE', type: 'ETF', sector: '미국채 3배 레버리지 ETF', currency: 'USD', aliases: ['티엠에프', '채권3배'] },
  { symbol: 'GLD', name: 'SPDR 골드 셰어즈 ETF', nameEn: 'SPDR Gold Shares', exchange: 'NYSE', type: 'ETF', sector: '금 실물 연계 ETF', currency: 'USD', aliases: ['금', 'gold'] },
  { symbol: 'SLV', name: 'iShares 실버 트러스트 ETF', nameEn: 'iShares Silver Trust', exchange: 'NYSE', type: 'ETF', sector: '은 실물 연계 ETF', currency: 'USD', aliases: ['은', 'silver'] },
  { symbol: 'VNQ', name: '뱅가드 미국 부동산 리츠 ETF', nameEn: 'Vanguard Real Estate ETF', exchange: 'NYSE', type: 'ETF', sector: '미국 부동산 리츠 ETF', currency: 'USD', aliases: ['리츠', '부동산'] },
  { symbol: 'ARKK', name: '아크 이노베이션 ETF', nameEn: 'ARK Innovation ETF', exchange: 'NYSE', type: 'ETF', sector: '파괴적 혁신 성장주 ETF', currency: 'USD', aliases: ['돈나무', '캐시우드', '아크'] },
];

import { matchHangulSearch } from '../src/utils/hangul';
import { standardizeTicker, toProviderTicker } from '../src/utils/stocks/ticker';

// Helper lookup map for instant ticker / alias resolution
const tickerMap = new Map<string, USStockMasterItem>();
US_STOCK_MASTER.forEach(item => {
  tickerMap.set(item.symbol.toUpperCase(), item);
  tickerMap.set(standardizeTicker(item.symbol).toUpperCase(), item);
  tickerMap.set(toProviderTicker(item.symbol).toUpperCase(), item);
});

// Query cache with TTL to avoid redundant external calls
const queryCache = new Map<string, { data: USStockMasterItem[]; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// In-flight promise map to deduplicate concurrent requests for the exact same query
const inFlightYahooSearches = new Map<string, Promise<USStockMasterItem[]>>();

/**
 * Helper to parse exchange string into known enum
 */
function parseExchange(exchangeStr: string): 'NASDAQ' | 'NYSE' | 'AMEX' | 'BATS' {
  const e = exchangeStr.toUpperCase();
  if (e.includes('NYQ') || e.includes('NYSE')) return 'NYSE';
  if (e.includes('ASE') || e.includes('AMEX')) return 'AMEX';
  if (e.includes('BTS') || e.includes('BATS')) return 'BATS';
  return 'NASDAQ';
}

export const usStockSearchService = {
  /**
   * Search US Stocks by Query (Ticker, English Name, Korean Name, Hangul Chosung, Aliases)
   */
  async search(query: string, limit: number = 20): Promise<USStockMasterItem[]> {
    const q = query.trim();
    if (!q) return [];

    // 1. Search local curated master
    const results: USStockMasterItem[] = [];
    const seenSymbols = new Set<string>();

    for (const item of US_STOCK_MASTER) {
      const match = matchHangulSearch(item.symbol, q) ||
                    matchHangulSearch(item.nameEn, q) ||
                    matchHangulSearch(item.name, q) ||
                    item.aliases.some(a => matchHangulSearch(a, q));

      if (match) {
        const standardized = standardizeTicker(item.symbol);
        if (!seenSymbols.has(standardized)) {
          results.push({ ...item, symbol: standardized });
          seenSymbols.add(standardized);
        }
      }
    }

    // 2. If query looks like an exact ticker or English search (and NOT a 6-digit Korean stock code)
    const isKoreanCode = /^\d{6}$/.test(query.trim());
    if (!isKoreanCode && results.length < limit && /^[a-zA-Z0-9\.\-\^]{1,10}$/.test(query.trim())) {
      try {
        const yahooResults = await this.queryYahooFinanceSearch(query.trim(), limit - results.length);
        for (const y of yahooResults) {
          if (!seenSymbols.has(y.symbol)) {
            results.push(y);
            seenSymbols.add(y.symbol);
          }
        }
      } catch (err: any) {
        // Safe degrade to curated list
        console.warn('[USStockSearch] Yahoo search query error:', err.message);
      }
    }

    // 3. Score and prioritize matches
    results.sort((a, b) => {
      // 1. Exact ticker match
      if (a.symbol.toLowerCase() === q) return -1;
      if (b.symbol.toLowerCase() === q) return 1;
      // 2. Starts with ticker
      if (a.symbol.toLowerCase().startsWith(q) && !b.symbol.toLowerCase().startsWith(q)) return -1;
      if (!a.symbol.toLowerCase().startsWith(q) && b.symbol.toLowerCase().startsWith(q)) return 1;
      // 3. Exact Korean name match
      if (a.name.toLowerCase() === q) return -1;
      if (b.name.toLowerCase() === q) return 1;
      // 4. Starts with Korean name
      if (a.name.toLowerCase().startsWith(q) && !b.name.toLowerCase().startsWith(q)) return -1;
      if (!a.name.toLowerCase().startsWith(q) && b.name.toLowerCase().startsWith(q)) return 1;
      return 0;
    });

    return results.slice(0, limit);
  },

  /**
   * Dynamic Yahoo Finance lookup with in-flight deduplication and safe caching
   */
  async queryYahooFinanceSearch(query: string, count: number = 10): Promise<USStockMasterItem[]> {
    const cacheKey = `${query.toUpperCase()}_${count}`;
    const cached = queryCache.get(cacheKey);
    // Return cached successful results (including valid 0-count results) if fresh
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    // Reuse in-flight request for identical concurrent query
    if (inFlightYahooSearches.has(cacheKey)) {
      return inFlightYahooSearches.get(cacheKey)!;
    }

    const fetchPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=${count}&newsCount=0`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Accept': 'application/json',
          },
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          // HTTP error (429, 5xx): DO NOT cache!
          console.warn(`[USStockSearch] Yahoo search responded with HTTP ${res.status} for "${query}"`);
          return [];
        }
        const data = await res.json();
        const quotes = data.quotes || [];

        const parsed: USStockMasterItem[] = [];
        for (const q of quotes) {
          if (!q.symbol || typeof q.symbol !== 'string') continue;
          // Standardize ticker (e.g. BRK-B -> BRK.B)
          const sym = standardizeTicker(q.symbol);
          if (!sym) continue;

          // Skip options, futures, complex crypto derivatives
          if (sym.includes('=') || sym.includes(':') || q.quoteType === 'FUTURE' || q.quoteType === 'OPTION') {
            continue;
          }

          // Exchange Parsing Logic
          const exchange = parseExchange(q.exchange || q.exchDisp || '');

          const isEtf = q.quoteType === 'ETF';
          const rawName = q.shortname || q.longname || sym;
          const isAdr = !isEtf && (
            rawName.toUpperCase().includes('ADR') ||
            rawName.toUpperCase().includes('AMERICAN DEPOSITARY') ||
            (q.longname && q.longname.toUpperCase().includes('ADR'))
          );

          const itemType: 'EQUITY' | 'ETF' | 'ADR' = isEtf ? 'ETF' : (isAdr ? 'ADR' : 'EQUITY');
          const sector = isEtf
            ? '미국 상장지수펀드 (ETF)'
            : (isAdr ? '미국 상장 글로벌 주식 (ADR)' : (q.sector || '미국 보통주'));

          parsed.push({
            symbol: sym,
            name: rawName,
            nameEn: q.longname || q.shortname || sym,
            exchange,
            type: itemType,
            sector,
            currency: 'USD',
            aliases: [sym],
          });
        }

        // Only cache valid HTTP 200 responses
        queryCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
        return parsed;
      } catch (err: any) {
        // Network errors or timeout: DO NOT cache
        console.warn(`[USStockSearch] Yahoo search network error for "${query}":`, err.message);
        return [];
      } finally {
        inFlightYahooSearches.delete(cacheKey);
      }
    })();

    inFlightYahooSearches.set(cacheKey, fetchPromise);
    return fetchPromise;
  },

  /**
   * Find item by symbol
   */
  getBySymbol(symbol: string): USStockMasterItem | undefined {
    if (!symbol) return undefined;
    const clean = standardizeTicker(symbol);
    return tickerMap.get(symbol.toUpperCase()) || 
           tickerMap.get(clean.toUpperCase()) || 
           tickerMap.get(toProviderTicker(symbol).toUpperCase());
  }
};

