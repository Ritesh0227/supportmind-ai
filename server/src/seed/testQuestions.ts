// server/src/seed/testQuestions.ts
import { TestQuestionExpected } from '../types.js';

export const PREDEFINED_TEST_QUESTIONS: TestQuestionExpected[] = [
  {
    id: 'test-1',
    question: 'How do I reset my password?',
    expectedCategory: 'Account Management',
    expectedArticleSlug: 'how-to-reset-password',
    keyVerificationPoints: [
      'Navigate to Sign In screen',
      'Click Forgot Password link',
      'Enter registered email address',
      'Secure link valid for 60 minutes'
    ]
  },
  {
    id: 'test-2',
    question: 'Where can I find my invoice?',
    expectedCategory: 'Billing and Payments',
    expectedArticleSlug: 'where-to-find-invoice',
    keyVerificationPoints: [
      'Go to Billing & Plans',
      'Scroll to Invoice History section',
      'Click Download PDF button'
    ]
  },
  {
    id: 'test-3',
    question: 'How do I track my order?',
    expectedCategory: 'Orders',
    expectedArticleSlug: 'how-to-track-order',
    keyVerificationPoints: [
      'Check shipping confirmation email for tracking number',
      'Go to My Account > Orders',
      'Click Track Shipment button'
    ]
  },
  {
    id: 'test-4',
    question: 'Can I cancel my order?',
    expectedCategory: 'Orders',
    expectedArticleSlug: 'can-i-cancel-order',
    keyVerificationPoints: [
      'Strict 30-minute automated fulfillment window',
      'Cancel Order button in My Account > Orders',
      'Standard return portal available if window has elapsed'
    ]
  },
  {
    id: 'test-5',
    question: 'Why was my payment declined?',
    expectedCategory: 'Billing and Payments',
    expectedArticleSlug: 'why-was-my-payment-declined',
    keyVerificationPoints: [
      'Address Verification (AVS) ZIP mismatch',
      'Card expiration or incorrect CVV',
      'Bank fraud or 3D Secure OTP timeout',
      'Insufficient funds'
    ]
  },
  {
    id: 'test-6',
    question: 'How do I request a return?',
    expectedCategory: 'Returns and Refunds',
    expectedArticleSlug: 'how-to-request-return',
    keyVerificationPoints: [
      '30-day return window from delivery date',
      'Visit Online Returns Center at /returns',
      'Download prepaid return shipping label'
    ]
  },
  {
    id: 'test-7',
    question: 'When will I receive my refund?',
    expectedCategory: 'Returns and Refunds',
    expectedArticleSlug: 'when-will-i-receive-refund',
    keyVerificationPoints: [
      'Warehouse inspection in 1-2 business days',
      'Bank posting window takes 5 to 7 business days',
      'PayPal / Apple Pay settles in 24 to 48 hours'
    ]
  },
  {
    id: 'test-8',
    question: 'How do I change my email address?',
    expectedCategory: 'Account Management',
    expectedArticleSlug: 'how-to-change-email-address',
    keyVerificationPoints: [
      'Go to Account Settings > Profile & Security',
      'Click Edit Email',
      'Enter 6-digit confirmation code sent to new address'
    ]
  },
  {
    id: 'test-9',
    question: 'My website is not loading. What should I do?',
    expectedCategory: 'Technical Support',
    expectedArticleSlug: 'website-not-loading-troubleshooting',
    keyVerificationPoints: [
      'Clear browser cache and cookies',
      'Test in Private / Incognito mode',
      'Flush local DNS cache (ipconfig /flushdns)',
      'Check system status at status.supportmind.ai'
    ]
  },
  {
    id: 'test-10',
    question: 'How do I contact customer support?',
    expectedCategory: 'Technical Support',
    expectedArticleSlug: 'how-to-contact-customer-support',
    keyVerificationPoints: [
      'Live Chat 24/7 in bottom right corner',
      'Priority email at support@supportmind.ai',
      'Phone/video hours Monday to Friday 8 AM - 8 PM EST'
    ]
  },
  // Negative / Out-of-Scope Test Query
  {
    id: 'test-11-fallback',
    question: 'What is your company policy on flying drones inside commercial passenger airplanes?',
    expectedCategory: 'None (Out of Scope)',
    expectedArticleSlug: 'none',
    keyVerificationPoints: [
      "I couldn't find a reliable answer in our knowledge base. Please contact our support team for further assistance."
    ]
  }
];
