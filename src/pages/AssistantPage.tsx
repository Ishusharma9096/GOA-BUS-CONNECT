import React, { useState, useEffect, useRef } from 'react';
import { GOA_BUS_ROUTES } from '../data/mockData';
import { ChatMessage, BusRoute } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Sparkles,
  Send,
  Bus,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Footprints,
  Info,
  X,
} from 'lucide-react';

interface AssistantPageProps {
  initialRouteId?: string;
  initialQuery?: string;
  onSelectRoute: (routeId: string) => void;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({
  initialRouteId,
  initialQuery,
  onSelectRoute,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(initialRouteId);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultGreeting: ChatMessage = {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am your GoaBusConnect AI Travel Assistant.
I can help you compare bus options, identify fastest routes, find boarding bays, and inspect live vs scheduled service status across Goa (Panaji, Margao, Vasco, Mapusa, Ponda, Calangute).

How can I assist your journey today?`,
      timestamp: 'Just now',
    };
    return [defaultGreeting];
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeRoute = selectedRouteId
    ? GOA_BUS_ROUTES.find((r) => r.id === selectedRouteId)
    : undefined;

  const suggestedPrompts = [
    'Find my fastest route from Margao to Panaji',
    'What is the cheapest option to travel from Margao?',
    'Where do I board at Panaji KTC?',
    'Is my bus delayed?',
    'I want minimal walking distance',
    'Which buses go to Calangute beach?',
  ];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If initial query provided, auto trigger it once
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || loading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          selectedRouteId: selectedRouteId,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach assistant server');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingNotice: data.groundingNotice,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const fallbackMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered a momentary connection issue. Based on scheduled timetables, Route 101 operates every 15 minutes between Margao and Panaji. Current status is SCHEDULED.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content: `Chat session reset. What Goa transit questions can I answer for you?`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-teal-600" />
              AI Travel Assistant
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              Gemini Powered
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Ask transit questions in natural language. Truthful status reporting without simulated GPS hallucinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Active Context Banner if asking about a specific route */}
      {activeRoute ? (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
              {activeRoute.routeNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Focus Route: {activeRoute.routeName}
                </span>
                <StatusBadge status={activeRoute.status} size="sm" />
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {activeRoute.origin} → {activeRoute.destination} ({activeRoute.durationFormatted} • ₹{activeRoute.fare})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectRoute(activeRoute.id)}
              className="text-xs font-semibold text-teal-800 hover:underline flex items-center gap-1"
            >
              <span>View Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => setSelectedRouteId(undefined)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              title="Clear Route Focus"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Tip: You can select a specific route to inspect delays, bay locations, or stops in context.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">Context Route:</span>
            <select
              value={selectedRouteId || ''}
              onChange={(e) => setSelectedRouteId(e.target.value || undefined)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="">All Goa Transit (General)</option>
              {GOA_BUS_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  Route {r.routeNumber} ({r.origin} - {r.destination})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-50 text-slate-900 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  {/* Message Content formatted with line breaks */}
                  <div className="whitespace-pre-wrap font-normal">
                    {msg.content}
                  </div>

                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.groundingNotice && (
                      <span className="flex items-center gap-1 font-medium text-teal-700">
                        <ShieldCheck className="w-3 h-3" />
                        {msg.groundingNotice}
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                <span>Consulting Goa transit database & Gemini reasoning...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2 flex items-center gap-1 shrink-0">
            <HelpCircle className="w-3.5 h-3.5" /> Suggestions:
          </span>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-700 border border-slate-200 font-medium transition-colors shrink-0 shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          id="assistant-chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            id="assistant-input-box"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything (e.g., 'Which bus is fastest to Panaji?', 'Where should I board?')..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
            disabled={loading}
          />

          <button
            type="submit"
            id="assistant-send-btn"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* AI Grounding Policy Banner */}
      <div className="rounded-2xl p-4 bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-900 block">
            Responsible AI Data Guarantee
          </span>
          <p>
            The GoaBusConnect assistant answers using verified timetables and active telemetry from the Kadamba transport directory. If real-time GPS telemetry is unavailable for a requested bus, it will explicitly advise you that the timing is based on published schedules.
          </p>
        </div>
      </div>
    </div>
  );
};
