// client/src/components/admin/ArticleEditorModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Edit3, Tag, FileText, Check } from 'lucide-react';
import { Article, ArticleCategory } from '../../types.js';
import { api } from '../../services/api.js';

interface ArticleEditorModalProps {
  article: Article | null;
  categories: ArticleCategory[];
  defaultQuestionPrompt?: string;
  onClose: () => void;
  onSaved: () => void;
}

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  article,
  categories,
  defaultQuestionPrompt,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(article);

  const [title, setTitle] = useState(article?.title || defaultQuestionPrompt ? `Resolving: ${defaultQuestionPrompt}` : '');
  const [categoryId, setCategoryId] = useState(article?.category_id || categories[0]?.id || '');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(article?.status || 'published');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
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
      setError('Title, category, and content are required.');
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
          content,
          excerpt: excerpt || content.slice(0, 140) + '...',
          keywords,
          tags,
          status,
        });
      } else {
        await api.createArticle({
          title: title.trim(),
          category_id: categoryId,
          content,
          excerpt: excerpt || content.slice(0, 140) + '...',
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
                {isEditing ? 'Modify content and update RAG retrieval tokens' : 'Add approved documentation to the grounded AI system'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              {previewMode ? (
                <>
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Editor</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </>
              )}
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Article Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How to Request an Expedited Refund"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Short Excerpt / Summary</label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary displayed in search results and AI citations..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="published">Published (Live for AI & Search)</option>
                <option value="draft">Draft (Internal review)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
            </div>
          </div>

          {/* Markdown Content or Preview */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Article Content (Markdown Formatted)
            </label>
            {previewMode ? (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 min-h-[220px] prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-slate-800">{content}</div>
              </div>
            ) : (
              <textarea
                rows={9}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Search Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="password, credentials, login, forgot"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Display Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Security, Account, Password"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
