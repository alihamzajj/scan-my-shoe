import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Project, Platform, ProjectCategory } from '../../types';
import { AppCard } from '../../components/common/AppCard';

export const AdminProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { projects, addProject, updateProject, addNotification } = useApp();

  const existingProject = isEditing ? projects.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    shortDescription: '',
    fullDescription: '',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'High-throughput real-time edge processing',
      'Local-first encrypted persistent cache',
      'Haptic feedback integration'
    ],
    technologies: ['Flutter', 'Dart', 'TensorFlow Lite', 'Swift'],
    platforms: 'Android + iOS' as Platform,
    category: 'AI & Computer Vision' as ProjectCategory,
    featured: false,
    published: true,
    playStoreUrl: 'https://play.google.com/store/apps',
    appStoreUrl: 'https://apps.apple.com/app',
    websiteUrl: 'https://example.com',
    githubUrl: 'https://github.com/apex-studio',
    version: '1.0.0',
    size: '42.5 MB',
    minAndroid: 'Android 10.0+',
    minIos: 'iOS 16.0+',
    accentColor: '#38bdf8',
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');

  useEffect(() => {
    if (existingProject) {
      setFormData({
        name: existingProject.name,
        tagline: existingProject.tagline,
        shortDescription: existingProject.shortDescription,
        fullDescription: existingProject.fullDescription,
        logo: existingProject.logo,
        coverImage: existingProject.coverImage,
        screenshots: existingProject.screenshots,
        demoVideoUrl: existingProject.demoVideoUrl,
        features: existingProject.features,
        technologies: existingProject.technologies,
        platforms: existingProject.platforms,
        category: existingProject.category,
        featured: existingProject.featured,
        published: existingProject.published,
        playStoreUrl: existingProject.playStoreUrl,
        appStoreUrl: existingProject.appStoreUrl,
        websiteUrl: existingProject.websiteUrl,
        githubUrl: existingProject.githubUrl,
        version: existingProject.version,
        size: existingProject.size,
        minAndroid: existingProject.minAndroid,
        minIos: existingProject.minIos,
        accentColor: existingProject.accentColor,
      });
    }
  }, [existingProject]);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, newTech.trim()] }));
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
  };

  const handleAddScreenshot = () => {
    if (newScreenshotUrl.trim()) {
      setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, newScreenshotUrl.trim()] }));
      setNewScreenshotUrl('');
    }
  };

  const handleRemoveScreenshot = (idx: number) => {
    setFormData(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addNotification('App name is required', 'error');
      return;
    }

    if (isEditing && id) {
      updateProject(id, formData);
      navigate('/admin/projects');
    } else {
      const created = addProject(formData);
      navigate('/admin/projects');
    }
  };

  // Preview mock project
  const previewProject: Project = {
    id: id || 'preview-id',
    name: formData.name || 'Untitled Application',
    tagline: formData.tagline || 'Modern mobile experience',
    shortDescription: formData.shortDescription || 'Short description of this application...',
    fullDescription: formData.fullDescription || 'Full detailed description...',
    logo: formData.logo,
    coverImage: formData.coverImage,
    screenshots: formData.screenshots,
    demoVideoUrl: formData.demoVideoUrl,
    features: formData.features,
    technologies: formData.technologies,
    platforms: formData.platforms,
    category: formData.category,
    featured: formData.featured,
    published: formData.published,
    playStoreUrl: formData.playStoreUrl,
    appStoreUrl: formData.appStoreUrl,
    websiteUrl: formData.websiteUrl,
    githubUrl: formData.githubUrl,
    rating: 5.0,
    reviewsCount: 1,
    downloads: '100+',
    version: formData.version,
    size: formData.size,
    minAndroid: formData.minAndroid,
    minIos: formData.minIos,
    lastUpdated: 'Just now',
    accentColor: formData.accentColor,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isEditing ? `Edit: ${formData.name || 'Project'}` : 'Create New Project'}
            </h1>
            <p className="text-xs text-slate-400">
              {isEditing ? 'Modify app metadata, screenshots, and release URLs' : 'Add an application to the studio portfolio'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          
          {/* Basic Identity */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
              1. Basic Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">App Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ShoeCheck AI"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Instant Sneaker Legit-Check"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option>AI & Computer Vision</option>
                  <option>Health & Fitness</option>
                  <option>Finance & Crypto</option>
                  <option>Productivity & Tools</option>
                  <option>Travel & Navigation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Platform</label>
                <select
                  value={formData.platforms}
                  onChange={(e) => setFormData({ ...formData, platforms: e.target.value as Platform })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option>Android + iOS</option>
                  <option>iOS</option>
                  <option>Android</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="High-level 1-2 sentence elevator pitch..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
              <textarea
                rows={4}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Comprehensive technical overview and architectural advantages..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-950 border-slate-800"
                />
                <span>Published (Visible on Public Marketplace)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-950 border-slate-800"
                />
                <span>Featured Showcase on Homepage</span>
              </label>
            </div>
          </div>

          {/* Media & Assets Placeholders */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
              2. Media & Visual Placeholders
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">App Logo URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                  <img src={formData.logo} alt="Logo" className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-800 shrink-0" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                  <img src={formData.coverImage} alt="Cover" className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-800 shrink-0" />
                </div>
              </div>
            </div>

            {/* Screenshots list */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Screenshot Placeholders ({formData.screenshots.length})</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.screenshots.map((shot, idx) => (
                  <div key={idx} className="relative group w-20 h-14 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={shot} alt="Screenshot" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(idx)}
                      className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newScreenshotUrl}
                  onChange={(e) => setNewScreenshotUrl(e.target.value)}
                  placeholder="Paste additional screenshot image URL..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddScreenshot}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Add Image
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Demo Video URL</label>
              <input
                type="text"
                value={formData.demoVideoUrl}
                onChange={(e) => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Features and Technologies */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
              3. Features & Technologies Stack
            </h3>

            {/* Features Editor */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Key Features</label>
              <div className="space-y-1.5 mb-2">
                {formData.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-200">{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g. Sub-50ms Neural Core inference"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Tech Chips Editor */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Technologies</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.technologies.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-sky-300">
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(t)}
                      className="hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g. Kotlin Multiplatform, SwiftUI"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  + Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Links & Specifications */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-sky-400">
              4. Distribution Links & Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Play Store URL</label>
                <input
                  type="text"
                  value={formData.playStoreUrl}
                  onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">iOS App Store URL</label>
                <input
                  type="text"
                  value={formData.appStoreUrl}
                  onChange={(e) => setFormData({ ...formData, appStoreUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Website URL</label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/admin/projects"
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20"
            >
              {isEditing ? 'Save Changes' : 'Create Application'}
            </button>
          </div>

        </form>

        {/* Right Live Preview Column */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Card Preview
            </span>
            <span className="text-[10px] text-sky-400 font-medium">Updates as you type</span>
          </div>

          <AppCard project={previewProject} />

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="font-semibold text-white block">Local Prototype Storage</span>
            <p className="text-[11px] leading-relaxed">
              Submitting this form commits your modifications directly to the browser's reactive state and local storage, ensuring the public pages reflect changes instantly.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
