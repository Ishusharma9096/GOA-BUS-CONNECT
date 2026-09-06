import React, { useState } from 'react';
import { DEMO_ALERTS } from '../data/mockData';
import { TransportAlert } from '../types';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  MapPin,
  Filter,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

interface AlertsPageProps {
  onNavigateReport: () => void;
  onSelectRouteByNumber?: (routeNumber: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  onNavigateReport,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'warning' | 'info' | 'success'>('all');

  const filteredAlerts = DEMO_ALERTS.filter((alert) => {
    if (severityFilter === 'all') return true;
    return alert.severity === severityFilter;
  });

  const getSeverityBadge = (severity: TransportAlert['severity']) => {
    switch (severity) {
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Delay / Congestion Warning
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            Service Disruption
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
            Service Augmentation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Info className="w-3.5 h-3.5 text-blue-700" />
            Transit Advisory
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-teal-600" />
              Transport Alerts & Advisories
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time traffic notices, platform reassignments, and corridor speed advisories for Goa.
          </p>
        </div>

        <button
          onClick={onNavigateReport}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-teal-400" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter by:
        </span>

        <button
          onClick={() => setSeverityFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            severityFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Notices ({DEMO_ALERTS.length})
        </button>

        <button
          onClick={() => setSeverityFilter('warning')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            severityFilter === 'warning'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Warnings & Delays
        </button>

        <button
          onClick={() => setSeverityFilter('info')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            severityFilter === 'info'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Platform & Weather Advisories
        </button>

        <button
          onClick={() => setSeverityFilter('success')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            severityFilter === 'success'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Service Additions
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            id={`alert-card-${alert.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {getSeverityBadge(alert.severity)}
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                  {alert.routeNumber}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{alert.date}, {alert.time}</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {alert.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {alert.description}
              </p>
            </div>

            {/* Affected location & stops */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Location: {alert.location}</span>
              </div>

              {alert.affectedStops && (
                <div className="text-[11px] text-slate-400">
                  Stops: {alert.affectedStops.join(' • ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prototype notice */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Alerts are sample notifications modeled for prototype verification.
        </span>
        <button
          onClick={onNavigateReport}
          className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
        >
          <span>Spot an unlisted delay? Report it here</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
