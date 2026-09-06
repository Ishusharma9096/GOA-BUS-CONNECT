import React from 'react';
import { GOA_BUS_ROUTES, DEMO_ALERTS, INITIAL_PASSENGER_REPORTS } from '../data/mockData';
import {
  BarChart3,
  Bus,
  Radio,
  Clock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';

interface InsightsPageProps {
  onNavigate: (path: string) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNavigate }) => {
  const liveRoutesCount = GOA_BUS_ROUTES.filter((r) => r.status === 'LIVE').length;
  const reportedRoutesCount = GOA_BUS_ROUTES.filter((r) => r.status === 'REPORTED').length;
  const scheduledRoutesCount = GOA_BUS_ROUTES.filter((r) => r.status === 'SCHEDULED').length;

  const governmentCount = GOA_BUS_ROUTES.filter((r) => r.operatorType === 'government').length;
  const privateCount = GOA_BUS_ROUTES.filter((r) => r.operatorType === 'private').length;

  const totalStops = GOA_BUS_ROUTES.reduce((acc, curr) => acc + curr.stops.length, 0);
  const avgDuration = Math.round(
    GOA_BUS_ROUTES.reduce((acc, curr) => acc + curr.durationMinutes, 0) / GOA_BUS_ROUTES.length
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-teal-600" />
              Transport Insights Dashboard
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Prototype Analytics
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            System performance, fleet distribution, telemetry coverage, and passenger feedback metrics.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/plan')}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <span>Plan a Journey</span>
        </button>
      </div>

      {/* Top 4 Core Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Corridors</span>
            <Bus className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {GOA_BUS_ROUTES.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Covering North & South Goa hubs
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Telemetry Feeds</span>
            <Radio className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-teal-700 font-mono">
            {liveRoutesCount} LIVE
          </div>
          <p className="text-[11px] text-slate-500">
            {scheduledRoutesCount} on timetable schedule
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Journey</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {avgDuration} min
          </div>
          <p className="text-[11px] text-slate-500">
            Across {totalStops} monitored bus stops
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Reported Issues</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {INITIAL_PASSENGER_REPORTS.length}
          </div>
          <p className="text-[11px] text-slate-500">
            {DEMO_ALERTS.length} active service advisories
          </p>
        </div>
      </div>

      {/* Fleet & Status Coverage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Architecture */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Data Trust Architecture
            </h3>
            <span className="text-xs text-slate-400">Status Verification</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            GoaBusConnect guarantees never to fabricate GPS positions. When hardware telematics are absent, routes are strictly classified as SCHEDULED:
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-teal-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  LIVE Telemetry ({liveRoutesCount} routes)
                </span>
                <span className="text-slate-600">
                  {Math.round((liveRoutesCount / GOA_BUS_ROUTES.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${(liveRoutesCount / GOA_BUS_ROUTES.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  SCHEDULED Timetable ({scheduledRoutesCount} routes)
                </span>
                <span className="text-slate-600">
                  {Math.round((scheduledRoutesCount / GOA_BUS_ROUTES.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(scheduledRoutesCount / GOA_BUS_ROUTES.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  REPORTED Passenger Updates ({reportedRoutesCount} routes)
                </span>
                <span className="text-slate-600">
                  {Math.round((reportedRoutesCount / GOA_BUS_ROUTES.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(reportedRoutesCount / GOA_BUS_ROUTES.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Composition */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bus className="w-4 h-4 text-teal-600" />
              Fleet & Operator Split
            </h3>
            <span className="text-xs text-slate-400">Operator Network</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Goa transit combines the government Kadamba Transport Corporation (KTC) with independent private shuttle cooperatives:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                Government (KTC)
              </span>
              <span className="text-2xl font-black text-teal-900 font-mono mt-1 block">
                {governmentCount} Routes
              </span>
              <span className="text-[11px] text-teal-700 mt-0.5 block">
                Electric & Express fleet
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Private Operators
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {privateCount} Routes
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Coastal & feeder shuttles
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 leading-relaxed border border-slate-100">
            <strong>KTC Hubs:</strong> Panaji Central KTC, Margao KTC, Vasco Bus Stand, Mapusa Bus Stand, Ponda KTC.
          </div>
        </div>
      </div>
    </div>
  );
};
