import React, { useState } from 'react';
import { Bus, Sparkles, Menu, X, Bell, AlertTriangle, Compass, MapPin, BarChart3, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  unreadAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  unreadAlertsCount = 2,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', icon: Compass },
    { label: 'Plan Journey', path: '/plan', icon: MapPin },
    { label: 'Routes', path: '/routes', icon: Bus },
    { label: 'Alerts', path: '/alerts', icon: Bell, badge: unreadAlertsCount },
    { label: 'Report Issue', path: '/report', icon: AlertTriangle },
    { label: 'Insights', path: '/insights', icon: BarChart3 },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top micro-bar indicating Student MVP & Data Transparency */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Student Innovation MVP
            </span>
            <span className="hidden sm:inline text-slate-400">
              Goa State Transit Prototype • Verified Status Architecture
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              7 Corridors Monitored
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              LIVE / REPORTED / SCHEDULED Segregated
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            id="nav-brand-logo"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="bg-teal-600 p-2 rounded-lg text-white shadow-sm transition-transform group-hover:scale-105">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  GOA<span className="text-teal-600">BUS</span>CONNECT
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                One Platform. All Buses. Better Journeys.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-1.5 transition-colors pb-1 ${
                    isActive
                      ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
                      : 'hover:text-teal-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* AI Assistant Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              id="nav-ai-assistant-btn"
              onClick={() => handleNavClick('/assistant')}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition shadow-sm ${
                currentPath === '/assistant'
                  ? 'bg-teal-700 text-white shadow-teal-700/30'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>AI Assistant</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-xl">
          {navLinks.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('/assistant')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Launch AI Travel Assistant</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
