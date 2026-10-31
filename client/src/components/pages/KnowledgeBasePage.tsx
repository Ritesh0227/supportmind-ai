// client/src/components/pages/KnowledgeBasePage.tsx
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  BookOpen,
  Calendar,
  Eye,
  ThumbsUp,
  Tag,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Article, ArticleCategory, Product } from '../../types.js';

interface KnowledgeBasePageProps {
  articles: Article[];
  categories: ArticleCategory[];
  products: Product[];
  initialCategoryId?: string | null;
  initialSearchQuery?: string;
  onSelectArticle: (article: Article) => void;
  onAskAi: (query: string) => void;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({
  articles,
  categories,
  products,
  initialCategoryId,
  initialSearchQuery,
  onSelectArticle,
  onAskAi,
}) => {
  const [search, setSearch] = useState(initialSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId || null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Category filter
      if (selectedCategory && art.category_id !== selectedCategory) {
        return false;
      }
      // Product filter
      if (selectedProduct) {
        if (!art.product || art.product.toLowerCase() !== selectedProduct.toLowerCase()) {
          return false;
        }
      }
      // Search filter (across title, excerpt, content, troubleshooting, keywords, tags, product)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchExcerpt = art.excerpt.toLowerCase().includes(q);
        const matchContent = art.content.toLowerCase().includes(q);
        const matchTroubleshooting = art.troubleshooting?.toLowerCase().includes(q);
        const matchKeywords = art.keywords.some((k) => k.toLowerCase().includes(q));
        const matchTags = art.tags.some((t) => t.toLowerCase().includes(q));
        const matchProduct = art.product?.toLowerCase().includes(q);
        return (
          matchTitle ||
          matchExcerpt ||
          matchContent ||
          matchTroubleshooting ||
          matchKeywords ||
          matchTags ||
          matchProduct
        );
      }
      return true;
    });
  }, [articles, selectedCategory, selectedProduct, search]);

  const hasActiveFilters = Boolean(selectedCategory || selectedProduct || search.trim());

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || 'General';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Approved Knowledge Base Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Customer Support Knowledge Base
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Search approved troubleshooting guides, product documentation, FAQs, and company policies.
          Filter by category and product suite.
        </p>
      </div>

      {/* Search & Filter Bar Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, keywords, troubleshooting steps, or error codes..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-hidden text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls: Category & Product */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* 1. Category Filter Pills */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-1.5">
                <Filter className="h-3 w-3 text-blue-600" />
                <span>Categories</span>
              </span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-blue-600 hover:underline capitalize"
                >
                  Clear Category
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                All Categories ({articles.length})
              </button>
              {categories.map((cat) => {
                const count = articles.filter((a) => a.category_id === cat.id && a.status === 'published').length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-70 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Product Filter Pills */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-1.5">
                <Layers className="h-3 w-3 text-indigo-600" />
                <span>Product Suite</span>
              </span>
              {selectedProduct && (
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-indigo-600 hover:underline capitalize"
                >
                  Clear Product
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedProduct === null
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                All Products
              </button>
              {products.map((prod) => {
                const isSelected = selectedProduct?.toLowerCase() === prod.name.toLowerCase();
                return (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(isSelected ? null : prod.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {prod.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{filteredArticles.length}</strong> of{' '}
            <strong className="text-slate-900">{articles.length}</strong> verified articles
            {selectedCategory && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                Category: {getCategoryName(selectedCategory)}
              </span>
            )}
            {selectedProduct && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                Product: {selectedProduct}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <X className="h-3 w-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Articles Cards Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => {
            const catName = getCategoryName(article.category_id);
            const formattedDate = new Date(article.updated_at || article.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="group bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Category & Product Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {catName}
                    </span>
                    {article.product && (
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {article.product}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Troubleshooting badge if available */}
                  {article.troubleshooting && (
                    <div className="mt-3 inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      <span>✓ Troubleshooting Steps Included</span>
                    </div>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center space-x-1" title="Last Updated">
                      <Calendar className="h-3 w-3" />
                      <span>{formattedDate}</span>
                    </span>
                    <span className="flex items-center space-x-1" title="Views">
                      <Eye className="h-3 w-3" />
                      <span>{article.views_count}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-emerald-600 font-semibold" title="Helpful Ratings">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{article.helpful_count}</span>
                    </span>
                  </div>

                  <span className="font-bold text-xs text-blue-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                    <span>Read</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Knowledge Articles Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            We couldn't find any articles matching your search query or selected product filter.
            Try adjusting your search terms or asking our AI Assistant directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Reset Filters
            </button>
            {search && (
              <button
                onClick={() => onAskAi(search)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center space-x-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask AI Assistant About "{search}"</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
