import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { PlanJourneyPage } from './pages/PlanJourneyPage';
import { RoutesPage } from './pages/RoutesPage';
import { JourneyDetailsPage } from './pages/JourneyDetailsPage';
import { AssistantPage } from './pages/AssistantPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { InsightsPage } from './pages/InsightsPage';
import { GOA_BUS_ROUTES } from './data/mockData';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [origin, setOrigin] = useState('Margao');
  const [destination, setDestination] = useState('Panaji');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-101');
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string>('');
  const [reportPrefill, setReportPrefill] = useState<{
    routeId?: string;
    routeNumber?: string;
    busService?: string;
  }>({});

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Flow handlers
  const handlePlanJourney = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
    navigateTo('/plan');
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    navigateTo('/journey');
  };

  const handleAskAIAboutJourney = (routeId?: string, query?: string) => {
    if (routeId) setSelectedRouteId(routeId);
    if (query) setAssistantInitialQuery(query);
    navigateTo('/assistant');
  };

  const handleReportIssuePrefill = (routeId: string, routeNumber: string, busService: string) => {
    setReportPrefill({ routeId, routeNumber, busService });
    navigateTo('/report');
  };

  const selectedRoute =
    GOA_BUS_ROUTES.find((r) => r.id === selectedRouteId) || GOA_BUS_ROUTES[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-teal-600 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Navigation Header */}
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            onPlanJourney={handlePlanJourney}
            onNavigate={navigateTo}
            onSelectRoute={handleSelectRoute}
          />
        )}

        {currentPath === '/plan' && (
          <PlanJourneyPage
            initialOrigin={origin}
            initialDestination={destination}
            onSelectRoute={handleSelectRoute}
            onAskAIAboutJourney={handleAskAIAboutJourney}
          />
        )}

        {currentPath === '/routes' && (
          <RoutesPage
            onSelectRoute={handleSelectRoute}
            onAskAIAboutJourney={handleAskAIAboutJourney}
          />
        )}

        {currentPath === '/journey' && (
          <JourneyDetailsPage
            route={selectedRoute}
            onBack={() => navigateTo('/plan')}
            onAskAI={handleAskAIAboutJourney}
            onReportIssue={handleReportIssuePrefill}
            onToast={addToast}
          />
        )}

        {currentPath === '/assistant' && (
          <AssistantPage
            initialRouteId={selectedRouteId}
            initialQuery={assistantInitialQuery}
            onSelectRoute={handleSelectRoute}
          />
        )}

        {currentPath === '/alerts' && (
          <AlertsPage onNavigateReport={() => navigateTo('/report')} />
        )}

        {currentPath === '/report' && (
          <ReportIssuePage
            initialRouteId={reportPrefill.routeId}
            initialRouteNumber={reportPrefill.routeNumber}
            initialBusService={reportPrefill.busService}
            onToast={addToast}
          />
        )}

        {currentPath === '/insights' && (
          <InsightsPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
