import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Code2, 
  Settings, 
  ExternalLink, 
  Lock, 
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSidebar: React.FC = () => {
  const { currentUser } = useApp();
  const hasCodeEditor = currentUser.permissions.codeEditor;

  const navItems = [
    {
      name: 'Overview',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
      allowed: true,
    },
    {
      name: 'Projects',
      path: '/admin/projects',
      icon: FolderKanban,
      exact: false,
      allowed: currentUser.permissions.viewProjects,
    },
    {
      name: 'Team & Permissions',
      path: '/admin/users',
      icon: Users,
      exact: false,
      allowed: true,
    },
    {
      name: 'Code Editor',
      path: '/admin/code',
      icon: Code2,
      exact: false,
      allowed: hasCodeEditor,
      lockedNotice: !hasCodeEditor ? 'Code Editor disabled for role' : undefined,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      exact: false,
      allowed: true,
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand & Studio info */}
        <div className="p-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-white tracking-tight">ApexStudio</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Control Hub</span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="px-3 py-6 space-y-1.5">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            if (!item.allowed && item.path === '/admin/code') {
              // Show as Locked item
              return (
                <div
                  key={item.path}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 bg-slate-900/40 border border-transparent cursor-not-allowed opacity-75 group"
                  title="Code Editor permission disabled for this user"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom User Persona info & Back to site */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Active persona pill */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700" 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                {currentUser.role}
              </span>
              <span className={`text-[10px] ${hasCodeEditor ? 'text-emerald-400' : 'text-slate-500'}`}>
                {hasCodeEditor ? 'Code: ON' : 'Code: OFF'}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          <span>View Public Showcase</span>
        </Link>
      </div>
    </aside>
  );
};
