import React, { useState } from 'react';
import { BusRoute } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LeafletMap } from '../components/LeafletMap';
import { VisualTimeline } from '../components/VisualTimeline';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Clock,
  DollarSign,
  Footprints,
  Bus,
  ShieldCheck,
  CheckCircle2,
  Radio,
  MapPin,
  Info,
} from 'lucide-react';

interface JourneyDetailsPageProps {
  route: BusRoute;
  onBack: () => void;
  onAskAI: (routeId: string, initialQuery?: string) => void;
  onReportIssue: (routeId: string, routeNumber: string, busService: string) => void;
  onToast: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const JourneyDetailsPage: React.FC<JourneyDetailsPageProps> = ({
  route,
  onBack,
  onAskAI,
  onReportIssue,
  onToast,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      onToast(
        'success',
        'Journey Saved',
        `Route ${route.routeNumber} (${route.origin} → ${route.destination}) saved to your offline quick list.`
      );
    } else {
      onToast('info', 'Journey Removed', 'Removed from your saved list.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `GoaBusConnect: Route ${route.routeNumber} (${route.origin} → ${route.destination}), Departs ${route.departureTime}, Fare ₹${route.fare}, Status: ${route.status}`
      );
      onToast(
        'success',
        'Details Copied',
        'Route timetable and stop milestones copied to clipboard.'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
            title="Share journey details"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            id="journey-save-btn"
            onClick={handleSaveToggle}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isSaved
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-teal-700" />
                <span>Saved to Trips</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span>Save Journey</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-sm font-extrabold bg-slate-900 text-white font-mono">
                ROUTE {route.routeNumber}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                {route.operator}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {route.busType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {route.origin} to {route.destination}
            </h1>
            <p className="text-sm text-slate-500">
              Board at <strong>{route.originStopName}</strong> • Exit at <strong>{route.destinationStopName}</strong>
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2">
            <StatusBadge
              status={route.status}
              lastUpdated={route.lastUpdated}
              size="lg"
              showSubtitle={true}
            />
            {route.status === 'LIVE' && route.currentLocation && (
              <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-teal-600 animate-pulse" />
                Live Pos: {route.currentLocation.description} ({route.currentLocation.speedKmH} km/h)
              </span>
            )}
          </div>
        </div>

        {/* Detailed Status Explanation Banner */}
        <div className="rounded-xl p-4 bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-slate-900">
              Status Architecture: {route.status}
            </div>
            <p className="text-slate-600 leading-relaxed">
              {route.statusDetail}
            </p>
          </div>
        </div>

        {/* Four Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
              Departure / Arrival
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono mt-1 block">
              {route.departureTime} → {route.arrivalTime}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Total {route.durationFormatted}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
              Transit Fare
            </span>
            <span className="text-2xl font-black text-teal-600 mt-1 block">
              ₹{route.fare}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Standard passenger tariff
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
              Walking Distance
            </span>
            <span className="text-base font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-teal-600" />
              {route.walkingFormatted}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Direct terminal access
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
              Service Frequency
            </span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">
              {route.frequency.split('(')[0]}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {route.frequency.split('(')[1] ? `(${route.frequency.split('(')[1]}` : 'Active daily'}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            id="journey-ask-ai-btn"
            onClick={() =>
              onAskAI(
                route.id,
                `Explain this journey on Route ${route.routeNumber} from ${route.origin} to ${route.destination}. What should I keep in mind?`
              )
            }
            className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-100" />
            <span>Ask AI about this journey</span>
          </button>

          <button
            id="journey-report-issue-btn"
            onClick={() =>
              onReportIssue(route.id, route.routeNumber, `${route.routeName} (${route.operator})`)
            }
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs border border-slate-200 hover:border-rose-200 transition-all flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Report an issue or delay</span>
          </button>
        </div>
      </div>

      {/* Route Map & Visual Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Interactive Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Route Map & Geography
            </h3>
            <span className="text-xs text-slate-400">
              Interactive Leaflet GIS
            </span>
          </div>
          <LeafletMap route={route} height="480px" />
          <p className="text-[11px] text-slate-500 text-center">
            Pinch or scroll to zoom. Click markers to inspect individual stop landmarks and time offsets.
          </p>
        </div>

        {/* Right Column: Visual Journey Timeline */}
        <div className="space-y-4">
          <VisualTimeline route={route} />
        </div>
      </div>
    </div>
  );
};
