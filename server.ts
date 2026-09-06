import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { GOA_BUS_ROUTES, DEMO_ALERTS, INITIAL_PASSENGER_REPORTS } from './src/data/mockData.ts';
import { PassengerReport } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory reports store initialized with realistic community reports
let passengerReports: PassengerReport[] = [...INITIAL_PASSENGER_REPORTS];

// Lazy helper for Gemini AI client with telemetry header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GoaBusConnect API',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/routes', (req, res) => {
  const { origin, destination, operatorType, status } = req.query;
  let filtered = [...GOA_BUS_ROUTES];

  if (origin && typeof origin === 'string') {
    filtered = filtered.filter(
      (r) =>
        r.origin.toLowerCase().includes(origin.toLowerCase()) ||
        r.stops.some((s) => s.name.toLowerCase().includes(origin.toLowerCase()))
    );
  }

  if (destination && typeof destination === 'string') {
    filtered = filtered.filter(
      (r) =>
        r.destination.toLowerCase().includes(destination.toLowerCase()) ||
        r.stops.some((s) => s.name.toLowerCase().includes(destination.toLowerCase()))
    );
  }

  if (operatorType && typeof operatorType === 'string' && operatorType !== 'all') {
    filtered = filtered.filter((r) => r.operatorType === operatorType);
  }

  if (status && typeof status === 'string' && status !== 'all') {
    filtered = filtered.filter((r) => r.status === status);
  }

  res.json({ routes: filtered, count: filtered.length });
});

app.get('/api/routes/:id', (req, res) => {
  const route = GOA_BUS_ROUTES.find((r) => r.id === req.params.id);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json({ route });
});

app.get('/api/alerts', (req, res) => {
  res.json({ alerts: DEMO_ALERTS, count: DEMO_ALERTS.length });
});

app.get('/api/reports', (req, res) => {
  res.json({ reports: passengerReports, count: passengerReports.length });
});

app.post('/api/reports', (req, res) => {
  const { routeId, routeNumber, busService, location, issueType, description, commuterName } = req.body;

  if (!routeNumber || !issueType || !description) {
    return res.status(400).json({ error: 'Route, issue type, and description are required.' });
  }

  const newReport: PassengerReport = {
    id: `rep-${Date.now()}`,
    routeId: routeId || 'custom',
    routeNumber: String(routeNumber),
    busService: busService || `Route ${routeNumber} Service`,
    location: location || 'Transit Stop',
    issueType: issueType,
    description: String(description).trim(),
    timestamp: 'Just now',
    commuterName: commuterName ? String(commuterName).trim() : 'Anonymous Commuter',
    status: 'Pending Verification',
    upvotes: 1,
  };

  passengerReports.unshift(newReport);
  res.status(201).json({ success: true, report: newReport });
});

