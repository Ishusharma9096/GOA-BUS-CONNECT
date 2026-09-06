import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusRoute } from '../types';
import { Maximize2, Navigation } from 'lucide-react';

interface LeafletMapProps {
  route: BusRoute;
  className?: string;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  route,
  className = '',
  height = '420px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center around Goa
    const centerLat = route.coordinates[0]?.[0] || 15.35;
    const centerLng = route.coordinates[0]?.[1] || 73.85;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 11,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Add standard zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // OpenStreetMap standard tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Polyline for route
    const polyline = L.polyline(route.coordinates, {
      color: '#0d9488', // Teal-600
      weight: 5,
      opacity: 0.85,
      smoothFactor: 1,
      dashArray: route.status === 'SCHEDULED' ? '6, 6' : undefined,
    }).addTo(map);

    // Add Markers for Stops
    route.stops.forEach((stop, index) => {
      const isFirst = index === 0;
      const isLast = index === route.stops.length - 1;

      let iconHtml = '';
      if (isFirst) {
        iconHtml = `
          <div style="background-color: #0d9488; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            A
          </div>
        `;
      } else if (isLast) {
        iconHtml = `
          <div style="background-color: #2563eb; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            B
          </div>
        `;
      } else {
        iconHtml = `
          <div style="background-color: white; border: 2.5px solid #0d9488; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-stop-icon',
        html: iconHtml,
        iconSize: isFirst || isLast ? [26, 26] : [14, 14],
        iconAnchor: isFirst || isLast ? [13, 13] : [7, 7],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="color: #0f172a; font-size: 13px;">${stop.name}</strong><br/>
          <span style="color: #64748b;">${isFirst ? 'Boarding Stop' : isLast ? 'Destination Stop' : 'Intermediate Stop'}</span><br/>
          ${stop.landmark ? `<span style="color: #0d9488; font-size: 11px;">📍 ${stop.landmark}</span><br/>` : ''}
          <span style="color: #475569;">Est. +${stop.timeOffsetMinutes}m from departure</span>
        </div>
      `);
    });

    // If bus has current location, render live bus marker!
    if (route.currentLocation) {
      const busIconHtml = `
        <div style="position: relative; width: 34px; height: 34px;">
          <div style="position: absolute; inset: 0; background-color: ${
            route.status === 'LIVE' ? '#0d9488' : '#f59e0b'
          }; border-radius: 50%; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; inset: 2px; background-color: #0f172a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid ${
            route.status === 'LIVE' ? '#0d9488' : '#f59e0b'
          }; box-shadow: 0 3px 8px rgba(0,0,0,0.4); font-size: 14px;">
            🚌
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'custom-bus-icon',
        html: busIconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const busMarker = L.marker(
        [route.currentLocation.lat, route.currentLocation.lng],
        { icon: busIcon, zIndexOffset: 1000 }
      ).addTo(map);

      busMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <div style="font-weight: bold; color: #0f172a;">${route.routeName}</div>
          <div style="font-size: 11px; color: ${route.status === 'LIVE' ? '#0d9488' : '#d97706'}; font-weight: 600;">
            ● ${route.status === 'LIVE' ? 'LIVE GPS POSITION' : 'REPORTED LOCATION'}
          </div>
          <div style="color: #334155; margin-top: 2px;">📍 ${route.currentLocation.description}</div>
          ${route.currentLocation.speedKmH ? `<div style="color: #64748b; font-size: 11px;">Speed: ${route.currentLocation.speedKmH} km/h</div>` : ''}
        </div>
      `);
    }

    // Fit map bounds to polyline
    map.fitBounds(polyline.getBounds(), {
      padding: [45, 45],
    });

    // Force size recheck after initial render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [route]);

  const handleResetBounds = () => {
    if (!mapInstanceRef.current || !route.coordinates.length) return;
    const polyline = L.polyline(route.coordinates);
    mapInstanceRef.current.fitBounds(polyline.getBounds(), {
      padding: [45, 45],
    });
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}>
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10 bg-slate-100" />

      {/* Floating control buttons */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleResetBounds}
          className="bg-white/95 hover:bg-white text-slate-700 p-2 rounded-lg shadow-md border border-slate-200 text-xs font-medium flex items-center gap-1 transition-all"
          title="Fit full route in view"
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Fit Route</span>
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl p-2.5 shadow-sm text-xs space-y-1.5 max-w-[210px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-600"></div>
          <span className="text-slate-700 font-medium">Origin: {route.origin}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-slate-700 font-medium">Exit: {route.destination}</span>
        </div>
        {route.currentLocation && (
          <div className="flex items-center gap-2 border-t border-slate-100 pt-1">
            <span className="text-sm">🚌</span>
            <span className="text-[11px] font-semibold text-teal-800">
              {route.status === 'LIVE' ? 'Live Bus Tracker' : 'Reported Point'}
            </span>
          </div>
        )}
        <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-1">
          OpenStreetMap • Goa Transit Layer
        </div>
      </div>
    </div>
  );
};
