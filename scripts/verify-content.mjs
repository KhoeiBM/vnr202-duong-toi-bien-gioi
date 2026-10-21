#!/usr/bin/env node
/**
 * Kiểm chứng nội dung website "Đường tới biên giới".
 * Chạy: npm run verify:content
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

const errors = [];
const ok = (cond, msg) => {
  if (!cond) errors.push(msg);
};

// ---- quiz ----
const quiz = read('data/quiz.json');
ok(quiz.questions.length >= 80, `quiz.json: cần >= 80 câu, hiện có ${quiz.questions.length}`);
const topicIds = new Set(quiz.topics.map((t) => t.id));
const ids = new Set();
for (const q of quiz.questions) {
  ok(!ids.has(q.id), `quiz: id trùng ${q.id}`);
  ids.add(q.id);
  ok(topicIds.has(q.topic), `quiz ${q.id}: topic không tồn tại "${q.topic}"`);
  ok(['de', 'trung-binh', 'kho'].includes(q.difficulty), `quiz ${q.id}: độ khó lạ "${q.difficulty}"`);
  ok(Array.isArray(q.options) && q.options.length === 4, `quiz ${q.id}: cần đúng 4 lựa chọn`);
  ok(
    Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4,
    `quiz ${q.id}: answerIndex không hợp lệ`
  );
  ok(typeof q.explanation === 'string' && q.explanation.length > 20, `quiz ${q.id}: thiếu giải thích`);
}
for (const t of quiz.topics) {
  const n = quiz.questions.filter((q) => q.topic === t.id).length;
  ok(n > 0, `topic "${t.id}" không có câu hỏi nào`);
}

// ---- quotes ----
const quotes = read('data/quotes.json');
ok(quotes.quotes.length >= 8, `quotes.json: cần >= 8 trích dẫn`);
for (const q of quotes.quotes) {
  ok(typeof q.source === 'string' && q.source.length > 5, `quote ${q.id}: thiếu nguồn`);
  ok(
    typeof q.sourceUrl === 'string' && /^https?:\/\//.test(q.sourceUrl),
    `quote ${q.id}: sourceUrl không hợp lệ`
  );
  ok(typeof q.verbatim === 'boolean', `quote ${q.id}: thiếu cờ verbatim`);
}

// ---- verification ----
const verification = read('data/verification.json');
ok(verification.items.length >= 10, `verification.json: cần >= 10 mục`);
for (const item of verification.items) {
  ok(item.evidence && item.evidence.length > 10, `verify ${item.id}: thiếu bằng chứng`);
  ok(
    item.referenceUrl && /^https?:\/\//.test(item.referenceUrl),
    `verify ${item.id}: referenceUrl không hợp lệ`
  );
}

// ---- timeline ----
const timeline = read('data/timeline.json');
ok(timeline.events.length >= 20, `timeline.json: cần >= 20 mốc`);
let lastISO = '';
for (const ev of timeline.events) {
  ok(ev.dateISO >= lastISO, `timeline ${ev.id}: dateISO không tăng dần (${ev.dateISO})`);
  lastISO = ev.dateISO;
  ok(ev.title && ev.summary && ev.detail, `timeline ${ev.id}: thiếu nội dung`);
}

// ---- map ----
const map = read('data/map-places.json');
ok(map.places.length >= 8, `map-places.json: cần >= 8 điểm`);
for (const p of map.places) {
  ok(Array.isArray(p.coords) && p.coords.length === 2, `map ${p.id}: coords không hợp lệ`);
  ok(typeof p.svg?.x === 'number' && typeof p.svg?.y === 'number', `map ${p.id}: thiếu toạ độ svg`);
}

// ---- flashcards & roadmap ----
const flashcards = read('data/flashcards.json');
ok(flashcards.cards.length >= 20, `flashcards.json: cần >= 20 thẻ`);
for (const c of flashcards.cards) {
  ok(topicIds.has(c.topic), `flashcard ${c.id}: topic không tồn tại`);
}
const roadmap = read('data/roadmap.json');
ok(roadmap.days.length === 7, `roadmap.json: cần đúng 7 ngày`);
const taskIds = new Set();
for (const d of roadmap.days) {
  for (const t of d.tasks) {
    ok(!taskIds.has(t.id), `roadmap: task id trùng ${t.id}`);
    taskIds.add(t.id);
  }
}

// ---- audio ----
const audio = read('data/audio.json');
ok(audio.clips.length >= 2, `audio.json: cần >= 2 clip`);
for (const c of audio.clips) {
  ok(
    typeof c.audioUrl === 'string' && /^https:\/\/hochiminh\.vn\/.+\.(mp3|m4a|wav)$/i.test(c.audioUrl),
    `audio ${c.id}: audioUrl phải là file media trên hochiminh.vn`
  );
  ok(
    typeof c.sourceUrl === 'string' && /^https:\/\/hochiminh\.vn\/audio\//.test(c.sourceUrl),
    `audio ${c.id}: sourceUrl phải là trang tư liệu trên hochiminh.vn`
  );
  ok(typeof c.note === 'string' && c.note.length > 10, `audio ${c.id}: thiếu ghi chú nguồn`);
}

// ---- report ----
if (errors.length) {
  console.error(`✗ Kiểm chứng THẤT BẠI (${errors.length} lỗi):`);
  for (const e of errors) console.error('  -', e);
  process.exit(1);
}
console.log(
  `✓ Kiểm chứng đạt: ${quiz.questions.length} câu quiz, ${quotes.quotes.length} trích dẫn, ` +
    `${verification.items.length} mục kiểm chứng, ${timeline.events.length} mốc thời gian, ` +
    `${map.places.length} điểm bản đồ, ${flashcards.cards.length} flashcard, 7 ngày lộ trình, ` +
    `${audio.clips.length} clip âm thanh nguồn chính thống.`
);
