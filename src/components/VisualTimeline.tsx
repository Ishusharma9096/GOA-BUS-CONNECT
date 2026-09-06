import React from 'react';
import { BusRoute } from '../types';
import { MapPin, Navigation, Clock, Footprints, ShieldAlert } from 'lucide-react';

interface VisualTimelineProps {
  route: BusRoute;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({ route }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Journey Timeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {route.stops.length} stops across {route.durationFormatted} ({route.operator})
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Walking</span>
          <span className="text-sm font-semibold text-slate-800 flex items-center justify-end gap-1">
            <Footprints className="w-3.5 h-3.5 text-teal-600" />
            {route.walkingFormatted}
          </span>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-[19px] sm:before:left-[27px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {route.stops.map((stop, index) => {
          const isFirst = index === 0;
          const isLast = index === route.stops.length - 1;

          return (
            <div key={stop.id} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-[27px] sm:-left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                  isFirst
                    ? 'bg-teal-600 text-white shadow-sm'
                    : isLast
                    ? 'bg-blue-600 text-white shadow-sm'
                    : stop.isMajor
                    ? 'bg-teal-50 text-teal-800 border-2 border-teal-600'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isFirst ? 'A' : isLast ? 'B' : ''}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        isFirst || isLast
                          ? 'font-bold text-slate-900'
                          : stop.isMajor
                          ? 'font-semibold text-slate-800'
                          : 'text-slate-600'
                      }`}
                    >
                      {stop.name}
                    </span>
                    {isFirst && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        Board Here
                      </span>
                    )}
                    {isLast && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        Exit Stop
                      </span>
                    )}
                  </div>

                  {stop.landmark && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-teal-500" />
                      {stop.landmark}
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-medium text-slate-500">
                    {isFirst
                      ? route.departureTime
                      : isLast
                      ? route.arrivalTime
                      : `+${stop.timeOffsetMinutes}m`}
                  </span>
                </div>
              </div>

              {/* Transit vehicle between stops indicator */}
              {!isLast && (
                <div className="my-2 ml-1 text-slate-400 flex items-center gap-2 text-xs py-1">
                  <span className="text-base">🚌</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    En route • {route.busType}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Walking connection footer */}
      <div className="mt-8 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-2xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-teal-600" />
          <span>
            After exiting at <strong>{route.destinationStopName}</strong>, allow {route.walkingFormatted} to your final destination.
          </span>
        </div>
        <span className="text-slate-400 font-mono">Fare: ₹{route.fare}</span>
      </div>
    </div>
  );
};
