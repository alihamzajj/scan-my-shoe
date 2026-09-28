import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Users, 
  Code2, 
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';

export const AdminHeader: React.FC = () => {
  const { currentUser, users, setCurrentUser, addNotification } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Studio Overview';
    if (location.pathname.startsWith('/admin/projects/new')) return 'Add New Application';
    if (location.pathname.includes('/edit')) return 'Edit Application Details';
    if (location.pathname.startsWith('/admin/projects')) return 'Project Portfolio Manager';
    if (location.pathname.startsWith('/admin/users')) return 'Developer Permissions & Roles';
    if (location.pathname.startsWith('/admin/code')) return 'Cloud Code Editor';
    if (location.pathname.startsWith('/admin/settings')) return 'Studio Settings & API Keys';
    return 'Admin Console';
  };

  const handleSignOut = () => {
    addNotification('Logged out from Admin Console', 'info');
    navigate('/admin/login');
  };

  return (
    <header className="h-16 px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-30 shrink-0">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-white tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Tools & Fast Persona Switcher */}
      <div className="flex items-center gap-4">
        
        {/* FAST PERSONA SWITCHER - Crucial for testing prototype permissions! */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-sky-500/50 text-slate-200 text-xs font-medium transition-all shadow-sm"
          >
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-6 h-6 rounded-lg object-cover" 
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${currentUser.permissions.codeEditor ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-semibold block text-slate-100">{currentUser.name}</span>
              <span className="text-[10px] text-sky-400">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Test permission states in real time
                </p>
              </div>

              <div className="py-1 space-y-1">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      user.id === currentUser.id 
                        ? 'bg-sky-500/15 text-sky-300 font-semibold' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium text-slate-200">{user.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <span>{user.role}</span>
                          <span>•</span>
                          <span className={user.permissions.codeEditor ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                            {user.permissions.codeEditor ? 'Code: ON' : 'Code: OFF'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {user.id === currentUser.id && (
                      <Check className="w-4 h-4 text-sky-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 mt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out to Login Screen</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-white">System Events</span>
                <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">Live Mock</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <p className="font-medium text-slate-200">Production Build Passed</p>
                  <p className="text-[11px] text-slate-400">ShoeCheck v3.2.1 passed iOS App Store verification.</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <p className="font-medium text-slate-200">Role Policy Updated</p>
                  <p className="text-[11px] text-slate-400">Owner enabled Code Editor permissions for Developer team.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