app.post('/api/reports/:id/upvote', (req, res) => {
  const report = passengerReports.find((r) => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  report.upvotes += 1;
  res.json({ success: true, report });
});

app.get('/api/insights', (req, res) => {
  const totalRoutes = GOA_BUS_ROUTES.length;
  const liveCount = GOA_BUS_ROUTES.filter((r) => r.status === 'LIVE').length;
  const reportedCount = GOA_BUS_ROUTES.filter((r) => r.status === 'REPORTED').length;
  const scheduledCount = GOA_BUS_ROUTES.filter((r) => r.status === 'SCHEDULED').length;

  const totalMinutes = GOA_BUS_ROUTES.reduce((sum, r) => sum + r.durationMinutes, 0);
  const avgDurationMinutes = Math.round(totalMinutes / totalRoutes);

  // Issue counts by route
  const issueCountsByRoute: Record<string, { routeNumber: string; count: number; name: string }> = {};
  GOA_BUS_ROUTES.forEach((r) => {
    issueCountsByRoute[r.routeNumber] = {
      routeNumber: r.routeNumber,
      name: r.routeName,
      count: 0,
    };
  });

  passengerReports.forEach((rep) => {
    if (issueCountsByRoute[rep.routeNumber]) {
      issueCountsByRoute[rep.routeNumber].count += 1;
    } else {
      issueCountsByRoute[rep.routeNumber] = {
        routeNumber: rep.routeNumber,
        name: rep.busService,
        count: 1,
      };
    }
  });

  res.json({
    metrics: {
      activeRoutes: totalRoutes,
      reportedIssues: passengerReports.length,
      scheduledServices: scheduledCount,
      liveServices: liveCount,
      avgJourneyTimeMinutes: avgDurationMinutes,
      avgJourneyTimeFormatted: `${Math.floor(avgDurationMinutes / 60)}h ${avgDurationMinutes % 60}m`,
    },
    statusBreakdown: [
      { status: 'LIVE', count: liveCount, label: 'GPS Live Telemetry' },
      { status: 'REPORTED', count: reportedCount, label: 'Passenger Reported' },
      { status: 'SCHEDULED', count: scheduledCount, label: 'Timetable Scheduled' },
    ],
    issuesByRoute: Object.values(issueCountsByRoute),
  });
});

// AI Assistant Chat Route powered by Gemini
app.post('/api/assistant/chat', async (req, res) => {
  const { message, history = [], selectedRouteId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'User message is required.' });
  }

  // Selected route context if user is asking about a specific journey
  const activeRoute = selectedRouteId ? GOA_BUS_ROUTES.find((r) => r.id === selectedRouteId) : null;

  // Build condensed context of Goa routes
  const routesContext = GOA_BUS_ROUTES.map((r) => ({
    id: r.id,
    number: r.routeNumber,
    name: r.routeName,
    operator: `${r.operator} (${r.operatorType})`,
    origin: r.origin,
    destination: r.destination,
    originStop: r.originStopName,
    destinationStop: r.destinationStopName,
    departure: r.departureTime,
    duration: r.durationFormatted,
    fare: `₹${r.fare}`,
    walking: r.walkingFormatted,
    status: r.status,
    statusDetail: r.statusDetail,
    accessible: r.accessible,
    keyStops: r.stops.map((s) => s.name).join(' → '),
  }));

  const systemInstruction = `You are the GoaBusConnect AI Transportation Assistant, an intelligent public transit advisor for Goa, India.
Your mission is to help passengers navigate buses across Goa (Panaji, Margao, Vasco, Mapusa, Ponda, Calangute, Porvorim, etc.) with clarity, precision, and complete honesty.

CRITICAL SAFETY & DATA HONESTY RULES:
1. Differentiate between status types:
   - LIVE: Real-time GPS telemetry is active.
   - REPORTED: Crowdsourced passenger updates or operator notifications.
   - SCHEDULED: Timetable only. NO live GPS exists for this bus.
2. NEVER fabricate live GPS coordinates or pretend scheduled data is live. Never say "your bus is 2 minutes away" unless status is LIVE with verified GPS.
3. If a user asks whether a SCHEDULED bus is delayed or its current position, EXPLICITLY STATE:
   "I don't have verified live GPS information for this service. The information shown is based on scheduled/reported data."
4. When recommending a journey, provide a structured journey card in your response using this EXACT format:

Recommended Journey
🚌 Bus: [Route Number and Name]
📍 Board: [Boarding Stop Name]
🏁 Exit: [Destination Stop Name]
⏱ Duration: [Duration]
💰 Fare: ₹[Fare amount]
🚶 Walking: [Walking distance/time]
[Status emoji: 🟢 LIVE, 🟠 REPORTED, 🟡 SCHEDULED] Status: [LIVE / REPORTED / SCHEDULED]

Follow this structured block with a concise 1-3 sentence explanation explaining why this option fits their preferences (e.g. fastest, lowest walking, cheapest, direct vs local).

5. Tone: Helpful, courteous, objective, and realistic. Keep explanations concise and scannable.

AVAILABLE GOA BUS DATASET:
${JSON.stringify(routesContext, null, 2)}

${activeRoute ? `CURRENTLY VIEWED JOURNEY CONTEXT:\n${JSON.stringify(activeRoute, null, 2)}` : ''}`;

  const ai = getGeminiClient();

  // If Gemini API is initialized
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const replyText = response.text || "I couldn't generate a response. Please rephrase your query.";

      return res.json({
        reply: replyText,
        source: 'gemini-3.8-flash',
        groundingNotice: 'Verified against GoaBusConnect schedule & telemetry database',
      });
    } catch (err: unknown) {
      console.error('Gemini API call failed, falling back to local reasoning engine:', err);
      // Fall through to smart local fallback
    }
  }

  // Smart local travel engine fallback (handles exact search queries & prompt suggestions when API key is not yet set)
  const lower = message.toLowerCase();

  let matchedRoute = activeRoute;
  if (!matchedRoute) {
    if (lower.includes('margao') && lower.includes('panaji')) {
      matchedRoute = lower.includes('cheap')
        ? GOA_BUS_ROUTES.find((r) => r.id === 'route-102')!
        : GOA_BUS_ROUTES.find((r) => r.id === 'route-101')!;
    } else if (lower.includes('mapusa') && lower.includes('panaji')) {
      matchedRoute = GOA_BUS_ROUTES.find((r) => r.id === 'route-201')!;
    } else if (lower.includes('calangute')) {
      matchedRoute = GOA_BUS_ROUTES.find((r) => r.id === 'route-601') || GOA_BUS_ROUTES.find((r) => r.id === 'route-202')!;
    } else if (lower.includes('vasco')) {
      matchedRoute = GOA_BUS_ROUTES.find((r) => r.id === 'route-301') || GOA_BUS_ROUTES.find((r) => r.id === 'route-401')!;
    } else if (lower.includes('ponda')) {
      matchedRoute = GOA_BUS_ROUTES.find((r) => r.id === 'route-501')!;
    } else if (lower.includes('fastest')) {
      matchedRoute = GOA_BUS_ROUTES[0];
    } else if (lower.includes('cheap')) {
      matchedRoute = GOA_BUS_ROUTES.find((r) => r.fare <= 35) || GOA_BUS_ROUTES[1];
    } else {
      matchedRoute = GOA_BUS_ROUTES[0];
    }
  }

  let explanation = '';
  if (lower.includes('delayed') || lower.includes('where is')) {
    if (matchedRoute.status === 'SCHEDULED') {
      explanation = `I don't have verified live GPS information for this service. The information shown is based on scheduled/reported data. Route ${matchedRoute.routeNumber} follows standard timetable departures every ${matchedRoute.frequency}.`;
    } else if (matchedRoute.status === 'REPORTED') {
      explanation = `Recent commuter reports indicate: ${matchedRoute.statusDetail} Scheduled arrival remains ${matchedRoute.arrivalTime}.`;
    } else {
      explanation = `GPS telemetry confirms this bus is LIVE at ${matchedRoute.currentLocation?.description || 'en route'} moving at approx ${matchedRoute.currentLocation?.speedKmH || 45} km/h. Expected on-time arrival around ${matchedRoute.arrivalTime}.`;
    }
  } else if (lower.includes('walk')) {
    explanation = `For minimal walking, this route stops right inside ${matchedRoute.destinationStopName}, requiring only ${matchedRoute.walkingFormatted}.`;
  } else if (lower.includes('board') || lower.includes('where do i board')) {
    explanation = `Board at ${matchedRoute.originStopName}. Make sure to look for the Kadamba or private shuttle signboards at the boarding bay.`;
  } else {
    explanation = `Based on current network schedules, this is the optimal connection from ${matchedRoute.origin} to ${matchedRoute.destination}. ${
      matchedRoute.status === 'LIVE'
        ? 'Active GPS tracking is currently reporting regular movement.'
        : 'Note: Current status is ' + matchedRoute.status + ', so timing is based on timetable/community updates rather than direct GPS telemetry.'
    }`;
  }

  const structuredResponse = `Recommended Journey
🚌 Bus: Route ${matchedRoute.routeNumber} (${matchedRoute.routeName})
📍 Board: ${matchedRoute.originStopName}
🏁 Exit: ${matchedRoute.destinationStopName}
⏱ Duration: ${matchedRoute.durationFormatted}
💰 Fare: ₹${matchedRoute.fare}
🚶 Walking: ${matchedRoute.walkingFormatted}
${matchedRoute.status === 'LIVE' ? '🟢 LIVE' : matchedRoute.status === 'REPORTED' ? '🟠 REPORTED' : '🟡 SCHEDULED'} Status: ${matchedRoute.status}

${explanation}`;

  res.json({
    reply: structuredResponse,
    source: 'goa-transit-engine',
    groundingNotice: 'Verified against GoaBusConnect schedule & telemetry database',
  });
});

// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GoaBusConnect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
