// client/src/components/knowledge/ContactSection.tsx
import React, { useState } from 'react';
import { Mail, Clock, MessageSquare, CheckCircle, Send, Shield } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Need Further Assistance?</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Contact Our Support Team
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                If our AI assistant or knowledge base hasn't fully answered your question, our human support specialists are standing by to help.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email Help Desk</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Direct tickets to support@supportmind.ai</p>
                  <span className="text-[11px] font-semibold text-blue-600 mt-1 inline-block">Guaranteed reply under 4 hours</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Live Support Hours</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Monday – Friday: 8:00 AM – 8:00 PM EST</p>
                  <p className="text-xs text-slate-500">Saturday – Sunday: 9:00 AM – 5:00 PM EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Enterprise SLA Escalation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Dedicated phone hotline for 99.9% uptime enterprise partners.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
            {submitted ? (
              <div className="text-center py-12">
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ticket Successfully Dispatched!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
                  Thank you for contacting us. A support representative has been notified and will reach out to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">Submit a Support Ticket</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Johnson"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Issue Summary</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Inquiring regarding invoice tax deduction"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Describe Your Issue</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide relevant details, error codes, or order numbers..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Protected by SupportMind enterprise encryption.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
