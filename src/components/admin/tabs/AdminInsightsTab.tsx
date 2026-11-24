import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, Plus, Sparkles, Edit3, Trash2, Globe, EyeOff, 
  CheckCircle2, Clock, Tag, TrendingUp, AlertTriangle, X, RefreshCw, ExternalLink 
} from 'lucide-react';
import { EditorialInsight, InsightCategory, InsightDraftGenerateRequest } from '../../../types/insights';
import { insightService } from '../../../services/insightService';
import { UserRole } from '../../../types';

interface AdminInsightsTabProps {
  callerRole?: UserRole;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AdminInsightsTab: React.FC<AdminInsightsTabProps> = ({ showToast }) => {
  const [insights, setInsights] = useState<EditorialInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | InsightCategory>('all');

  // Generator Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genCategory, setGenCategory] = useState<InsightCategory>('domestic-market');
  const [genTopic, setGenTopic] = useState('');
  const [genSymbol, setGenSymbol] = useState('');

  // Editor Modal State
  const [editingInsight, setEditingInsight] = useState<EditorialInsight | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<InsightCategory>('domestic-market');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editStatus, setEditStatus] = useState<'draft' | 'published'>('draft');
  const [isSaving, setIsSaving] = useState(false);

  const loadInsights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await insightService.fetchAdminInsights();
      setInsights(data);
    } catch (err: any) {
      showToast(err.message || '인사이트 목록 로드 실패', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  // Handle AI Draft Generation
  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const req: InsightDraftGenerateRequest = {
        category: genCategory,
        topic: genTopic.trim() || undefined,
        targetSymbol: genSymbol.trim() || undefined,
      };
      const draft = await insightService.generateDraft(req);
      showToast(`'${draft.title}' 초안 생성이 완료되었습니다.`, 'success');
      setIsGenerateModalOpen(false);
      setGenTopic('');
      setGenSymbol('');
      await loadInsights();
      // Automatically open editor for review
      openEditor(draft);
    } catch (err: any) {
      showToast(err.message || '초안 생성에 실패했습니다.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Open Editor Modal
  const openEditor = (item: EditorialInsight) => {
    setEditingInsight(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditSummary(item.summary);
    setEditContent(item.content);
    setEditTags(item.tags ? item.tags.join(', ') : '');
    setEditStatus(item.status);
  };

  // Save Edits
  const handleSaveEdit = async () => {
    if (!editingInsight) return;
    if (!editTitle.trim()) {
      showToast('제목을 입력해 주세요.', 'warning');
      return;
    }
    if (!editContent.trim()) {
      showToast('본문 내용을 입력해 주세요.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = editTags
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const updated = await insightService.updateInsight(editingInsight.id, {
        title: editTitle.trim(),
        category: editCategory,
        summary: editSummary.trim(),
        content: editContent.trim(),
        tags: tagsArray,
        status: editStatus,
      });

      showToast(`인사이트가 성공적으로 저장되었습니다. (상태: ${editStatus === 'published' ? '공개 발행됨' : '초안 저장'})`, 'success');
      setEditingInsight(null);
      await loadInsights();
    } catch (err: any) {
      showToast(err.message || '저장 실패', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Status Toggle
  const handleQuickToggleStatus = async (item: EditorialInsight) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await insightService.updateInsight(item.id, { status: nextStatus });
      showToast(nextStatus === 'published' ? '공개 발행되었습니다.' : '초안으로 전환되었습니다.', 'info');
      await loadInsights();
    } catch (err: any) {
      showToast(err.message || '상태 변경 실패', 'error');
    }
  };

  // Delete Insight
  const handleDelete = async (item: EditorialInsight) => {
    if (!window.confirm(`'${item.title}' 문서를 완전히 삭제하시겠습니까?`)) {
      return;
    }
    try {
      await insightService.deleteInsight(item.id);
      showToast('삭제되었습니다.', 'info');
      await loadInsights();
    } catch (err: any) {
      showToast(err.message || '삭제 실패', 'error');
    }
  };

  // Filtered List
  const filteredInsights = insights.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0d111a] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            투자 인사이트 & 애드센스 콘텐츠 관리
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            실시간 증시 데이터 접지 기반 AI 초안 생성, 팩트체크 검토, 및 검색엔진 SEO 공개 발행
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={loadInsights}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            AI 초안 생성 (Gemini + 실시간 증시)
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0d111a] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-400 mr-1">상태:</span>
          {(['all', 'draft', 'published'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === st
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? '전체' : st === 'draft' ? '초안 (Draft)' : '발행됨 (Published)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-400 mr-1">분류:</span>
          {(['all', 'domestic-market', 'us-market', 'economy'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? '전체' : cat === 'domestic-market' ? '국내 증시' : cat === 'us-market' ? '미국 증시' : '거시경제'}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      {loading ? (
        <div className="py-20 text-center bg-white dark:bg-[#0d111a] rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">인사이트 데이터를 불러오는 중입니다...</p>
        </div>
      ) : filteredInsights.length > 0 ? (
        <div className="space-y-3">
          {filteredInsights.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      item.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {item.status === 'published' ? '공개 발행됨' : '초안 (미공개)'}
                  </span>
                  <span className="text-xs font-semibold text-rose-500">
                    {item.categoryLabel || item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.publishedAt || item.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-2xl">
                  {item.summary}
                </p>

                {item.marketDataSnapshot && (
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-rose-400" />
                    <span>기준가: {item.marketDataSnapshot.benchmarkPrice?.toLocaleString()}원</span>
                    {item.marketDataSnapshot.changePercent !== undefined && (
                      <span className={item.marketDataSnapshot.changePercent >= 0 ? 'text-red-400' : 'text-blue-400'}>
                        ({item.marketDataSnapshot.changePercent > 0 ? '+' : ''}{item.marketDataSnapshot.changePercent}%)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                {item.status === 'published' && (
                  <a
                    href={`/insights/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="공개 페이지 미리보기"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">보기</span>
                  </a>
                )}

                <button
                  onClick={() => openEditor(item)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  편집/검토
                </button>

                <button
                  onClick={() => handleQuickToggleStatus(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    item.status === 'published'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {item.status === 'published' ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      초안 전환
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      즉시 발행
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-[#0d111a] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            등록된 인사이트가 없습니다
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            상단의 'AI 초안 생성' 버튼을 클릭하여 실시간 시장 데이터를 접목한 고품질 시황 초안을 생성해 보세요.
          </p>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            초안 생성 시작
          </button>
        </div>
      )}

      {/* AI Draft Generator Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  실시간 증시 데이터 기반 AI 초안 생성
                </h3>
              </div>
              <button
                onClick={() => !isGenerating && setIsGenerateModalOpen(false)}
                disabled={isGenerating}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateDraft} className="space-y-4">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400 leading-relaxed">
                <strong>원칙:</strong> 생성된 콘텐츠는 기본적으로 <strong>초안(draft)</strong> 상태로 저장되며, 관리자의 팩트체크와 검토 승인을 거쳐야만 일반 사용자와 검색엔진에 공개됩니다.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  분석 카테고리
                </label>
                <select
                  value={genCategory}
                  onChange={e => setGenCategory(e.target.value as InsightCategory)}
                  disabled={isGenerating}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                >
                  <option value="domestic-market">국내 증시 분석 (코스피, 코스닥)</option>
                  <option value="us-market">미국 증시 분석 (뉴욕, 나스닥, S&P 500)</option>
                  <option value="economy">거시경제 분석 (환율, 금리, 인플레이션)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  분석 대상 종목 코드 (선택 사항)
                </label>
                <input
                  type="text"
                  placeholder="예: 005930 (삼성전자), 000660 (SK하이닉스), AAPL, NVDA"
                  value={genSymbol}
                  onChange={e => setGenSymbol(e.target.value)}
                  disabled={isGenerating}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  핵심 분석 주제 / 포커스 (선택 사항)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 반도체 업종 실적 발표와 외국인 매수세 유입 분석"
                  value={genTopic}
                  onChange={e => setGenTopic(e.target.value)}
                  disabled={isGenerating}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      실시간 증시 데이터 접지 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      초안 생성 실행
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editor & Review Modal */}
      {editingInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#0d111a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-rose-500" />
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  인사이트 검토 및 편집
                </h3>
              </div>
              <button
                onClick={() => !isSaving && setEditingInsight(null)}
                disabled={isSaving}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    카테고리
                  </label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as InsightCategory)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100"
                  >
                    <option value="domestic-market">국내 증시 분석</option>
                    <option value="us-market">미국 증시 분석</option>
                    <option value="economy">거시경제 분석</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    공개 상태
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100"
                  >
                    <option value="draft">초안 (Draft - 비공개 보관)</option>
                    <option value="published">공개 발행 (Published - SEO 및 검색 노출)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  리포트 제목
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  요약문 (검색엔진 Meta Description)
                </label>
                <textarea
                  rows={2}
                  value={editSummary}
                  onChange={e => setEditSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  본문 내용 (Markdown)
                </label>
                <textarea
                  rows={12}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  placeholder="예: 코스피, 반도체, 외인수급"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  문서 ID: <code className="font-mono">{editingInsight.id}</code>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingInsight(null)}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        저장 완료
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
