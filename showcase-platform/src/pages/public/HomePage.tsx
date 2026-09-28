import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  Download, 
  Smartphone, 
  CheckCircle, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Zap, 
  Apple, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../../components/common/AppCard';
import { DeviceMockup } from '../../components/common/DeviceMockup';

export const HomePage: React.FC = () => {
  const { projects } = useApp();
  const featuredProjects = projects.filter(p => p.featured && p.published);
  const latestProjects = projects.filter(p => p.published).slice(0, 6);

  const [activeHeroApp, setActiveHeroApp] = useState<'shoecheck' | 'foodai' | 'pulsefit'>('shoecheck');

  const heroAppDetails = {
    shoecheck: {
      name: 'ShoeCheck AI',
      category: 'AI Computer Vision',
      tagline: 'Instant Sneaker Legit-Check & Condition Analyzer',
      stats: '850K+ Downloads • 4.9 ★',
      img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
      accent: '#f97316',
      id: 'shoecheck',
    },
    foodai: {
      name: 'FoodAI Nutritionist',
      category: 'Computer Vision Health',
      tagline: 'Snap your meal to auto-calculate macros & calories',
      stats: '1.4M+ Downloads • 4.8 ★',
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      accent: '#10b981',
      id: 'foodai',
    },
    pulsefit: {
      name: 'PulseFit Pro',
      category: 'Bio-Sensor Fitness',
      tagline: 'Adaptive HIIT training with wearable heart rate telemetry',
      stats: '920K+ Downloads • 4.9 ★',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      accent: '#ec4899',
      id: 'pulsefit-tracker',
    },
  };

  const techStack = [
    { name: 'Flutter & Dart', category: 'Cross-Platform Framework', desc: 'Single-codebase native performance across iOS and Android with 120 FPS rendering.' },
    { name: 'Swift & SwiftUI', category: 'Apple Native', desc: 'Hardware-accelerated Metal pipelines, CoreML neural models, and Live Activities.' },
    { name: 'Kotlin Multiplatform', category: 'Android & Shared Logic', desc: 'Jetpack Compose and modern reactive architecture with coroutines.' },
    { name: 'TensorFlow Lite & CoreML', category: 'On-Device AI Engine', desc: 'Sub-50ms offline inference models for object detection, segmentation, and OCR.' },
    { name: 'FastAPI & Python', category: 'Microservices', desc: 'Asynchronous cloud pipelines for batch model retraining and telemetry sync.' },
    { name: 'Supabase & SQLite', category: 'Data & Sync', desc: 'Local-first encrypted SQLite storage with real-time distributed sync.' },
  ];

  return (
    <div className="relative overflow-hidden">
      
      {/* Dynamic Ambient Background Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-[550px] h-[550px] bg-sky-500/15 rounded-full blur-[140px]" />
        <div className="absolute -top-20 right-1/4 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px]" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Mobile Engineering Studio • 2026 Production Catalog</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Building Mobile Apps That <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Redefine Daily Habits</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              We design, engineer, and publish top-ranked iOS and Android applications. From computer vision sneaker legit-checks to real-time AI nutrition calculators, our apps have delighted over 5.8 million users worldwide.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#featured"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
              >
                <span>Explore Our Apps</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/projects"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-slate-600 flex items-center justify-center gap-2 transition-all"
              >
                <span>Browse Marketplace</span>
              </Link>
            </div>

            {/* Metrics Ticker */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">5.8M+</div>
                <div className="text-xs text-slate-400 mt-0.5">App Store Downloads</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">4.86 ★</div>
                <div className="text-xs text-slate-400 mt-0.5">Average Store Rating</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">7+</div>
                <div className="text-xs text-slate-400 mt-0.5">Shipped Apps</div>
              </div>
            </div>

          </div>

          {/* Right Interactive Mockup Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Interactive Hero Tab Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 shadow-lg">
              <button
                onClick={() => setActiveHeroApp('shoecheck')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeHeroApp === 'shoecheck' 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ShoeCheck AI
              </button>
              <button
                onClick={() => setActiveHeroApp('foodai')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeHeroApp === 'foodai' 
                    ? 'bg-emerald-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FoodAI
              </button>
              <button
                onClick={() => setActiveHeroApp('pulsefit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeHeroApp === 'pulsefit' 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                PulseFit Pro
              </button>
            </div>

            {/* Smartphone Display Mockup */}
            <div className="relative group">
              <DeviceMockup
                appName={heroAppDetails[activeHeroApp].name}
                tagline={heroAppDetails[activeHeroApp].tagline}
                category={heroAppDetails[activeHeroApp].category}
                imageSrc={heroAppDetails[activeHeroApp].img}
                accentColor={heroAppDetails[activeHeroApp].accent}
              />

              <div className="mt-4 text-center">
                <Link
                  to={`/projects/${heroAppDetails[activeHeroApp].id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Inspect {heroAppDetails[activeHeroApp].name} specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. FEATURED APPS SECTION */}
      <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
              <Zap className="w-4 h-4" />
              <span>Flagship Productions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Mobile Applications
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              High-impact solutions with custom ML pipelines and responsive cross-platform architectures.
            </p>
          </div>
          <Link
            to="/projects"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors group"
          >
            <span>View All Apps ({projects.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <AppCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 3. LATEST PROJECTS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60 bg-slate-900/30 rounded-3xl my-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Portfolio Catalog
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Explore All Studio Releases
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every application engineered to Google Material You and Apple Human Interface Guidelines standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestProjects.map((project) => (
            <AppCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 4. TECHNOLOGIES & ARCHITECTURE SECTION */}
      <section id="technologies" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Modern Engineering Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built with World-Class Mobile Technologies
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            We reject bloated hybrid shells. Every project is built using native platform APIs or optimized Flutter/KMP pipelines with on-device tensor cores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech) => (
            <div 
              key={tech.name} 
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all hover:-translate-y-1 shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 text-sky-400">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                {tech.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                {tech.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-purple-600/30 border border-white/10 p-10 sm:p-16 text-center shadow-2xl backdrop-blur-md">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Experience Our Apps?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Download our mobile apps today directly on the Apple App Store and Google Play Store, or access the developer studio to review our architecture.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/projects"
                className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl transition-all hover:scale-105"
              >
                Browse All 7 Applications
              </Link>
              <Link
                to="/admin/login"
                className="px-8 py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 text-white font-semibold text-sm border border-white/20 flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Launch Admin Console</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
