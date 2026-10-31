// Live API test - uses built-in fetch (Node 18+)
const BASE = 'http://localhost:5000';
const results = [];
let TOKEN = '';

async function test(name, fn) {
  try {
    await fn();
  } catch (e) {
    results.push({ test: name, status: 'FAIL', detail: e.message });
  }
}

function pass(name, detail) { results.push({ test: name, status: 'PASS', detail }); }
function fail(name, detail) { results.push({ test: name, status: 'FAIL', detail }); }

// Test 1: Valid admin login
await test('Admin Login (valid)', async () => {
  const r = await fetch(BASE + '/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@supportmind.ai', password: 'admin123' }),
  });
  const d = await r.json();
  if (r.ok && d.token && d.token.startsWith('SM.')) {
    TOKEN = d.token;
    pass('Admin Login (valid)', 'Token: ' + d.token.substring(0, 20) + '...');
  } else {
    fail('Admin Login (valid)', JSON.stringify(d));
  }
});

// Test 2: Invalid password -> 401
await test('Admin Login (invalid pw)', async () => {
  const r = await fetch(BASE + '/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@supportmind.ai', password: 'wrongpassword' }),
  });
  if (r.status === 401) pass('Admin Login (invalid pw)', 'HTTP 401 ✓');
  else fail('Admin Login (invalid pw)', 'Expected 401, got HTTP ' + r.status);
});

// Test 3: GET /auth/me with token
await test('GET /auth/me (with token)', async () => {
  const r = await fetch(BASE + '/api/auth/me', { headers: { Authorization: 'Bearer ' + TOKEN } });
  const d = await r.json();
  if (r.ok && d.user) pass('GET /auth/me (with token)', d.user.email);
  else fail('GET /auth/me (with token)', JSON.stringify(d));
});

// Test 4: GET /auth/me without token -> 401
await test('GET /auth/me (no token)', async () => {
  const r = await fetch(BASE + '/api/auth/me');
  if (r.status === 401) pass('GET /auth/me (no token)', 'HTTP 401 ✓');
  else fail('GET /auth/me (no token)', 'Expected 401, got HTTP ' + r.status);
});

// Tests 5-9: AI Chat questions (grounded)
const chatTests = [
  { q: 'How do I reset my password?', key: 'AI Chat: password reset' },
  { q: 'Where can I find my invoice?', key: 'AI Chat: billing invoice' },
  { q: 'How do I track my order?', key: 'AI Chat: order tracking' },
  { q: 'Why was my payment declined?', key: 'AI Chat: payment declined' },
  { q: 'How do I request a return?', key: 'AI Chat: return request' },
];
for (const ct of chatTests) {
  await test(ct.key, async () => {
    const r = await fetch(BASE + '/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'live-' + Date.now(), query: ct.q }),
    });
    const d = await r.json();
    if (r.ok && !d.isFallback && d.sources && d.sources.length > 0)
      pass(ct.key, `sources=${d.sources.length} fallback=${d.isFallback}`);
    else
      fail(ct.key, `sources=${d.sources?.length || 0} fallback=${d.isFallback}`);
  });
}

// Test 10: Out-of-scope -> fallback
await test('AI Chat: out-of-scope fallback', async () => {
  const r = await fetch(BASE + '/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: 'fallback-' + Date.now(), query: 'What is your drone policy for airplanes?' }),
  });
  const d = await r.json();
  if (r.ok && d.isFallback === true) pass('AI Chat: out-of-scope fallback', 'isFallback=true ✓');
  else fail('AI Chat: out-of-scope fallback', `isFallback=${d.isFallback}`);
});

// Tests 11-14: Article CRUD
let artId = null;
await test('Article Create', async () => {
  const r = await fetch(BASE + '/api/articles', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'LIVE TEST Article', category_id: 'cat-account-mgmt', content: 'Live test content for password reset help.', product: 'AuthShield Pro', status: 'published' }),
  });
  const d = await r.json();
  artId = d.article?.id || d.id;
  if (r.ok && artId) pass('Article Create', 'ID: ' + artId);
  else fail('Article Create', JSON.stringify(d));
});

if (artId) {
  await test('Article Edit', async () => {
    const r = await fetch(BASE + '/api/articles/' + artId, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'LIVE TEST Article (Updated)' }),
    });
    const d = await r.json();
    if (r.ok) pass('Article Edit', d.article?.title || 'updated');
    else fail('Article Edit', JSON.stringify(d));
  });

  await test('Article Archive', async () => {
    const r = await fetch(BASE + '/api/articles/' + artId + '/archive', { method: 'POST' });
    const d = await r.json();
    if (r.ok) pass('Article Archive', 'status=' + d.article?.status);
    else fail('Article Archive', JSON.stringify(d));
  });

  await test('Article Delete', async () => {
    const r = await fetch(BASE + '/api/articles/' + artId, { method: 'DELETE' });
    if (r.ok) pass('Article Delete', 'HTTP ' + r.status);
    else fail('Article Delete', 'HTTP ' + r.status);
  });
}

// DB Persistence: verify article count still correct after delete
await test('DB State Consistency', async () => {
  const r = await fetch(BASE + '/api/articles?status=published');
  const d = await r.json();
  const count = d.articles?.length || d.length || 0;
  if (count >= 20) pass('DB State Consistency', count + ' published articles ✓');
  else fail('DB State Consistency', 'Only ' + count + ' published articles (expected ≥20)');
});

// Print results
console.log('');
console.log('============================================================');
console.log('   SUPPORTMIND AI — LIVE API TEST RESULTS (HACK-P380)');
console.log('============================================================');
let passCount = 0, failCount = 0;
for (const res of results) {
  const icon = res.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} | ${res.test} | ${res.detail}`);
  if (res.status === 'PASS') passCount++; else failCount++;
}
console.log('');
console.log(`TOTAL: ${passCount} PASS, ${failCount} FAIL out of ${passCount + failCount} tests`);
if (failCount === 0) {
  console.log('🎉 ALL TESTS PASSED');
} else {
  console.log('⚠️  Some tests failed — see above');
}
