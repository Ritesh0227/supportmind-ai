// client/src/components/knowledge/ArticleList.tsx
import React from 'react';
import {
  FileText,
  Eye,
  ThumbsUp,
  ArrowRight,
  Sparkles,
  Tag,
  Search,
} from 'lucide-react';
import { Article, ArticleCategory } from '../../types.js';

interface ArticleListProps {
  articles: Article[];
  categories: ArticleCategory[];
  selectedCategoryId: string | null;
  searchQuery: string;
  onSelectArticle: (article: Article) => void;
  onClearFilters: () => void;
  onOpenChatWithQuery: (query: string) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  categories,
  selectedCategoryId,
  searchQuery,
  onSelectArticle,
  onClearFilters,
  onOpenChatWithQuery,
}) => {
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <section id="articles" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-6 gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span>
              {activeCategory
                ? `${activeCategory.name} Articles`
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : 'All Verified Support Articles'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {articles.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeCategory
              ? activeCategory.description
              : 'Each article is reviewed and maintained by the customer operations team.'}
          </p>
        </div>

        {(selectedCategoryId || searchQuery) && (
          <button
            onClick={onClearFilters}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 underline self-start sm:self-auto"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {articles.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Search className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">No matching articles found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            We couldn't find an approved knowledge article matching your exact query. You can ask our AI assistant or contact support.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={onClearFilters}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onOpenChatWithQuery(searchQuery)}
              className="text-xs px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold inline-flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      ) : (
        /* Article Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => {
            const cat = categories.find((c) => c.id === art.category_id);

            return (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-card transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Category and Tags */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {cat?.name || 'Knowledge'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      3 min read
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {art.excerpt}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {art.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded"
                        >
                          <Tag className="h-2.5 w-2.5 mr-1 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Metrics */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1" title="Total Views">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{art.views_count}</span>
                      </span>
                      <span className="flex items-center space-x-1" title="Helpful Ratings">
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{art.helpful_count}</span>
                      </span>
                    </div>

                    <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Read article <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
