import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Shield, KeyRound, ArrowRight, CheckCircle2, UserCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, setCurrentUser, addNotification } = useApp();
  
  const [email, setEmail] = useState('alex.rivera@apexstudio.io');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Find matching user or fallback to Owner
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users[0];
      setCurrentUser(found);
      addNotification(`Welcome back, ${found.name}! Signed in as ${found.role}.`, 'success');
      navigate('/admin');
    }, 450);
  };

  const handleQuickPersonaSelect = (userIndex: number) => {
    const selected = users[userIndex];
    if (selected) {
      setEmail(selected.email);
      setCurrentUser(selected);
      addNotification(`Selected persona: ${selected.name} (${selected.role})`, 'info');
      setTimeout(() => {
        navigate('/admin');
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden py-12">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-sky-500/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-[130px]" />
      </div>

      {/* Top Studio Logo */}
      <div className="mb-8 text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Apex<span className="text-sky-400">Studio</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                PROTOTYPE
              </span>
            </div>
            <span className="text-xs text-slate-400">Admin Authentication Portal</span>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-8 relative z-10 backdrop-blur-xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>Mock Developer Access</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in using mock credentials or select a quick persona to test permission policies.
          </p>
        </div>

        {/* Quick Persona Picker (Essential for prototype demonstration) */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>1-Click Test Personas:</span>
            <span className="text-sky-400">Instant Switch</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickPersonaSelect(0)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-left text-xs transition-colors border border-slate-800/80 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white">Alex Rivera</span>
                <span className="text-[10px] text-slate-400">(Owner)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold group-hover:underline">All Access</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersonaSelect(1)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-left text-xs transition-colors border border-slate-800/80 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="font-semibold text-white">Marcus Vance</span>
                <span className="text-[10px] text-slate-400">(Developer)</span>
              </div>
              <span className="text-[10px] text-sky-400 font-semibold group-hover:underline">Code ON • Deploy OFF</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersonaSelect(3)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-left text-xs transition-colors border border-slate-800/80 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-semibold text-white">David Kim</span>
                <span className="text-[10px] text-slate-400">(Content Mgr)</span>
              </div>
              <span className="text-[10px] text-amber-400 font-semibold group-hover:underline">Code Locked</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              placeholder="name@apexstudio.io"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <span className="text-[10px] text-slate-500">Any password accepted</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Return to Public Showcase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
};
