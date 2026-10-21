'use client';

import { useEffect, useMemo, useState } from 'react';
import roadmap from '@/data/roadmap.json';

const PROGRESS_KEY = 'dtb-roadmap';

export default function Roadmap() {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (taskId: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const totalTasks = useMemo(
    () => roadmap.days.reduce((n, d) => n + d.tasks.length, 0),
    []
  );
  const pct = totalTasks ? Math.round((done.size / totalTasks) * 100) : 0;

  return (
    <div>
      <div className="roadmap-progress">
        <div className="row">
          <span>
            Tiến độ: <strong className="text-gold">{done.size}/{totalTasks}</strong> nhiệm vụ
          </span>
          <span>{pct}%</span>
        </div>
        <div className="quiz-bar">
          <div className="quiz-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="roadmap-grid">
        {roadmap.days.map((day) => {
          const allDone = day.tasks.every((t) => done.has(t.id));
          return (
            <div key={day.day} className={`roadmap-day ${allDone ? 'is-done' : ''}`}>
              <div className="day-badge">
                {allDone ? '✓ ' : ''}Ngày {day.day}
              </div>
              <h3>{day.title}</h3>
              <p className="desc">{day.description}</p>
              <ul className="task-list">
                {day.tasks.map((task) => {
                  const checked = done.has(task.id);
                  return (
                    <li key={task.id} className={`task-item ${checked ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        id={task.id}
                        checked={checked}
                        onChange={() => toggle(task.id)}
                      />
                      <span>{task.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
