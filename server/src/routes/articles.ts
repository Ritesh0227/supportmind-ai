// server/src/routes/articles.ts
import { Router } from 'express';
import { db } from '../db/index.js';

export const articlesRouter = Router();

// GET /api/articles - List articles with filters
articlesRouter.get('/', async (req, res) => {
  try {
    const { category_id, status, search } = req.query;
    const articles = await db.getArticles({
      category_id: category_id as string,
      status: status as string,
      search: search as string,
    });
    res.json({ articles });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list articles' });
  }
});

// GET /api/articles/:slugOrId - Get article details & increment view count
articlesRouter.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let article = await db.getArticleBySlug(slugOrId);
    if (!article) {
      article = await db.getArticleById(slugOrId);
    }

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view counter
    await db.incrementArticleViews(article.id);

    // Get category info
    const category = await db.getCategoryBySlug(article.category_id) || null;

    res.json({ article, category });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get article' });
  }
});

// POST /api/articles - Create article (Admin)
articlesRouter.post('/', async (req, res) => {
  try {
    const { title, category_id, content, excerpt, keywords, tags, status } = req.body;

    if (!title || !category_id || !content) {
      return res.status(400).json({ error: 'Title, category_id, and content are required' });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newArticle = await db.createArticle({
      id,
      title: title.trim(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      category_id,
      content,
      excerpt: excerpt || content.slice(0, 150) + '...',
      keywords: Array.isArray(keywords) ? keywords : (keywords || '').split(',').map((k: string) => k.trim()).filter(Boolean),
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      status: status || 'published',
    });

    res.status(201).json({ article: newArticle });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create article' });
  }
});

// PUT /api/articles/:id - Update article (Admin)
articlesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category_id, content, excerpt, keywords, tags, status } = req.body;

    const existing = await db.getArticleById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const updates: any = {};
    if (title) updates.title = title.trim();
    if (category_id) updates.category_id = category_id;
    if (content) updates.content = content;
    if (excerpt) updates.excerpt = excerpt;
    if (keywords !== undefined) {
      updates.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
    }
    if (tags !== undefined) {
      updates.tags = Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    if (status) updates.status = status;

    const updated = await db.updateArticle(id, updates);
    res.json({ article: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update article' });
  }
});

// POST /api/articles/:id/archive - Archive article (Admin)
articlesRouter.post('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getArticleById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const newStatus = existing.status === 'archived' ? 'published' : 'archived';
    const updated = await db.updateArticle(id, { status: newStatus });
    res.json({ article: updated, message: `Article status changed to ${newStatus}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to archive article' });
  }
});

// POST /api/articles/:id/vote - Record article helpfulness vote
articlesRouter.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body;

    await db.recordArticleVote(id, Boolean(helpful));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record vote' });
  }
});
