import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, ArrowUpRight, Smartphone, Apple } from 'lucide-react';
import { Project } from '../../types';

interface AppCardProps {
  project: Project;
}

export const AppCard: React.FC<AppCardProps> = ({ project }) => {
  return (
    <div className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-sky-500/10 overflow-hidden">
      {/* Background ambient subtle glow on hover */}
      <div 
        className="absolute -right-20 -top-20 w-44 h-44 rounded-full opacity-0 group-hover:opacity-15 transition-opacity blur-3xl pointer-events-none"
        style={{ backgroundColor: project.accentColor }}
      />

      <div>
        {/* Top Header: Logo, Badges & Rating */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="relative">
            <img 
              src={project.logo} 
              alt={project.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300" 
            />
            {project.badge && (
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-sm border border-amber-300">
                {project.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{project.rating.toFixed(1)}</span>
              <span className="text-[10px] text-amber-400/70">({(project.reviewsCount / 1000).toFixed(1)}k)</span>
            </div>
            
            {/* Platform Badges */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              {project.platforms.includes('iOS') && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/50">
                  <Apple className="w-3 h-3 text-slate-200" />
                  iOS
                </span>
              )}
              {project.platforms.includes('Android') && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/50">
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  Android
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title and descriptions */}
        <div className="space-y-1 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
            {project.category}
          </span>
          <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-slate-400 font-medium line-clamp-1">
            {project.tagline}
          </p>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {project.shortDescription}
        </p>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-4 border-t border-slate-800/80 space-y-4">
        {/* Technologies Pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span 
              key={tech} 
              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/70 text-slate-300 border border-slate-700/30"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] text-slate-500 font-semibold">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>{project.downloads} downloads</span>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 hover:shadow-lg hover:shadow-sky-500/25 transition-all group-hover:translate-x-0.5"
          >
            <span>View Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
