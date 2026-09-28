import React, { useState, useMemo } from 'react';
import { Search, Filter, Smartphone, Apple, Layers, Sparkles, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../../components/common/AppCard';
import { ProjectCategory, Platform } from '../../types';

export const ProjectsPage: React.FC = () => {
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'downloads' | 'name'>('featured');

  const categories = [
    'All',
    'AI & Computer Vision',
    'Health & Fitness',
    'Finance & Crypto',
    'Productivity & Tools',
    'Travel & Navigation',
  ];

  const platforms = ['All', 'Android', 'iOS', 'Android + iOS'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Must be published for public view
      if (!project.published) return false;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query));

      // Category match
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

      // Platform match
      let matchesPlatform = true;
      if (selectedPlatform === 'Android') {
        matchesPlatform = project.platforms.includes('Android');
      } else if (selectedPlatform === 'iOS') {
        matchesPlatform = project.platforms.includes('iOS');
      } else if (selectedPlatform === 'Android + iOS') {
        matchesPlatform = project.platforms === 'Android + iOS';
      }

      return matchesSearch && matchesCategory && matchesPlatform;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'downloads') {
        const parseDL = (str: string) => parseFloat(str.replace(/[^\d.]/g, '')) * (str.includes('M') ? 1000 : 1);
        return parseDL(b.downloads) - parseDL(a.downloads);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // default: featured first, then rating
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.rating - a.rating;
    });
  }, [projects, searchQuery, selectedCategory, selectedPlatform, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPlatform('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedPlatform !== 'All';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>App Portfolio & Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Explore Our Mobile Apps
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
          Filter through our native iOS, Android, and cross-platform productions. Click any project to inspect technical architecture, interactive demo videos, and download links.
        </p>
      </div>

      {/* Control Bar: Search & Sort */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by app name, technology, or feature..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rating</option>
              <option value="downloads">Most Downloaded</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Filter Rows: Platforms & Categories */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Platform Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">Platform:</span>
            {platforms.map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedPlatform === plat
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {plat === 'iOS' && <Apple className="w-3 h-3" />}
                {plat === 'Android' && <Smartphone className="w-3 h-3" />}
                <span>{plat}</span>
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Active Filter summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <span>
              Showing {filteredProjects.length} matches for current filters
            </span>
            <button
              onClick={clearFilters}
              className="text-sky-400 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <AppCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl bg-slate-900/50 border border-slate-800 p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No matching applications found</h3>
          <p className="text-xs text-slate-400 mb-6">
            We couldn't find any app matching your filter criteria. Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
