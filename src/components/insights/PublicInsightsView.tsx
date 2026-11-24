import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, Share2, Tag, TrendingUp, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { EditorialInsight, InsightCategory } from '../../types/insights';
import { insightService } from '../../services/insightService';

interface PublicInsightsViewProps {
  initialCategory?: InsightCategory;
  initialInsightId?: string;
  onNavigateHome: () => void;
  onSelectCategory: (cat?: InsightCategory) => void;
  onSelectArticle: (id: string) => void;
}

export const PublicInsightsView: React.FC<PublicInsightsViewProps> = ({
  initialCategory,
  initialInsightId,
  onNavigateHome,
  onSelectCategory,
  onSelectArticle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory | undefined>(initialCategory);
  const [activeArticleId, setActiveArticleId] = useState<string | undefined>(initialInsightId);
  const [articles, setArticles] = useState<EditorialInsight[]>([]);
  const [currentArticle, setCurrentArticle] = useState<EditorialInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Sync props to state if props change
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setActiveArticleId(initialInsightId);
  }, [initialInsightId]);

  // Load article listing
  useEffect(() => {
    if (activeArticleId) return;

    let isMounted = true;
    setLoading(true);

    insightService.fetchPublicInsights(selectedCategory).then(data => {
      if (isMounted) {
        setArticles(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, activeArticleId]);

  // Load single article
  useEffect(() => {
    if (!activeArticleId) {
      setCurrentArticle(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    insightService.fetchPublicInsightById(activeArticleId).then(data => {
      if (isMounted) {
        setCurrentArticle(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeArticleId]);

  const handleCategoryClick = (cat?: InsightCategory) => {
    setActiveArticleId(undefined);
    setSelectedCategory(cat);
    onSelectCategory(cat);
  };

  const handleArticleClick = (id: string) => {
    setActiveArticleId(id);
    onSelectArticle(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categories: { key?: InsightCategory; label: string }[] = [
    { key: undefined, label: '전체 리포트' },
    { key: 'domestic-market', label: '국내 증시' },
    { key: 'us-market', label: '미국 증시' },
    { key: 'economy', label: '거시경제' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              증시 메인
            </button>
            {activeArticleId && (
              <button
                onClick={() => handleCategoryClick(selectedCategory)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs sm:text-sm font-medium transition-colors"
              >
                리포트 목록
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">Byeongdol Investment Research</span>
        </div>

        {/* View Mode: Single Article Detail */}
        {activeArticleId ? (
          <div>
            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 text-sm">분석 리포트를 불러오는 중입니다...</p>
              </div>
            ) : currentArticle ? (
              <article className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 sm:p-10 shadow-xl backdrop-blur-sm">
                <header className="border-b border-slate-700/80 pb-6 mb-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                      {currentArticle.categoryLabel || currentArticle.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(currentArticle.publishedAt || currentArticle.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      약 {currentArticle.readTimeMinutes || 3}분 소요
                    </span>
                    <span className="text-slate-400">
                      작성: {currentArticle.authorName || '병돌 리서치팀'}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    {currentArticle.title}
                  </h1>

                  {currentArticle.summary && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 text-sm sm:text-base leading-relaxed">
                      {currentArticle.summary}
                    </div>
                  )}

                  {/* Market Data Snapshot if Available */}
                  {currentArticle.marketDataSnapshot && (
                    <div className="mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> 공식 시장 데이터 기준:
                      </span>
                      {currentArticle.marketDataSnapshot.benchmarkPrice !== undefined && (
                        <span>기준가: {currentArticle.marketDataSnapshot.benchmarkPrice.toLocaleString()}원</span>
                      )}
                      {currentArticle.marketDataSnapshot.changePercent !== undefined && (
                        <span className={currentArticle.marketDataSnapshot.changePercent >= 0 ? 'text-red-400' : 'text-blue-400'}>
                          등락: {currentArticle.marketDataSnapshot.changePercent > 0 ? '+' : ''}{currentArticle.marketDataSnapshot.changePercent}%
                        </span>
                      )}
                      {currentArticle.marketDataSnapshot.exchangeRate && (
                        <span>환율: {currentArticle.marketDataSnapshot.exchangeRate.toLocaleString()}원</span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {currentArticle.tags?.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-900/50 px-2.5 py-1 rounded-md">
                          <Tag className="w-3 h-3" />
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
                      title="URL 복사"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      {copied ? '복사됨!' : '공유하기'}
                    </button>
                  </div>
                </header>

                {/* Article Main Body */}
                <div className="space-y-4 text-slate-200 text-base leading-relaxed whitespace-pre-line">
                  {currentArticle.content}
                </div>

                {/* Mandatory Investment Disclaimer Banner */}
                <div className="mt-12 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs sm:text-sm text-amber-200 leading-relaxed flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block mb-1">법적 면책 고지 및 투자 유의사항</strong>
                    본 분석 자료는 신뢰할 수 있는 공식 금융 시장 데이터와 공개된 경제 지표를 바탕으로 작성되었으나, 
                    그 완전성이나 정확성을 보증하지 않습니다. 본 자료는 정보 제공만을 목적으로 하며, 
                    특정 증권의 매수 또는 매도를 권유하는 법률상 금융투자 자문이 아닙니다. 
                    모든 투자 판단의 최종 책임은 전적으로 투자자 본인에게 있습니다.
                  </div>
                </div>
              </article>
            ) : (
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white mb-2">리포트를 찾을 수 없습니다</h2>
                <p className="text-slate-400 text-sm mb-6">요청하신 분석 리포트가 아직 발행 전이거나 존재하지 않습니다.</p>
                <button
                  onClick={() => handleCategoryClick()}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  전체 리포트 목록 보기
                </button>
              </div>
            )}
          </div>
        ) : (
          /* View Mode: Category Listing */
          <div className="space-y-6">
            <header className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">투자 인사이트 & 시황 리포트</h1>
                  <p className="text-sm text-slate-400 mt-0.5">실시간 시장 지표와 정밀 데이터 기반의 금융 분석 리서치</p>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/60">
                {categories.map(c => (
                  <button
                    key={c.label}
                    onClick={() => handleCategoryClick(c.key)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === c.key
                        ? 'bg-rose-500 text-white font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </header>

            {/* Articles List */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 text-sm">분석 리포트를 불러오는 중입니다...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map(article => (
                  <div
                    key={article.id}
                    onClick={() => handleArticleClick(article.id)}
                    className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-rose-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-md">
                        {article.categoryLabel || article.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-rose-300 transition-colors mb-2">
                      {article.title}
                    </h2>

                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/40">
                      <div className="flex items-center gap-3">
                        <span>작성: {article.authorName || '병돌 리서치팀'}</span>
                        <span>•</span>
                        <span>{article.readTimeMinutes || 3}분 소요</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-rose-400 font-medium group-hover:translate-x-0.5 transition-transform">
                        자세히 보기 <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-12 text-center">
                <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">발행된 리포트가 없습니다</h3>
                <p className="text-slate-400 text-sm">
                  {selectedCategory ? '선택하신 카테고리의 리포트를 준비 중입니다.' : '현재 발행 준비 중인 리포트가 곧 업데이트됩니다.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
