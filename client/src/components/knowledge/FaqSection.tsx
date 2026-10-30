// client/src/components/knowledge/FaqSection.tsx
import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  onAskAi: (question: string) => void;
}

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Billing',
    question: 'Where can I find and download my VAT/tax invoice?',
    answer:
      'All invoices are available in your customer account under "Billing & Plans > Invoice History". You can download PDF statements anytime with complete tax breakdowns.',
  },
  {
    category: 'Orders',
    question: 'How long do I have to cancel an order after placing it?',
    answer:
      'Orders can be cancelled directly within 30 minutes of purchase from "My Account > Orders". After 30 minutes, items enter automated batching and can be returned via our standard Returns Center once received.',
  },
  {
    category: 'Returns',
    question: 'What is the return window and who pays for return shipping?',
    answer:
      'SupportMind offers a 30-day return window from the confirmed delivery date. We provide prepaid return shipping labels with zero restocking fees for eligible items in original condition.',
  },
  {
    category: 'Security',
    question: 'How does SupportMind AI protect my account data and privacy?',
    answer:
      'We comply fully with GDPR and CCPA standards. Customer support interactions and documentation are encrypted at rest with AES-256 and are never used to train public foundation models.',
  },
  {
    category: 'Technical',
    question: 'What should I do if the web portal is not loading?',
    answer:
      'Clear your browser cache and cookies for the past 24 hours, test in an Incognito window, or flush your local DNS cache with ipconfig /flushdns. You can also monitor status.supportmind.ai for planned maintenance.',
  },
];

export const FaqSection: React.FC<FaqSectionProps> = ({ onAskAi }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 bg-slate-100/50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Quick answers to our most common customer inquiries. Click any question or ask our AI assistant for instant, personalized guidance.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p>{faq.answer}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => onAskAi(faq.question)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Ask AI Assistant about this</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
