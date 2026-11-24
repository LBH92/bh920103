import { useRef, useCallback } from 'react';

export const useChartViewport = (initialViewCount: number, rawCandlesLength: number) => {
  const viewCountRef = useRef<number>(initialViewCount);
  const viewOffsetRef = useRef<number>(0);

  const setView = useCallback((count: number, offset: number) => {
    viewCountRef.current = Math.max(15, Math.min(rawCandlesLength, count));
    viewOffsetRef.current = Math.max(0, Math.min(rawCandlesLength - viewCountRef.current, offset));
  }, [rawCandlesLength]);

  return { viewCountRef, viewOffsetRef, setView };
};
