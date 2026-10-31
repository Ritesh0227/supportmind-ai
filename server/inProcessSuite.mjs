import http from 'http';

// We import the compiled server which starts listening on PORT (5000 by default)
process.env.PORT = '5001'; // use a fresh port 5001 to avoid collisions
const BASE = 'http://127.0.0.1:5001';

console.log('Starting in-process server on port 5001...');
await import('./dist/index.js');
await new Promise(r => setTimeout(r, 1200));

const results = [];
let TOKEN = '';

async function test(name, fn) {
  try {
    await fn();
  } catch (e) {
    results.push({ test: name, status: 'FAIL', detail: `${e.message} (cause: ${e.cause})` });
  }
}

function pass(name, detail) { results.push({ test: name, status: 'PASS', detail }); }
function fail(name, detail) { results.push({ test: name, status: 'FAIL', detail }); }

// 1. Valid Admin Login
await test('Admin Login (valid credentials)', async () => {
  const r = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@supportmind.ai', password: 'admin123' }),
  });
  const d = await r.json();
  if (r.ok && d.token && d.token.startsWith('SM.')) {
    TOKEN = d.token;
    pass('Admin Login (valid credentials)', `Authenticated: ${d.user?.full_name} (${d.token.substring(0, 16)}...)`);
  } else {
    fail('Admin Login (valid credentials)', JSON.stringify(d));
  }
});

// 2. Invalid Admin Login
await test('Admin Login (invalid password)', async () => {
  const r = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@supportmind.ai', password: 'wrongpassword' }),
  });
  if (r.status === 401) {
    pass('Admin Login (invalid password)', 'Rejected with HTTP 401 (Unauthorized)');
  } else {
    fail('Admin Login (invalid password)', 'Expected 401, got ' + r.status);
  }
});

// 3. Admin /api/auth/me with Bearer token
await test('Admin Auth Guard (valid token)', async () => {
  const r = await fetch(BASE + '/api/auth/me', {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  const d = await r.json();
  if (r.ok && d.user?.email === 'admin@supportmind.ai') {
    pass('Admin Auth Guard (valid token)', `Identity verified: ${d.user.email}`);
  } else {
    fail('Admin Auth Guard (valid token)', JSON.stringify(d));
  }
});

// 4. Admin /api/auth/me without Bearer token
await test('Admin Auth Guard (missing token)', async () => {
  const r = await fetch(BASE + '/api/auth/me');
  if (r.status === 401) {
    pass('Admin Auth Guard (missing token)', 'Protected endpoint blocked without token (401)');
  } else {
    fail('Admin Auth Guard (missing token)', 'Expected 401, got ' + r.status);
  }
});

// 5. 5 Questions based on existing articles
const aiQuestions = [
  { q: 'How do I reset my password?', tag: 'Password Reset Guide' },
  { q: 'Where can I find my invoice?', tag: 'Invoice & Billing Receipt' },
  { q: 'How do I track my order?', tag: 'Order Tracking & Shipment' },
  { q: 'Why was my payment declined?', tag: 'Declined Payment Solutions' },
  { q: 'How do I request a return?', tag: 'Return & Exchange Policy' }
];

for (let i = 0; i < aiQuestions.length; i++) {
  const item = aiQuestions[i];
  await test(`AI Assistant Q${i+1} (${item.tag})`, async () => {
    const r = await fetch(BASE + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: `session-q${i+1}-${Date.now()}`, query: item.q }),
    });
    const d = await r.json();
    if (r.ok && !d.isFallback && d.sources && d.sources.length > 0) {
      pass(`AI Assistant Q${i+1} (${item.tag})`, `Answer grounded. Primary source: "${d.sources[0].title}"`);
    } else {
      fail(`AI Assistant Q${i+1} (${item.tag})`, `Fallback=${d.isFallback}, Sources=${d.sources?.length || 0}`);
    }
  });
}

// 6. 1 Out-of-scope question (unsupported fallback)
await test('AI Assistant Out-of-Scope Safe Fallback', async () => {
  const r = await fetch(BASE + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: `session-fallback-${Date.now()}`, query: 'What is your drone flying policy inside airplanes?' }),
  });
  const d = await r.json();
  if (r.ok && d.isFallback === true && d.sources.length === 0) {
    pass('AI Assistant Out-of-Scope Safe Fallback', 'Gracefully handled unsupported query with verified fallback response');
  } else {
    fail('AI Assistant Out-of-Scope Safe Fallback', `Expected fallback=true, got ${d.isFallback}`);
  }
});

// 7. Article Creation
let createdArticleId = '';
await test('Article Creation (Admin CRUD)', async () => {
  const r = await fetch(BASE + '/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      title: 'Automated Test Article for Knowledge Base',
      category_id: 'cat-account-mgmt',
      content: 'This is a test article created to verify admin dashboard write capabilities.',
      product: 'NexusDesk Core',
      troubleshooting: ['Step 1: Check account status', 'Step 2: Restart service'],
      status: 'published'
    })
  });
  const d = await r.json();
  const art = d.article || d;
  if (r.ok && art.id) {
    createdArticleId = art.id;
    pass('Article Creation (Admin CRUD)', `Created article ID: ${createdArticleId}`);
  } else {
    fail('Article Creation (Admin CRUD)', JSON.stringify(d));
  }
});

// 8. Article Editing
await test('Article Editing (Admin CRUD)', async () => {
  if (!createdArticleId) throw new Error('No article ID available from creation');
  const r = await fetch(BASE + `/api/articles/${createdArticleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      title: 'Automated Test Article for Knowledge Base (Updated Title)'
    })
  });
  const d = await r.json();
  const art = d.article || d;
  if (r.ok && art.title?.includes('Updated Title')) {
    pass('Article Editing (Admin CRUD)', `Updated title: "${art.title}"`);
  } else {
    fail('Article Editing (Admin CRUD)', JSON.stringify(d));
  }
});

// 9. Article Cleanup
await test('Article Deletion & Persistence', async () => {
  if (createdArticleId) {
    const r = await fetch(BASE + `/api/articles/${createdArticleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    if (r.ok) {
      pass('Article Deletion & Persistence', `Cleaned up test article ${createdArticleId}`);
    } else {
      fail('Article Deletion & Persistence', `Delete returned status ${r.status}`);
    }
  }
});

// Report summary
console.log('\n============================================================');
console.log('       SUPPORTMIND AI — COMPREHENSIVE TEST REPORT');
console.log('============================================================');
let passCount = 0;
let failCount = 0;
for (const res of results) {
  const icon = res.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} | ${res.test}\n       ↳ ${res.detail}`);
  if (res.status === 'PASS') passCount++; else failCount++;
}
console.log('============================================================');
console.log(`FINAL SCORE: ${passCount} PASSED, ${failCount} FAILED out of ${results.length} total tests.`);
console.log('============================================================\n');

process.exit(failCount > 0 ? 1 : 0);
