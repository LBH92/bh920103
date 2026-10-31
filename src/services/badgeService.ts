export const BADGES = {
  SURVIVOR: { id: 'survivor', name: '국장 생존자', condition: '주식 1년 이상 보유' },
  CHART_MASTER: { id: 'chart_master', name: '새벽의 차트러', condition: '일 10회 이상 차트 조회' },
  DIVIDEND: { id: 'dividend', name: '배당금 존버단', condition: '배당 종목 3개 이상 보유' },
  NEWBIE_ESCAPE: { id: 'newbie_escape', name: '주린이 탈출 중', condition: '게시글 10개 작성' },
};

export const LEVELS = [
  { minLevel: 1, name: '주린이' },
  { minLevel: 10, name: '짬밥 개미' },
  { minLevel: 30, name: '고인물' },
];

export const getLevelName = (level: number) => {
  return LEVELS.slice().reverse().find(l => level >= l.minLevel)?.name || '주린이';
};
