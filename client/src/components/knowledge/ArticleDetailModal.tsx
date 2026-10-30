// client/src/components/knowledge/ArticleDetailModal.tsx
import React, { useState } from 'react';
import {
  X,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { Article, ArticleCategory } from '../../types.js';
import { api } from '../../services/api.js';

interface ArticleDetailModalProps {
  article: Article | null;
  categories: ArticleCategory[];
  onClose: () => void;
  onVoteRecorded?: (articleId: string, helpful: boolean) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  categories,
  onClose,
  onVoteRecorded,
}) => {
  if (!article) return null;

  const [voted, setVoted] = useState<'helpful' | 'not_helpful' | null>(null);
  const [copied, setCopied] = useState(false);

  const category = categories.find((c) => c.id === article.category_id);

  const handleVote = async (isHelpful: boolean) => {
    if (voted) return;
    try {
      await api.voteArticle(article.id, isHelpful);
      setVoted(isHelpful ? 'helpful' : 'not_helpful');
      onVoteRecorded?.(article.id, isHelpful);
    } catch (err) {
      console.error('Failed to record vote:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-800">
                {category?.name || 'Knowledge Base'}
              </span>
              <span className="text-xs text-slate-400 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Updated {new Date(article.updated_at).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {article.title}
            </h2>
          </div>

          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={handleCopyLink}
              title="Copy share link"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              {copied ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <Share2 className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          {/* Demonstration Notice */}
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Official Knowledge Article (Demonstration Data)</span>
              <p className="text-amber-700 mt-0.5">
                This policy document is part of the SupportMind AI sample demonstration dataset.
              </p>
            </div>
          </div>

          {/* Excerpt Summary */}
          <div className="text-slate-600 italic bg-slate-50 p-4 rounded-xl border-l-4 border-blue-500 font-medium text-sm">
            {article.excerpt}
          </div>

          {/* Markdown Content Formatter */}
          <div className="prose max-w-none text-slate-800 space-y-4">
            {article.content.split('\n\n').map((paragraph, idx) => {
              // Section Header
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-slate-900 pt-4 border-b pb-2">
                    {paragraph.replace('## ', '')}
                  </h3>
                );
              }
              // List items
              if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ').map((s) => s.replace(/^- /, ''));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-sm">
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                );
              }
              // Ordered list items
              if (paragraph.match(/^\d+\.\s+/m)) {
                const lines = paragraph.split('\n').filter(Boolean);
                return (
                  <ol key={idx} className="list-decimal pl-5 space-y-2 text-sm">
                    {lines.map((line, i) => (
                      <li key={i}>{line.replace(/^\d+\.\s+/, '')}</li>
                    ))}
                  </ol>
                );
              }
              // Blockquote
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="p-3 bg-blue-50/60 border-l-4 border-blue-600 text-xs text-blue-900 rounded-r-lg">
                    {paragraph.replace(/^>\s*/, '')}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="text-sm sm:text-base leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500">Related tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Rating Section */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{article.views_count} views</span>
            </span>
            <span className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4 text-emerald-600" />
              <span>{article.helpful_count} found this helpful</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700 mr-1">Was this article helpful?</span>
            {voted ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Thank you for your feedback!
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleVote(true)}
                  className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 font-semibold transition-all shadow-2xs"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Yes</span>
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-semibold transition-all shadow-2xs"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  <span>No</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
