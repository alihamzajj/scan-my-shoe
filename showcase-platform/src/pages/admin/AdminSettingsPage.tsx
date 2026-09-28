import React, { useState } from 'react';
import { Settings, Key, Shield, Smartphone, Save, Eye, EyeOff, Check, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettingsPage: React.FC = () => {
  const { addNotification } = useApp();

  const [studioName, setStudioName] = useState('Apex Mobile Studios Inc.');
  const [supportEmail, setSupportEmail] = useState('engineering@apexstudio.io');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('apex_live_sec_9948201a884fbc901e82');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification('Studio settings saved successfully.', 'success');
  };

  const handleRollKey = () => {
    const newKey = 'apex_live_sec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);
    setApiKey(newKey);
    addNotification('Mock API Secret key rolled.', 'info');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Studio Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage mobile studio profile, telemetry credentials, and mock API keys.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Studio Profile */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
            Studio Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Studio Entity</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* API Keys Mock */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
              Mock Developer API Secret Key
            </h3>
            <button
              type="button"
              onClick={handleRollKey}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate Secret Key</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Used for automated CI/CD pipeline triggers and mock binary signing.
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                readOnly
                value={apiKey}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 select-all"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20"
          >
            Save Settings
          </button>
        </div>

      </form>

    </div>
  );
};
