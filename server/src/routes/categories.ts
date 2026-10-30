// server/src/routes/categories.ts
import { Router } from 'express';
import { db } from '../db/index.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res) => {
  try {
    const categories = await db.getCategories();
    const articles = await db.getArticles({ status: 'published' });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      articleCount: articles.filter((a) => a.category_id === cat.id).length,
    }));

    res.json({ categories: categoriesWithCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch categories' });
  }
});

categoriesRouter.get('/:slug', async (req, res) => {
  try {
    const category = await db.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const articles = await db.getArticles({ category_id: category.id, status: 'published' });
    res.json({ category, articles });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch category' });
  }
});
