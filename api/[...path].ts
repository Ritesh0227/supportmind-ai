// api/[...path].ts
// Vercel Serverless Function catch-all handler for /api/*
process.env.VERCEL = process.env.VERCEL || '1';
import { app } from '../server/src/index.js';

export default app;
