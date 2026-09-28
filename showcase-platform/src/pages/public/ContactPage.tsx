import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'App Support / Feedback',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are your mobile apps available globally?',
      a: 'Yes! All apps released on Apple App Store and Google Play are localized and available across 150+ countries with regional currency conversions.'
    },
    {
      q: 'How does ShoeCheck AI verify authenticity?',
      a: 'ShoeCheck utilizes computer vision models trained on over 2.5 million verified sneaker pairs. It scans stitch count, box typography, UV ink markers, and RFID frequency chips.'
    },
    {
      q: 'Do your apps sell user biometrics or location telemetry?',
      a: 'Never. All biometric data and LiDAR measurements are processed directly on your device enclave and discarded after inference.'
    },
    {
      q: 'Can third-party developers integrate with your APIs?',
      a: 'We offer partner SDKs for ShoeCheck verification and FoodAI macro classification. Contact our partnerships team below for API credentials.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addNotification('Message transmitted! Our studio team will get back to you shortly.', 'success');
  };

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Get in Touch with ApexStudio
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-normal">
          Have questions about our apps, technical architecture, or enterprise partnerships? Send us a message or reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-400" />
            <span>Send a Direct Message</span>
          </h3>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Thank you for contacting us!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your message has been received by our mobile engineering leads. We typically reply within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'App Support / Feedback', message: '' });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Rivera"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option>App Support / Bug Report</option>
                  <option>Enterprise SDK & API Licensing</option>
                  <option>Press & Media Relations</option>
                  <option>Careers & Engineering Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your inquiry..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry (Mock Action)</span>
              </button>
            </form>
          )}
        </div>

        {/* Studio Contacts & Locations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Direct Communication</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Engineering Support</div>
                  <div className="text-slate-400">engineering@apexstudio.io</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Direct Studio Line</div>
                  <div className="text-slate-400">+1 (800) 555-APEX</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Studio Headquarters</div>
                  <div className="text-slate-400">548 Market St, Suite 39201, San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Response SLA badge */}
          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Support dispatch SLA: under 2 hours during US & EU market windows.</span>
          </div>
        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-sky-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
