import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDarkTheme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      className={`p-2 rounded-xl border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-sm ${className}`}
      title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
    </button>
  );
};
