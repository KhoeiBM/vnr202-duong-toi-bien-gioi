'use client';

import { useEffect, useRef, useState } from 'react';
import audioData from '@/data/audio.json';

interface Clip {
  id: string;
  title: string;
  date: string;
  audioUrl: string;
  sourceUrl: string;
  sourceName: string;
  note: string;
  context: boolean;
}

function fmt(t: number): string {
  if (!Number.isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function ClipCard({ clip }: { clip: Clip }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrent(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    const onError = () => {
      setFailed(true);
      setPlaying(false);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || failed) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          setFailed(true);
          setPlaying(false);
        });
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  return (
    <div className="audio-card">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <span className="quiz-tag">{clip.date}</span>
        {clip.context && <span className="badge-paraphrase">Bối cảnh mở đầu</span>}
      </div>
      <h3>{clip.title}</h3>
      <div className="audio-row">
        <button
          className="audio-play"
          onClick={toggle}
          disabled={failed}
          aria-label={playing ? 'Tạm dừng' : 'Phát'}
          style={failed ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="audio-track" onClick={seek} role="progressbar" aria-valuenow={progress}>
          <div className="fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="audio-time">
          {fmt(current)} / {fmt(duration)}
        </div>
      </div>

      {failed && (
        <p className="audio-failed">
          ⚠️ Không phát được trực tiếp trên trang này (nguồn có thể chặn nhúng hoặc trình duyệt
          chặn tải file). Hãy nghe tại trang chính thống bằng nút bên dưới.
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
        <a className="src-btn" href={clip.sourceUrl} target="_blank" rel="noopener noreferrer">
          Nghe tại nguồn ({clip.sourceName}) ↗
        </a>
      </div>

      <div className="audio-note">{clip.note}</div>
      <audio ref={audioRef} src={clip.audioUrl} preload="none" />
    </div>
  );
}

export default function AudioArchive() {
  return (
    <div>
      <div className="audio-grid">
        {(audioData.clips as Clip[]).map((clip) => (
          <ClipCard key={clip.id} clip={clip} />
        ))}
      </div>
      <p className="map-note">
        Website không tự host file âm thanh: các trình phát trên đây gọi trực tiếp file từ máy chủ
        hochiminh.vn (Văn phòng Trung ương Đảng) và luôn kèm nút mở tại nguồn. Nếu nguồn thay đổi
        đường dẫn hoặc chặn nhúng, nút “Nghe tại nguồn” vẫn hoạt động.
      </p>
    </div>
  );
}
