// server/src/testRunner.ts
import dotenv from 'dotenv';
dotenv.config();

import { db } from './db/index.js';
import { PREDEFINED_TEST_QUESTIONS } from './seed/testQuestions.js';
import { AiProviderService } from './ai/providers.js';

async function runCliTests() {
  console.log('\n======================================================');
  console.log('🧪 Starting SupportMind AI Backend Automated Verification');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. Verify Categories
  const categories = await db.getCategories();
  if (categories.length === 8) {
    console.log(`✅ [Category Test] All 8 required categories verified.`);
    passed++;
  } else {
    console.error(`❌ [Category Test] Expected 8 categories, found ${categories.length}`);
    failed++;
  }

  // 2. Verify Articles
  const articles = await db.getArticles();
  if (articles.length >= 20) {
    console.log(`✅ [Articles Test] Verified ${articles.length} sample articles (minimum 20 required).`);
    passed++;
  } else {
    console.error(`❌ [Articles Test] Expected at least 20 articles, found ${articles.length}`);
    failed++;
  }

  // 3. Verify Predefined Questions
  console.log('\n--- Evaluating Predefined Test Questions ---');
  for (let i = 0; i < PREDEFINED_TEST_QUESTIONS.length; i++) {
    const item = PREDEFINED_TEST_QUESTIONS[i];
    const res = await AiProviderService.answerQuestion(item.question, 'builtin');

    if (item.expectedArticleSlug === 'none') {
      // Fallback assertion
      if (res.isFallback && res.answer.includes("I couldn't find a reliable answer")) {
        console.log(`✅ [Q${i + 1} Out-of-Scope Fallback] "${item.question.slice(0, 35)}..." -> Safe fallback triggered`);
        passed++;
      } else {
        console.error(`❌ [Q${i + 1} Out-of-Scope Fallback] Expected fallback, got: ${res.answer}`);
        failed++;
      }
    } else {
      const match = res.sources.find((s) => s.slug === item.expectedArticleSlug);
      if (match && !res.isFallback) {
        console.log(`✅ [Q${i + 1} Positive Grounding] "${item.question.slice(0, 35)}..." -> Cited: "${match.title}"`);
        passed++;
      } else {
        console.error(`❌ [Q${i + 1} Positive Grounding] Missing citation for "${item.expectedArticleSlug}"`);
        failed++;
      }
    }
  }

  // 4. Verify Dashboard Metrics
  const stats = await db.getDashboardStats();
  if (stats.totalActiveArticles > 0) {
    console.log(`\n✅ [Analytics Test] Live dashboard calculated metrics successfully: ${stats.totalActiveArticles} active articles.`);
    passed++;
  } else {
    console.error(`❌ [Analytics Test] Dashboard stats failed.`);
    failed++;
  }

  console.log('\n======================================================');
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runCliTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
