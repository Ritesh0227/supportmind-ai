// client/src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Search,
  Filter,
  Edit2,
  Archive,
  BarChart3,
  List,
  AlertCircle,
  Eye,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Article, ArticleCategory, DashboardStats, FeedbackRecord } from '../../types.js';
import { AnalyticsCharts } from './AnalyticsCharts.js';
import { ArticleEditorModal } from './ArticleEditorModal.js';
import { UnansweredQuestionsManager } from './UnansweredQuestionsManager.js';
import { FeedbackManager } from './FeedbackManager.js';
import { api } from '../../services/api.js';

interface AdminDashboardProps {
  categories: ArticleCategory[];
  onOpenArticleDetail: (article: Article) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  categories,
  onOpenArticleDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'analytics' | 'unanswered' | 'feedback' | 'questions'>('articles');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for Articles Table
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Modals
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorDefaultQuestion, setEditorDefaultQuestion] = useState<string | undefined>(undefined);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, articlesData, feedbackData] = await Promise.all([
        api.getDashboardStats(),
        api.getArticles(),
        api.getFeedbackList(),
      ]);
      setStats(statsData);
      setArticles(articlesData);
      setFeedbackList(feedbackData);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleArchive = async (id: string) => {
    try {
      await api.archiveArticle(id);
      loadData();
    } catch (err) {
      console.error('Failed to toggle archive:', err);
    }
  };

  const handleCreateForQuestion = (question: string) => {
    setEditingArticle(null);
    setEditorDefaultQuestion(question);
    setIsEditorOpen(true);
  };

  const filteredArticles = articles.filter((art) => {
    if (selectedCategoryFilter && art.category_id !== selectedCategoryFilter) return false;
    if (selectedStatusFilter && art.status !== selectedStatusFilter) return false;
    if (articleSearch) {
      const q = articleSearch.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Support Operations Admin Console
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-semibold">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage approved knowledge documentation, review AI customer inquiries, inspect ratings, and resolve content gaps.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            title="Refresh dashboard metrics"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setEditingArticle(null);
              setEditorDefaultQuestion(undefined);
              setIsEditorOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Knowledge Article</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Real live database statistics) */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 my-6">
          {/* 1. Active Articles */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Articles</span>
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalActiveArticles}</div>
            <span className="text-[10px] text-slate-400 font-medium">Published in knowledge base</span>
          </div>

          {/* 2. Customer Questions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Queries</span>
              <MessageSquare className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalCustomerQuestions}</div>
            <span className="text-[10px] text-slate-400 font-medium">Logged user inquiries</span>
          </div>

          {/* 3. Answered Questions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Grounded Answers</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.answeredQuestions}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Citations attached</span>
          </div>

          {/* 4. Unanswered / Fallbacks */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Safe Fallbacks</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.unansweredQuestions}</div>
            <span className="text-[10px] text-amber-600 font-medium">No policy match</span>
          </div>

          {/* 5. Helpful Feedback */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Helpful Ratings</span>
              <ThumbsUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.helpfulFeedbackCount}</div>
            <span className="text-[10px] text-slate-400 font-medium">Customer thumbs-up</span>
          </div>

          {/* 6. Not Helpful Feedback */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Not Helpful</span>
              <ThumbsDown className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.notHelpfulFeedbackCount}</div>
            <span className="text-[10px] text-slate-400 font-medium">Customer thumbs-down</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'articles'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Articles Directory ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics & Visual Charts</span>
        </button>

        <button
          onClick={() => setActiveTab('unanswered')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'unanswered'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>Unanswered Inquiries ({stats?.unansweredList.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Customer Feedback ({feedbackList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'questions'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <List className="h-4 w-4" />
          <span>Recent Queries Log</span>
        </button>
      </div>

      {/* Tab 1: Articles Directory */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder="Search articles by title, keywords, excerpt..."
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-slate-700"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {(articleSearch || selectedCategoryFilter || selectedStatusFilter) && (
                <button
                  onClick={() => {
                    setArticleSearch('');
                    setSelectedCategoryFilter('');
                    setSelectedStatusFilter('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Title & Excerpt</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Views</th>
                  <th className="py-3 px-3">Helpful</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((art) => {
                  const cat = categories.find((c) => c.id === art.category_id);
                  return (
                    <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate text-xs sm:text-sm">
                          {art.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                          {art.excerpt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-[11px] text-slate-700">
                          {cat?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : art.status === 'draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">{art.views_count}</td>
                      <td className="py-3.5 px-3 font-semibold text-emerald-600">{art.helpful_count}</td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                        {new Date(art.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => onOpenArticleDetail(art)}
                          title="Preview article"
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingArticle(art);
                            setIsEditorOpen(true);
                          }}
                          title="Edit article"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleArchive(art.id)}
                          title={art.status === 'archived' ? 'Unarchive' : 'Archive article'}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 ${
                            art.status === 'archived' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Analytics & Visual Charts */}
      {activeTab === 'analytics' && stats && <AnalyticsCharts stats={stats} />}

      {/* Tab 3: Unanswered Inquiries */}
      {activeTab === 'unanswered' && stats && (
        <UnansweredQuestionsManager
          unansweredList={stats.unansweredList}
          onCreateArticleForQuestion={handleCreateForQuestion}
        />
      )}

      {/* Tab 4: Customer Feedback */}
      {activeTab === 'feedback' && <FeedbackManager feedbackList={feedbackList} />}

      {/* Tab 5: Recent Questions */}
      {activeTab === 'questions' && stats && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Recent Customer AI Interactions</h3>
            <p className="text-xs text-slate-500">Live query logs and grounded citation traceability.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentQuestions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No customer questions recorded yet. Try asking questions in the customer chat!
              </div>
            ) : (
              stats.recentQuestions.map((q) => (
                <div key={q.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">"{q.question}"</span>
                      <p className="text-xs text-slate-600 line-clamp-2">{q.answer}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {q.isFallback ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Fallback
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {q.sourcesCount} Source(s)
                        </span>
                      )}
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {new Date(q.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Article Editor Modal */}
      {isEditorOpen && (
        <ArticleEditorModal
          article={editingArticle}
          categories={categories}
          defaultQuestionPrompt={editorDefaultQuestion}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingArticle(null);
            setEditorDefaultQuestion(undefined);
          }}
          onSaved={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
