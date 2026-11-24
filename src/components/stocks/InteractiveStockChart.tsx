import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  CandleData,
  ChartCandleType,
  KiwoomChartPeriod,
  KiwoomChartResponse,
  WatchlistBuyEntry,
} from '../../types';
import { stockRepository } from '../../services/stockRepository';
import { formatMoney } from '../../utils/currency';
import { sanitizeAndValidateCandles } from '../../utils/chartSanitizer';
import {
  RefreshCw,
  AlertTriangle,
  BarChart2,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Edit3,
  ChevronDown,
  Activity,
  Compass,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Radio,
} from 'lucide-react';
import {
  IndicatorSettings,
  DEFAULT_INDICATOR_SETTINGS,
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateVWAP,
  calculateRSI,
  calculateMACD,
  calculateStochastic,
} from '../../utils/chartIndicators';
import {
  DrawingToolType,
  DrawingShape,
  Point,
  FIBONACCI_LEVELS,
} from '../../types/chartDrawings';
import { IndicatorSettingsModal } from './IndicatorSettingsModal';
import { AdSlot } from '../common/AdSlot';
import { useApp } from '../../context/AppContext';

export interface InteractiveStockChartProps {
  symbol?: string;
  candles?: CandleData[];
  stockPrice: number;
  prevClose: number;
  currency?: 'KRW' | 'USD' | 'USDT' | 'BTC';
  buyEntries?: WatchlistBuyEntry[];
}

interface PeriodConfig {
  id: KiwoomChartPeriod;
  label: string;
  trId: string;
  defaultCandleType: ChartCandleType;
  ticScope?: string;
  description: string;
  category: 'primary' | 'minute';
}

const PRIMARY_PERIODS: PeriodConfig[] = [
  { id: '1d', label: '1일', trId: 'REAL_1D', defaultCandleType: 'minute', description: '당일 분봉', category: 'primary' },
  { id: '1w', label: '1주', trId: 'REAL_1W', defaultCandleType: 'minute', description: '최근 1주일', category: 'primary' },
  { id: '1mo', label: '1개월', trId: 'REAL_1M', defaultCandleType: 'day', description: '최근 1개월', category: 'primary' },
  { id: '3mo', label: '3개월', trId: 'REAL_3M', defaultCandleType: 'day', description: '최근 3개월', category: 'primary' },
  { id: '6mo', label: '6개월', trId: 'REAL_6M', defaultCandleType: 'day', description: '최근 6개월', category: 'primary' },
  { id: '1y', label: '1년', trId: 'REAL_1Y', defaultCandleType: 'day', description: '최근 1년', category: 'primary' },
  { id: '3y', label: '3년', trId: 'REAL_3Y', defaultCandleType: 'week', description: '최근 3년', category: 'primary' },
  { id: 'all', label: '전체', trId: 'REAL_ALL', defaultCandleType: 'month', description: '전체 기간', category: 'primary' },
];

const MINUTE_PERIODS: PeriodConfig[] = [
  { id: '1m', label: '1분', trId: 'ka10080', defaultCandleType: 'minute', ticScope: '1', description: '1분봉', category: 'minute' },
  { id: '5m', label: '5분', trId: 'ka10080', defaultCandleType: 'minute', ticScope: '5', description: '5분봉', category: 'minute' },
  { id: '15m', label: '15분', trId: 'ka10080', defaultCandleType: 'minute', ticScope: '15', description: '15분봉', category: 'minute' },
  { id: '30m', label: '30분', trId: 'ka10080', defaultCandleType: 'minute', ticScope: '30', description: '30분봉', category: 'minute' },
  { id: '1h', label: '60분', trId: 'ka10080', defaultCandleType: 'minute', ticScope: '60', description: '60분봉', category: 'minute' },
];

const ALL_CHART_PERIODS = [...PRIMARY_PERIODS, ...MINUTE_PERIODS];

function getStepDaysForPeriod(p: KiwoomChartPeriod): number {
  switch (p) {
    case '1w':
      return 7;
    case '1mo':
      return 30;
    case '3mo':
      return 90;
    case '6mo':
      return 180;
    case '1y':
      return 365;
    case '3y':
    case '5y':
    case 'all':
      return 365;
    default:
      return 1;
  }
}

function getSourceLabel(source?: KiwoomChartResponse['source']): string {
  switch (source) {
    case 'kiwoom':
      return '키움 Open API';
    case 'yahoo':
      return 'Yahoo Finance';
    case 'upbit':
      return 'Upbit API';
    case 'binance':
      return 'Binance API';
    default:
      return '실시간 시세';
  }
}

type DragMode = 'none' | 'pan' | 'priceAxis' | 'timeAxis';

