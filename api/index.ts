// api/index.ts
// Vercel Serverless Function entry point for SupportMind AI API
process.env.VERCEL = process.env.VERCEL || '1';
import { app } from '../server/src/index.js';

export default app;
