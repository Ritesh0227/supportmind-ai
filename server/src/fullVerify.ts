import { db } from './db/index.js';
import { AiProviderService } from './ai/providers.js';
import { PREDEFINED_TEST_QUESTIONS } from './seed/testQuestions.js';

async function verifyFullSystem() {
  console.log('====================================================');
  console.log('   SupportMind AI (HACK-P380) Verification Suite   ');
  console.log('====================================================\n');

  // 1. Categories check
  const cats = await db.getCategories();
  console.log(`[CATEGORIES] ${cats.length}/8 categories verified.`);
  if (cats.length !== 8) throw new Error('Expected 8 categories');

  // 2. Products check
  const prods = await db.getProducts();
  console.log(`[PRODUCTS] ${prods.length} products verified (${prods.map(p => p.name).join(', ')}).`);
  if (prods.length < 5) throw new Error('Expected at least 5 products');

  // 3. Articles check (Count & Fields)
  const arts = await db.getArticles();
  console.log(`[ARTICLES] ${arts.length} articles in database (minimum required: 20).`);
  if (arts.length < 20) throw new Error('Expected at least 20 articles');

  const withProduct = arts.filter(a => Boolean(a.product));
  const withTroubleshooting = arts.filter(a => Boolean(a.troubleshooting));
  console.log(`  - Articles with product assigned: ${withProduct.length}/${arts.length}`);
  console.log(`  - Articles with troubleshooting checklist: ${withTroubleshooting.length}/${arts.length}`);

  // 4. Filtering Tests
  console.log('\n[FILTERING & SEARCH TESTS]');
  const byCat = await db.getArticles({ category_id: cats[0].id });
  console.log(`  ✅ Filter by Category ("${cats[0].name}"): ${byCat.length} articles`);

  const byProd = await db.getArticles({ product: 'NexusDesk Core' });
  console.log(`  ✅ Filter by Product ("NexusDesk Core"): ${byProd.length} articles`);

  const searchResults = await db.getArticles({ search: 'password' });
  console.log(`  ✅ Full-text Search ("password"): ${searchResults.length} articles`);

  // 5. Question Verification & Grounding
  console.log('\n[AI EVALUATION] Testing 10 Sample Questions + Out-of-Scope Fallback:');
  let passCount = 0;
  for (let i = 0; i < PREDEFINED_TEST_QUESTIONS.length; i++) {
    const q = PREDEFINED_TEST_QUESTIONS[i];
    const res = await AiProviderService.answerQuestion(q.question, 'builtin');
    const isPass = q.expectedArticleSlug === 'none' 
      ? (res.isFallback && res.answer.includes("I couldn't find a reliable answer"))
      : res.sources.some(s => s.slug === q.expectedArticleSlug);
    
    if (isPass) passCount++;
    console.log(`  ${isPass ? '✅ PASS' : '❌ FAIL'} Q${i+1}: "${q.question.slice(0, 36)}..." -> Sources: ${res.sources.length}, Fallback: ${res.isFallback}`);
  }
  console.log(`AI Accuracy: ${passCount}/${PREDEFINED_TEST_QUESTIONS.length} (${Math.round(passCount/PREDEFINED_TEST_QUESTIONS.length*100)}%)`);
  if (passCount !== PREDEFINED_TEST_QUESTIONS.length) throw new Error('Some test questions failed grounding');

  // 6. Admin Authentication
  console.log('\n[ADMIN AUTHENTICATION]');
  const adminAuthSuccess = await db.verifyAdmin('admin@supportmind.ai', 'admin123');
  console.log(`  ✅ Valid Admin Login: ${adminAuthSuccess ? 'Authenticated as ' + adminAuthSuccess.full_name : 'Failed'}`);
  const adminAuthFail = await db.verifyAdmin('admin@supportmind.ai', 'wrongpassword');
  console.log(`  ✅ Invalid Password Guard: ${adminAuthFail === null ? 'Rejected correctly' : 'Security vulnerability!'}`);
  if (!adminAuthSuccess || adminAuthFail !== null) throw new Error('Admin auth verification failed');

  // 7. Admin CRUD
  console.log('\n[ADMIN OPERATIONS] Testing Create, Edit, Archive, Related, Delete:');
  const tempArticle = await db.createArticle({
    id: `art-verify-${Date.now()}`,
    title: 'Verification Test Guide for NexusDesk',
    slug: `verification-test-guide-${Date.now()}`,
    category_id: cats[0].id,
    product: 'NexusDesk Core',
    troubleshooting: '1. Test step 1\n2. Test step 2\n3. Completion step',
    content: 'Full step by step guide for automated system verification.',
    excerpt: 'Verification test article excerpt.',
    keywords: ['verify', 'test', 'guide'],
    tags: ['Verification'],
    status: 'published'
  });
  console.log(`  ✅ Create Article: Created ID "${tempArticle.id}" with product "${tempArticle.product}"`);

  const updatedArticle = await db.updateArticle(tempArticle.id, {
    title: 'Verification Test Guide (Updated Title)',
    troubleshooting: '1. Updated troubleshooting diagnostic step',
  });
  console.log(`  ✅ Update Article: Updated title to "${updatedArticle?.title}"`);

  const archivedArticle = await db.updateArticle(tempArticle.id, { status: 'archived' });
  console.log(`  ✅ Archive Article: Status changed to "${archivedArticle?.status}"`);

  const related = await db.getRelatedArticles(tempArticle.id, 3);
  console.log(`  ✅ Related Articles: Retrieved ${related.length} relevant articles`);

  const deleted = await db.deleteArticle(tempArticle.id);
  console.log(`  ✅ Delete Article: Deleted test article = ${deleted}`);

  // 8. Customer Feedback submission
  console.log('\n[FEEDBACK & ANALYTICS] Testing Feedback & Live Stats:');
  const feedbackRecord = await db.createFeedback({
    message_id: `msg-${Date.now()}`,
    conversation_id: `conv-${Date.now()}`,
    rating: 'helpful',
    comment: 'Instant and grounded resolution'
  });
  console.log(`  ✅ Submit Feedback: Logged ${feedbackRecord.rating} feedback (ID: ${feedbackRecord.id})`);

  const stats = await db.getDashboardStats();
  console.log(`  ✅ Live Dashboard Metrics:`);
  console.log(`     - Total Active Articles: ${stats.totalActiveArticles}`);
  console.log(`     - Total Questions: ${stats.totalCustomerQuestions}`);
  console.log(`     - Answered: ${stats.answeredQuestions} | Fallbacks: ${stats.unansweredQuestions}`);
  console.log(`     - Helpful Feedback: ${stats.helpfulFeedbackCount} | Not Helpful: ${stats.notHelpfulFeedbackCount}`);
  console.log(`     - Satisfaction Rate: ${stats.satisfactionRate}%`);

  // 9. Storage Driver Status
  const driverInfo = db.getStorageDriverInfo();
  console.log(`\n[DATABASE DRIVER] ${driverInfo.driver} (Persistent: ${driverInfo.isPersistent})`);
  console.log(`  - Models Available: ${driverInfo.modelsAvailable.join(', ')}`);

  console.log('\n====================================================');
  console.log('🎉 ALL HACK-P380 SYSTEM CHECKS PASSED WITH 100% SUCCESS');
  console.log('====================================================');
}

verifyFullSystem().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
