'use client';

import { useState } from 'react';
import timeline from '@/data/timeline.json';

const TAG_LABEL: Record<string, string> = {
  'khoi-dau': 'Khởi đầu',
  'duong-loi': 'Đường lối',
  'to-chuc': 'Tổ chức',
  'chien-dich': 'Chiến sự',
  'quoc-te': 'Quốc tế',
};

export default function Timeline() {
  const [open, setOpen] = useState<string | null>('tl-1946-12-19');

  return (
    <div className="timeline">
      {timeline.events.map((ev) => {
        const isOpen = open === ev.id;
        return (
          <div
            key={ev.id}
            className={`tl-item ${ev.highlight ? 'is-highlight' : ''}`}
          >
            <div
              className={`tl-card ${isOpen ? 'is-open' : ''}`}
              onClick={() => setOpen(isOpen ? null : ev.id)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(isOpen ? null : ev.id);
                }
              }}
            >
              <div className="tl-date">
                {ev.date} · {TAG_LABEL[ev.tag] ?? ev.tag}
              </div>
              <h3 className="tl-title">{ev.title}</h3>
              <p className="tl-summary">{ev.summary}</p>
              <div className="tl-detail">{ev.detail}</div>
              <div className="tl-more">{isOpen ? 'Thu gọn —' : 'Chi tiết +'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
