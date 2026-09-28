import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Smartphone, 
  Apple, 
  Globe, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Share2, 
  Info,
  Maximize2
} from 'lucide-react';
import { GithubIcon } from '../../components/common/Icons';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../../components/common/AppCard';
import { Modal } from '../../components/common/Modal';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, addNotification } = useApp();

  const project = projects.find((p) => p.id === id);

  const [activeScreenshot, setActiveScreenshot] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Demo video player simulation states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [downloadModal, setDownloadModal] = useState<'ios' | 'android' | null>(null);

  if (!project) {
    return (
      <div className="py-24 max-w-xl mx-auto text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-800">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested application ID does not exist or has been unpublished from the catalog.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  const relatedProjects = projects
    .filter((p) => p.id !== project.id && p.published && (p.category === project.category || p.platforms === project.platforms))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addNotification('Project URL copied to clipboard!', 'info');
  };

  const handleOpenDownload = (platform: 'ios' | 'android') => {
    setDownloadModal(platform);
    addNotification(`Redirecting to ${platform === 'ios' ? 'Apple App Store' : 'Google Play Store'}... (Mock Prototype)`, 'info');
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Catalog</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <Link
            to={`/admin/projects/${project.id}/edit`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sky-400 hover:text-sky-300 text-xs font-medium transition-colors"
          >
            <span>Edit in Admin</span>
          </Link>
        </div>
      </div>

      {/* Hero Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
        
        {/* Left Column: App Identity & Main Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-start gap-5">
            <img 
              src={project.logo} 
              alt={project.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-2 ring-slate-800 shadow-2xl" 
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  {project.category}
                </span>
                {project.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    {project.badge}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {project.name}
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-300">
                {project.tagline}
              </p>

              {/* Ratings and Stats */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{project.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-amber-400/70">({project.reviewsCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold">{project.downloads}</span>
                </div>
                <div className="text-slate-400">
                  v{project.version} • {project.size}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {project.fullDescription}
          </p>

          {/* Action Download Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {project.platforms.includes('iOS') && (
              <button
                onClick={() => handleOpenDownload('ios')}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
              >
                <Apple className="w-5 h-5 fill-current" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider leading-none text-slate-600">Download on</div>
                  <div className="text-xs font-black leading-tight">Apple App Store</div>
                </div>
              </button>
            )}

            {project.platforms.includes('Android') && (
              <button
                onClick={() => handleOpenDownload('android')}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700/80 shadow-lg transition-transform hover:scale-105"
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider leading-none text-slate-400">Get it on</div>
                  <div className="text-xs font-black leading-tight">Google Play</div>
                </div>
              </button>
            )}

            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Product Landing Page"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="GitHub Core Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Quick Specifications Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div>
              <div className="text-slate-400">Platforms</div>
              <div className="font-semibold text-white mt-0.5">{project.platforms}</div>
            </div>
            <div>
              <div className="text-slate-400">Target Requirements</div>
              <div className="font-semibold text-white mt-0.5">{project.minIos || project.minAndroid || 'Modern OS'}</div>
            </div>
            <div>
              <div className="text-slate-400">App Package Size</div>
              <div className="font-semibold text-white mt-0.5">{project.size}</div>
            </div>
            <div>
              <div className="text-slate-400">Latest Release</div>
              <div className="font-semibold text-white mt-0.5">{project.lastUpdated}</div>
            </div>
          </div>

        </div>

        {/* Right Column: Large Interactive Preview Hero */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
            <img 
              src={project.coverImage} 
              alt={project.name}
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            <div className="absolute bottom-6 inset-x-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Official Production Build</span>
                <h4 className="text-lg font-bold text-white">{project.name}</h4>
              </div>
              <button
                onClick={() => setLightboxImage(project.coverImage)}
                className="p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-white/10 hover:bg-slate-900 transition-colors"
                title="View Fullscreen Preview"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Demo Video Simulation & Screenshots Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start">
        
        {/* Left: Interactive Simulated Video Player */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Play className="w-4 h-4 text-sky-400" />
              <span>Interactive App Demo Video</span>
            </h3>
            <span className="text-xs text-slate-400">4K 60fps Gameplay Preview</span>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video shadow-2xl flex items-center justify-center group">
            {/* Background mockup video or animated simulated poster */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950" />
            
            <img 
              src={project.screenshots[0] || project.coverImage} 
              alt="Demo video frame"
              className={`w-full h-full object-cover opacity-60 transition-opacity ${isPlaying ? 'scale-105' : ''}`} 
            />

            {/* Simulated Live Scan Overlay if playing */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-48 h-48 border-2 border-dashed border-sky-400/80 rounded-2xl animate-pulse flex items-center justify-center">
                  <span className="text-[11px] font-mono font-bold bg-sky-500/80 text-slate-950 px-2 py-0.5 rounded">
                    ANALYZING SAMPLE...
                  </span>
                </div>
                <div className="mt-4 text-xs font-mono text-emerald-400 bg-slate-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Confidence Score: 99.4% Valid
                </div>
              </div>
            )}

            {/* Big Play/Pause Button */}
            <button
              onClick={() => {
                const next = !isPlaying;
                setIsPlaying(next);
                addNotification(next ? 'Simulated demo video playing...' : 'Demo video paused', 'info');
              }}
              className="relative z-10 w-16 h-16 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/30 transition-transform hover:scale-110"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </button>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between text-xs text-white z-20">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-sky-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-sky-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] text-slate-400 font-mono">0:45 / 1:30</span>
              </div>

              {/* Progress bar */}
              <div className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-sky-400 rounded-full transition-all ${isPlaying ? 'w-2/3' : 'w-1/3'}`} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                PROTOTYPE DEMO
              </span>
            </div>
          </div>
        </div>

        {/* Right: Screenshot Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Application Gallery
            </h3>
            <span className="text-xs text-slate-400">Click any frame to inspect</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {project.screenshots.map((shot, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(shot)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3] cursor-pointer hover:border-sky-500/50 transition-all shadow-md"
              >
                <img 
                  src={shot} 
                  alt={`${project.name} screenshot ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Features & Technologies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
        
        {/* Key Features */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Key Architecture & Features
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feature, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 font-medium leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Chips & Platform Info */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Technologies & Frameworks
          </h3>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-sky-300 border border-slate-700/60 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Compilation Target:</span>
                <span className="font-semibold text-slate-200">AOT Native Arm64 / x86_64</span>
              </div>
              <div className="flex justify-between">
                <span>CI/CD Pipeline:</span>
                <span className="font-semibold text-slate-200">Fastlane & GitHub Actions (Mock)</span>
              </div>
              <div className="flex justify-between">
                <span>Inference Runtime:</span>
                <span className="font-semibold text-slate-200">On-Device Neural Engine</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="border-t border-slate-800/80 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Related Applications
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                More releases from our mobile engineering laboratory
              </p>
            </div>
            <Link to="/projects" className="text-xs font-semibold text-sky-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProjects.map((p) => (
              <AppCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <Modal
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          title={project.name}
          subtitle="High-Resolution Production Screenshot"
          maxWidth="max-w-4xl"
        >
          <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[75vh]">
            <img 
              src={lightboxImage} 
              alt="Fullscreen preview" 
              className="max-h-[75vh] w-auto object-contain" 
            />
          </div>
        </Modal>
      )}

      {/* Mock Download Modal */}
      {downloadModal && (
        <Modal
          isOpen={!!downloadModal}
          onClose={() => setDownloadModal(null)}
          title={`Download ${project.name}`}
          subtitle={`Redirecting to ${downloadModal === 'ios' ? 'Apple App Store' : 'Google Play'}`}
          maxWidth="max-w-md"
        >
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
              {downloadModal === 'ios' ? <Apple className="w-8 h-8" /> : <Smartphone className="w-8 h-8 text-emerald-400" />}
            </div>
            <h4 className="text-base font-bold text-white">
              Prototype Store Link
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This is a frontend demonstration prototype. In production, this button connects directly to the published app bundle:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-sky-300 break-all border border-slate-800">
              {downloadModal === 'ios' ? project.appStoreUrl : project.playStoreUrl}
            </div>
            <button
              onClick={() => setDownloadModal(null)}
              className="w-full py-2.5 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold hover:bg-sky-400 transition-colors"
            >
              Close Prototype Notice
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};
