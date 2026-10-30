// server/src/routes/analytics.ts
import { Router } from 'express';
import { db } from '../db/index.js';

export const analyticsRouter = Router();

// GET /api/analytics/dashboard - Real-time metrics computed directly from database
analyticsRouter.get('/dashboard', async (_req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({ stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to compute analytics' });
  }
});
