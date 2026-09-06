import React from 'react';
import { Bus, ShieldCheck, Heart, Sparkles, Navigation } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-teal-600 p-2 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                <Bus className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                GOA<span className="text-teal-400">BUS</span>CONNECT
              </span>
            </div>
            <p className="text-base text-slate-200 font-medium">
              "One Platform. All Buses. Better Journeys."
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A student MVP & prototype designed to reduce transit uncertainty across Goa by uniting government Kadamba (KTC) and private shuttle networks with transparent status architecture.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Strictly differentiates LIVE GPS vs REPORTED vs SCHEDULED</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/plan')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-slate-500" />
                  Plan Journey
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/routes')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Bus className="w-3.5 h-3.5 text-slate-500" />
                  Route Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/assistant')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  AI Travel Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/alerts')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Transport Alerts & Advisories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Transport Insights Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Academic / Project Details */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Project Profile
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-teal-400 block mb-0.5">
                  Academic Focus
                </span>
                <p className="text-slate-300">
                  Student Innovation Project • Prototype
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  Department of Computer Science & Engineering
                </p>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Demo data is for prototype simulation. Does not represent official real-time Kadamba transport telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} GoaBusConnect</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Student Innovation Prototype</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-slate-300 font-medium">System Operational</span>
            </div>
            <div className="flex items-center gap-1 border-l border-slate-700 pl-4">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">Demo Mode</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
