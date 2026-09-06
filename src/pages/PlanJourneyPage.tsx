import React, { useState, useEffect } from 'react';
import { GOA_LOCATIONS, GOA_BUS_ROUTES } from '../data/mockData';
import { BusRoute, JourneySearchPreferences } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowRightLeft,
  Search,
  Zap,
  DollarSign,
  Footprints,
  Accessibility,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Bus,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface PlanJourneyPageProps {
  initialOrigin?: string;
  initialDestination?: string;
  onSelectRoute: (routeId: string) => void;
  onAskAIAboutJourney: (routeId?: string, query?: string) => void;
}

export const PlanJourneyPage: React.FC<PlanJourneyPageProps> = ({
  initialOrigin = 'Margao',
  initialDestination = 'Panaji',
  onSelectRoute,
  onAskAIAboutJourney,
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [departureTime, setDepartureTime] = useState('08:30');
  const [preference, setPreference] = useState<JourneySearchPreferences['preference']>('all');
  const [results, setResults] = useState<BusRoute[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  // Handle Swap
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setError('');
  };

  const performSearch = (fromLoc: string, toLoc: string, pref: string) => {
    if (!fromLoc || !toLoc) {
      setError('Please select both Origin and Destination.');
      return;
    }
    if (fromLoc.toLowerCase() === toLoc.toLowerCase()) {
      setError('Origin and Destination cannot be the same city.');
      return;
    }
    setError('');

    // Match routes where origin or intermediate stop matches fromLoc, and destination matches toLoc
    let matched = GOA_BUS_ROUTES.filter((r) => {
      const matchOrigin =
        r.origin.toLowerCase().includes(fromLoc.toLowerCase()) ||
        r.stops.some((s) => s.name.toLowerCase().includes(fromLoc.toLowerCase()));
      const matchDest =
        r.destination.toLowerCase().includes(toLoc.toLowerCase()) ||
        r.stops.some((s) => s.name.toLowerCase().includes(toLoc.toLowerCase()));
      return matchOrigin && matchDest;
    });

    // If no direct routes in demo dataset, provide closest regional connections
    if (matched.length === 0) {
      matched = GOA_BUS_ROUTES.filter(
        (r) =>
          r.origin.toLowerCase().includes(fromLoc.toLowerCase()) ||
          r.destination.toLowerCase().includes(toLoc.toLowerCase())
      );
    }

    // Sort according to preference
    if (pref === 'fastest') {
      matched = [...matched].sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (pref === 'cheapest') {
      matched = [...matched].sort((a, b) => a.fare - b.fare);
    } else if (pref === 'least-walking') {
      matched = [...matched].sort((a, b) => a.walkingMinutes - b.walkingMinutes);
    } else if (pref === 'accessible') {
      matched = [...matched].filter((r) => r.accessible);
    }

    setResults(matched);
    setHasSearched(true);
  };

  useEffect(() => {
    if (origin && destination) {
      performSearch(origin, destination, preference);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(origin, destination, preference);
  };

  const handlePreferenceChange = (newPref: JourneySearchPreferences['preference']) => {
    setPreference(newPref);
    if (hasSearched) {
      performSearch(origin, destination, newPref);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Plan Your Journey
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Compare transit routes, walking distances, fares, and real-time status across Goa.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Demo / Timetable Engine
            </span>
          </div>
        </div>
      </div>

      {/* Journey Search Form */}
      <form
        id="plan-journey-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* Origin */}
          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor="plan-origin-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Origin
            </label>
            <select
              id="plan-origin-input"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Select origin point...</option>
              {GOA_LOCATIONS.map((loc) => (
                <option key={`plan-origin-${loc}`} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
            <button
              type="button"
              id="plan-swap-btn"
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors border border-slate-200 hover:border-teal-300 shadow-sm"
              title="Swap Origin and Destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor="plan-dest-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Destination
            </label>
            <select
              id="plan-dest-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">Select destination point...</option>
              {GOA_LOCATIONS.map((loc) => (
                <option key={`plan-dest-${loc}`} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Departure Time & Preferences */}
        <div className="pt-4 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Preferences:
            </span>

            <button
              type="button"
              id="pref-all"
              onClick={() => handlePreferenceChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preference === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Options
            </button>

            <button
              type="button"
              id="pref-fastest"
              onClick={() => handlePreferenceChange('fastest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                preference === 'fastest'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Fastest
            </button>

            <button
              type="button"
              id="pref-cheapest"
              onClick={() => handlePreferenceChange('cheapest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                preference === 'cheapest'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Cheapest
            </button>

            <button
              type="button"
              id="pref-least-walking"
              onClick={() => handlePreferenceChange('least-walking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                preference === 'least-walking'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              Least Walking
            </button>

            <button
              type="button"
              id="pref-accessible"
              onClick={() => handlePreferenceChange('accessible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                preference === 'accessible'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              Accessible (EV / Low Floor)
            </button>
          </div>

          {/* Time Picker & Submit Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="bg-transparent focus:outline-none font-semibold text-slate-800"
              />
            </div>

            <button
              type="submit"
              id="plan-find-buses-btn"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Buses</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-medium">⚠️ {error}</p>
        )}
      </form>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Available Routes ({results.length})
            </h2>
            <p className="text-xs text-slate-500">
              Showing services connecting <strong>{origin}</strong> and <strong>{destination}</strong>
            </p>
          </div>

          {results.length > 0 && (
            <button
              onClick={() =>
                onAskAIAboutJourney(
                  results[0]?.id,
                  `I need to go from ${origin} to ${destination}. Which of the available options is best?`
                )
              }
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Ask AI to compare these options</span>
            </button>
          )}
        </div>

        {/* Route Cards */}
        {results.length === 0 && hasSearched ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No direct buses found for this corridor
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find a direct timetable run matching both "{origin}" and "{destination}". Try connecting via Panaji KTC or Margao KTC hub.
            </p>
            <button
              onClick={() => {
                setOrigin('Margao');
                setDestination('Panaji');
                performSearch('Margao', 'Panaji', 'all');
              }}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Reset to Margao – Panaji Corridor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((route, index) => {
              const optionNumber = index + 1;

              return (
                <div
                  key={route.id}
                  id={`journey-card-${route.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all space-y-4"
                >
                  {/* Top Bar: Option Tag & Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
                        OPTION {optionNumber}
                      </span>
                      {route.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                        >
                          {t}
                        </span>
                      ))}
                      {route.accessible && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 flex items-center gap-1">
                          <Accessibility className="w-3 h-3" />
                          Low Floor
                        </span>
                      )}
                    </div>

                    <StatusBadge
                      status={route.status}
                      lastUpdated={route.lastUpdated}
                      showSubtitle={true}
                    />
                  </div>

                  {/* Route Flow (Stops) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                        <Bus className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>Route {route.routeNumber}: {route.routeName}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Operator: <span className="text-slate-700">{route.operator}</span> ({route.busType})
                      </p>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-2">
                        <span className="text-teal-700">{route.originStopName}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-blue-700">{route.destinationStopName}</span>
                      </div>
                    </div>

                    {/* Fare & Timing summary */}
                    <div className="flex items-center sm:text-right gap-6 sm:gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase">
                          Duration
                        </span>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {route.durationFormatted}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase">
                          Fare
                        </span>
                        <span className="text-base font-extrabold text-teal-600">
                          ₹{route.fare}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase">
                          Walking
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          {route.walkingFormatted}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Depart: {route.departureTime} • Est. Arrival: {route.arrivalTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onAskAIAboutJourney(
                            route.id,
                            `Explain Route ${route.routeNumber} (${route.routeName}) and its current status.`
                          )
                        }
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        <span>Ask AI</span>
                      </button>

                      <button
                        id={`view-journey-${route.id}`}
                        onClick={() => onSelectRoute(route.id)}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <span>View Journey</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Prototype Transparency Notice */}
        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            <strong>Transparency Notice:</strong> Fares, timings, and stops are modeled after actual Kadamba Transport Corporation (KTC) schedules for demo purposes. LIVE GPS indicators require active hardware beacons, while SCHEDULED trips strictly reflect published timetables.
          </p>
        </div>
      </div>
    </div>
  );
};
