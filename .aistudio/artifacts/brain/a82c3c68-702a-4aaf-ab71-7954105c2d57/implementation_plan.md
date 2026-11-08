# 병돌 인베스트먼트: 라이트/다크 금융 프리미엄 테마 리뉴얼 완료 보고서

## 1. 개요 및 디자인 토큰 체계
지정된 9대 디자인 토큰을 시스템 전반에 적용하여 라이트모드는 차분한 웜그레이와 네이비 계열로, 다크모드는 눈부심이 없는 딥차콜/슬레이트 계열로 완전히 일체화하였습니다.

| 토큰 명칭 | 라이트모드 색상 | 다크모드 색상 | 적용 역할 및 설명 |
|---|---|---|---|
| `--color-finance-bg` | `#F3F5F7` | `#171D26` | 전체 페이지 메인 배경 |
| `--color-finance-card` | `#FFFFFF` | `#222C39` | 카드, 패널, 모달, 호가창, 차트 컨테이너 |
| `--color-finance-sub-bg` | `#EDF1F5` | `#293545` | 보조 배경, 검색창 인풋, 탭 컨테이너, 버튼 배경 |
| `--color-finance-border` | `#E4E9EF` | `#354252` | 패널 구분선, 카드 테두리, 테이블 구분선 |
| `--color-finance-text` | `#25364A` | `#E5EBF2` | 주요 텍스트, 헤드라인, 현재가, 종목명 |
| `--color-finance-sub-text` | `#607184` | `#A6B4C4` | 보조 텍스트, 종목코드, 단위, 기준시간 |
| `--color-finance-accent` | `#365F85` | `#78A9D6` | 포인트 컬러, 액티브 탭, 브랜드 강조 |
| `--color-finance-up` | `#D94B50` | `#F0787D` | 상승 호가, 상승 캔들, 플러스 변동률 |
| `--color-finance-down` | `#3478C8` | `#72A9E8` | 하락 호가, 하락 캔들, 마이너스 변동률 |

---

## 2. 주요 컴포넌트별 적용 내역

1. **글로벌 테마 시스템 (`src/index.css`, `index.html`)**
   - Tailwind CSS v4 `@theme` 블록에 9대 금융 변수 바인딩
   - `index.html` 내 인라인 FOUC 방지 스크립트에 라이트(`#F3F5F7`) / 다크(`#171D26`) 배경색 즉시 동기화
   - 글로벌 다크모드/라이트모드 브리지 CSS를 추가하여 모든 모달, 드롭다운, 테이블, 툴팁이 9대 색상 토큰을 준수하도록 통일

2. **호가창 위젯 (`OrderBookWidget.tsx`)**
   - 컨테이너: `bg-finance-card border-finance-border text-finance-text`
   - 매도 10단계 호가: 매도 배경 `bg-finance-down/5`, 매도량 바 `bg-finance-down/15`, 가격 `text-finance-down`
   - 매수 10단계 호가: 매수 배경 `bg-finance-up/5`, 매수량 바 `bg-finance-up/15`, 가격 `text-finance-up`
   - 현재가 체결 기준 바: `bg-finance-sub-bg border-finance-border`
   - 하단 누적 잔량 바: 매도 `bg-finance-down`, 매수 `bg-finance-up`, 트랙 `bg-finance-sub-bg`

3. **인터랙티브 캔들 차트 (`InteractiveStockChart.tsx`)**
   - 상단 마스터 툴바: `bg-finance-card border-finance-border`, 활성 주기 버튼 `bg-finance-accent text-white`
   - 차트 캔버스 영역: `bg-finance-card border-finance-border`
   - 캔들 및 거래량 봉: 상승 시 라이트 `#D94B50` / 다크 `#F0787D`, 하락 시 라이트 `#3478C8` / 다크 `#72A9E8`
   - 그리드 라인: 라이트 `#E4E9EF` / 다크 `#354252`, 축 텍스트: 라이트 `#607184` / 다크 `#A6B4C4`

4. **태블릿 & 데스크톱 2열 매매 뷰 (`TabletStockTradingView.tsx`)**
   - 좌측 종목 리스트 패널 및 우측 차트/호가 상세 패널에 토큰 적용
   - 선택된 종목 하이라이트: `bg-finance-accent/15 border-finance-accent text-finance-text`
   - 마켓 필터 탭 및 서브 네비게이션 탭의 액티브/인액티브 토큰화

5. **상단 네비게이션 & 좌우 사이드바 (`Navbar.tsx`, `LeftSidebar.tsx`, `RightSidebar.tsx`)**
   - 상단 티커 리본: `bg-finance-sub-bg/60 border-finance-border text-finance-sub-text`
   - 로고 및 네비게이션: `text-finance-text`, 액티브 링크 `bg-finance-accent/15 text-finance-accent`
   - 지수 요약 카드: KOSPI/KOSDAQ 등락률에 `text-finance-up` / `text-finance-down` 적용
   - 관심종목 및 실시간 톡 패널 전환 탭 토큰화

6. **모바일 대시보드 & 드로어 (`HomeMobileDashboard.tsx`, `MobileDrawer.tsx`)**
   - 모바일 상단 검색창, 시장 인덱스 미니 카드, 관심종목 스와이프 탭 일체화
   - 모바일 전체 메뉴 드로어 배경 및 링크 상태 토큰화

7. **시장 히트맵 (`MarketHeatmap.tsx`) & 뱃지 (`PriceBadge.tsx`)**
   - 상승 타일 그라데이션: `#D94B50` (라이트) / `#F0787D` (다크)
   - 하락 타일 그라데이션: `#3478C8` (라이트) / `#72A9E8` (다크)

---

## 3. 검증 결과
- **TypeScript 타입 검사 (`tsc --noEmit`)**: 0 errors
- **Vite 번들 컴파일 (`npm run build`)**: Build succeeded
- **Dev Server**: Port 3000 정상 가동 (HTTP 200 OK)
- **FOUC 방지**: `localStorage.getItem('bd_theme')` 기반 즉각 렌더링 정상 동작
