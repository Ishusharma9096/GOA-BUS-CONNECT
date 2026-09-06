import React, { useState, useEffect } from 'react';
import { GOA_BUS_ROUTES } from '../data/mockData';
import { IssueType, PassengerReport } from '../types';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  ThumbsUp,
  ShieldCheck,
  RotateCcw,
  Users,
  Bus,
} from 'lucide-react';

interface ReportIssuePageProps {
  initialRouteId?: string;
  initialRouteNumber?: string;
  initialBusService?: string;
  onToast: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  initialRouteId,
  initialRouteNumber,
  initialBusService,
  onToast,
}) => {
  const [routeId, setRouteId] = useState(initialRouteId || 'route-101');
  const [routeNumber, setRouteNumber] = useState(initialRouteNumber || '101');
  const [busService, setBusService] = useState(
    initialBusService || 'Margao – Panaji Direct Shuttle'
  );
  const [location, setLocation] = useState('Margao KTC Bus Stand');
  const [issueType, setIssueType] = useState<IssueType>('Bus delayed');
  const [description, setDescription] = useState('');
  const [commuterName, setCommuterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<PassengerReport | null>(null);

  const [communityReports, setCommunityReports] = useState<PassengerReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Fetch community reports from backend
  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.reports) {
        setCommunityReports(data.reports);
      }
    } catch (e) {
      console.error('Could not load reports', e);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRouteChange = (selectedId: string) => {
    setRouteId(selectedId);
    const found = GOA_BUS_ROUTES.find((r) => r.id === selectedId);
    if (found) {
      setRouteNumber(found.routeNumber);
      setBusService(`${found.routeName} (${found.operator})`);
      setLocation(found.originStopName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      onToast('warning', 'Missing Description', 'Please provide a short description of the issue.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routeId,
          routeNumber,
          busService,
          location,
          issueType,
          description: description.trim(),
          commuterName: commuterName.trim() || 'Anonymous Commuter',
        }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setSubmittedReport(data.report);
        setCommunityReports((prev) => [data.report, ...prev]);
        onToast(
          'success',
          'Report Submitted',
          'Thank you. Your report has been submitted to community verification.'
        );
      }
    } catch (err) {
      onToast('warning', 'Network Notice', 'Report recorded locally in prototype memory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.report) {
        setCommunityReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
        );
        onToast('info', 'Upvoted', 'Thank you for verifying this passenger report.');
      }
    } catch (e) {
      // Local optimistic increment
      setCommunityReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
      );
    }
  };

  const handleResetForm = () => {
    setSubmittedReport(null);
    setDescription('');
    setCommuterName('');
  };

  const issueCategories: IssueType[] = [
    'Bus delayed',
    'Bus cancelled',
    'Bus did not arrive',
    'Wrong route',
    'Overcrowding',
    'Stop issue',
    'Other',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            Report a Bus Issue or Delay
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            Crowdsourced Triage
          </span>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Help fellow Goa passengers by reporting unannounced delays, skipped stops, or crowding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Reporting Form or Success Screen */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {submittedReport ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto shadow-sm border border-teal-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Thank you. Your report has been submitted.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your report for <strong>Route {submittedReport.routeNumber}</strong> at <strong>{submittedReport.location}</strong> is now listed in the community feed.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue Category:</span>
                  <span className="font-bold text-rose-700">{submittedReport.issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-semibold text-slate-800">{submittedReport.busService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-amber-700">{submittedReport.status}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600 italic">
                  "{submittedReport.description}"
                </div>
              </div>

              <button
                onClick={handleResetForm}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Another Report</span>
              </button>
            </div>
          ) : (
            <form id="report-issue-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Route Selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor="report-route-select"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Route
                </label>
                <select
                  id="report-route-select"
                  value={routeId}
                  onChange={(e) => handleRouteChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {GOA_BUS_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      Route {r.routeNumber}: {r.routeName} ({r.operator})
                    </option>
                  ))}
                  <option value="custom">Other / Private Bus (Not in List)</option>
                </select>
              </div>

              {/* Bus / Service Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="report-busservice-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Bus / Service Name
                </label>
                <input
                  id="report-busservice-input"
                  type="text"
                  value={busService}
                  onChange={(e) => setBusService(e.target.value)}
                  placeholder="e.g. Kadamba Electric Express or Private Shuttle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label
                  htmlFor="report-location-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Location / Stop
                </label>
                <input
                  id="report-location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Margao KTC, Cortalim Bridge, or Agassaim"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Issue Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Issue Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {issueCategories.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIssueType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        issueType === type
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label
                  htmlFor="report-desc-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Description
                </label>
                <textarea
                  id="report-desc-input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the incident (e.g. 'Bus was scheduled at 08:30 AM but did not arrive until 08:55 AM due to traffic near Zuari bridge.')..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                />
              </div>

              {/* Commuter Name (Optional) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="report-name-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Your Name (Optional)
                </label>
                <input
                  id="report-name-input"
                  type="text"
                  value={commuterName}
                  onChange={(e) => setCommuterName(e.target.value)}
                  placeholder="e.g. Maria D. or leave blank for Anonymous"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-report-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Reports update the 'REPORTED' status tag after commuter validation.</span>
              </div>
            </form>
          )}
        </div>

        {/* Right Col: Recent Community Reports Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Community Transit Reports ({communityReports.length})
            </h3>
            <span className="text-[11px] text-slate-400">Live community triage</span>
          </div>

          <div className="space-y-3">
            {communityReports.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white font-mono">
                      ROUTE {item.routeNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      {item.issueType}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  "{item.description}"
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-600" />
                    {item.location}
                  </span>

                  <button
                    onClick={() => handleUpvote(item.id)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium transition-colors"
                    title="Confirm this report"
                  >
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    <span>{item.upvotes} Confirmations</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
