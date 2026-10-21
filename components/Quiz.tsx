'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import quizData from '@/data/quiz.json';

type Mode = 'practice' | 'exam';
type Phase = 'config' | 'playing' | 'result';

interface Question {
  id: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const questions = quizData.questions as Question[];
const topics = quizData.topics;

const DIFF_LABEL: Record<string, string> = {
  de: 'Dễ',
  'trung-binh': 'Trung bình',
  kho: 'Khó',
};

const LETTERS = ['A', 'B', 'C', 'D'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gradeOf(pct: number): string {
  if (pct >= 90) return 'Xuất sắc';
  if (pct >= 80) return 'Giỏi';
  if (pct >= 70) return 'Khá';
  if (pct >= 50) return 'Trung bình';
  return 'Cần ôn thêm';
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const BEST_KEY = 'dtb-quiz-best';

export default function Quiz() {
  const [mode, setMode] = useState<Mode>('practice');
  const [phase, setPhase] = useState<Phase>('config');

  // config
  const [topicFilter, setTopicFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [examCount, setExamCount] = useState(20);
  const [examMinutes, setExamMinutes] = useState(15);

  // game state
  const [list, setList] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEST_KEY);
      if (raw) setBest(Number(raw));
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finish = useCallback(
    (answers: (number | null)[], listArg: Question[]) => {
      stopTimer();
      const correct = answers.reduce<number>(
        (n, a, i) => (a !== null && a === listArg[i].answer ? n + 1 : n),
        0
      );
      const pct = listArg.length ? Math.round((correct / listArg.length) * 100) : 0;
      if (mode === 'exam') {
        try {
          const cur = Number(localStorage.getItem(BEST_KEY) ?? '0');
          if (pct > cur) {
            localStorage.setItem(BEST_KEY, String(pct));
            setBest(pct);
          }
        } catch {
          /* ignore */
        }
      }
      setPhase('result');
    },
    [mode, stopTimer]
  );

  const startPractice = () => {
    const filtered = questions.filter(
      (q) =>
        (topicFilter === 'all' || q.topic === topicFilter) &&
        (diffFilter === 'all' || q.difficulty === diffFilter)
    );
    const l = shuffle(filtered);
    setList(l);
    setPicked(Array(l.length).fill(null));
    setIdx(0);
    setChoice(null);
    setRevealed(false);
    setPhase('playing');
  };

  const startExam = () => {
    const l = shuffle(questions).slice(0, Math.min(examCount, questions.length));
    setList(l);
    setPicked(Array(l.length).fill(null));
    setIdx(0);
    setChoice(null);
    setRevealed(false);
    setSecondsLeft(examMinutes * 60);
    setPhase('playing');
    stopTimer();
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stopTimer();
          setPicked((prev) => {
            const next = [...prev];
            finish(next, l);
            return next;
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => stopTimer, [stopTimer]);

  const current = list[idx];
  const isExam = mode === 'exam';
  const answeredCount = picked.filter((p) => p !== null).length;

  const topicBreakdown = useMemo(() => {
    if (phase !== 'result') return [];
    return topics.map((t) => {
      const qs = list.filter((q) => q.topic === t.id);
      const ok = qs.filter((q) => picked[list.indexOf(q)] === q.answer).length;
      return { name: t.name, total: qs.length, ok };
    });
  }, [phase, list, picked]);

  const correctCount = useMemo(
    () =>
      picked.reduce<number>(
        (n, a, i) => (a !== null && a === list[i]?.answer ? n + 1 : n),
        0
      ),
    [picked, list]
  );
  const pctScore = list.length ? Math.round((correctCount / list.length) * 100) : 0;

  const pickOption = (optIdx: number) => {
    if (isExam) {
      const next = [...picked];
      next[idx] = optIdx;
      setPicked(next);
      return;
    }
    if (revealed) return;
    setChoice(optIdx);
    setRevealed(true);
    const next = [...picked];
    next[idx] = optIdx;
    setPicked(next);
  };

  const goNext = () => {
    if (idx < list.length - 1) {
      setIdx(idx + 1);
      setChoice(null);
      setRevealed(false);
    } else if (!isExam) {
      finish(picked, list);
    }
  };

  const backToConfig = () => {
    stopTimer();
    setPhase('config');
    setList([]);
    setPicked([]);
    setIdx(0);
  };

  /* ---------------- CONFIG ---------------- */
  if (phase === 'config') {
    return (
      <div className="quiz-shell">
        <div className="quiz-mode-tabs" role="tablist" aria-label="Chế độ">
          <button
            className={`quiz-chip ${mode === 'practice' ? 'is-active' : ''}`}
            onClick={() => setMode('practice')}
          >
            Luyện tập
          </button>
          <button
            className={`quiz-chip ${mode === 'exam' ? 'is-active' : ''}`}
            onClick={() => setMode('exam')}
          >
            Thi thử tính giờ
          </button>
        </div>

        {mode === 'practice' ? (
          <>
            <p className="section-desc" style={{ marginBottom: 20 }}>
              Chọn chủ đề và độ khó, trả lời từng câu với đáp án và giải thích tức thì. Không giới
              hạn thời gian — sai ở đâu, học ở đó.
            </p>
            <div className="quiz-config-grid">
              <div className="quiz-field">
                <label htmlFor="quiz-topic">Chủ đề</label>
                <select
                  id="quiz-topic"
                  className="quiz-select"
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                >
                  <option value="all">Tất cả chủ đề</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="quiz-field">
                <label htmlFor="quiz-diff">Độ khó</label>
                <select
                  id="quiz-diff"
                  className="quiz-select"
                  value={diffFilter}
                  onChange={(e) => setDiffFilter(e.target.value)}
                >
                  <option value="all">Tất cả độ khó</option>
                  <option value="de">Dễ</option>
                  <option value="trung-binh">Trung bình</option>
                  <option value="kho">Khó</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={startPractice}>
              Bắt đầu luyện tập
            </button>
          </>
        ) : (
          <>
            <p className="section-desc" style={{ marginBottom: 20 }}>
              Chế độ thi: câu hỏi bốc ngẫu nhiên từ ngân hàng {questions.length} câu, không xem
              giải thích cho đến khi nộp bài. Kỷ lục được lưu trên máy bạn.
            </p>
            <div className="quiz-config-grid">
              <div className="quiz-field">
                <label htmlFor="exam-count">Số câu hỏi</label>
                <select
                  id="exam-count"
                  className="quiz-select"
                  value={examCount}
                  onChange={(e) => setExamCount(Number(e.target.value))}
                >
                  <option value={10}>10 câu</option>
                  <option value={20}>20 câu</option>
                  <option value={30}>30 câu</option>
                  <option value={40}>40 câu</option>
                </select>
              </div>
              <div className="quiz-field">
                <label htmlFor="exam-time">Thời gian</label>
                <select
                  id="exam-time"
                  className="quiz-select"
                  value={examMinutes}
                  onChange={(e) => setExamMinutes(Number(e.target.value))}
                >
                  <option value={10}>10 phút</option>
                  <option value={15}>15 phút</option>
                  <option value={20}>20 phút</option>
                  <option value={30}>30 phút</option>
                </select>
              </div>
            </div>
            <div className="quiz-footer" style={{ marginTop: 0 }}>
              <button className="btn btn-primary" onClick={startExam}>
                Vào phòng thi
              </button>
              <span className="best-score">
                Kỷ lục cá nhân: <strong>{best !== null ? `${best}%` : 'chưa có'}</strong>
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ---------------- RESULT ---------------- */
  if (phase === 'result') {
    return (
      <div className="quiz-shell">
        <div className="quiz-result">
          <div className="quiz-score-ring" style={{ ['--score' as string]: pctScore }}>
            <div className="num">
              {pctScore}%
              <small>
                {correctCount}/{list.length} đúng
              </small>
            </div>
          </div>
          <h3 className="quiz-grade">{gradeOf(pctScore)}</h3>
          <p className="section-desc" style={{ marginInline: 'auto' }}>
            {isExam
              ? `Hoàn thành ${list.length} câu trong chế độ thi tính giờ.${
                  best !== null ? ` Kỷ lục hiện tại: ${best}%.` : ''
                }`
              : 'Xem lại các câu dưới đây để củng cố kiến thức nhé.'}
          </p>

          <div className="quiz-breakdown">
            {topicBreakdown
              .filter((t) => t.total > 0)
              .map((t) => (
                <div className="bd" key={t.name}>
                  <div className="label">{t.name}</div>
                  <div className="value">
                    {t.ok}/{t.total} đúng
                  </div>
                </div>
              ))}
          </div>

          <div className="quiz-review-list">
            {list.map((q, i) => {
              const a = picked[i];
              const ok = a === q.answer;
              return (
                <div key={q.id} className={`quiz-review-item ${ok ? '' : 'is-wrong'}`}>
                  <div className="q">
                    {i + 1}. {q.question}
                  </div>
                  <div className={`a ${ok ? 'ok' : 'bad'}`}>
                    Bạn chọn: {a !== null ? `${LETTERS[a]}. ${q.options[a]}` : 'Không trả lời'}
                  </div>
                  {!ok && (
                    <div className="a ok">
                      Đúng: {LETTERS[q.answer]}. {q.options[q.answer]}
                    </div>
                  )}
                  <div className="a">💡 {q.explanation}</div>
                </div>
              );
            })}
          </div>

          <div className="quiz-footer">
            <button className="btn btn-ghost" onClick={backToConfig}>
              Chọn lại chế độ
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (isExam) startExam();
                else startPractice();
              }}
            >
              Làm lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- PLAYING ---------------- */
  if (!current) return null;

  const progress = ((idx + (isExam ? 1 : picked[idx] !== null ? 1 : 0)) / list.length) * 100;

  return (
    <div className="quiz-shell">
      <div className="quiz-progress-row">
        <span>
          Câu {idx + 1}/{list.length}
          {isExam ? ` · Đã trả lời ${answeredCount}` : ''}
        </span>
        {isExam ? (
          <span className={`quiz-timer ${secondsLeft <= 60 ? 'is-low' : ''}`}>
            ⏱ {fmtTime(secondsLeft)}
          </span>
        ) : (
          <span className="best-score">
            Điểm tạm tính: <strong>{correctCount}</strong> đúng
          </span>
        )}
      </div>
      <div className="quiz-bar">
        <div className="quiz-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-meta">
        <span className="quiz-tag">{topics.find((t) => t.id === current.topic)?.name}</span>
        <span className="quiz-tag">{DIFF_LABEL[current.difficulty] ?? current.difficulty}</span>
      </div>

      <h3 className="quiz-question">{current.question}</h3>

      <div className="quiz-options">
        {current.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (isExam && picked[idx] === i) cls += ' is-correct';
          if (!isExam && revealed) {
            if (i === current.answer) cls += ' is-correct';
            else if (i === choice) cls += ' is-wrong';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => pickOption(i)}
              disabled={!isExam && revealed}
            >
              <span className="opt-letter">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {!isExam && (
        <div className={`quiz-explain ${revealed ? 'is-visible' : ''}`}>
          <strong>{choice === current.answer ? 'Chính xác! ' : 'Chưa đúng. '}</strong>
          {current.explanation}
        </div>
      )}

      <div className="quiz-footer">
        <button className="btn btn-ghost" onClick={backToConfig}>
          Thoát
        </button>
        {isExam ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {idx > 0 && (
              <button className="btn btn-ghost" onClick={() => setIdx(idx - 1)}>
                Câu trước
              </button>
            )}
            {idx < list.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setIdx(idx + 1)}>
                Câu sau
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => finish(picked, list)}>
                Nộp bài
              </button>
            )}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={goNext} disabled={!revealed}>
            {idx < list.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
          </button>
        )}
      </div>
    </div>
  );
}
