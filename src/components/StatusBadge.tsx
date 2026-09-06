import React from 'react';
import { BusStatusType } from '../types';
import { Radio, Users, Calendar, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BusStatusType;
  lastUpdated?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  lastUpdated,
  size = 'md',
  showSubtitle = false,
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[10px] font-bold px-2 py-1 gap-1.5',
    lg: 'text-xs font-bold px-2.5 py-1 gap-1.5',
  };

  switch (status) {
    case 'LIVE':
      return (
        <div className="inline-flex flex-col">
          <span
            className={`inline-flex items-center rounded bg-green-100 text-green-700 font-bold uppercase tracking-wider ${sizeClasses[size]}`}
          >
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
            <span>LIVE</span>
          </span>
          {showSubtitle && (
            <span className="text-[10px] text-slate-400 mt-1">
              {lastUpdated || 'Updated 2m ago'}
            </span>
          )}
        </div>
      );

    case 'REPORTED':
      return (
        <div className="inline-flex flex-col">
          <span
            className={`inline-flex items-center rounded bg-orange-100 text-orange-700 font-bold uppercase tracking-wider ${sizeClasses[size]}`}
          >
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
            <span>REPORTED</span>
          </span>
          {showSubtitle && (
            <span className="text-[10px] text-slate-400 mt-1">
              {lastUpdated || 'Reported 12m ago'}
            </span>
          )}
        </div>
      );

    case 'SCHEDULED':
      return (
        <div className="inline-flex flex-col">
          <span
            className={`inline-flex items-center rounded bg-blue-100 text-blue-700 font-bold uppercase tracking-wider ${sizeClasses[size]}`}
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            <span>SCHEDULED</span>
          </span>
          {showSubtitle && (
            <span className="text-[10px] text-slate-400 mt-1">
              {lastUpdated || 'Timetable Data'}
            </span>
          )}
        </div>
      );

    default:
      return (
        <span
          className={`inline-flex items-center rounded bg-slate-100 text-slate-600 font-bold uppercase tracking-wider ${sizeClasses[size]}`}
        >
          <AlertCircle className="w-3 h-3 text-slate-400" />
          <span>UNKNOWN</span>
        </span>
      );
  }
};
