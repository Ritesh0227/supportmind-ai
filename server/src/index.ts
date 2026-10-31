// server/src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { categoriesRouter } from './routes/categories.js';
import { productsRouter } from './routes/products.js';
import { articlesRouter } from './routes/articles.js';
import { chatRouter } from './routes/chat.js';
import { feedbackRouter } from './routes/feedback.js';
import { analyticsRouter } from './routes/analytics.js';
import { testSuiteRouter } from './routes/testSuite.js';
import { configRouter } from './routes/config.js';
import { authRouter } from './routes/auth.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Root endpoint for deployment verification
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    name: 'SupportMind AI API (HACK-P380)',
    version: '1.0.0',
    health: '/api/health',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
      articles: '/api/articles',
      chat: '/api/chat',
      auth: '/api/auth/login',
      analytics: '/api/analytics/dashboard',
    },
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/test-suite', testSuiteRouter);
app.use('/api/config', configRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    name: 'SupportMind AI Knowledge System (HACK-P380)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    databaseDriver: process.env.MONGODB_URI ? 'MongoDB' : 'Persistent Storage (db.json)',
  });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log('====================================================');
  console.log(`🚀 SupportMind AI Backend Server active on ${HOST}:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'builtin'}`);
  console.log(`🗄️ Database: ${process.env.MONGODB_URI ? 'MongoDB' : 'Persistent Storage (server/data/db.json)'}`);
  console.log('====================================================');
});

export { app };
