// client/src/components/admin/ArticleEditorModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Edit3, Tag, FileText, Check, Layers, Wrench, AlertCircle } from 'lucide-react';
import { Article, ArticleCategory, Product } from '../../types.js';
import { api } from '../../services/api.js';

interface ArticleEditorModalProps {
  article: Article | null;
  categories: ArticleCategory[];
  products?: Product[];
  defaultQuestionPrompt?: string;
  onClose: () => void;
  onSaved: () => void;
}

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  article,
  categories,
  products = [],
  defaultQuestionPrompt,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(article);

  const [title, setTitle] = useState(article?.title || defaultQuestionPrompt ? `Resolving: ${defaultQuestionPrompt}` : '');
  const [categoryId, setCategoryId] = useState(article?.category_id || categories[0]?.id || '');
  const [product, setProduct] = useState(article?.product || products[0]?.name || 'NexusDesk Core');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(article?.status || 'published');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [troubleshooting, setTroubleshooting] = useState(
    article?.troubleshooting ||
      '1. Verify system requirements and connection status.\n2. Clear browser cache and restart application.\n3. Escalate to engineering if error code persists.'
  );
  const [content, setContent] = useState(
    article?.content ||
      `## Overview\n\n*(Demonstration Knowledge Base - SupportMind AI Sample Data)*\n\nProvide clear context regarding this support topic.\n\n## Step-by-Step Procedure\n\n1. Step one instructions\n2. Step two instructions\n3. Verification and completion step\n\n> **Note:** Important considerations for the customer.`
  );
  const [keywordsInput, setKeywordsInput] = useState(article?.keywords?.join(', ') || '');
  const [tagsInput, setTagsInput] = useState(article?.tags?.join(', ') || '');
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultQuestionPrompt && !title) {
      setTitle(defaultQuestionPrompt);
      setExcerpt(`Verified official guidance to address: "${defaultQuestionPrompt}"`);
    }
  }, [defaultQuestionPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      setError('Title, category, and article content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const keywords = keywordsInput.split(',').map((k) => k.trim()).filter(Boolean);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (isEditing && article) {
        await api.updateArticle(article.id, {
          title: title.trim(),
          category_id: categoryId,
          product,
          content,
          excerpt: excerpt || content.slice(0, 140) + '...',
          troubleshooting,
          keywords,
          tags,
          status,
        });
      } else {
        await api.createArticle({
          title: title.trim(),
          category_id: categoryId,
          product,
          content,
          excerpt: excerpt || content.slice(0, 140) + '...',
          troubleshooting,
          keywords,
          tags,
          status,
        });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {isEditing ? 'Edit Knowledge Article' : 'Create New Knowledge Article'}
              </h3>
              <p className="text-xs text-slate-500">
                Grounds customer AI support answers and updates the searchable knowledge base.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-rose-700 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to Configure Multi-Factor Authentication"
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-sm text-slate-900 font-semibold"
            />
          </div>

          {/* Grid: Category, Product, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Suite *
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800 bg-white"
              >
                {products.length > 0 ? (
                  products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="NexusDesk Core">NexusDesk Core</option>
                    <option value="CloudScale API">CloudScale API</option>
                    <option value="AuthShield Pro">AuthShield Pro</option>
                    <option value="BillingEngine">BillingEngine</option>
                    <option value="ShipTrack Express">ShipTrack Express</option>
                  </>
                )}
              </select>
            </div>

            {/* Publication Status */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Publication Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800 bg-white font-medium"
              >
                <option value="published">Published (Live in AI & KB)</option>
                <option value="draft">Draft (Internal Only)</option>
                <option value="archived">Archived (Hidden from Search)</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Description / Excerpt (Summary for Search Results)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise 1-2 sentence summary displayed on cards and search snippets..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800 leading-relaxed"
            />
          </div>

          {/* Dedicated Troubleshooting Information */}
          <div>
            <div className="flex items-center space-x-1.5 font-bold text-slate-700 uppercase tracking-wider mb-1">
              <Wrench className="h-3.5 w-3.5 text-amber-600" />
              <span>Relevant Troubleshooting Steps (Diagnostic Checklist)</span>
            </div>
            <textarea
              rows={3}
              value={troubleshooting}
              onChange={(e) => setTroubleshooting(e.target.value)}
              placeholder="1. First diagnostic check&#10;2. Second diagnostic test&#10;3. Resolution or escalation step"
              className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/30 focus:border-blue-600 focus:outline-hidden text-slate-800 font-mono text-[11px] leading-relaxed"
            />
          </div>

          {/* Main Article Content with Live Preview Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Article Content (Markdown Supported) *
              </label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                {previewMode ? <Edit3 className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{previewMode ? 'Switch to Edit' : 'Preview Output'}</span>
              </button>
            </div>

            {previewMode ? (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 min-h-[220px] prose prose-sm max-w-none">
                {content.split('\n\n').map((p, i) => (
                  <p key={i} className="text-slate-700 leading-relaxed mb-2">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <textarea
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write approved customer-facing documentation with step-by-step guidance..."
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden font-mono text-[11px] leading-relaxed text-slate-800"
              />
            )}
          </div>

          {/* Keywords & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Search Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="password, reset, credentials, login"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Security, Authentication, Account"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden text-slate-800"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
