import { categoriesRouter } from './routes/categories.js';
import { articlesRouter } from './routes/articles.js';
import { chatRouter } from './routes/chat.js';
import { feedbackRouter } from './routes/feedback.js';
import { analyticsRouter } from './routes/analytics.js';
import express from 'express';

const app = express();
app.use(express.json());
app.use('/api/categories', categoriesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/analytics', analyticsRouter);
app.get('/api/health', (req, res) => res.json({ status: 'healthy', name: 'SupportMind AI' }));

async function runInProcessHttpTest() {
  console.log('--- Starting In-Process HTTP Server ---');
  const server = app.listen(0);
  const port = server.address().port;
  const BASE = `http://127.0.0.1:${port}/api`;
  console.log(`Bound to local ephemeral port: ${port}`);

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      passed++;
      console.log(`✅ [HTTP PASS] ${name}`);
    } catch (err) {
      console.error(`❌ [HTTP FAIL] ${name}:`, err.message || err);
    }
  }

  try {
    await test('GET /health', async () => {
      const res = await fetch(`${BASE}/health`);
      const data = await res.json();
      if (res.status !== 200 || data.status !== 'healthy') throw new Error(`Status ${res.status}`);
    });

    await test('GET /categories (8 expected)', async () => {
      const res = await fetch(`${BASE}/categories`);
      const data = await res.json();
      if (res.status !== 200 || data.categories.length !== 8) throw new Error(`Expected 8, got ${data?.categories?.length}`);
    });

    await test('GET /articles (>= 20 expected)', async () => {
      const res = await fetch(`${BASE}/articles`);
      const data = await res.json();
      if (res.status !== 200 || data.articles.length < 20) throw new Error(`Expected >=20, got ${data?.articles?.length}`);
    });

    let lastMessageId = '';
    let lastConvId = '';
    await test('POST /chat (Grounded Question)', async () => {
      const res = await fetch(`${BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'How do I reset my password?' })
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      if (data.isFallback || data.sources.length === 0) throw new Error('Expected grounded response with citations');
      lastMessageId = data.messageId;
      lastConvId = data.conversationId;
    });

    await test('POST /chat (Safe Fallback Question)', async () => {
      const res = await fetch(`${BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'What is your company policy on flying drones inside passenger planes?' })
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      if (!data.isFallback) throw new Error('Expected fallback to be true');
      if (!data.answer.includes("I couldn't find a reliable answer")) throw new Error('Missing standard fallback text');
    });

    await test('POST /feedback', async () => {
      const res = await fetch(`${BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: lastMessageId || 'msg-1',
          conversationId: lastConvId || 'conv-1',
          rating: 'helpful',
          comment: 'Very helpful steps!'
        })
      });
      const data = await res.json();
      if (res.status !== 201 || data.feedback?.rating !== 'helpful') throw new Error(`Status ${res.status}`);
    });

    await test('GET /analytics/dashboard (Live calculation)', async () => {
      const res = await fetch(`${BASE}/analytics/dashboard`);
      const data = await res.json();
      if (res.status !== 200 || !data.stats || data.stats.totalActiveArticles < 20) throw new Error('Invalid dashboard stats');
    });

    let newArticleId = '';
    await test('POST /articles (Admin create)', async () => {
      const res = await fetch(`${BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Live Verified Admin Article',
          category_id: 'cat-account-mgmt',
          content: 'Test content for administrative knowledge publishing.',
          excerpt: 'Short excerpt',
          keywords: ['live', 'verify'],
          tags: ['Test']
        })
      });
      const data = await res.json();
      if (res.status !== 201 || !data.article?.id) throw new Error(`Status ${res.status}`);
      newArticleId = data.article.id;
    });

    await test('PUT /articles/:id (Admin update)', async () => {
      const res = await fetch(`${BASE}/articles/${newArticleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Live Verified Admin Article (Updated Title)' })
      });
      const data = await res.json();
      if (res.status !== 200 || !data.article?.title.includes('Updated')) throw new Error(`Status ${res.status}`);
    });

    await test('POST /articles/:id/archive (Admin archive)', async () => {
      const res = await fetch(`${BASE}/articles/${newArticleId}/archive`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.status !== 200 || data.article?.status !== 'archived') throw new Error(`Status ${res.status}`);
    });

  } finally {
    server.close();
  }

  console.log(`\n======================================================`);
  console.log(`Live HTTP API Verification: ${passed}/${total} Passed`);
  console.log(`======================================================`);
  if (passed !== total) process.exit(1);
}

runInProcessHttpTest().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
