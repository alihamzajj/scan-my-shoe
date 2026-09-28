import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceMockupProps {
  imageSrc?: string;
  appName?: string;
  tagline?: string;
  category?: string;
  accentColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  imageSrc,
  appName = 'App Showcase',
  tagline = 'Next-gen Mobile App',
  category,
  accentColor = '#38bdf8',
  className = '',
  children,
}) => {
  return (
    <div className={`relative mx-auto select-none ${className}`}>
      {/* Outer Phone Border with Titanium finish */}
      <div className="relative rounded-[48px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-sky-950/40 ring-1 ring-white/20">
        
        {/* Antenna bands */}
        <div className="absolute top-24 -left-1 w-1 h-6 bg-slate-600 rounded-l" />
        <div className="absolute top-36 -left-1 w-1 h-10 bg-slate-600 rounded-l" />
        <div className="absolute top-50 -left-1 w-1 h-10 bg-slate-600 rounded-l" />
        <div className="absolute top-32 -right-1 w-1 h-14 bg-slate-600 rounded-r" />

        {/* Inner Bezel Screen */}
        <div className="relative rounded-[38px] overflow-hidden bg-slate-950 aspect-[9/19] w-[280px] sm:w-[310px] border border-slate-800/80 flex flex-col justify-between">
          
          {/* Dynamic Island & Status Bar */}
          <div className="relative z-20 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-white/90">
            <span>9:41</span>
            
            {/* Dynamic Island Pill */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-6 w-24 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative flex-1 overflow-hidden">
            {children ? (
              children
            ) : imageSrc ? (
              <div className="relative w-full h-full">
                <img 
                  src={imageSrc} 
                  alt={appName}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Overlay Card Inside Phone */}
                <div className="absolute bottom-6 inset-x-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl">
                  {category && (
                    <span 
                      className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {category}
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-white leading-tight">{appName}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{tagline}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div 
                  className="w-16 h-16 rounded-2xl mb-4 shadow-lg flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: accentColor }}
                >
                  {appName.charAt(0)}
                </div>
                <h4 className="text-base font-bold text-white">{appName}</h4>
                <p className="text-xs text-slate-400 mt-1">{tagline}</p>
              </div>
            )}
          </div>

          {/* Home Indicator Bar */}
          <div className="h-4 flex items-center justify-center pb-2 z-20">
            <div className="w-28 h-1 bg-white/40 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
