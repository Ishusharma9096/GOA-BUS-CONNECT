import React, { useState } from 'react';
import { GOA_LOCATIONS, GOA_BUS_ROUTES } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowRightLeft,
  Search,
  Bus,
  Bell,
  AlertTriangle,
  Sparkles,
  Radio,
  ShieldCheck,
  Compass,
  ArrowRight,
  Clock,
  Navigation,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface HomePageProps {
  onPlanJourney: (origin: string, destination: string) => void;
  onNavigate: (path: string) => void;
  onSelectRoute: (routeId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPlanJourney,
  onNavigate,
  onSelectRoute,
}) => {
  const [origin, setOrigin] = useState('Margao');
  const [destination, setDestination] = useState('Panaji');
  const [searchError, setSearchError] = useState('');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setSearchError('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      setSearchError('Please select both a starting point and destination.');
      return;
    }
    if (origin === destination) {
      setSearchError('Origin and destination cannot be identical.');
      return;
    }
    setSearchError('');
    onPlanJourney(origin, destination);
  };

  // Popular high-frequency corridors in Goa
  const popularCorridors = [
    { from: 'Margao', to: 'Panaji', duration: '1h 05m', tag: 'Fastest Direct', fare: '₹55' },
    { from: 'Panaji', to: 'Mapusa', duration: '30m', tag: 'High Frequency', fare: '₹30' },
    { from: 'Panaji', to: 'Calangute', duration: '40m', tag: 'Beach Express', fare: '₹50' },
    { from: 'Margao', to: 'Vasco', duration: '50m', tag: 'Airport Link', fare: '₹60' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-xl">
        {/* Background visual motif */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            GOABUSCONNECT • Prototype Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Travel Goa with confidence.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Find buses, plan journeys and get trusted transport updates in one place.
          </p>
        </div>

        {/* Main Journey Search Card */}
        <div className="relative max-w-3xl mx-auto mt-10">
          <form
            id="home-journey-search-card"
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-slate-900"
          >
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* FROM Input */}
              <div className="md:col-span-3 space-y-1.5 text-left">
                <label
                  htmlFor="home-origin-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  FROM
                </label>
                <div className="relative">
                  <select
                    id="home-origin-select"
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setSearchError('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer outline-none"
                  >
                    <option value="">Select origin...</option>
                    {GOA_LOCATIONS.map((loc) => (
                      <option key={`origin-${loc}`} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
                <button
                  type="button"
                  id="home-swap-btn"
                  onClick={handleSwap}
                  className="p-3 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors border border-slate-200 hover:border-teal-300 shadow-sm"
                  title="Swap Origin and Destination"
                  aria-label="Swap starting point and destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* TO Input */}
              <div className="md:col-span-3 space-y-1.5 text-left">
                <label
                  htmlFor="home-dest-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  TO
                </label>
                <div className="relative">
                  <select
                    id="home-dest-select"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setSearchError('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer outline-none"
                  >
                    <option value="">Select destination...</option>
                    {GOA_LOCATIONS.map((loc) => (
                      <option key={`dest-${loc}`} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {searchError && (
              <p className="text-rose-600 text-xs mt-3 font-medium text-left">
                ⚠️ {searchError}
              </p>
            )}

            {/* Plan Button */}
            <div className="mt-6">
              <button
                type="submit"
                id="home-plan-submit-btn"
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>PLAN MY JOURNEY</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Timetable & live data clearly marked. Demo schedules simulated for prototype.</span>
            </div>
          </form>
        </div>

        {/* Quick Actions Below Search Card */}
        <div className="max-w-3xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="home-quick-find"
            onClick={() => onNavigate('/plan')}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white text-xs font-semibold transition-all hover:border-teal-400/30"
          >
            <Compass className="w-5 h-5 text-teal-400" />
            <span>Find a Bus</span>
          </button>

          <button
            id="home-quick-routes"
            onClick={() => onNavigate('/routes')}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white text-xs font-semibold transition-all hover:border-teal-400/30"
          >
            <Bus className="w-5 h-5 text-teal-300" />
            <span>View Routes</span>
          </button>

          <button
            id="home-quick-alerts"
            onClick={() => onNavigate('/alerts')}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white text-xs font-semibold transition-all hover:border-teal-400/30"
          >
            <Bell className="w-5 h-5 text-amber-400" />
            <span>Check Alerts</span>
          </button>

          <button
            id="home-quick-report"
            onClick={() => onNavigate('/report')}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white text-xs font-semibold transition-all hover:border-teal-400/30"
          >
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Report an Issue</span>
          </button>
        </div>
      </section>

      {/* Why GoaBusConnect Section (3 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-wider text-teal-700 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            The Three Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Why GoaBusConnect?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Built to eliminate transit guesswork across Goa with verified data transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: LIVE VISIBILITY */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 mb-5">
              <Radio className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                1. LIVE VISIBILITY
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "Bus location, ETA and service status when live data is available."
            </p>
            <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
              Active telemetry feeds indicate actual road speed and approaching stop milestones.
            </p>
          </div>

          {/* Card 2: TRUSTED STATUS */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                2. TRUSTED STATUS
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "Clearly distinguish LIVE, REPORTED and SCHEDULED information."
            </p>
            <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
              Never confuses static timetables with real-time GPS. Honest labeling for every bus.
            </p>
          </div>

          {/* Card 3: SMART PLANNING */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                3. SMART PLANNING
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "Compare journey options based on time, cost and walking distance."
            </p>
            <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
              Ask Gemini AI natural-language questions to find the ideal match for your trip.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Corridors Quick Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Key Travel Corridors
            </h2>
            <p className="text-xs text-slate-500">
              Frequent daily connections across North and South Goa
            </p>
          </div>
          <button
            onClick={() => onNavigate('/routes')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Routes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCorridors.map((c, i) => (
            <div
              key={i}
              onClick={() => onPlanJourney(c.from, c.to)}
              className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {c.tag}
                </span>
                <div className="mt-3 flex items-center gap-2 font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                  <span>{c.from}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span>{c.to}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {c.duration}
                </span>
                <span className="font-bold text-teal-600">{c.fare}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white border border-slate-800 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Powered by Gemini 3.8
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Got travel questions? Ask the AI Assistant.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ask in plain English: "Which bus is fastest?", "Cheapest way to reach Panaji?", or "Where do I board at Margao?". The assistant is grounded on real Goa transit stops without fabricating live data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/assistant')}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Open AI Travel Assistant</span>
            </button>
            <button
              onClick={() => onNavigate('/insights')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span>Transit Insights</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
