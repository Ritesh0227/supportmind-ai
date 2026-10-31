// verifyDeploy.mjs - Comprehensive Live Deployment & API Verification
const SITE = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://supportmind-ai-tau.vercel.app';

async function verifyDeploy() {
  console.log(`\n======================================================`);
  console.log(`  VERIFYING LIVE VERCEL DEPLOYMENT: ${SITE}`);
  console.log(`======================================================\n`);

  const results = [];
  let token = '';

  const test = async (name, fn) => {
    try {
      await fn();
    } catch (err) {
      results.push({ name, status: 'FAIL', detail: err.message });
    }
  };

  const pass = (name, detail) => results.push({ name, status: 'PASS', detail });
  const fail = (name, detail) => results.push({ name, status: 'FAIL', detail });

  // 1. Homepage loads
  await test('Frontend Homepage loads', async () => {
    const res = await fetch(SITE);
    const html = await res.text();
    if (res.status === 200 && html.includes('root')) {
      pass('Frontend Homepage loads', `HTTP 200, contains root element`);
    } else {
      fail('Frontend Homepage loads', `HTTP ${res.status}`);
    }
  });

  // 2. SPA routing works
  await test('SPA Subroute routing (/knowledge-base)', async () => {
    const res = await fetch(`${SITE}/knowledge-base`);
    if (res.status === 200) {
      pass('SPA Subroute routing (/knowledge-base)', `HTTP 200`);
    } else {
      fail('SPA Subroute routing (/knowledge-base)', `HTTP ${res.status}`);
    }
  });

  // 3. Health / Root API
  await test('API Root / Health', async () => {
    const res = await fetch(`${SITE}/api`);
    const data = await res.json();
    if (res.status === 200 && data.status === 'online') {
      pass('API Root / Health', `HTTP 200 - ${data.name}`);
    } else {
      fail('API Root / Health', `HTTP ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 4. Categories API
  await test('Categories API (/api/categories)', async () => {
    const res = await fetch(`${SITE}/api/categories`);
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data) && data.length >= 8) {
      pass('Categories API (/api/categories)', `HTTP 200, returned ${data.length} categories`);
    } else {
      fail('Categories API (/api/categories)', `HTTP ${res.status}: returned ${Array.isArray(data) ? data.length : typeof data}`);
    }
  });

  // 5. Articles API
  await test('Articles API (/api/articles)', async () => {
    const res = await fetch(`${SITE}/api/articles?status=published`);
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data) && data.length >= 20) {
      pass('Articles API (/api/articles)', `HTTP 200, returned ${data.length} articles`);
    } else {
      fail('Articles API (/api/articles)', `HTTP ${res.status}: count=${Array.isArray(data) ? data.length : 0}`);
    }
  });

  // 6. Admin Login
  await test('Admin Dashboard Login (/api/auth/login)', async () => {
    const res = await fetch(`${SITE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@supportmind.ai', password: 'admin123' }),
    });
    const data = await res.json();
    if (res.status === 200 && data.token && data.user?.role === 'admin') {
      token = data.token;
      pass('Admin Dashboard Login (/api/auth/login)', `HTTP 200, authenticated as ${data.user.full_name} (${data.token.slice(0, 16)}...)`);
    } else {
      fail('Admin Dashboard Login (/api/auth/login)', `HTTP ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 7. Admin Auth Token Verification
  await test('Admin Session Verification (/api/auth/me)', async () => {
    if (!token) throw new Error('Skipped: No auth token');
    const res = await fetch(`${SITE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.status === 200 && data.email === 'admin@supportmind.ai') {
      pass('Admin Session Verification (/api/auth/me)', `HTTP 200, verified identity for ${data.email}`);
    } else {
      fail('Admin Session Verification (/api/auth/me)', `HTTP ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 8. AI Grounded Question
  await test('AI Support Question (Grounded RAG)', async () => {
    const res = await fetch(`${SITE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How do I reset my password?' }),
    });
    const data = await res.json();
    if (res.status === 200 && !data.isFallback && data.sources?.length > 0) {
      pass('AI Support Question (Grounded RAG)', `HTTP 200, cited: "${data.sources[0].title}"`);
    } else {
      fail('AI Support Question (Grounded RAG)', `HTTP ${res.status}: ${JSON.stringify(data).slice(0, 100)}`);
    }
  });

  // 9. AI Out-of-Scope Fallback
  await test('AI Safe Fallback (No Hallucination)', async () => {
    const res = await fetch(`${SITE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is drone flying policy for airplane luggage?' }),
    });
    const data = await res.json();
    if (res.status === 200 && data.isFallback) {
      pass('AI Safe Fallback (No Hallucination)', `HTTP 200, safely triggered fallback without hallucinations`);
    } else {
      fail('AI Safe Fallback (No Hallucination)', `HTTP ${res.status}: isFallback=${data.isFallback}`);
    }
  });

  // 10. Analytics Dashboard
  await test('Analytics Dashboard (/api/analytics/dashboard)', async () => {
    const res = await fetch(`${SITE}/api/analytics/dashboard`);
    const data = await res.json();
    if (res.status === 200 && typeof data.totalArticles === 'number') {
      pass('Analytics Dashboard (/api/analytics/dashboard)', `HTTP 200, total articles: ${data.totalArticles}`);
    } else {
      fail('Analytics Dashboard (/api/analytics/dashboard)', `HTTP ${res.status}`);
    }
  });

  // Print Summary
  console.log('\n======================================================');
  console.log('                 VERIFICATION RESULTS');
  console.log('======================================================');
  let passedCount = 0;
  for (const r of results) {
    console.log(`[${r.status}] ${r.name}`);
    console.log(`       ↳ ${r.detail}`);
    if (r.status === 'PASS') passedCount++;
  }
  console.log('======================================================');
  console.log(`SUMMARY: ${passedCount} PASSED, ${results.length - passedCount} FAILED out of ${results.length} total checks.`);
  console.log(`LIVE URL: ${SITE}`);
  console.log('======================================================\n');

  if (passedCount < results.length) {
    process.exit(1);
  }
}

verifyDeploy().catch((err) => {
  console.error('Fatal deployment check error:', err);
  process.exit(1);
});
