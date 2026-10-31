// server/src/routes/products.ts
import { Router } from 'express';
import { db } from '../db/index.js';

export const productsRouter = Router();

// GET /api/products - Get all supported products with article counts
productsRouter.get('/', async (_req, res) => {
  try {
    const [products, articles] = await Promise.all([
      db.getProducts(),
      db.getArticles({ status: 'published' }),
    ]);

    const enriched = products.map((prod) => {
      const count = articles.filter(
        (a) => a.product?.toLowerCase() === prod.name.toLowerCase()
      ).length;
      return {
        ...prod,
        article_count: count,
      };
    });

    res.json({ products: enriched });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list products' });
  }
});
