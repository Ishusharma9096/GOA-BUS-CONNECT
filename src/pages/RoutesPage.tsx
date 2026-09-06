import React, { useState, useMemo } from 'react';
import { GOA_BUS_ROUTES } from '../data/mockData';
import { BusRoute } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Search,
  Filter,
  Bus,
  ArrowRight,
  Clock,
  Compass,
  Sparkles,
  ShieldCheck,
  Radio,
  Calendar,
} from 'lucide-react';

interface RoutesPageProps {
  onSelectRoute: (routeId: string) => void;
  onAskAIAboutJourney: (routeId?: string, query?: string) => void;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({
  onSelectRoute,
  onAskAIAboutJourney,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'government' | 'private' | 'live' | 'scheduled'>('all');

  const filteredRoutes = useMemo(() => {
    return GOA_BUS_ROUTES.filter((route) => {
      // Search filter
      const matchesSearch =
        route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.stops.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Category filter
      if (filterType === 'government') return route.operatorType === 'government';
      if (filterType === 'private') return route.operatorType === 'private';
      if (filterType === 'live') return route.status === 'LIVE';
      if (filterType === 'scheduled') return route.status === 'SCHEDULED';

      return true;
    });
  }, [searchQuery, filterType]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Goa Bus Route Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Search active corridors, Kadamba state transports, private routes, and real-time feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
            {filteredRoutes.length} of {GOA_BUS_ROUTES.length} Routes
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="routes-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by route number (e.g. 101), stop name (e.g. Cortalim), or location..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>

          <button
            id="routes-filter-all"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Services
          </button>

          <button
            id="routes-filter-govt"
            onClick={() => setFilterType('government')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'government'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Government (Kadamba KTC)
          </button>

          <button
            id="routes-filter-private"
            onClick={() => setFilterType('private')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'private'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Private Operators
          </button>

          <button
            id="routes-filter-live"
            onClick={() => setFilterType('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'live'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-teal-200" />
            Live GPS Feeds
          </button>

          <button
            id="routes-filter-scheduled"
            onClick={() => setFilterType('scheduled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-200" />
            Scheduled Timetable
          </button>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutes.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">
              No routes found matching your criteria "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <div
              key={route.id}
              id={`route-card-${route.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Route Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0">
                      {route.routeNumber}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {route.routeName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {route.operator} • {route.busType}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={route.status} size="sm" />
                </div>

                {/* Corridor & Stops */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="text-teal-700">{route.origin}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-blue-700">{route.destination}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    <span className="font-medium text-slate-600">Major Stops: </span>
                    {route.stops.map((s) => s.name).join(' • ')}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Typical Time
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {route.durationFormatted}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Standard Fare
                    </span>
                    <span className="font-bold text-teal-600">
                      ₹{route.fare}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Frequency
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] truncate block">
                      {route.frequency.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    onAskAIAboutJourney(
                      route.id,
                      `Tell me all about Route ${route.routeNumber} (${route.routeName}). What are the key stops and status?`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Ask AI</span>
                </button>

                <button
                  onClick={() => onSelectRoute(route.id)}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>View Details & Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
