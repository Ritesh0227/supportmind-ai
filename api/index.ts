// api/index.ts
// Vercel Serverless Function entry point for SupportMind AI API
let cachedApp: any = null;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    process.env.VERCEL = process.env.VERCEL || '1';
    const mod = await import('../server/src/index.js');
    cachedApp = mod.app;
  }
  return cachedApp(req, res);
}
