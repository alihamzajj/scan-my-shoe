import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckCircle, 
  Smartphone, 
  Apple, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Code2, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const { projects, users, activities, currentUser } = useApp();

  const totalProjects = projects.length;
  const publishedProjects = projects.filter(p => p.published).length;
  const androidApps = projects.filter(p => p.platforms.includes('Android')).length;
  const iosApps = projects.filter(p => p.platforms.includes('iOS')).length;
  const totalDevelopers = users.filter(u => u.role === 'Developer' || u.role === 'Owner').length;

  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Published Projects', value: publishedProjects, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Android Apps', value: androidApps, icon: Smartphone, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'iOS Apps', value: iosApps, icon: Apple, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Total Developers', value: totalDevelopers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900/40 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Active Session: {currentUser.role}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Mock
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            You are managing ApexStudio's mobile catalog. Code Editor permissions are currently{' '}
            <strong className={currentUser.permissions.codeEditor ? 'text-emerald-400' : 'text-amber-400'}>
              {currentUser.permissions.codeEditor ? 'ENABLED' : 'DISABLED'}
            </strong> for your role.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Project</span>
          </Link>

          {currentUser.permissions.codeEditor && (
            <Link
              to="/admin/code"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Open Code Editor</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{s.label}</span>
                <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Simulated Analytics & Platform Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Chart: Monthly Downloads Trend */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Monthly Downloads Growth (2026)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated App Store & Google Play Telemetry</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+34.2% MoM</span>
            </div>
          </div>

          {/* SVG Bar Chart with glowing heights */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {[
              { month: 'Apr', val: 42, count: '320k' },
              { month: 'May', val: 56, count: '450k' },
              { month: 'Jun', val: 68, count: '540k' },
              { month: 'Jul', val: 80, count: '690k' },
              { month: 'Aug', val: 92, count: '810k' },
              { month: 'Sep', val: 100, count: '940k' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-sky-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.count}
                </span>
                <div 
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-500 group-hover:to-cyan-300 transition-all duration-300 shadow-lg shadow-sky-500/20"
                  style={{ height: `${bar.val * 1.6}px` }}
                />
                <span className="text-xs text-slate-400 font-medium">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Peak Month: September (ShoeCheck v3.2.1 Launch)</span>
            <span className="font-semibold text-white">Total: 5.8M+ Downloads</span>
          </div>
        </div>

        {/* Right Chart: Platform Distribution */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Platform Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Device Operating System Split</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Apple className="w-3.5 h-3.5" /> iOS (Apple App Store)
                </span>
                <span className="font-bold text-sky-400">58%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full w-[58%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Android (Google Play)
                </span>
                <span className="font-bold text-emerald-400">42%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[42%]" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
            <span className="font-semibold text-white block">Engine Consistency</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Cross-platform code reuse between iOS and Android currently averages 89.4% with native platform shims.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Projects & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Projects Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Projects</h3>
            <Link to="/admin/projects" className="text-xs text-sky-400 hover:underline font-semibold">
              Manage All ({projects.length}) →
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-x-auto">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={project.logo} alt={project.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-white truncate">{project.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{project.category}</span>
                      <span>•</span>
                      <span>{project.platforms}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    project.published 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                  
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
                    title="Edit project"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Recent Activity Feed</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time Mock</span>
          </div>

          <div className="space-y-3.5">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <img src={act.avatar} alt={act.user} className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-800 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="text-slate-300">
                    <strong className="text-white font-semibold">{act.user}</strong> {act.action}
                  </div>
                  <div className="text-[11px] text-sky-400 font-medium truncate mt-0.5">
                    {act.target}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{act.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
