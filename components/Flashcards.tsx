'use client';

import { useEffect, useMemo, useState } from 'react';
import flashcards from '@/data/flashcards.json';
import quizData from '@/data/quiz.json';

const topicName: Record<string, string> = Object.fromEntries(
  quizData.topics.map((t) => [t.id, t.name])
);

const KNOWN_KEY = 'dtb-flash-known';

export default function Flashcards() {
  const [filter, setFilter] = useState('all');
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [known, setKnown] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KNOWN_KEY);
      if (raw) setKnown(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Set<string>) => {
    setKnown(next);
    try {
      localStorage.setItem(KNOWN_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  };

  const toggleFlip = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleKnown = (id: string) => {
    const next = new Set(known);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persist(next);
  };

  const cards = useMemo(
    () =>
      flashcards.cards.filter((c) => filter === 'all' || c.topic === filter),
    [filter]
  );

  return (
    <div>
      <div className="flash-toolbar">
        <button
          className={`quiz-chip ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </button>
        {quizData.topics.map((t) => (
          <button
            key={t.id}
            className={`quiz-chip ${filter === t.id ? 'is-active' : ''}`}
            onClick={() => setFilter(t.id)}
          >
            {t.name}
          </button>
        ))}
        <span className="flash-count">
          {known.size}/{flashcards.cards.length} thẻ đã thuộc · bấm thẻ để lật
        </span>
      </div>

      <div className="flash-grid">
        {cards.map((card) => {
          const isFlipped = flipped.has(card.id);
          const isKnown = known.has(card.id);
          return (
            <div
              key={card.id}
              className={`flash-card ${isFlipped ? 'is-flipped' : ''} ${
                isKnown ? 'is-known' : ''
              }`}
              onClick={() => toggleFlip(card.id)}
              role="button"
              tabIndex={0}
              aria-label={`Flashcard: ${card.front}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFlip(card.id);
                }
              }}
            >
              <div className="flash-inner">
                <div className="flash-face flash-front">
                  <div className="flash-topic">{topicName[card.topic] ?? card.topic}</div>
                  <p className="front-text">{card.front}</p>
                  <div className="flash-foot">
                    <span>Chạm để lật ⟳</span>
                    <button
                      className="flash-known"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleKnown(card.id);
                      }}
                    >
                      {isKnown ? '✓ Đã thuộc' : 'Đánh dấu đã thuộc'}
                    </button>
                  </div>
                </div>
                <div className="flash-face flash-back">
                  <div className="flash-topic">Đáp án</div>
                  <p className="back-text">{card.back}</p>
                  <div className="flash-foot">
                    <span>Chạm để lật lại ⟲</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
