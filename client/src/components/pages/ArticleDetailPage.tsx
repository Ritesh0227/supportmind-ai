// client/src/components/pages/ArticleDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Share2,
  Tag,
  Wrench,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { Article, ArticleCategory } from '../../types.js';
import { api } from '../../services/api.js';

interface ArticleDetailPageProps {
  article: Article;
  categories: ArticleCategory[];
  onBackToKnowledgeBase: () => void;
  onSelectRelatedArticle: (article: Article) => void;
  onAskAi: (query: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  categories,
  onBackToKnowledgeBase,
  onSelectRelatedArticle,
  onAskAi,
}) => {
  const [voted, setVoted] = useState<'helpful' | 'not_helpful' | null>(null);
  const [voting, setVoting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const category = categories.find((c) => c.id === article.category_id);

  // Load related articles from API
  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        const data = await api.getArticle(article.id);
        if (isMounted && data.relatedArticles) {
          setRelatedArticles(data.relatedArticles);
        }
      } catch (err) {
        console.error('Failed to load related articles:', err);
      } finally {
        if (isMounted) setLoadingRelated(false);
      }
    };
    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [article.id]);

  const handleVote = async (isHelpful: boolean) => {
    if (voted || voting) return;
    setVoting(true);
    try {
      await api.voteArticle(article.id, isHelpful);
      setVoted(isHelpful ? 'helpful' : 'not_helpful');
    } catch (err) {
      console.error('Failed to record vote:', err);
    } finally {
      setVoting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(article.updated_at || article.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <button
          onClick={onBackToKnowledgeBase}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Knowledge Base</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Knowledge Base</span>
          <span>/</span>
          <span className="text-slate-600 font-medium">{category?.name || 'General'}</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold truncate max-w-[200px]">{article.title}</span>
        </div>
      </div>

      {/* Article Main Container */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {category?.name || 'Support Article'}
            </span>

            {article.product && (
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                <Layers className="h-3 w-3 text-indigo-600" />
                <span>{article.product}</span>
              </span>
            )}

            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-100">
              Verified Documentation
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Last updated: {formattedDate}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>{article.views_count + 1} views</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-600 font-medium">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{article.helpful_count} helpful</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Copy article link"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>

              <button
                onClick={() => onAskAi(`Regarding article "${article.title}": `)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask AI About This</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lead Excerpt */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border-l-4 border-blue-600 text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
          {article.excerpt}
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
          {article.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl font-extrabold text-slate-900 pt-4 pb-1 border-b border-slate-100">
                  {paragraph.replace(/^##\s*/, '')}
                </h2>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={idx} className="pl-4 border-l-4 border-blue-500 italic text-slate-600 my-3">
                  {paragraph.replace(/^>\s*/, '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
              return (
                <div key={idx} className="space-y-1.5 pl-2 my-2">
                  {paragraph.split('\n').map((line, lIdx) => (
                    <div key={lIdx} className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600 text-xs mt-1">•</span>
                      <span>{line.replace(/^(\d+\.|\-)\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Dedicated Troubleshooting Steps Section */}
        {article.troubleshooting && (
          <div className="mt-8 p-6 rounded-3xl bg-amber-50/60 border-2 border-amber-200/80 space-y-3">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-base">
              <Wrench className="h-5 w-5 text-amber-600" />
              <span>Troubleshooting & Diagnostic Checklist</span>
            </div>
            <p className="text-xs text-amber-800/90 font-medium">
              If standard instructions do not resolve the issue, follow these diagnostic steps:
            </p>
            <div className="space-y-2 mt-3 bg-white p-4 rounded-2xl border border-amber-200">
              {article.troubleshooting.split('\n').map((step, sIdx) => (
                <div key={sIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-800">
                  <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    {sIdx + 1}
                  </div>
                  <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords / Tags */}
        {(article.keywords.length > 0 || article.tags.length > 0) && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center space-x-1">
              <Tag className="h-3 w-3" />
              <span>Keywords:</span>
            </span>
            {article.keywords.map((kw, idx) => (
              <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Helpful / Not Helpful Feedback Box */}
        <div className="mt-8 pt-8 border-t border-slate-200 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-900">Was this article helpful?</h3>
          <p className="text-xs text-slate-500">
            Your feedback helps our support engineering team improve documentation accuracy.
          </p>

          {voted ? (
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>
                Thank you! Your feedback has been recorded into our customer satisfaction system.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => handleVote(true)}
                disabled={voting}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-all hover:scale-105"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Yes, it helped</span>
              </button>

              <button
                onClick={() => handleVote(false)}
                disabled={voting}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all hover:scale-105"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>No, I need more help</span>
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Related Support Articles</h2>
          </div>
          <button
            onClick={onBackToKnowledgeBase}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Explore All Articles →
          </button>
        </div>

        {relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => {
              const relCat = categories.find((c) => c.id === rel.category_id);
              return (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedArticle(rel)}
                  className="group bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {relCat?.name || 'Related Guide'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2 line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                    <span>Read Guide</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No direct related articles found in this category.</p>
        )}
      </section>
    </div>
  );
};
