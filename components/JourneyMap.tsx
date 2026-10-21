'use client';

import { useState } from 'react';
import placesData from '@/data/map-places.json';

const places = [...placesData.places].sort((a, b) => a.order - b.order);

const routeD = places
  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.svg.x} ${p.svg.y}`)
  .join(' ');

export default function JourneyMap() {
  const [activeId, setActiveId] = useState(places[0].id);
  const active = places.find((p) => p.id === activeId) ?? places[0];

  return (
    <div className="journey-layout">
      <div className="journey-svg-wrap">
        <svg viewBox="0 0 820 560" role="img" aria-label="Bản đồ hành trình Đường tới biên giới">
          <defs>
            <linearGradient id="routeGradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#c8393f" />
              <stop offset="100%" stopColor="#ecc98c" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(236,201,140,0.55)" />
              <stop offset="100%" stopColor="rgba(236,201,140,0)" />
            </radialGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(212,162,78,0.07)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="820" height="560" fill="url(#grid)" />

          {/* Sông Hồng & sông Lô (stylized) */}
          <path
            d="M 120 560 C 160 500, 190 470, 240 430 C 290 395, 320 380, 360 330"
            fill="none"
            stroke="rgba(107,163,214,0.35)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 360 330 C 400 300, 420 260, 460 210 C 490 175, 520 160, 560 140"
            fill="none"
            stroke="rgba(107,163,214,0.28)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Biên giới Việt – Trung (stylized) */}
          <path
            d="M 800 470 C 780 380, 760 300, 700 220 C 660 165, 610 110, 540 82 C 470 55, 380 70, 320 110"
            fill="none"
            stroke="rgba(236,229,216,0.3)"
            strokeWidth="2"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />
          <text x="756" y="205" fill="rgba(236,229,216,0.42)" fontSize="12" fontFamily="inherit">
            Biên giới Việt – Trung
          </text>

          {/* Vùng ATK */}
          <ellipse cx="352" cy="318" rx="86" ry="52" fill="rgba(200,57,63,0.09)" stroke="rgba(200,57,63,0.3)" strokeDasharray="5 6" />
          <text x="308" y="252" fill="rgba(224,69,75,0.65)" fontSize="12.5" fontFamily="inherit" fontWeight="600">
            ATK Việt Bắc
          </text>

          {/* Đường hành trình */}
          <path className="route-line" d={routeD} />

          {/* Các điểm */}
          {places.map((p) => {
            const isActive = p.id === activeId;
            return (
              <g
                key={p.id}
                className={`map-node ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveId(p.id)}
                role="button"
                tabIndex={0}
                aria-label={p.name}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveId(p.id);
                  }
                }}
              >
                {isActive && <circle cx={p.svg.x} cy={p.svg.y} r="22" fill="url(#glow)" />}
                <circle
                  className="core"
                  cx={p.svg.x}
                  cy={p.svg.y}
                  r={isActive ? 8.5 : 6.5}
                />
                <text
                  x={p.svg.x + (p.svg.x > 620 ? -12 : 14)}
                  y={p.svg.y + (p.svg.y < 90 ? 20 : -12)}
                  textAnchor={p.svg.x > 620 ? 'end' : 'start'}
                >
                  {p.order}. {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="journey-side" aria-live="polite">
        <div className="place-date">
          Chặng {active.order}/{places.length} · {active.date}
        </div>
        <h3>{active.name}</h3>
        <p>{active.event}</p>
        <div className="journey-hint">
          Bấm vào các điểm trên bản đồ để theo dõi hành trình từ đêm 19-12-1946 đến biên giới
          Cao Bằng – Lạng Sơn. Tọa độ trên bản đồ Leaflet là xấp xỉ, mang tính minh họa.
        </div>
      </aside>
    </div>
  );
}
