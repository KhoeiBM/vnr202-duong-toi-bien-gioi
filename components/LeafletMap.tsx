'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMapType } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import placesData from '@/data/map-places.json';

const places = [...placesData.places].sort((a, b) => a.order - b.order);

export default function LeafletMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMapType | null>(null);

  useEffect(() => {
    let disposed = false;

    (async () => {
      const L = (await import('leaflet')).default;

      if (disposed || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [21.9, 106.3],
        zoom: 7,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const latlngs: [number, number][] = [];

      places.forEach((p) => {
        latlngs.push([p.coords[0], p.coords[1]]);
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:14px;height:14px;border-radius:50%;
            background:${p.tag === 'bien-gioi' ? '#e0454b' : '#d4a24e'};
            border:2px solid #0a0c10;
            box-shadow:0 0 10px rgba(212,162,78,0.8);
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([p.coords[0], p.coords[1]], { icon })
          .addTo(map)
          .bindPopup(
            `<strong style="font-size:14px">${p.order}. ${p.name}</strong><br/>
             <em>${p.date}</em><br/>
             <span style="font-size:12.5px">${p.event}</span>`
          );
      });

      L.polyline(latlngs, {
        color: '#d4a24e',
        weight: 2.5,
        dashArray: '8 8',
        opacity: 0.85,
      }).addTo(map);

      map.fitBounds(L.latLngBounds(latlngs), { padding: [42, 42] });
    })();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div>
      <div className="leaflet-wrap" ref={containerRef} />
      <p className="map-note">
        Bản đồ nền: OpenStreetMap. Nhấp vào từng ghim để xem chi tiết; tọa độ mang tính xấp xỉ,
        phục vụ minh họa học tập.
      </p>
    </div>
  );
}
