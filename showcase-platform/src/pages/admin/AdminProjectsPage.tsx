import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Apple, 
  Star, 
  ExternalLink,
  Layers,
  Sparkles,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export const AdminProjectsPage: React.FC = () => {
  const { projects, deleteProject, toggleProjectPublish, toggleProjectFeatured } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Project Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish, edit, and orchestrate releases for all mobile apps in the studio catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Project</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, category, or stack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredProjects.length}</span> of {projects.length} projects
        </div>
      </div>

      {/* View: Table Mode */}
      {viewMode === 'table' ? (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">App Name & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Platforms</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* App Logo & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={project.logo} 
                          alt={project.name} 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs hover:text-sky-400 transition-colors">
                            {project.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {project.tagline}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-300 font-medium">
                      {project.category}
                    </td>

                    {/* Platforms */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {project.platforms.includes('iOS') && (
                          <span className="p-1 rounded bg-slate-800 text-slate-300" title="iOS">
                            <Apple className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {project.platforms.includes('Android') && (
                          <span className="p-1 rounded bg-slate-800 text-emerald-400" title="Android">
                            <Smartphone className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{project.platforms}</span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleProjectPublish(project.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                          project.published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleProjectFeatured(project.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.featured
                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {project.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${project.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Live Public Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setProjectToDelete(project.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View: Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800" />
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      project.published 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => toggleProjectFeatured(project.id)}
                      className={project.featured ? 'text-amber-400' : 'text-slate-600'}
                    >
                      <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{project.name}</h3>
                <p className="text-xs text-sky-400 font-medium mb-1">{project.category}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{project.shortDescription}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{project.platforms}</span>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setProjectToDelete(project.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <Modal
          isOpen={!!projectToDelete}
          onClose={() => setProjectToDelete(null)}
          title="Delete Project?"
          subtitle="Are you sure you want to remove this application from the studio catalog?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-400 leading-relaxed">
              This action will remove the project from the public showcase and admin portfolio listings. You can test adding it back anytime.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
