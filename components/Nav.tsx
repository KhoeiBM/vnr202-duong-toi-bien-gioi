'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#thoi-gian', label: 'Dòng thời gian' },
  { href: '#ban-do', label: 'Bản đồ' },
  { href: '#duong-loi', label: 'Đường lối' },
  { href: '#quiz', label: 'Trắc nghiệm' },
  { href: '#flashcard', label: 'Flashcard' },
  { href: '#lo-trinh', label: 'Lộ trình' },
  { href: '#trich-dan', label: 'Trích dẫn' },
  { href: '#kiem-chung', label: 'Kiểm chứng' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      let current = '';
      for (const link of LINKS) {
        const el = document.querySelector(link.href);
        if (el && el.getBoundingClientRect().top <= 140) {
          current = link.href;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-brand">
          <span className="nav-mark">ĐB</span>
          <span>Đường tới biên giới</span>
        </a>
        <nav className="nav-links" aria-label="Điều hướng chính">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${active === link.href ? 'is-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
