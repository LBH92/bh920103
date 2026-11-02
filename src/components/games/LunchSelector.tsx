import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { firebaseRepository } from '../../services/firebaseRepository';
import {
  Coffee,
  RotateCcw,
  MapPin,
  Utensils,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Flame,
  X,
  History,
  Compass,
} from 'lucide-react';

export interface LunchDish {
  id: string;
  name: string;
  category: '한식' | '중식' | '일식' | '양식' | '분식' | '고기/구이' | '해산물' | '패스트푸드' | '건강식';
  avgPrice: number;
  spiciness: 'none' | 'mild' | 'spicy' | 'hot'; // 0, 1, 2, 3
  description: string;
  tags: string[];
}

export const LUNCH_MENU_POOL: LunchDish[] = [
  // 한식
  { id: 'k1', name: '김치찌개', category: '한식', avgPrice: 9000, spiciness: 'spicy', description: '칼칼하고 든든한 돼지고기 김치찌개', tags: ['국물', '스테디셀러'] },
  { id: 'k2', name: '차돌 된장찌개', category: '한식', avgPrice: 9500, spiciness: 'mild', description: '구수하고 진한 차돌박이 된장찌개', tags: ['국물', '밥도둑'] },
  { id: 'k3', name: '제육볶음 정식', category: '한식', avgPrice: 10000, spiciness: 'spicy', description: '매콤달콤 불향 가득한 직장인 소울푸드', tags: ['고기', '인기'] },
  { id: 'k4', name: '전주 돌솥비빔밥', category: '한식', avgPrice: 10000, spiciness: 'mild', description: '신선한 나물과 고소한 누룽지의 조화', tags: ['나물', '건강'] },
  { id: 'k5', name: '순두부찌개', category: '한식', avgPrice: 9000, spiciness: 'spicy', description: '몽글몽글 부드러운 해물 순두부', tags: ['얼큰', '뚝배기'] },
  { id: 'k6', name: '뚝배기 불고기', category: '한식', avgPrice: 11000, spiciness: 'none', description: '달콤 짭조름한 당면 듬뿍 불고기', tags: ['달콤', '남녀노소'] },
  { id: 'k7', name: '설렁탕 / 곰탕', category: '한식', avgPrice: 12000, spiciness: 'none', description: '진하고 뽀얀 사골 육수에 소면 한 그릇', tags: ['보양', '담백'] },
  { id: 'k8', name: '뼈해장국', category: '한식', avgPrice: 10000, spiciness: 'spicy', description: '살코기 듬뿍 얼큰한 뼈해장국', tags: ['해장', '든든'] },

  // 중식
  { id: 'c1', name: '간짜장', category: '중식', avgPrice: 8500, spiciness: 'none', description: '갓 볶아낸 아삭한 양파와 진한 춘장의 맛', tags: ['면요리', '불향'] },
  { id: 'c2', name: '해물 짬뽕', category: '중식', avgPrice: 9500, spiciness: 'hot', description: '각종 해산물과 불맛 가득한 얼큰 국물', tags: ['해장', '얼큰'] },
  { id: 'c3', name: '마파두부 덮밥', category: '중식', avgPrice: 9000, spiciness: 'spicy', description: '알싸한 마라 향과 부드러운 두부', tags: ['매콤', '마라'] },
  { id: 'c4', name: '잡채밥', category: '중식', avgPrice: 10000, spiciness: 'mild', description: '불향 가득 볶음 잡채와 짜장 소스', tags: ['밥류', '푸짐'] },
  { id: 'c5', name: '꿔바로우 & 볶음밥', category: '중식', avgPrice: 13000, spiciness: 'none', description: '바삭 쫀득 탕수육과 고슬고슬 계란볶음밥', tags: ['세트', '별미'] },

  // 일식
  { id: 'j1', name: '수제 모듬초밥', category: '일식', avgPrice: 16000, spiciness: 'none', description: '신선한 제철 생선 10피스 스시 세트', tags: ['신선', '고급'] },
  { id: 'j2', name: '바삭 안심 돈카츠', category: '일식', avgPrice: 12000, spiciness: 'none', description: '두툼하고 촉촉한 육즙의 일식 돈카츠', tags: ['튀김', '바삭'] },
  { id: 'j3', name: '가츠동 (돈까스 덮밥)', category: '일식', avgPrice: 9500, spiciness: 'none', description: '부드러운 계란과 달콤 짭조름한 쯔유 소스', tags: ['덮밥', '인기'] },
  { id: 'j4', name: '돈코츠 라멘', category: '일식', avgPrice: 10000, spiciness: 'mild', description: '진한 돼지 뼈 육수에 차슈와 반숙란', tags: ['면요리', '진한국물'] },
  { id: 'j5', name: '사케동 (생연어 덮밥)', category: '일식', avgPrice: 14000, spiciness: 'none', description: '입안에서 사르르 녹는 생연어 덮밥', tags: ['연어', '깔끔'] },

  // 양식
  { id: 'w1', name: '베이컨 까르보나라', category: '양식', avgPrice: 13000, spiciness: 'none', description: '고소하고 진한 크림 파스타', tags: ['파스타', '크림'] },
  { id: 'w2', name: '매콤 아라비아따', category: '양식', avgPrice: 13000, spiciness: 'spicy', description: '페페론치노를 넣은 깔끔한 토마토 파스타', tags: ['파스타', '매콤'] },
  { id: 'w3', name: '수제 치즈버거 세트', category: '양식', avgPrice: 11000, spiciness: 'none', description: '육즙 가득 소고기 패티와 멜팅 치즈', tags: ['버거', '수제'] },
  { id: 'w4', name: '마르게리따 피자 (1인)', category: '양식', avgPrice: 14000, spiciness: 'none', description: '바질과 모짜렐라가 올라간 화덕 피자', tags: ['피자', '치즈'] },

  // 분식
  { id: 'b1', name: '떡튀순 (떡볶이·튀김·순대)', category: '분식', avgPrice: 8000, spiciness: 'spicy', description: '매콤달콤 쌀떡볶이와 바삭한 모듬 튀김', tags: ['가성비', '분식세트'] },
  { id: 'b2', name: '참치마요 김밥 & 라면', category: '분식', avgPrice: 7500, spiciness: 'mild', description: '든든한 꿀조합 분식 클래식', tags: ['가성비', '스피드'] },
  { id: 'b3', name: '얼큰 칼국수 & 왕만두', category: '분식', avgPrice: 9000, spiciness: 'spicy', description: '손칼국수와 육즙 꽉 찬 왕만두 세트', tags: ['면요리', '따뜻함'] },

  // 고기/구이
  { id: 'm1', name: '삼겹살 구이 백반', category: '고기/구이', avgPrice: 12000, spiciness: 'none', description: '노릇노릇 구워 나오는 삼겹살과 쌈채소', tags: ['고기', '푸짐'] },
  { id: 'm2', name: '차돌박이 숙주볶음', category: '고기/구이', avgPrice: 11000, spiciness: 'none', description: '아삭한 숙주와 고소한 차돌박이의 조화', tags: ['고기', '별미'] },
  { id: 'm3', name: '소고기 국밥', category: '고기/구이', avgPrice: 10000, spiciness: 'mild', description: '푸짐한 소고기와 얼큰 시원한 무 육수', tags: ['국밥', '든든'] },

  // 해산물
  { id: 's1', name: '활어 회덮밥', category: '해산물', avgPrice: 11000, spiciness: 'mild', description: '신선한 활어회와 초고추장, 채소 듬뿍', tags: ['신선', '새콤달콤'] },
  { id: 's2', name: '꼬막 비빔밥', category: '해산물', avgPrice: 12000, spiciness: 'spicy', description: '통통한 벌교 꼬막과 매콤한 양념장', tags: ['별미', '인기'] },
  { id: 's3', name: '동태탕 / 대구탕', category: '해산물', avgPrice: 10000, spiciness: 'spicy', description: '시원하고 칼칼한 생선 맑은탕/매운탕', tags: ['해장', '국물'] },

  // 패스트푸드
  { id: 'f1', name: '싸이버거 세트', category: '패스트푸드', avgPrice: 7500, spiciness: 'mild', description: '바삭하고 두툼한 닭다리살 치킨버거', tags: ['가성비', '치킨버거'] },
  { id: 'f2', name: '서브웨이 이탈리안 BMT', category: '패스트푸드', avgPrice: 8500, spiciness: 'none', description: '취향대로 고르는 신선한 샌드위치', tags: ['간편', '야채듬뿍'] },

  // 건강식
  { id: 'h1', name: '닭가슴살 아보카도 샐러드', category: '건강식', avgPrice: 11000, spiciness: 'none', description: '부드러운 닭가슴살과 슈퍼푸드 샐러드 볼', tags: ['다이어트', '클린'] },
  { id: 'h2', name: '연어 포케 (Poke)', category: '건강식', avgPrice: 13000, spiciness: 'none', description: '하와이안 현미밥과 신선한 생연어 큐브', tags: ['포케', '단백질'] },
  { id: 'h3', name: '월남쌈 & 쌀국수 세트', category: '건강식', avgPrice: 12000, spiciness: 'none', description: '각종 채소 쌈과 맑고 깊은 양지 쌀국수', tags: ['베트남', '소화잘됨'] },
];

