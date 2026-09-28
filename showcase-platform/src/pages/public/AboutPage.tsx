import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Shield, Zap, Sparkles, Heart, Users, Target, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const milestones = [
    { year: '2023', title: 'Studio Founded', desc: 'Started with 2 engineers building computer vision shoe authentication models.' },
    { year: '2024', title: '1 Million Downloads', desc: 'ShoeCheck and FoodAI hit viral milestones on the iOS App Store.' },
    { year: '2025', title: 'Cross-Platform Expansion', desc: 'Migrated architecture to Flutter and Kotlin Multiplatform for unified 120fps physics.' },
    { year: '2026', title: '5.8 Million Active Users', desc: 'Expanded to 7 applications with continuous on-device machine learning inference.' },
  ];

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Obsessed with Mobile Craftsmanship
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Apex Mobile Studio was founded on a simple premise: mobile applications should be blazingly fast, privacy-preserving, and visually unforgettable.
        </p>
      </div>

      {/* Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Sub-50ms On-Device AI</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We don't ship your personal camera feeds to slow cloud servers. Our neural models execute directly on Apple Neural Engine and Qualcomm Hexagon NPUs.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Zero-Compromise Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Biometrics and health telemetry never leave your hardware enclave. Encryption is client-side by default with zero creepy ad SDK trackers.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Fluid 120 FPS Interfaces</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every haptic tap, transition curve, and gesture responds with instantaneous physical weight, matching high refresh rate OLED screens.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          Studio Milestones
        </h2>
        <div className="space-y-6">
          {milestones.map((m, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-black text-sky-400 font-mono">{m.year}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <h4 className="text-base font-bold text-white">{m.title}</h4>
              </div>
              <p className="text-xs text-slate-400 max-w-md">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-white">Explore our live applications</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Try ShoeCheck, FoodAI, or PulseFit Pro on your phone right now.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors"
        >
          <span>View App Showcase Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