export const InteractiveStockChart: React.FC<InteractiveStockChartProps> = ({
  symbol,
  candles: initialCandles = [],
  stockPrice,
  prevClose,
  currency = 'KRW',
  buyEntries = [],
}) => {
  const { isDark } = useApp();
  const upColor = isDark ? '#F0787D' : '#D94B50';
  const downColor = isDark ? '#72A9E8' : '#3478C8';
  const gridColor = isDark ? '#263040' : '#E5E9F0';
  const axisTextColor = isDark ? '#94A3B8' : '#64748B';

  const activeCurrency = (currency || 'KRW') as 'KRW' | 'USD' | 'USDT' | 'BTC';

  const formatPrice = useCallback(
    (val: number) => {
      if (!Number.isFinite(val)) return '-';
      const targetCur = activeCurrency;
      if (targetCur === 'USD') {
        return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (targetCur === 'USDT') {
        const decimals = val < 0.01 ? 6 : val < 1 ? 4 : 2;
        return `${val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} USDT`;
      }
      if (targetCur === 'BTC') {
        return `${val.toFixed(8)} BTC`;
      }
      return formatMoney(val, 'KRW');
    },
    [activeCurrency]
  );

  const formatAxisPrice = useCallback(
    (val: number) => {
      if (!Number.isFinite(val)) return '';
      if (activeCurrency === 'USD') {
        return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (activeCurrency === 'USDT') {
        const decimals = val < 0.01 ? 5 : val < 1 ? 4 : 2;
        return val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      }
      if (activeCurrency === 'BTC') {
        return val.toFixed(6);
      }
      return Math.round(val).toLocaleString();
    },
    [activeCurrency]
  );

  // 1. Period & Candle Type State
  const [period, setPeriod] = useState<KiwoomChartPeriod>('1d');
  const [candleType, setCandleType] = useState<ChartCandleType>('minute');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [isMinuteMenuOpen, setIsMinuteMenuOpen] = useState<boolean>(false);

  // Date Navigation State
  const [targetDate, setTargetDate] = useState<string>(''); // YYYY-MM-DD
  const [isHistoricalView, setIsHistoricalView] = useState<boolean>(false);
  const [selectedDateClose, setSelectedDateClose] = useState<number | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string | null>(null);

  const reqSeqRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stockPriceRef = useRef<number>(stockPrice);
  stockPriceRef.current = stockPrice;

  // 2. Raw Data State
  const [rawCandles, setRawCandles] = useState<CandleData[]>(() =>
    sanitizeAndValidateCandles(initialCandles)
  );
  const [chartMeta, setChartMeta] = useState<KiwoomChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [serverIp, setServerIp] = useState<string | null>(null);

  // 3. Responsive Container Measurement
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(900);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const updateWidth = () => {
      const nextW = Math.round(el.getBoundingClientRect().width);
      if (nextW > 100) {
        setContainerWidth(Math.max(360, Math.min(1150, nextW)));
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 4. Zoom, Pan & Vertical Scale State
  const [viewCount, setViewCount] = useState<number>(60);
  const [viewOffset, setViewOffset] = useState<number>(0);
  const [yScale, setYScale] = useState<number>(1);

  const dragModeRef = useRef<DragMode>('none');
  const [isDraggingUI, setIsDraggingUI] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number; offset: number; count: number; yScale: number } | null>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const rAFPendingRef = useRef<number | null>(null);

  // 5. Hover & Crosshair
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // 6. Indicators State
  const [indicators, setIndicators] = useState<IndicatorSettings>(DEFAULT_INDICATOR_SETTINGS);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isIndicatorMenuOpen, setIsIndicatorMenuOpen] = useState<boolean>(false);

  // 7. Drawing Tools State
  const [activeTool, setActiveTool] = useState<DrawingToolType>('none');
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [drawingShape, setDrawingShape] = useState<Partial<DrawingShape> | null>(null);
  const [isDrawingMenuOpen, setIsDrawingMenuOpen] = useState<boolean>(false);

  const currentPeriodConfig = useMemo(() => {
    return ALL_CHART_PERIODS.find(p => p.id === period) || PRIMARY_PERIODS[0];
  }, [period]);

  const minViewCount = useMemo(() => {
    if (rawCandles.length === 0) return 1;
    return Math.min(rawCandles.length, 10);
  }, [rawCandles.length]);

  // Immediate state reset on symbol switch so previous stock's chart/error never lingers
  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    reqSeqRef.current += 1;

    setRawCandles([]);
    setChartMeta(null);
    setApiError(null);
    setHoverIndex(null);
    setHoverPrice(null);
    setTargetDate('');
    setIsHistoricalView(false);
    setSelectedDateClose(null);
    setSelectedDateString(null);
    setViewOffset(0);
    setYScale(1);
    setShapes([]);
    setSelectedShapeId(null);
    setDrawingShape(null);
    setActiveTool('none');
  }, [symbol]);

  // Fetch Chart from server with AbortController + sequence race guard
  const loadChartData = useCallback(
    async (
      targetPeriod: KiwoomChartPeriod,
      customDate?: string,
      customCandleType?: ChartCandleType
    ) => {
      if (!symbol) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentSeq = ++reqSeqRef.current;
      const effectiveCandleType = customCandleType || candleType;
      const queryDate = customDate !== undefined ? customDate : targetDate;

      setIsLoading(true);
      setApiError(null);

      try {
        const data = await stockRepository.getKiwoomChart!(symbol, targetPeriod, {
          candleType: effectiveCandleType,
          date: queryDate.trim() || undefined,
          signal: controller.signal,
        });

        if (reqSeqRef.current !== currentSeq || controller.signal.aborted) return;

        setChartMeta(data);
        if (data.serverIp) setServerIp(data.serverIp);

        if (data.error) {
          setApiError(data.error);
          setRawCandles([]);
        } else if (Array.isArray(data.candles)) {
          let candles = sanitizeAndValidateCandles(data.candles);
          const livePrice = stockPriceRef.current;

          // Align latest candle with live price ONLY in live mode (never overwrite historical view)
          if (!data.isHistoricalView && livePrice > 0 && candles.length > 0) {
            const lastIndex = candles.length - 1;
            const last = { ...candles[lastIndex] };
            last.close = livePrice;
            last.high = Math.max(last.high, livePrice);
            last.low = Math.min(last.low, livePrice);
            candles[lastIndex] = last;
            candles = sanitizeAndValidateCandles(candles);
          }

          setRawCandles(candles);
          setIsHistoricalView(Boolean(data.isHistoricalView));
          setSelectedDateClose(data.selectedDateClose ?? null);
          setSelectedDateString(data.selectedDate ?? null);
          setViewOffset(0);
          setYScale(1);
          setViewCount(candles.length > 0 ? Math.min(candles.length, Math.max(24, Math.min(72, candles.length))) : 60);
        } else {
          setRawCandles([]);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError' || controller.signal.aborted) return;
        if (reqSeqRef.current === currentSeq) {
          console.warn('[InteractiveStockChart] Fetch error:', err);
          setApiError(err?.message || '차트 데이터를 불러오지 못했습니다.');
          setRawCandles([]);
        }
      } finally {
        if (reqSeqRef.current === currentSeq && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [symbol, targetDate, candleType]
  );

  // Trigger fetch whenever symbol, period, or candleType changes
  useEffect(() => {
    loadChartData(period, targetDate, candleType);
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [symbol, period, candleType]);

  // Sync live stockPrice updates cleanly without snapping user's panned offset
  useEffect(() => {
    if (isHistoricalView || !stockPrice || stockPrice <= 0) return;
    setRawCandles(prev => {
      if (!prev || prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.close === stockPrice) return prev;
      const updatedLast: CandleData = {
        ...last,
        close: stockPrice,
        high: Math.max(last.high, stockPrice),
        low: Math.min(last.low, stockPrice),
      };
      return sanitizeAndValidateCandles([...prev.slice(0, -1), updatedLast]);
    });
  }, [stockPrice, isHistoricalView]);

  // Real-time execution tick listener (ignores historical view and keeps panned window stable)
  useEffect(() => {
    if (!symbol) return;

    const unsubscribe = stockRepository.subscribeExecutionTick?.(symbol, (tick) => {
      if (isHistoricalView) return;
      const currentLivePrice = stockPriceRef.current;
      if (currentLivePrice > 0 && tick.price > 0 && Math.abs(tick.price - currentLivePrice) / currentLivePrice > 0.25) {
        return;
      }
      if (!Number.isFinite(tick.price) || tick.price <= 0) return;

      setRawCandles(prev => {
        if (!prev || prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const updatedLast: CandleData = {
          ...last,
          close: tick.price,
          high: Math.max(last.high, tick.price),
          low: Math.min(last.low, tick.price),
          volume: last.volume + (tick.volume > 0 ? Math.round(tick.volume / 100) : 0),
        };
        return sanitizeAndValidateCandles([...prev.slice(0, -1), updatedLast]);
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, [symbol, isHistoricalView]);

  // Date Navigation Handlers
  const handlePrevDay = () => {
    const baseDate = targetDate ? new Date(`${targetDate}T00:00:00Z`) : new Date();
    baseDate.setUTCDate(baseDate.getUTCDate() - getStepDaysForPeriod(period));
    const newDateStr = baseDate.toISOString().slice(0, 10);
    setTargetDate(newDateStr);
    loadChartData(period, newDateStr, candleType);
  };

  const handleNextDay = () => {
    if (!targetDate) return;
    const baseDate = new Date(`${targetDate}T00:00:00Z`);
    baseDate.setUTCDate(baseDate.getUTCDate() + getStepDaysForPeriod(period));
    const todayStr = new Date().toISOString().slice(0, 10);
    const nextStr = baseDate.toISOString().slice(0, 10);
    if (nextStr >= todayStr) {
      handleResetToLive();
    } else {
      setTargetDate(nextStr);
      loadChartData(period, nextStr, candleType);
    }
  };

  const handleDateChange = (newDateStr: string) => {
    setTargetDate(newDateStr);
    loadChartData(period, newDateStr, candleType);
  };

  const handleResetToLive = () => {
    setTargetDate('');
    setIsHistoricalView(false);
    setSelectedDateClose(null);
    setSelectedDateString(null);
    loadChartData(period, '', candleType);
  };

  // Visible Slice Calculation
  const visibleWindow = useMemo(() => {
    if (rawCandles.length === 0) {
      return { slice: [] as CandleData[], startIndex: 0, endIndex: 0 };
    }
    const count = Math.max(minViewCount, Math.min(rawCandles.length, viewCount));
    const maxOffset = Math.max(0, rawCandles.length - count);
    const clampedOffset = Math.max(0, Math.min(maxOffset, viewOffset));
    const startIndex = Math.max(0, rawCandles.length - count - clampedOffset);
    const endIndex = rawCandles.length - clampedOffset;
    return {
      slice: rawCandles.slice(startIndex, endIndex),
      startIndex,
      endIndex,
    };
  }, [rawCandles, viewCount, viewOffset, minViewCount]);

  const visibleCandles = visibleWindow.slice;

  // Responsive Chart Dimensions
  const width = containerWidth;
  const isNarrow = width < 540;
  const paddingLeft = isNarrow ? 10 : 16;
  const paddingRight = isNarrow ? 74 : 88;
  const innerWidth = Math.max(180, width - paddingLeft - paddingRight);

  const hasSubChartRsi = indicators.rsi.enabled;
  const hasSubChartMacd = indicators.macd.enabled;
  const hasSubChartStoch = indicators.stochastic.enabled;
  const subChartCount = (hasSubChartRsi ? 1 : 0) + (hasSubChartMacd ? 1 : 0) + (hasSubChartStoch ? 1 : 0);

  const mainPriceHeight = isNarrow ? 225 : 280;
  const volumeHeight = indicators.volume.enabled ? (isNarrow ? 56 : 68) : 0;
  const subChartHeight = isNarrow ? 64 : 74;
  const bottomTimePadding = 28;
  const paddingTop = 22;

  const totalHeight = paddingTop + mainPriceHeight + volumeHeight + subChartCount * subChartHeight + bottomTimePadding;

  // Scaled Y-Axis Coordinate Range (respects vertical drag yScale)
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (visibleCandles.length === 0) {
      return { minPrice: 0, maxPrice: 1, priceRange: 1 };
    }
    const rawMin = Math.min(...visibleCandles.map(c => c.low));
    const rawMax = Math.max(...visibleCandles.map(c => c.high));
    const center = (rawMax + rawMin) / 2;
    const rawHalf = (rawMax - rawMin) / 2;
    const baseHalf = rawHalf > 0 ? rawHalf : Math.max(center * 0.005, 1e-6);
    const paddedHalf = (baseHalf * 1.08) / Math.max(0.3, Math.min(5, yScale));

    const minP = Math.max(1e-8, center - paddedHalf);
    const maxP = center + paddedHalf;
    return {
      minPrice: minP,
      maxPrice: maxP,
      priceRange: Math.max(maxP - minP, 1e-8),
    };
  }, [visibleCandles, yScale]);

  const maxVolume = useMemo(() => {
    if (visibleCandles.length === 0) return 1;
    return Math.max(...visibleCandles.map(c => c.volume)) || 1;
  }, [visibleCandles]);

  const getPriceY = useCallback(
    (price: number) => {
      return paddingTop + mainPriceHeight - ((price - minPrice) / priceRange) * mainPriceHeight;
    },
    [minPrice, priceRange, mainPriceHeight, paddingTop]
  );

  const getPriceFromY = useCallback(
    (y: number) => {
      const ratio = (paddingTop + mainPriceHeight - y) / mainPriceHeight;
      return minPrice + ratio * priceRange;
    },
    [minPrice, priceRange, mainPriceHeight, paddingTop]
  );

  const getCandleX = useCallback(
    (indexInVisible: number) => {
      if (visibleCandles.length <= 1) return paddingLeft + innerWidth / 2;
      return paddingLeft + indexInVisible * (innerWidth / (visibleCandles.length - 1));
    },
    [paddingLeft, innerWidth, visibleCandles.length]
  );

  const candleWidth = useMemo(() => {
    if (visibleCandles.length === 0) return 5;
    return Math.max(2, Math.min(20, (innerWidth / Math.max(1, visibleCandles.length)) * 0.68));
  }, [visibleCandles.length, innerWidth]);

  // Full Indicator Computation (recomputed only when candles or indicator settings change)
  const allIndicatorSeries = useMemo(() => {
    if (rawCandles.length === 0) {
      return null;
    }
    return {
      sma5All: indicators.ma.enabled && indicators.ma.ma5 ? calculateSMA(rawCandles, indicators.ma.period5) : [],
      sma20All: indicators.ma.enabled && indicators.ma.ma20 ? calculateSMA(rawCandles, indicators.ma.period20) : [],
      sma60All: indicators.ma.enabled && indicators.ma.ma60 ? calculateSMA(rawCandles, indicators.ma.period60) : [],
      sma120All: indicators.ma.enabled && indicators.ma.ma120 ? calculateSMA(rawCandles, indicators.ma.period120) : [],
      emaAll: indicators.ema.enabled ? calculateEMA(rawCandles, indicators.ema.period) : [],
      bbAll: indicators.bollinger.enabled
        ? calculateBollingerBands(rawCandles, indicators.bollinger.period, indicators.bollinger.stdDev)
        : { upper: [], middle: [], lower: [] },
      vwapAll: indicators.vwap.enabled ? calculateVWAP(rawCandles) : [],
      rsiAll: indicators.rsi.enabled ? calculateRSI(rawCandles, indicators.rsi.period) : [],
      macdAll: indicators.macd.enabled
        ? calculateMACD(rawCandles, indicators.macd.fastPeriod, indicators.macd.slowPeriod, indicators.macd.signalPeriod)
        : { macdLine: [], signalLine: [], histogram: [] },
      stochAll: indicators.stochastic.enabled
        ? calculateStochastic(rawCandles, indicators.stochastic.kPeriod, indicators.stochastic.dPeriod)
        : { kLine: [], dLine: [] },
    };
  }, [rawCandles, indicators]);

  // Indicator Series Slicing (fast array slices on pan/zoom without recalculating indicators)
  const {
    sma5Slice,
    sma20Slice,
    sma60Slice,
    sma120Slice,
    emaSlice,
    bollingerSlice,
    vwapSlice,
    rsiSlice,
    macdSlice,
    stochSlice,
  } = useMemo(() => {
    if (!allIndicatorSeries) {
      return {
        sma5Slice: [],
        sma20Slice: [],
        sma60Slice: [],
        sma120Slice: [],
        emaSlice: [],
        bollingerSlice: { upper: [], middle: [], lower: [] },
        vwapSlice: [],
        rsiSlice: [],
        macdSlice: { macdLine: [], signalLine: [], histogram: [] },
        stochSlice: { kLine: [], dLine: [] },
      };
    }

    const { startIndex, endIndex } = visibleWindow;
    const {
      sma5All,
      sma20All,
      sma60All,
      sma120All,
      emaAll,
      bbAll,
      vwapAll,
      rsiAll,
      macdAll,
      stochAll,
    } = allIndicatorSeries;

    return {
      sma5Slice: sma5All.slice(startIndex, endIndex),
      sma20Slice: sma20All.slice(startIndex, endIndex),
      sma60Slice: sma60All.slice(startIndex, endIndex),
      sma120Slice: sma120All.slice(startIndex, endIndex),
      emaSlice: emaAll.slice(startIndex, endIndex),
      bollingerSlice: {
        upper: bbAll.upper.slice(startIndex, endIndex),
        middle: bbAll.middle.slice(startIndex, endIndex),
        lower: bbAll.lower.slice(startIndex, endIndex),
      },
      vwapSlice: vwapAll.slice(startIndex, endIndex),
      rsiSlice: rsiAll.slice(startIndex, endIndex),
      macdSlice: {
        macdLine: macdAll.macdLine.slice(startIndex, endIndex),
        signalLine: macdAll.signalLine.slice(startIndex, endIndex),
        histogram: macdAll.histogram.slice(startIndex, endIndex),
      },
      stochSlice: {
        kLine: stochAll.kLine.slice(startIndex, endIndex),
        dLine: stochAll.dLine.slice(startIndex, endIndex),
      },
    };
  }, [allIndicatorSeries, visibleWindow]);

  const generateSeriesPath = useCallback(
    (series: (number | null)[]) => {
      const points: string[] = [];
      for (let i = 0; i < series.length; i++) {
        const val = series[i];
        if (val !== null && val !== undefined && Number.isFinite(val)) {
          const x = getCandleX(i);
          const y = getPriceY(val);
          points.push(`${points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
        }
      }
      return points.join(' ');
    },
    [getCandleX, getPriceY]
  );

  // Active Hover or Latest Index & Candle
  const activeSliceIndex = useMemo(() => {
    if (hoverIndex !== null && visibleCandles[hoverIndex]) return hoverIndex;
    return visibleCandles.length > 0 ? visibleCandles.length - 1 : -1;
  }, [hoverIndex, visibleCandles]);

  const display = activeSliceIndex >= 0 ? visibleCandles[activeSliceIndex] : null;
  const isDisplayUp = display ? display.close >= display.open : true;
  const candleChange = display ? display.close - display.open : 0;
  const candleChangePercent = display && display.open > 0 ? ((candleChange / display.open) * 100).toFixed(2) : '0.00';

  // Sub-chart Y layout positions
  const volumeStartY = paddingTop + mainPriceHeight;
  let currentSubY = volumeStartY + volumeHeight;
  const rsiStartY = hasSubChartRsi ? (currentSubY += subChartHeight, currentSubY - subChartHeight) : 0;
  const macdStartY = hasSubChartMacd ? (currentSubY += subChartHeight, currentSubY - subChartHeight) : 0;
  const stochStartY = hasSubChartStoch ? (currentSubY += subChartHeight, currentSubY - subChartHeight) : 0;

  // Native Wheel Zoom (non-passive to prevent browser scroll conflict + anchored at mouse X)
  const wheelHandlerRef = useRef<(e: WheelEvent) => void>(() => {});
  wheelHandlerRef.current = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (rawCandles.length === 0 || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;

    const relativeMouseX = Math.max(0, Math.min(1, (svgX - paddingLeft) / innerWidth));
    const prevCount = viewCount;
    const nextCount = Math.max(minViewCount, Math.min(rawCandles.length, Math.round(prevCount * zoomFactor)));
    if (nextCount === prevCount && rawCandles.length > minViewCount) {
      const nudged = e.deltaY > 0 ? Math.min(rawCandles.length, prevCount + 2) : Math.max(minViewCount, prevCount - 2);
      const maxOffset = Math.max(0, rawCandles.length - nudged);
      const newOffset = Math.max(0, Math.min(maxOffset, Math.round(viewOffset + (prevCount - nudged) * relativeMouseX)));
      if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
      rAFPendingRef.current = requestAnimationFrame(() => {
        setViewCount(nudged);
        setViewOffset(newOffset);
      });
      return;
    }

    const maxOffset = Math.max(0, rawCandles.length - nextCount);
    const newOffset = Math.max(0, Math.min(maxOffset, Math.round(viewOffset + (prevCount - nextCount) * relativeMouseX)));

    if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
    rAFPendingRef.current = requestAnimationFrame(() => {
      setViewCount(nextCount);
      setViewOffset(newOffset);
    });
  };

  // Native TouchMove (non-passive to block page scroll while panning/pinching chart)
  const touchMoveHandlerRef = useRef<(e: TouchEvent) => void>(() => {});
  touchMoveHandlerRef.current = (e: TouchEvent) => {
    if (!svgRef.current || rawCandles.length === 0) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length === 1 && dragModeRef.current === 'pan' && panStartRef.current) {
      const touch = e.touches[0];
      const rect = svgRef.current.getBoundingClientRect();
      const deltaPx = touch.clientX - panStartRef.current.x;
      const svgDeltaX = (deltaPx / rect.width) * width;
      const candlePixelWidth = innerWidth / Math.max(1, visibleCandles.length);
      const candleDelta = Math.round(svgDeltaX / Math.max(1, candlePixelWidth));
      const maxOffset = Math.max(0, rawCandles.length - viewCount);
      const newOffset = Math.max(0, Math.min(maxOffset, panStartRef.current.offset + candleDelta));

      const clientX = touch.clientX - rect.left;
      const svgX = (clientX / rect.width) * width;
      const index = Math.round(((svgX - paddingLeft) / innerWidth) * Math.max(1, visibleCandles.length - 1));
      const clampedIndex = Math.max(0, Math.min(visibleCandles.length - 1, index));

      if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
      rAFPendingRef.current = requestAnimationFrame(() => {
        setViewOffset(newOffset);
        setHoverIndex(clampedIndex);
      });
    } else if (e.touches.length === 2 && touchStartDistRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (dist <= 0) return;

      const ratio = touchStartDistRef.current / dist;
      if (Math.abs(ratio - 1) > 0.03) {
        const rect = svgRef.current.getBoundingClientRect();
        const centerClientX = (t1.clientX + t2.clientX) / 2 - rect.left;
        const centerSvgX = (centerClientX / rect.width) * width;
        const relativeCenterX = Math.max(0, Math.min(1, (centerSvgX - paddingLeft) / innerWidth));

        const prevCount = viewCount;
        const nextCount = Math.max(minViewCount, Math.min(rawCandles.length, Math.round(prevCount * ratio)));
        const maxOffset = Math.max(0, rawCandles.length - nextCount);
        const newOffset = Math.max(0, Math.min(maxOffset, Math.round(viewOffset + (prevCount - nextCount) * relativeCenterX)));

        touchStartDistRef.current = dist;
        if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
        rAFPendingRef.current = requestAnimationFrame(() => {
          setViewCount(nextCount);
          setViewOffset(newOffset);
        });
      }
    }
  };

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const onWheelNative = (e: WheelEvent) => wheelHandlerRef.current(e);
    const onTouchMoveNative = (e: TouchEvent) => touchMoveHandlerRef.current(e);

    svgEl.addEventListener('wheel', onWheelNative, { passive: false });
    svgEl.addEventListener('touchmove', onTouchMoveNative, { passive: false });
    return () => {
      svgEl.removeEventListener('wheel', onWheelNative);
      svgEl.removeEventListener('touchmove', onTouchMoveNative);
      if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
    };
  }, [rawCandles.length, isLoading, apiError]);

  // Toolbar Zoom & Reset Controls
  const zoomIn = () => {
    setViewCount(prev => Math.max(minViewCount, Math.round(prev * 0.8)));
  };

  const zoomOut = () => {
    setViewCount(prev => Math.min(rawCandles.length || 60, Math.round(prev * 1.25)));
  };

  const resetView = () => {
    setViewOffset(0);
    setYScale(1);
    setViewCount(rawCandles.length > 0 ? Math.min(rawCandles.length, 60) : 60);
  };

  const viewAllData = () => {
    setViewOffset(0);
    setYScale(1);
    setViewCount(Math.max(1, rawCandles.length));
  };

  // Mouse Drag Handlers (Pan / Price-Axis Y-Scale / Time-Axis Span / Drawing)
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || visibleCandles.length === 0) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const svgX = (clientX / rect.width) * width;
    const svgY = (clientY / rect.height) * totalHeight;

    // Drawing Mode
    if (activeTool !== 'none') {
      const candleIndex = Math.max(
        0,
        Math.min(visibleCandles.length - 1, Math.round(((svgX - paddingLeft) / innerWidth) * Math.max(1, visibleCandles.length - 1)))
      );
      const price = getPriceFromY(svgY);

      const newPoint: Point = {
        x: svgX,
        y: price,
        candleIndex,
      };

      if (activeTool === 'horizontal' || activeTool === 'vertical') {
        const newShape: DrawingShape = {
          id: `draw_${Date.now()}`,
          type: activeTool,
          color: '#f43f5e',
          lineWidth: 1.5,
          startPoint: newPoint,
        };
        setShapes(prev => [...prev, newShape]);
        setActiveTool('none');
      } else {
        setDrawingShape({
          id: `draw_${Date.now()}`,
          type: activeTool,
          color: activeTool === 'fibonacci' ? '#fbbf24' : '#38bdf8',
          lineWidth: 1.5,
          startPoint: newPoint,
        });
      }
      return;
    }

    // Price Axis Y-Scale Drag
    if (svgX >= width - paddingRight) {
      dragModeRef.current = 'priceAxis';
      setIsDraggingUI(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offset: viewOffset,
        count: viewCount,
        yScale,
      };
      return;
    }

    // Time Axis X-Span Drag
    if (svgY >= totalHeight - bottomTimePadding) {
      dragModeRef.current = 'timeAxis';
      setIsDraggingUI(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offset: viewOffset,
        count: viewCount,
        yScale,
      };
      return;
    }

    // Main Canvas Horizontal Pan
    dragModeRef.current = 'pan';
    setIsDraggingUI(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offset: viewOffset,
      count: viewCount,
      yScale,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || visibleCandles.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const svgX = (clientX / rect.width) * width;
    const svgY = (clientY / rect.height) * totalHeight;

    const index = Math.round(((svgX - paddingLeft) / innerWidth) * Math.max(1, visibleCandles.length - 1));
    const clampedIndex = Math.max(0, Math.min(visibleCandles.length - 1, index));

    const mode = dragModeRef.current;
    const start = panStartRef.current;

    if (rAFPendingRef.current) cancelAnimationFrame(rAFPendingRef.current);
    rAFPendingRef.current = requestAnimationFrame(() => {
      setHoverIndex(clampedIndex);
      setHoverPrice(getPriceFromY(svgY));

      if (mode === 'pan' && start) {
        const deltaPx = e.clientX - start.x;
        const svgDeltaX = (deltaPx / rect.width) * width;
        const candlePixelWidth = innerWidth / Math.max(1, visibleCandles.length);
        const candleDelta = Math.round(svgDeltaX / Math.max(1, candlePixelWidth));
        const maxOffset = Math.max(0, rawCandles.length - viewCount);
        setViewOffset(Math.max(0, Math.min(maxOffset, start.offset + candleDelta)));
      } else if (mode === 'priceAxis' && start) {
        const deltaY = start.y - e.clientY; // Drag up -> expand Y scale (zoom in price)
        const nextScale = Math.max(0.3, Math.min(5.0, start.yScale * Math.exp(deltaY * 0.006)));
        setYScale(Number(nextScale.toFixed(3)));
      } else if (mode === 'timeAxis' && start) {
        const deltaX = e.clientX - start.x; // Drag right -> expand time span
        const nextCount = Math.max(
          minViewCount,
          Math.min(rawCandles.length, Math.round(start.count * Math.exp(deltaX * 0.005)))
        );
        const maxOffset = Math.max(0, rawCandles.length - nextCount);
        setViewCount(nextCount);
        setViewOffset(prev => Math.min(maxOffset, prev));
      }

      if (drawingShape && drawingShape.startPoint) {
        const candleIdx = Math.max(
          0,
          Math.min(visibleCandles.length - 1, Math.round(((svgX - paddingLeft) / innerWidth) * Math.max(1, visibleCandles.length - 1)))
        );
        setDrawingShape(prev => ({
          ...prev,
          endPoint: {
            x: svgX,
            y: getPriceFromY(svgY),
            candleIndex: candleIdx,
          },
        }));
      }
    });
  };

  const handleMouseUp = () => {
    if (dragModeRef.current !== 'none') {
      dragModeRef.current = 'none';
      setIsDraggingUI(false);
      panStartRef.current = null;
    }

    if (drawingShape && drawingShape.startPoint && drawingShape.endPoint) {
      setShapes(prev => [...prev, drawingShape as DrawingShape]);
      setDrawingShape(null);
      setActiveTool('none');
    }
  };

  const handleMouseLeave = () => {
    dragModeRef.current = 'none';
    setIsDraggingUI(false);
    panStartRef.current = null;
    setHoverIndex(null);
    setHoverPrice(null);
    if (drawingShape) {
      setDrawingShape(null);
      setActiveTool('none');
    }
  };

  // Touch Start / End (stops propagation so outer mobile swipe container doesn't steal chart gestures)
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    e.stopPropagation();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      dragModeRef.current = 'pan';
      setIsDraggingUI(true);
      panStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        offset: viewOffset,
        count: viewCount,
        yScale,
      };
    } else if (e.touches.length === 2) {
      dragModeRef.current = 'none';
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchStartDistRef.current = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
    e.stopPropagation();
    dragModeRef.current = 'none';
    setIsDraggingUI(false);
    panStartRef.current = null;
    touchStartDistRef.current = null;
  };

  // Keyboard navigation & shape deletion
  const deleteSelectedShape = useCallback(() => {
    if (selectedShapeId) {
      setShapes(prev => prev.filter(s => s.id !== selectedShapeId));
      setSelectedShapeId(null);
    }
  }, [selectedShapeId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeId) {
        deleteSelectedShape();
      } else if (e.key === 'Escape' && activeTool !== 'none') {
        setActiveTool('none');
        setDrawingShape(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId, activeTool, deleteSelectedShape]);

  const clearAllShapes = () => {
    setShapes([]);
    setSelectedShapeId(null);
    setDrawingShape(null);
    setActiveTool('none');
  };

  // Switch Candle Type cleanly (ensures meaningful range when switching from 1d/minute to day/week/month)
  const handleSelectCandleType = (nextType: ChartCandleType) => {
    setCandleType(nextType);
    setIsMinuteMenuOpen(false);
    if (nextType === 'minute') {
      if (!MINUTE_PERIODS.some(mp => mp.id === period) && period !== '1d' && period !== '1w') {
        setPeriod('1d');
      }
    } else if (nextType === 'day') {
      if (period === '1d' || MINUTE_PERIODS.some(mp => mp.id === period)) {
        setPeriod('3mo');
      }
    } else if (nextType === 'week') {
      if (period === '1d' || period === '1w' || MINUTE_PERIODS.some(mp => mp.id === period)) {
        setPeriod('1y');
      }
    } else if (nextType === 'month') {
      if (period === '1d' || period === '1w' || period === '1mo' || MINUTE_PERIODS.some(mp => mp.id === period)) {
        setPeriod('3y');
      }
    }
  };

  const activeIndicatorCount = [
    indicators.ma.enabled,
    indicators.ema.enabled,
    indicators.bollinger.enabled,
    indicators.vwap.enabled,
    indicators.rsi.enabled,
    indicators.macd.enabled,
    indicators.stochastic.enabled,
  ].filter(Boolean).length;

  const hoverMa5 = activeSliceIndex >= 0 ? sma5Slice[activeSliceIndex] : null;
  const hoverMa20 = activeSliceIndex >= 0 ? sma20Slice[activeSliceIndex] : null;
  const hoverMa60 = activeSliceIndex >= 0 ? sma60Slice[activeSliceIndex] : null;
  const hoverEma = activeSliceIndex >= 0 ? emaSlice[activeSliceIndex] : null;
  const hoverRsi = activeSliceIndex >= 0 ? rsiSlice[activeSliceIndex] : null;

  const isStale = Boolean(chartMeta?.isStale);
  const priceTagWidth = isNarrow ? 70 : 82;

  return (
    <>
      <div ref={chartContainerRef} className="space-y-2.5 font-sans">
        {/* 1. Master Toolbar */}
        <div className="flex flex-col gap-2 bg-finance-card p-2.5 rounded-2xl border border-finance-border shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Period Selector: 1일 / 1주 / 1개월 / 3개월 / 6개월 / 1년 / 3년 / 전체 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-finance-accent/10 text-finance-accent border border-finance-accent/25 text-[11px] font-bold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-finance-accent animate-pulse" />
                <span>{getSourceLabel(chartMeta?.source)}</span>
                <span className="opacity-70">· {chartMeta?.currency || activeCurrency}</span>
              </div>

              <div className="flex p-0.5 bg-finance-sub-bg rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none border border-finance-border">
                {PRIMARY_PERIODS.map(p => {
                  const isActive = period === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPeriod(p.id);
                        setCandleType(p.defaultCandleType);
                        setIsMinuteMenuOpen(false);
                      }}
                      disabled={isLoading && period === p.id}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all shrink-0 font-mono text-xs cursor-pointer ${
                        isActive
                          ? 'bg-finance-accent text-white font-bold shadow-xs'
                          : 'text-finance-sub-text hover:text-finance-text'
                      }`}
                      title={p.description}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candle Type Selector: 분봉 / 일봉 / 주봉 / 월봉 + Candle/Line Switch */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center p-0.5 bg-finance-sub-bg rounded-xl text-xs font-semibold border border-finance-border">
                {/* Minute Intervals Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMinuteMenuOpen(o => !o)}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all text-xs font-mono cursor-pointer ${
                      candleType === 'minute'
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="분봉 선택 (1분, 5분, 15분, 30분, 60분)"
                  >
                    <span>{MINUTE_PERIODS.find(mp => mp.id === period)?.label || '분봉'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {isMinuteMenuOpen && (
                    <div className="absolute left-0 mt-1.5 w-28 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 text-xs space-y-0.5">
                      {MINUTE_PERIODS.map(mp => (
                        <button
                          key={mp.id}
                          type="button"
                          onClick={() => {
                            setPeriod(mp.id);
                            setCandleType('minute');
                            setIsMinuteMenuOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg font-mono cursor-pointer ${
                            period === mp.id && candleType === 'minute'
                              ? 'bg-rose-500 text-white font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {mp.label}봉
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {(
                  [
                    { id: 'day' as const, label: '일봉' },
                    { id: 'week' as const, label: '주봉' },
                    { id: 'month' as const, label: '월봉' },
                  ]
                ).map(ct => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => handleSelectCandleType(ct.id)}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all text-xs font-mono cursor-pointer ${
                      candleType === ct.id
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>

              {/* Candle / Line Toggle */}
              <div className="flex p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-xl text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setChartType('candle')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    chartType === 'candle'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  봉
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    chartType === 'line'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  선
                </button>
              </div>
            </div>
          </div>

          {/* Second Row: Date Navigation | Indicators | Drawing | Zoom & Reset | Refresh */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-finance-border/60">
            {/* Prev / Date Picker / Next / Live Reset */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={handlePrevDay}
                disabled={isLoading}
                className="p-1.5 rounded-lg bg-finance-sub-bg border border-finance-border text-finance-sub-text hover:text-finance-text transition-colors cursor-pointer"
                title="이전 날짜 구간으로 이동"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <label className="relative flex items-center gap-1.5 px-2 py-1 rounded-lg bg-finance-sub-bg border border-finance-border text-[11px] font-mono text-finance-text">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={targetDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={e => handleDateChange(e.target.value)}
                  className="bg-transparent focus:outline-none text-[11px] font-mono w-[108px] cursor-pointer"
                  aria-label="조회 기준일"
                />
              </label>

              <button
                type="button"
                onClick={handleNextDay}
                disabled={isLoading || !targetDate}
                className="p-1.5 rounded-lg bg-finance-sub-bg border border-finance-border text-finance-sub-text hover:text-finance-text disabled:opacity-40 transition-colors cursor-pointer"
                title="다음 날짜 구간으로 이동"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {(isHistoricalView || targetDate) && (
                <button
                  type="button"
                  onClick={handleResetToLive}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/25 text-[11px] font-bold hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <Radio className="w-3 h-3" />
                  <span>실시간 복귀</span>
                </button>
              )}

              {isHistoricalView && selectedDateString && (
                <span className="text-[11px] font-mono text-slate-400 px-1.5">
                  기준일 {selectedDateString}
                  {selectedDateClose ? ` (종가 ${formatPrice(selectedDateClose)})` : ''}
                </span>
              )}
            </div>

            {/* Right Controls: Indicators | Drawing | Settings | Zoom | Refresh */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Indicators Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsIndicatorMenuOpen(o => !o);
                    setIsDrawingMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  <span>지표 ({activeIndicatorCount})</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isIndicatorMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-40 text-xs space-y-1">
                    <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      보조지표 빠른 ON/OFF
                    </div>

                    <button
                      type="button"
                      onClick={() => setIndicators(prev => ({ ...prev, ma: { ...prev.ma, enabled: !prev.ma.enabled } }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        이동평균 (MA 5/20/60/120)
                      </span>
                      {indicators.ma.enabled && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndicators(prev => ({ ...prev, ema: { ...prev.ema, enabled: !prev.ema.enabled } }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500" />
                        지수이동평균 (EMA {indicators.ema.period})
                      </span>
                      {indicators.ema.enabled && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndicators(prev => ({ ...prev, bollinger: { ...prev.bollinger, enabled: !prev.bollinger.enabled } }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        볼린저 밴드 (BB {indicators.bollinger.period}, {indicators.bollinger.stdDev})
                      </span>
                      {indicators.bollinger.enabled && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndicators(prev => ({ ...prev, vwap: { enabled: !prev.vwap.enabled } }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        VWAP (거래량가중평균가)
                      </span>
                      {indicators.vwap.enabled && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndicators(prev => ({ ...prev, rsi: { ...prev.rsi, enabled: !prev.rsi.enabled } }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        RSI ({indicators.rsi.period})
                      </span>
                      {indicators.rsi.enabled && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndicators(prev => ({ ...prev, macd: { ...prev.macd, enabled: !prev.macd.enabled } }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        MACD ({indicators.macd.fastPeriod},{indicators.macd.slowPeriod},{indicators.macd.signalPeriod})
                      </span>
                      {indicators.macd.enabled && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndicators(prev => ({ ...prev, stochastic: { ...prev.stochastic, enabled: !prev.stochastic.enabled } }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        스토캐스틱 ({indicators.stochastic.kPeriod},{indicators.stochastic.dPeriod})
                      </span>
                      {indicators.stochastic.enabled && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => {
                          setIsIndicatorMenuOpen(false);
                          setIsSettingsModalOpen(true);
                        }}
                        className="w-full text-center py-1.5 font-bold text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        기간값 및 상세 설정 열기
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawing Tools Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawingMenuOpen(o => !o);
                    setIsIndicatorMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    activeTool !== 'none'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>
                    {activeTool === 'none'
                      ? `그리기 (${shapes.length})`
                      : activeTool === 'trendline'
                      ? '추세선'
                      : activeTool === 'horizontal'
                      ? '수평선'
                      : activeTool === 'vertical'
                      ? '수직선'
                      : activeTool === 'rectangle'
                      ? '사각형'
                      : '피보나치'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isDrawingMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-40 text-xs space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTool('trendline');
                        setIsDrawingMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${
                        activeTool === 'trendline' ? 'bg-rose-500/10 text-rose-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-0.5 bg-sky-400 rotate-45 inline-block" />
                      <span>추세선 (Trendline)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTool('horizontal');
                        setIsDrawingMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${
                        activeTool === 'horizontal' ? 'bg-rose-500/10 text-rose-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-3 h-0.5 bg-rose-500 inline-block" />
                      <span>수평선 (지지/저항선)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTool('vertical');
                        setIsDrawingMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${
                        activeTool === 'vertical' ? 'bg-rose-500/10 text-rose-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-0.5 h-3 bg-indigo-500 inline-block" />
                      <span>수직선 (시간선)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTool('rectangle');
                        setIsDrawingMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${
                        activeTool === 'rectangle' ? 'bg-rose-500/10 text-rose-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-3 h-2.5 border border-emerald-400 inline-block" />
                      <span>사각형 영역</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTool('fibonacci');
                        setIsDrawingMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${
                        activeTool === 'fibonacci' ? 'bg-rose-500/10 text-rose-500 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-500" />
                      <span>피보나치 되돌림</span>
                    </button>

                    {shapes.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1">
                        {selectedShapeId && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteSelectedShape();
                              setIsDrawingMenuOpen(false);
                            }}
                            className="flex-1 py-1 text-center rounded-lg bg-slate-100 dark:bg-slate-700 text-rose-500 font-semibold cursor-pointer"
                          >
                            선택 삭제
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            clearAllShapes();
                            setIsDrawingMenuOpen(false);
                          }}
                          className="flex-1 py-1 text-center rounded-lg bg-rose-500/10 text-rose-500 font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>전체 지우기</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Indicator Settings Button */}
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="보조지표 기간값 상세설정"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Zoom & Reset */}
              <div className="flex items-center gap-0.5 bg-slate-200/50 dark:bg-slate-800/80 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={zoomIn}
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="확대 (줌 인)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={zoomOut}
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="축소 (줌 아웃)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={viewAllData}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="전체 구간 보기"
                >
                  전체
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="초기 뷰 복원 (더블클릭)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => loadChartData(period, targetDate, candleType)}
                disabled={isLoading}
                className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="차트 데이터 새로고침"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Stale Warning Banner */}
        {isStale && !isLoading && (
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>현재 표시 중인 시세는 지연 또는 최근 정상 보존된 차트 데이터입니다.</span>
            </div>
            <button
              type="button"
              onClick={() => loadChartData(period, targetDate, candleType)}
              className="text-[11px] font-bold underline cursor-pointer shrink-0"
            >
              갱신
            </button>
          </div>
        )}

        {/* 2. Restored OHLCV + Indicator Crosshair Readout Bar */}
        {display && (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2 rounded-xl bg-finance-sub-bg/80 border border-finance-border text-[11px] font-mono tabular-nums">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-bold text-finance-text">{display.time}</span>
              <span className="text-slate-400">
                시 <strong className="text-finance-text font-semibold">{formatPrice(display.open)}</strong>
              </span>
              <span className="text-slate-400">
                고 <strong className="text-rose-500 font-semibold">{formatPrice(display.high)}</strong>
              </span>
              <span className="text-slate-400">
                저 <strong className="text-blue-500 font-semibold">{formatPrice(display.low)}</strong>
              </span>
              <span className="text-slate-400">
                종{' '}
                <strong className={isDisplayUp ? 'text-rose-500 font-bold' : 'text-blue-500 font-bold'}>
                  {formatPrice(display.close)}
                </strong>
              </span>
              <span className={`font-bold ${isDisplayUp ? 'text-rose-500' : 'text-blue-500'}`}>
                {candleChange >= 0 ? '+' : ''}
                {formatPrice(candleChange)} ({candleChange >= 0 ? '+' : ''}
                {candleChangePercent}%)
              </span>
              <span className="text-slate-400">
                거래량 <strong className="text-finance-text font-semibold">{display.volume.toLocaleString()}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px]">
              {hoverPrice !== null && (
                <span className="text-slate-400">
                  커서 <strong className="text-finance-text">{formatPrice(hoverPrice)}</strong>
                </span>
              )}
              {indicators.ma.enabled && hoverMa5 !== null && hoverMa5 !== undefined && (
                <span className="text-amber-500">MA{indicators.ma.period5} {formatAxisPrice(hoverMa5)}</span>
              )}
              {indicators.ma.enabled && hoverMa20 !== null && hoverMa20 !== undefined && (
                <span className="text-purple-500">MA{indicators.ma.period20} {formatAxisPrice(hoverMa20)}</span>
              )}
              {indicators.ma.enabled && hoverMa60 !== null && hoverMa60 !== undefined && (
                <span className="text-emerald-500">MA{indicators.ma.period60} {formatAxisPrice(hoverMa60)}</span>
              )}
              {indicators.ema.enabled && hoverEma !== null && hoverEma !== undefined && (
                <span className="text-pink-500">EMA{indicators.ema.period} {formatAxisPrice(hoverEma)}</span>
              )}
              {indicators.rsi.enabled && hoverRsi !== null && hoverRsi !== undefined && (
                <span className="text-cyan-500">RSI {hoverRsi.toFixed(1)}</span>
              )}
            </div>
          </div>
        )}

        {/* 3. Main Chart Canvas Area */}
        <div className="relative w-full rounded-2xl bg-finance-card border border-finance-border p-2 sm:p-3 overflow-hidden min-h-[380px] sm:min-h-[420px] flex items-center justify-center select-none shadow-xs">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0c0f17]/90 backdrop-blur-xs transition-opacity">
              <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                실시간 차트 데이터 조회 중...
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {currentPeriodConfig.label} · {candleType === 'minute' ? '분봉' : candleType === 'day' ? '일봉' : candleType === 'week' ? '주봉' : '월봉'}
              </p>
            </div>
          )}

          {/* API Error State */}
          {!isLoading && apiError && (
            <div className="w-full max-w-lg p-5 my-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center space-y-3 z-10">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-rose-500">차트 데이터 조회 안내</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed whitespace-pre-line">
                  {apiError}
                </p>
              </div>
              {apiError.includes('8050') && serverIp && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>현재 서버 공인 IP:</span>
                    <span className="text-emerald-400 font-bold">{serverIp}</span>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => loadChartData(period, targetDate, candleType)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>차트 다시 시도</span>
              </button>
            </div>
          )}

          {/* Empty Data State (no fabricated candles) */}
          {!isLoading && !apiError && rawCandles.length === 0 && (
            <div className="text-center py-12 space-y-2.5 text-slate-400">
              <BarChart2 className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                선택한 조건의 차트 데이터가 없습니다.
              </p>
              <p className="text-xs text-slate-500">
                장 개시 전이거나 해당 날짜에 체결 이력이 없습니다. 임의의 데이터를 생성하지 않습니다.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                {targetDate && (
                  <button
                    type="button"
                    onClick={handleResetToLive}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold cursor-pointer"
                  >
                    실시간 최근 구간 보기
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => loadChartData(period, targetDate, candleType)}
                  className="px-3 py-1.5 rounded-lg border border-finance-border text-xs font-semibold hover:bg-finance-sub-bg cursor-pointer"
                >
                  새로고침
                </button>
              </div>
            </div>
          )}

          {/* Active Drawing Mode Badge Overlay */}
          {activeTool !== 'none' && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-lg">
              <span>도형 그리기: {activeTool}</span>
              <button
                type="button"
                onClick={() => {
                  setActiveTool('none');
                  setDrawingShape(null);
                }}
                className="text-white hover:text-rose-200 underline text-[11px] cursor-pointer"
              >
                취소 (ESC)
              </button>
            </div>
          )}

          {/* SVG Interactive Canvas */}
          {!isLoading && !apiError && visibleCandles.length > 0 && (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${totalHeight}`}
              className={`w-full h-auto select-none touch-none ${
                isDraggingUI ? 'cursor-grabbing' : activeTool !== 'none' ? 'cursor-crosshair' : 'cursor-crosshair'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onDoubleClick={resetView}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Grid Lines */}
              <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke={gridColor} strokeDasharray="3 3" />
              <line
                x1={paddingLeft}
                y1={paddingTop + mainPriceHeight * 0.25}
                x2={width - paddingRight}
                y2={paddingTop + mainPriceHeight * 0.25}
                stroke={gridColor}
                strokeDasharray="3 3"
              />
              <line
                x1={paddingLeft}
                y1={paddingTop + mainPriceHeight * 0.5}
                x2={width - paddingRight}
                y2={paddingTop + mainPriceHeight * 0.5}
                stroke={gridColor}
                strokeDasharray="3 3"
              />
              <line
                x1={paddingLeft}
                y1={paddingTop + mainPriceHeight * 0.75}
                x2={width - paddingRight}
                y2={paddingTop + mainPriceHeight * 0.75}
                stroke={gridColor}
                strokeDasharray="3 3"
              />
              <line
                x1={paddingLeft}
                y1={paddingTop + mainPriceHeight}
                x2={width - paddingRight}
                y2={paddingTop + mainPriceHeight}
                stroke={gridColor}
              />

              {/* Right Price Axis Area (interactive vertical scale drag target) */}
              <rect
                x={width - paddingRight}
                y={paddingTop}
                width={paddingRight}
                height={mainPriceHeight}
                fill="transparent"
                className="cursor-ns-resize"
              >
                <title>위아래 드래그로 가격축 확대/축소 · 더블클릭으로 초기화</title>
              </rect>

              <text x={width - 8} y={paddingTop + 11} fill={axisTextColor} className="text-[10px] font-mono tabular-nums" textAnchor="end">
                {formatAxisPrice(maxPrice)}
              </text>
              <text
                x={width - 8}
                y={paddingTop + mainPriceHeight * 0.25 + 3}
                fill={axisTextColor}
                className="text-[10px] font-mono tabular-nums"
                textAnchor="end"
              >
                {formatAxisPrice(minPrice + priceRange * 0.75)}
              </text>
              <text
                x={width - 8}
                y={paddingTop + mainPriceHeight * 0.5 + 3}
                fill={axisTextColor}
                className="text-[10px] font-mono tabular-nums"
                textAnchor="end"
              >
                {formatAxisPrice((maxPrice + minPrice) / 2)}
              </text>
              <text
                x={width - 8}
                y={paddingTop + mainPriceHeight * 0.75 + 3}
                fill={axisTextColor}
                className="text-[10px] font-mono tabular-nums"
                textAnchor="end"
              >
                {formatAxisPrice(minPrice + priceRange * 0.25)}
              </text>
              <text x={width - 8} y={paddingTop + mainPriceHeight - 4} fill={axisTextColor} className="text-[10px] font-mono tabular-nums" textAnchor="end">
                {formatAxisPrice(minPrice)}
              </text>

              {/* Previous Close Dashed Reference Line */}
              {prevClose > 0 && prevClose >= minPrice && prevClose <= maxPrice && (
                <g className="pointer-events-none">
                  <line
                    x1={paddingLeft}
                    y1={getPriceY(prevClose)}
                    x2={width - paddingRight}
                    y2={getPriceY(prevClose)}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <rect
                    x={paddingLeft + 4}
                    y={getPriceY(prevClose) - 14}
                    width="82"
                    height="13"
                    rx="3"
                    fill={isDark ? '#1e293b' : '#f1f5f9'}
                    opacity="0.88"
                  />
                  <text
                    x={paddingLeft + 8}
                    y={getPriceY(prevClose) - 5}
                    fill={axisTextColor}
                    className="text-[9px] font-mono font-semibold"
                  >
                    전일종가 {formatAxisPrice(prevClose)}
                  </text>
                </g>
              )}

              {/* Clean Buy Entries Price Markers (replaces cartoon stick figure) */}
              {buyEntries &&
                buyEntries.length > 0 &&
                buyEntries.map((entry, i) => {
                  if (!entry || entry.price <= 0 || entry.price < minPrice || entry.price > maxPrice) return null;
                  const entryY = getPriceY(entry.price);
                  return (
                    <g key={entry.id || `buy-${i}`} className="pointer-events-none">
                      <line
                        x1={paddingLeft}
                        y1={entryY}
                        x2={width - paddingRight}
                        y2={entryY}
                        stroke="#10b981"
                        strokeDasharray="3 2"
                        strokeWidth="1.2"
                        opacity="0.85"
                      />
                      <rect
                        x={paddingLeft + 6}
                        y={entryY - 9}
                        width={isNarrow ? 86 : 112}
                        height="16"
                        rx="4"
                        fill="#10b981"
                      />
                      <text
                        x={paddingLeft + 11}
                        y={entryY + 2}
                        fill="#ffffff"
                        className="text-[9px] font-mono font-bold tabular-nums"
                      >
                        {`매수 ${entry.quantity} · ${formatAxisPrice(entry.price)}`}
                      </text>
                      <title>{`매수가: ${formatPrice(entry.price)}, 수량: ${entry.quantity}, 날짜: ${entry.date}`}</title>
                    </g>
                  );
                })}

              {/* Bollinger Bands */}
              {indicators.bollinger.enabled && bollingerSlice.upper.length > 0 && (
                <g>
                  <path
                    d={generateSeriesPath(bollingerSlice.upper)}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    opacity="0.75"
                  />
                  <path
                    d={generateSeriesPath(bollingerSlice.middle)}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                  <path
                    d={generateSeriesPath(bollingerSlice.lower)}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    opacity="0.75"
                  />
                </g>
              )}

              {/* VWAP Line */}
              {indicators.vwap.enabled && vwapSlice.length > 0 && (
                <path d={generateSeriesPath(vwapSlice)} fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.9" />
              )}

              {/* EMA Line */}
              {indicators.ema.enabled && emaSlice.length > 0 && (
                <path d={generateSeriesPath(emaSlice)} fill="none" stroke="#ec4899" strokeWidth="1.4" opacity="0.9" />
              )}

              {/* Moving Averages (MA 5/20/60/120) */}
              {indicators.ma.enabled && (
                <g>
                  {indicators.ma.ma5 && sma5Slice.length > 0 && (
                    <path d={generateSeriesPath(sma5Slice)} fill="none" stroke="#f59e0b" strokeWidth="1.4" opacity="0.85" />
                  )}
                  {indicators.ma.ma20 && sma20Slice.length > 0 && (
                    <path d={generateSeriesPath(sma20Slice)} fill="none" stroke="#a855f7" strokeWidth="1.4" opacity="0.85" />
                  )}
                  {indicators.ma.ma60 && sma60Slice.length > 0 && (
                    <path d={generateSeriesPath(sma60Slice)} fill="none" stroke="#10b981" strokeWidth="1.4" opacity="0.85" />
                  )}
                  {indicators.ma.ma120 && sma120Slice.length > 0 && (
                    <path d={generateSeriesPath(sma120Slice)} fill="none" stroke="#06b6d4" strokeWidth="1.4" opacity="0.85" />
                  )}
                </g>
              )}

              {/* Line Chart */}
              {chartType === 'line' && (
                <path
                  d={generateSeriesPath(visibleCandles.map(c => c.close))}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Candlestick Bars */}
              {chartType === 'candle' && (
                <g>
                  {visibleCandles.map((c, i) => {
                    const x = getCandleX(i);
                    const yHigh = getPriceY(c.high);
                    const yLow = getPriceY(c.low);
                    const yOpen = getPriceY(c.open);
                    const yClose = getPriceY(c.close);

                    const candleIsUp = c.close >= c.open;
                    const candleColor = candleIsUp ? upColor : downColor;
                    const bodyTop = Math.min(yOpen, yClose);
                    const bodyHeight = Math.max(1.5, Math.abs(yOpen - yClose));
                    const isHovered = hoverIndex === i;

                    return (
                      <g key={`${c.time}-${i}`}>
                        <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={candleColor} strokeWidth="1.2" />
                        <rect
                          x={x - candleWidth / 2}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={candleColor}
                          rx="0.5"
                          stroke={isHovered ? (isDark ? '#ffffff' : '#0f172a') : candleColor}
                          strokeWidth={isHovered ? 1.8 : 0.6}
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Current Live Price Dashed Line & Right Tag */}
              {!isHistoricalView && stockPrice > 0 && stockPrice >= minPrice && stockPrice <= maxPrice && (
                <g className="pointer-events-none">
                  <line
                    x1={paddingLeft}
                    y1={getPriceY(stockPrice)}
                    x2={width - paddingRight}
                    y2={getPriceY(stockPrice)}
                    stroke="#ef4444"
                    strokeDasharray="2 2"
                    strokeWidth="1.1"
                    opacity="0.75"
                  />
                  <rect
                    x={width - paddingRight + 3}
                    y={getPriceY(stockPrice) - 8}
                    width={priceTagWidth}
                    height="16"
                    fill="#ef4444"
                    rx="3"
                  />
                  <text
                    x={width - 8}
                    y={getPriceY(stockPrice) + 3}
                    fill="#ffffff"
                    className="text-[9px] font-mono font-bold tabular-nums"
                    textAnchor="end"
                  >
                    {formatAxisPrice(stockPrice)}
                  </text>
                </g>
              )}

              {/* Drawn Shapes */}
              {shapes.map(shape => {
                const isSelected = selectedShapeId === shape.id;
                const y1 = getPriceY(shape.startPoint.y);
                const x1 = shape.startPoint.x;

                if (shape.type === 'horizontal') {
                  return (
                    <g key={shape.id} onClick={() => setSelectedShapeId(shape.id)} className="cursor-pointer">
                      <line
                        x1={paddingLeft}
                        y1={y1}
                        x2={width - paddingRight}
                        y2={y1}
                        stroke={shape.color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        strokeDasharray={isSelected ? '4 2' : undefined}
                      />
                      <text
                        x={width - paddingRight - 5}
                        y={y1 - 4}
                        fill={shape.color}
                        className="text-[9px] font-mono font-bold"
                        textAnchor="end"
                      >
                        {formatPrice(shape.startPoint.y)}
                      </text>
                    </g>
                  );
                }

                if (shape.type === 'vertical') {
                  return (
                    <g key={shape.id} onClick={() => setSelectedShapeId(shape.id)} className="cursor-pointer">
                      <line
                        x1={x1}
                        y1={paddingTop}
                        x2={x1}
                        y2={paddingTop + mainPriceHeight}
                        stroke={shape.color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                    </g>
                  );
                }

                if (shape.endPoint) {
                  const x2 = shape.endPoint.x;
                  const y2 = getPriceY(shape.endPoint.y);

                  if (shape.type === 'trendline') {
                    return (
                      <g key={shape.id} onClick={() => setSelectedShapeId(shape.id)} className="cursor-pointer">
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={shape.color} strokeWidth={isSelected ? 2.5 : 1.5} />
                      </g>
                    );
                  }

                  if (shape.type === 'rectangle') {
                    return (
                      <g key={shape.id} onClick={() => setSelectedShapeId(shape.id)} className="cursor-pointer">
                        <rect
                          x={Math.min(x1, x2)}
                          y={Math.min(y1, y2)}
                          width={Math.abs(x2 - x1)}
                          height={Math.abs(y2 - y1)}
                          fill={shape.color}
                          fillOpacity="0.12"
                          stroke={shape.color}
                          strokeWidth={isSelected ? 2 : 1}
                        />
                      </g>
                    );
                  }

                  if (shape.type === 'fibonacci') {
                    const diffY = y2 - y1;
                    const startP = shape.startPoint.y;
                    const diffP = shape.endPoint.y - startP;

                    return (
                      <g key={shape.id} onClick={() => setSelectedShapeId(shape.id)} className="cursor-pointer">
                        {FIBONACCI_LEVELS.map(f => {
                          const levelY = y1 + diffY * f.level;
                          const levelPrice = startP + diffP * f.level;
                          return (
                            <g key={f.level}>
                              <line
                                x1={Math.min(x1, x2)}
                                y1={levelY}
                                x2={Math.min(width - paddingRight, Math.max(x1, x2) + 60)}
                                y2={levelY}
                                stroke={f.color}
                                strokeWidth="1"
                                strokeDasharray="2 2"
                              />
                              <text
                                x={Math.min(width - paddingRight - 4, Math.max(x1, x2) + 64)}
                                y={levelY + 3}
                                fill={f.color}
                                className="text-[9px] font-mono"
                              >
                                {f.label} ({formatAxisPrice(levelPrice)})
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  }
                }
                return null;
              })}

              {/* In-progress Drawing Preview */}
              {drawingShape && drawingShape.startPoint && drawingShape.endPoint && (
                <g className="pointer-events-none opacity-80">
                  {drawingShape.type === 'trendline' && (
                    <line
                      x1={drawingShape.startPoint.x}
                      y1={getPriceY(drawingShape.startPoint.y)}
                      x2={drawingShape.endPoint.x}
                      y2={getPriceY(drawingShape.endPoint.y)}
                      stroke={drawingShape.color || '#38bdf8'}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}
                  {drawingShape.type === 'rectangle' && (
                    <rect
                      x={Math.min(drawingShape.startPoint.x, drawingShape.endPoint.x)}
                      y={Math.min(getPriceY(drawingShape.startPoint.y), getPriceY(drawingShape.endPoint.y))}
                      width={Math.abs(drawingShape.endPoint.x - drawingShape.startPoint.x)}
                      height={Math.abs(getPriceY(drawingShape.endPoint.y) - getPriceY(drawingShape.startPoint.y))}
                      fill="#38bdf8"
                      fillOpacity="0.15"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}
                  {drawingShape.type === 'fibonacci' && (
                    <line
                      x1={drawingShape.startPoint.x}
                      y1={getPriceY(drawingShape.startPoint.y)}
                      x2={drawingShape.endPoint.x}
                      y2={getPriceY(drawingShape.endPoint.y)}
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              )}

              {/* Crosshair Overlay */}
              {hoverIndex !== null && visibleCandles[hoverIndex] && (
                <g className="pointer-events-none">
                  <line
                    x1={getCandleX(hoverIndex)}
                    y1={paddingTop}
                    x2={getCandleX(hoverIndex)}
                    y2={totalHeight - bottomTimePadding}
                    stroke="#94a3b8"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <line
                    x1={paddingLeft}
                    y1={getPriceY(visibleCandles[hoverIndex].close)}
                    x2={width - paddingRight}
                    y2={getPriceY(visibleCandles[hoverIndex].close)}
                    stroke="#94a3b8"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <rect
                    x={width - paddingRight + 3}
                    y={getPriceY(visibleCandles[hoverIndex].close) - 8}
                    width={priceTagWidth}
                    height="16"
                    fill="#475569"
                    rx="3"
                  />
                  <text
                    x={width - 8}
                    y={getPriceY(visibleCandles[hoverIndex].close) + 3}
                    fill="#ffffff"
                    className="text-[9px] font-mono font-bold tabular-nums"
                    textAnchor="end"
                  >
                    {formatAxisPrice(visibleCandles[hoverIndex].close)}
                  </text>
                </g>
              )}

              {/* Volume Sub-chart */}
              {indicators.volume.enabled && (
                <g>
                  <line x1={paddingLeft} y1={volumeStartY} x2={width - paddingRight} y2={volumeStartY} stroke={gridColor} />
                  <text x={paddingLeft + 4} y={volumeStartY + 12} fill={axisTextColor} className="text-[10px] font-mono">
                    거래량
                  </text>
                  <text
                    x={width - 8}
                    y={volumeStartY + 12}
                    fill={axisTextColor}
                    className="text-[10px] font-mono tabular-nums"
                    textAnchor="end"
                  >
                    {maxVolume.toLocaleString()}
                  </text>

                  {visibleCandles.map((c, i) => {
                    const x = getCandleX(i);
                    const barH = Math.max(1, (c.volume / maxVolume) * (volumeHeight - 16));
                    const y = volumeStartY + volumeHeight - barH;
                    const barColor = c.close >= c.open ? upColor : downColor;
                    const isHovered = hoverIndex === i;
                    return (
                      <rect
                        key={`vol-${c.time}-${i}`}
                        x={x - candleWidth / 2}
                        y={y}
                        width={candleWidth}
                        height={barH}
                        fill={barColor}
                        opacity={isHovered ? '0.9' : '0.45'}
                      />
                    );
                  })}
                </g>
              )}

              {/* RSI Sub-chart */}
              {hasSubChartRsi && (
                <g>
                  <line x1={paddingLeft} y1={rsiStartY} x2={width - paddingRight} y2={rsiStartY} stroke={gridColor} />
                  <text x={paddingLeft + 4} y={rsiStartY + 12} fill={axisTextColor} className="text-[10px] font-mono">
                    RSI ({indicators.rsi.period})
                  </text>
                  <line
                    x1={paddingLeft}
                    y1={rsiStartY + subChartHeight * 0.3}
                    x2={width - paddingRight}
                    y2={rsiStartY + subChartHeight * 0.3}
                    stroke="#ef4444"
                    strokeDasharray="2 2"
                    opacity="0.4"
                  />
                  <text x={width - 8} y={rsiStartY + subChartHeight * 0.3 + 3} fill="#ef4444" className="text-[8px] font-mono" textAnchor="end">
                    70
                  </text>
                  <line
                    x1={paddingLeft}
                    y1={rsiStartY + subChartHeight * 0.7}
                    x2={width - paddingRight}
                    y2={rsiStartY + subChartHeight * 0.7}
                    stroke="#3b82f6"
                    strokeDasharray="2 2"
                    opacity="0.4"
                  />
                  <text x={width - 8} y={rsiStartY + subChartHeight * 0.7 + 3} fill="#3b82f6" className="text-[8px] font-mono" textAnchor="end">
                    30
                  </text>

                  {(() => {
                    const points: string[] = [];
                    for (let i = 0; i < rsiSlice.length; i++) {
                      const val = rsiSlice[i];
                      if (val !== null) {
                        const x = getCandleX(i);
                        const y = rsiStartY + subChartHeight - (val / 100) * subChartHeight;
                        points.push(`${points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
                      }
                    }
                    return points.length > 0 ? <path d={points.join(' ')} fill="none" stroke="#06b6d4" strokeWidth="1.5" /> : null;
                  })()}
                </g>
              )}

              {/* MACD Sub-chart */}
              {hasSubChartMacd && (
                <g>
                  <line x1={paddingLeft} y1={macdStartY} x2={width - paddingRight} y2={macdStartY} stroke={gridColor} />
                  <text x={paddingLeft + 4} y={macdStartY + 12} fill={axisTextColor} className="text-[10px] font-mono">
                    MACD ({indicators.macd.fastPeriod}, {indicators.macd.slowPeriod}, {indicators.macd.signalPeriod})
                  </text>

                  {(() => {
                    const validHist = macdSlice.histogram.filter((v): v is number => v !== null);
                    const maxH = Math.max(...validHist.map(Math.abs), 1e-6);
                    const midY = macdStartY + subChartHeight / 2;

                    return (
                      <>
                        <line x1={paddingLeft} y1={midY} x2={width - paddingRight} y2={midY} stroke={gridColor} strokeDasharray="2 2" />
                        {macdSlice.histogram.map((val, i) => {
                          if (val === null) return null;
                          const x = getCandleX(i);
                          const h = (Math.abs(val) / maxH) * (subChartHeight / 2 - 4);
                          const y = val >= 0 ? midY - h : midY;
                          return (
                            <rect
                              key={`hist-${i}`}
                              x={x - candleWidth / 2}
                              y={y}
                              width={candleWidth}
                              height={Math.max(1, h)}
                              fill={val >= 0 ? '#ef4444' : '#3b82f6'}
                              opacity="0.6"
                            />
                          );
                        })}

                        {(() => {
                          const points: string[] = [];
                          for (let i = 0; i < macdSlice.macdLine.length; i++) {
                            const val = macdSlice.macdLine[i];
                            if (val !== null) {
                              const x = getCandleX(i);
                              const y = midY - (val / maxH) * (subChartHeight / 2 - 6);
                              points.push(`${points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
                            }
                          }
                          return points.length > 0 ? <path d={points.join(' ')} fill="none" stroke="#f43f5e" strokeWidth="1.3" /> : null;
                        })()}

                        {(() => {
                          const points: string[] = [];
                          for (let i = 0; i < macdSlice.signalLine.length; i++) {
                            const val = macdSlice.signalLine[i];
                            if (val !== null) {
                              const x = getCandleX(i);
                              const y = midY - (val / maxH) * (subChartHeight / 2 - 6);
                              points.push(`${points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
                            }
                          }
                          return points.length > 0 ? <path d={points.join(' ')} fill="none" stroke="#38bdf8" strokeWidth="1.3" /> : null;
                        })()}
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Stochastic Sub-chart */}
              {hasSubChartStoch && (
                <g>
                  <line x1={paddingLeft} y1={stochStartY} x2={width - paddingRight} y2={stochStartY} stroke={gridColor} />
                  <text x={paddingLeft + 4} y={stochStartY + 12} fill={axisTextColor} className="text-[10px] font-mono">
                    스토캐스틱 ({indicators.stochastic.kPeriod}, {indicators.stochastic.dPeriod})
                  </text>
                  <line
                    x1={paddingLeft}
                    y1={stochStartY + subChartHeight * 0.2}
                    x2={width - paddingRight}
                    y2={stochStartY + subChartHeight * 0.2}
                    stroke="#ef4444"
                    strokeDasharray="2 2"
                    opacity="0.4"
                  />
                  <line
                    x1={paddingLeft}
                    y1={stochStartY + subChartHeight * 0.8}
                    x2={width - paddingRight}
                    y2={stochStartY + subChartHeight * 0.8}
                    stroke="#3b82f6"
                    strokeDasharray="2 2"
                    opacity="0.4"
                  />

                  {(() => {
                    const points: string[] = [];
                    for (let i = 0; i < stochSlice.kLine.length; i++) {
                      const val = stochSlice.kLine[i];
                      if (val !== null) {
                        const x = getCandleX(i);
                        const y = stochStartY + subChartHeight - (val / 100) * subChartHeight;
                        points.push(`${points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
                      }
                    }
                    return points.length > 0 ? <path d={points.join(' ')} fill="none" stroke="#a855f7" strokeWidth="1.4" /> : null;
                  })()}

                  {(() => {
                    const points: string[] = [];
                    for (let i = 0; i < stochSlice.dLine.length; i++) {
                      const val = stochSlice.dLine[i];
                      if (val !== null) {
                        const x = getCandleX(i);
                        const y = stochStartY + subChartHeight - (val / 100) * subChartHeight;
                        points.push(`${points.length === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
                      }
                    }
                    return points.length > 0 ? (
                      <path d={points.join(' ')} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
                    ) : null;
                  })()}
                </g>
              )}

              {/* Bottom Time Axis Drag Target & Labels */}
              <rect
                x={paddingLeft}
                y={totalHeight - bottomTimePadding}
                width={innerWidth}
                height={bottomTimePadding}
                fill="transparent"
                className="cursor-ew-resize"
              >
                <title>좌우 드래그로 시간 구간 확대/축소</title>
              </rect>

              {(() => {
                const tickCount = isNarrow ? 3 : 5;
                const step = Math.max(1, Math.floor(visibleCandles.length / tickCount));
                return visibleCandles
                  .map((c, idx) => ({ c, idx }))
                  .filter(({ idx }) => idx % step === 0 || idx === visibleCandles.length - 1)
                  .map(({ c, idx }) => (
                    <text
                      key={`time-${c.time}-${idx}`}
                      x={getCandleX(idx)}
                      y={totalHeight - 9}
                      fill={axisTextColor}
                      className="text-[10px] font-mono tabular-nums"
                      textAnchor="middle"
                    >
                      {c.time}
                    </text>
                  ));
              })()}
            </svg>
          )}
        </div>

        {/* 4. Bottom Footer: Legend & Controls Hint */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
              <span>상승</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" />
              <span>하락</span>
            </span>
            {indicators.ma.enabled && (
              <>
                {indicators.ma.ma5 && <span className="text-amber-500 font-semibold">MA{indicators.ma.period5}</span>}
                {indicators.ma.ma20 && <span className="text-purple-400 font-semibold">MA{indicators.ma.period20}</span>}
                {indicators.ma.ma60 && <span className="text-emerald-400 font-semibold">MA{indicators.ma.period60}</span>}
                {indicators.ma.ma120 && <span className="text-cyan-400 font-semibold">MA{indicators.ma.period120}</span>}
              </>
            )}
            {indicators.ema.enabled && <span className="text-pink-400 font-semibold">EMA{indicators.ema.period}</span>}
            {indicators.bollinger.enabled && <span className="text-indigo-400 font-semibold">BB({indicators.bollinger.period})</span>}
            {indicators.vwap.enabled && <span className="text-emerald-400 font-semibold">VWAP</span>}
            {indicators.rsi.enabled && <span className="text-cyan-400 font-semibold">RSI({indicators.rsi.period})</span>}
            {indicators.macd.enabled && <span className="text-rose-400 font-semibold">MACD</span>}
            {indicators.stochastic.enabled && <span className="text-purple-400 font-semibold">STOCH</span>}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 tabular-nums">
            <span className="hidden md:inline">휠/축 드래그(확대/축소) · 드래그(이동) · 더블클릭(초기화)</span>
            <span className="md:hidden">핀치(확대) · 드래그(이동)</span>
            <span>·</span>
            <span>
              {visibleCandles.length}/{rawCandles.length}개
            </span>
          </div>
        </div>

        {/* 5. Indicator Settings Modal */}
        <IndicatorSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={indicators}
          onChange={setIndicators}
        />

        {/* AdSense Ad Slot */}
        <AdSlot slotId="stock-chart-ad" format="auto" />
      </div>
    </>
  );
};