const CATEGORIES = ['전체', '한식', '중식', '일식', '양식', '분식', '고기/구이', '해산물', '패스트푸드', '건강식'];

export const LunchSelector: React.FC = () => {
  const { user } = useApp();

  // Filter States
  const [budget, setBudget] = useState<number>(15000);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [spicinessFilter, setSpicinessFilter] = useState<'all' | 'none' | 'mild' | 'spicy_hot'>('all');
  const [excludedTagInput, setExcludedTagInput] = useState<string>('');
  const [excludedMenus, setExcludedMenus] = useState<string[]>([]);
  const [avoidRecent, setAvoidRecent] = useState<boolean>(true);

  // Roulette States
  const [selectedDish, setSelectedDish] = useState<LunchDish | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [recentPicks, setRecentPicks] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('recent_lunch_picks');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Location States
  // 3 choices: 'current' (GPS), 'custom' (text address/station), 'none' (menu only)
  const [locationMode, setLocationMode] = useState<'current' | 'custom' | 'none'>('none');
  const [showLocationBanner, setShowLocationBanner] = useState<boolean>(true);
  const [customAddress, setCustomAddress] = useState<string>('');
  const [detectedAddress, setDetectedAddress] = useState<string>('');
  const [geoError, setGeoError] = useState<string | null>(null);

  // Unmount & interval cleanup refs
  const isMountedRef = useRef(true);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, []);

  // Filter calculation
  const filteredDishes = useMemo(() => {
    return LUNCH_MENU_POOL.filter(dish => {
      // Category filter
      if (selectedCategory !== '전체' && dish.category !== selectedCategory) return false;
      // Budget filter
      if (dish.avgPrice > budget) return false;
      // Spiciness filter
      if (spicinessFilter === 'none' && dish.spiciness !== 'none') return false;
      if (spicinessFilter === 'mild' && dish.spiciness !== 'mild' && dish.spiciness !== 'none') return false;
      if (spicinessFilter === 'spicy_hot' && dish.spiciness === 'none') return false;
      // Excluded user custom menus
      if (excludedMenus.includes(dish.name)) return false;
      // Avoid recent 3 picks if enabled
      if (avoidRecent && recentPicks.slice(-3).includes(dish.name)) return false;

      return true;
    });
  }, [selectedCategory, budget, spicinessFilter, excludedMenus, avoidRecent, recentPicks]);

  // Handle Location Choice: GPS
  const handleRequestCurrentLocation = () => {
    if (!navigator.geolocation) {
      if (isMountedRef.current) {
        setGeoError('브라우저에서 위치 서비스를 지원하지 않습니다.');
        setLocationMode('none');
        setShowLocationBanner(false);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        if (!isMountedRef.current) return;
        const { latitude, longitude } = pos.coords;
        setDetectedAddress(`현재 위치 (위도 ${latitude.toFixed(3)}, 경도 ${longitude.toFixed(3)})`);
        setLocationMode('current');
        setShowLocationBanner(false);
        setGeoError(null);
      },
      err => {
        if (!isMountedRef.current) return;
        console.warn('Geolocation permission denied or error:', err.message);
        setGeoError('위치 권한이 거부되었거나 위치를 가져올 수 없습니다. 수동 입력 또는 위치 없이 메뉴 추천을 이용하세요.');
        setLocationMode('none');
      },
      { timeout: 7000 }
    );
  };

  // Handle Location Choice: Custom Address
  const handleSetCustomLocation = (addr: string) => {
    if (!addr.trim() || !isMountedRef.current) return;
    setDetectedAddress(addr.trim());
    setLocationMode('custom');
    setShowLocationBanner(false);
    setGeoError(null);
  };

  // Add Excluded Menu
  const handleAddExcludedMenu = () => {
    const trimmed = excludedTagInput.trim();
    if (trimmed && !excludedMenus.includes(trimmed)) {
      setExcludedMenus([...excludedMenus, trimmed]);
      setExcludedTagInput('');
    }
  };

  const handleRemoveExcludedMenu = (menuName: string) => {
    setExcludedMenus(excludedMenus.filter(m => m !== menuName));
  };

  // Roulette Spin Handler
  const spinRoulette = async () => {
    if (isSpinning) return;
    if (filteredDishes.length === 0) {
      alert('조건에 맞는 메뉴 후보가 없습니다. 예산 또는 필터 조건을 완화해 보세요.');
      return;
    }

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    setIsSpinning(true);
    setSelectedDish(null);

    let count = 0;
    const maxSteps = 24;
    spinIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        return;
      }
      const randomCandidate = filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
      setSelectedDish(randomCandidate);
      count++;

      if (count >= maxSteps) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
        // Final random pick
        const finalDish = filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
        if (isMountedRef.current) {
          setSelectedDish(finalDish);
          setIsSpinning(false);

          // Update recent picks
          const updatedRecent = [...recentPicks, finalDish.name].slice(-10);
          setRecentPicks(updatedRecent);
          try {
            localStorage.setItem('recent_lunch_picks', JSON.stringify(updatedRecent));
          } catch {}
        }

        // Save to Firebase history
        if (user?.id) {
          firebaseRepository
            .saveGameHistory(
              user.id,
              'lunch',
              {
                budget,
                category: selectedCategory,
                spiciness: spicinessFilter,
                location: detectedAddress || '미사용',
              },
              {
                selectedDish: finalDish.name,
                category: finalDish.category,
                price: finalDish.avgPrice,
              }
            )
            .catch(console.warn);
        }
      }
    }, 80);
  };

  // Effective location query string for maps
  const mapSearchQuery = useMemo(() => {
    if (!selectedDish) return '';
    const locKeyword =
      locationMode === 'custom' && detectedAddress
        ? detectedAddress
        : locationMode === 'current'
        ? '내 주변'
        : '';
    return locKeyword ? `${locKeyword} ${selectedDish.name} 맛집` : `${selectedDish.name} 맛집`;
  }, [selectedDish, locationMode, detectedAddress]);

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 mb-2">
              <Utensils className="w-3.5 h-3.5" />
              스마트 런치 셀렉터
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              오늘의 점심 메뉴 고르기
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              예산·카테고리·맵기 필터와 어제 먹은 메뉴 제외. 실제 지도 검색 연동까지 완벽 지원합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('전체');
                setBudget(15000);
                setSpicinessFilter('all');
                setExcludedMenus([]);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              필터 초기화
            </button>
          </div>
        </div>

        {/* Location Permission Guidance Banner */}
        {showLocationBanner && (
          <div className="mt-5 p-4 rounded-xl bg-indigo-50/80 dark:bg-slate-900/80 border border-indigo-200 dark:border-slate-800 text-xs space-y-3 animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  주변 실제 음식점 연동을 위한 위치 선택
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  추첨된 메뉴를 바탕으로 실제 카카오맵/네이버지도 검색을 연결해 드립니다. 원하시는 위치 방식을 선택해 주세요. (위치를 사용하지 않아도 룰렛은 100% 정상 작동합니다)
                </p>
              </div>
              <button onClick={() => setShowLocationBanner(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleRequestCurrentLocation}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                현재 GPS 위치 사용
              </button>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="예: 여의도역, 강남역, 판교"
                  value={customAddress}
                  onChange={e => setCustomAddress(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSetCustomLocation(customAddress)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold w-40 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleSetCustomLocation(customAddress)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                >
                  입력
                </button>
              </div>

              <button
                onClick={() => {
                  setLocationMode('none');
                  setShowLocationBanner(false);
                }}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 font-semibold text-xs hover:bg-white dark:hover:bg-slate-800"
              >
                위치 없이 메뉴만 추천
              </button>
            </div>

            {geoError && (
              <div className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {geoError}
              </div>
            )}
          </div>
        )}

        {/* Selected Location Indicator */}
        {!showLocationBanner && (
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              위치 설정: <strong className="text-slate-800 dark:text-slate-200">{detectedAddress || '위치 미사용 (전국 메뉴)'}</strong>
            </span>
            <button
              onClick={() => setShowLocationBanner(true)}
              className="text-[11px] text-indigo-500 font-semibold hover:underline"
            >
              위치 변경
            </button>
          </div>
        )}
      </div>

      {/* 2. Filter & Preference Controls */}
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-amber-500" />
            맞춤 조건 설정 ({filteredDishes.length}개 메뉴 후보)
          </div>
          <span className="text-xs text-slate-400">
            예산 한도: <strong className="text-amber-500 font-bold">{budget.toLocaleString()}원 이하</strong>
          </span>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">음식 종류</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Budget & Spiciness Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Budget Slider */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">1인 예산 한도</span>
              <span className="font-bold text-slate-900 dark:text-white">{budget.toLocaleString()}원</span>
            </div>
            <input
              type="range"
              min={7000}
              max={25000}
              step={1000}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>7,000원 (가성비)</span>
              <span>15,000원 (보통)</span>
              <span>25,000원 (특식)</span>
            </div>
          </div>

          {/* Spiciness Filter */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-medium text-xs block">맵기 선호도</span>
            <div className="grid grid-cols-4 gap-1 text-xs">
              <button
                onClick={() => setSpicinessFilter('all')}
                className={`py-1.5 rounded-lg font-bold ${
                  spicinessFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                상관없음
              </button>
              <button
                onClick={() => setSpicinessFilter('none')}
                className={`py-1.5 rounded-lg font-bold ${
                  spicinessFilter === 'none'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                순한맛
              </button>
              <button
                onClick={() => setSpicinessFilter('mild')}
                className={`py-1.5 rounded-lg font-bold ${
                  spicinessFilter === 'mild'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                보통
              </button>
              <button
                onClick={() => setSpicinessFilter('spicy_hot')}
                className={`py-1.5 rounded-lg font-bold ${
                  spicinessFilter === 'spicy_hot'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                매콤/얼큰
              </button>
            </div>
          </div>
        </div>

        {/* Excluded Menus & Recent Duplicate Prevention */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500">제외할 메뉴 (어제 먹은 것 등)</span>
            <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={avoidRecent}
                onChange={e => setAvoidRecent(e.target.checked)}
                className="accent-amber-500"
              />
              최근 3회 당첨 메뉴 자동 제외
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="제외할 메뉴 입력 후 추가 (예: 김치찌개)"
              value={excludedTagInput}
              onChange={e => setExcludedTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExcludedMenu()}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleAddExcludedMenu}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
            >
              추가
            </button>
          </div>

          {excludedMenus.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {excludedMenus.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-[11px] font-bold flex items-center gap-1"
                >
                  {m}
                  <button onClick={() => handleRemoveExcludedMenu(m)} className="hover:text-rose-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Roulette Result Screen */}
      <div className="bg-white dark:bg-[#131722] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">
        <div className="max-w-md mx-auto space-y-3">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block">
            TODAY'S LUNCH PICK
          </span>

          <div
            className={`min-h-[140px] flex flex-col items-center justify-center p-6 rounded-3xl border transition-all ${
              selectedDish
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-slate-50 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800'
            }`}
          >
            {selectedDish ? (
              <div className="space-y-1.5 animate-in zoom-in-95 duration-100">
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                  {selectedDish.category} · 평균 {selectedDish.avgPrice.toLocaleString()}원
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {selectedDish.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                  {selectedDish.description}
                </p>
              </div>
            ) : (
              <div className="text-slate-400 space-y-1">
                <Utensils className="w-10 h-10 mx-auto opacity-40 mb-2" />
                <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  룰렛을 돌려 오늘 점심을 결정하세요!
                </div>
                <div className="text-xs text-slate-400">
                  현재 {filteredDishes.length}개의 메뉴가 대기 중입니다.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spin Button */}
        <div>
          <button
            onClick={spinRoulette}
            disabled={isSpinning || filteredDishes.length === 0}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-lg shadow-lg shadow-amber-500/25 transition-all inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isSpinning ? '메뉴 추첨 중...' : '오늘 점심 룰렛 돌리기!'}
          </button>
        </div>

        {/* 4. Real Map Search Links (Never fake ratings, honest verified linkouts) */}
        {selectedDish && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 max-w-lg mx-auto text-left space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-indigo-500" />
                실제 주변 {selectedDish.name} 식당 검색
              </span>
              <span className="text-[11px] text-slate-400">포털 실시간 지도</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(mapSearchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-800 dark:text-yellow-300 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span>카카오맵에서 "{selectedDish.name}" 찾기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(mapSearchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span>네이버지도에서 "{selectedDish.name}" 찾기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 5. Recent History */}
      {recentPicks.length > 0 && (
        <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              최근 선택한 점심 메뉴 이력
            </span>
            <span className="text-[11px] text-slate-400">최근 {recentPicks.length}개</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {recentPicks.slice(-6).reverse().map((pick, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {pick}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
