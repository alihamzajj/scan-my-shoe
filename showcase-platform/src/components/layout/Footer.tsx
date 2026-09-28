import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Heart, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 text-slate-400 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-sky-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Apex<span className="text-sky-400">Studio</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We engineer category-defining Android and iOS mobile applications combining on-device computer vision, reactive state architectures, and intuitive micro-interactions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Apps Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Featured Apps
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/projects/shoecheck" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  ShoeCheck AI
                </Link>
              </li>
              <li>
                <Link to="/projects/foodai" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  FoodAI Nutritionist
                </Link>
              </li>
              <li>
                <Link to="/projects/pulsefit-tracker" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  PulseFit Pro
                </Link>
              </li>
              <li>
                <Link to="/projects/brainwave-ai" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  BrainWave Study
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sky-400 hover:underline pt-1 inline-block">
                  All 7 Applications →
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About the Studio</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">App Portfolio</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Support</Link></li>
              <li>
                <a href="#technologies" className="hover:text-white transition-colors">
                  Technology Stack
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Prototype Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Developer Portal
            </h4>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Shield className="w-4 h-4 text-sky-400" />
                <span>Admin Studio</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Access the internal developer workspace, code editor sandbox, and project management.
              </p>
              <Link
                to="/admin/login"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
              >
                <span>Launch Admin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Apex Mobile Studios Inc. High-Fidelity Frontend Prototype.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Vite 8 • React 19 • Tailwind CSS
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
