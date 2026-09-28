import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Check, 
  Key, 
  Code2, 
  Sliders, 
  UserCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, Permissions, UserRole } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminUsersPage: React.FC = () => {
  const { users, currentUser, setCurrentUser, updateUserPermissions, addNotification } = useApp();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Modal local state
  const [modalRole, setModalRole] = useState<UserRole>('Developer');
  const [modalPermissions, setModalPermissions] = useState<Permissions>({
    viewProjects: true,
    addProjects: true,
    editProjects: true,
    codeEditor: true,
    createBranch: true,
    previewChanges: true,
    mergeToProduction: false,
    deployProduction: false,
  });

  const handleOpenPermissions = (user: User) => {
    setSelectedUser(user);
    setModalRole(user.role);
    setModalPermissions({ ...user.permissions });
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      updateUserPermissions(selectedUser.id, modalPermissions, modalRole);
      setSelectedUser(null);
    }
  };

  const permissionItems: { key: keyof Permissions; label: string; desc: string }[] = [
    { key: 'viewProjects', label: 'View Projects', desc: 'Allows viewing of public and private app specs' },
    { key: 'addProjects', label: 'Add Projects', desc: 'Can register new mobile applications in catalog' },
    { key: 'editProjects', label: 'Edit Projects', desc: 'Can modify project metadata, screenshots, and URLs' },
    { key: 'codeEditor', label: 'Code Editor Access', desc: 'Enables developer IDE sandbox tab (/admin/code)' },
    { key: 'createBranch', label: 'Create Branch', desc: 'Allows branching feature pipelines in mock IDE' },
    { key: 'previewChanges', label: 'Preview Changes', desc: 'Can generate and inspect live preview artifacts' },
    { key: 'mergeToProduction', label: 'Merge to Production', desc: 'Permission to merge branches into main' },
    { key: 'deployProduction', label: 'Deploy Production', desc: 'Trigger App Store / Google Play production release' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Developer Permission Matrix</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Team Members & Code Access
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Granular role-based access control. Toggle <strong>Code Editor</strong> or <strong>Deploy</strong> permissions to see immediate enforcement in the interface.
          </p>
        </div>

        {/* Current Active Persona Reminder */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-xl object-cover" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Logged in persona:</span>
            <span className="font-bold text-white">{currentUser.name} ({currentUser.role})</span>
          </div>
        </div>
      </div>

      {/* Instructional Callout */}
      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Prototype Testing Guide:</span>
          <p className="text-[11px] leading-relaxed text-sky-300">
            Click <strong>"Configure Permissions"</strong> for any developer or content manager below. Try toggling <strong>Code Editor</strong> OFF to lock their code access, or toggle <strong>Deploy Production</strong> ON/OFF. Then click <strong>"Simulate as User"</strong> to experience that persona's exact dashboard view!
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">User / Developer</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-4">Code Access Status</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {users.map((user) => {
                const isCurrent = user.id === currentUser.id;
                const hasCode = user.permissions.codeEditor;

                return (
                  <tr key={user.id} className={`hover:bg-slate-800/40 transition-colors ${isCurrent ? 'bg-sky-500/5' : ''}`}>
                    
                    {/* User Identity */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{user.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500 text-slate-950">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold ${
                        user.role === 'Owner' 
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : user.role === 'Developer'
                          ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {user.status}
                      </span>
                    </td>

                    {/* Code Access Badge */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {hasCode ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Code2 className="w-3 h-3" />
                            {user.permissions.deployProduction ? 'Full Access' : 'Code Access (No Deploy)'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Lock className="w-3 h-3" />
                            Locked (No Code)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {user.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenPermissions(user)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Sliders className="w-3.5 h-3.5 text-sky-400" />
                          <span>Permissions</span>
                        </button>

                        <button
                          onClick={() => setCurrentUser(user)}
                          disabled={isCurrent}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isCurrent
                              ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed'
                              : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold'
                          }`}
                        >
                          {isCurrent ? 'Active Persona' : 'Simulate User'}
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Drawer / Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Configure Permissions: ${selectedUser.name}`}
          subtitle={`${selectedUser.email} • ID: ${selectedUser.id}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-6 pt-2">
            
            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Assigned Role
              </label>
              <select
                value={modalRole}
                onChange={(e) => setModalRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Owner">Owner (Administrative Executive)</option>
                <option value="Developer">Developer (Engineering & Code Access)</option>
                <option value="Editor">Editor (Release Notes & Copy)</option>
                <option value="Content Manager">Content Manager (Storefront Assets)</option>
              </select>
            </div>

            {/* Permissions Checkbox Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Granular Permissions Policy
                </span>
                <span className="text-[10px] text-sky-400">Instant State Sync</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permissionItems.map((item) => {
                  const isChecked = modalPermissions[item.key];
                  const isCodeToggle = item.key === 'codeEditor';
                  const isDeployToggle = item.key === 'deployProduction';

                  return (
                    <label 
                      key={item.key}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-slate-950/80 border-sky-500/40 shadow-sm' 
                          : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setModalPermissions(prev => ({
                            ...prev,
                            [item.key]: e.target.checked
                          }));
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-slate-400'}`}>
                            {item.label}
                          </span>
                          {isCodeToggle && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300">
                              Core
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
              >
                Save Permissions
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
