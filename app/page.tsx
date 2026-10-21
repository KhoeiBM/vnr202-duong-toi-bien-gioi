'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import QuoteBanner from '@/components/QuoteBanner';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import Timeline from '@/components/Timeline';
import JourneyMap from '@/components/JourneyMap';
import LeafletMap from '@/components/LeafletMap';
import Quiz from '@/components/Quiz';
import Flashcards from '@/components/Flashcards';
import Roadmap from '@/components/Roadmap';
import Quotes from '@/components/Quotes';
import Verification from '@/components/Verification';

const PILLARS = [
  {
    icon: '👥',
    title: 'Toàn dân',
    desc: 'Đem toàn bộ sức dân, tài dân, lực dân. “Mỗi người dân là một chiến sĩ, mỗi làng xã là một pháo đài, mỗi đường phố là một mặt trận.” Quân đội nhân dân làm nòng cốt.',
  },
  {
    icon: '⚔️',
    title: 'Toàn diện',
    desc: 'Đánh địch trên mọi lĩnh vực: quân sự, chính trị, kinh tế, văn hóa, tư tưởng, ngoại giao — trong đó đấu tranh vũ trang giữ vai trò mũi nhọn, mang tính quyết định.',
  },
  {
    icon: '⏳',
    title: 'Lâu dài',
    desc: 'Trường kỳ kháng chiến: vừa đánh tiêu hao địch, vừa phát triển lực lượng ta; lấy thời gian chuyển hóa yếu thành mạnh, nhưng luôn chớp thời cơ thúc đẩy bước nhảy vọt về chất.',
  },
  {
    icon: '🛡️',
    title: 'Dựa vào sức mình là chính',
    desc: 'Nội lực dân tộc là chỗ dựa chủ yếu; tranh thủ ủng hộ quốc tế khi có điều kiện. Độc lập, tự chủ về đường lối là yếu tố quan trọng hàng đầu.',
  },
];

export default function Home() {
  const [mapTab, setMapTab] = useState<'hanh-trinh' | 'tra-cuu'>('hanh-trinh');

  return (
    <>
      <Hero />
      <QuoteBanner />

      {/* 01 — Dòng thời gian */}
      <section className="section" id="thoi-gian">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="01 · Dòng thời gian"
              title="Bốn năm từ Hà Nội tới biên giới"
              desc="Từ những ngày hòa hoãn cuối 1946 đến thắng lợi Chiến dịch Biên giới Thu Đông 1950. Bấm vào từng mốc để xem chi tiết."
            />
          </Reveal>
          <Timeline />
        </div>
      </section>

      <hr className="divider" />

      {/* 02 — Bản đồ */}
      <section className="section" id="ban-do">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="02 · Bản đồ tương tác"
              title="Đường tới biên giới"
              desc="Hành trình từ đêm nổ súng ở Hà Nội, qua căn cứ địa ATK Việt Bắc, đến tuyến biên giới Cao Bằng – Lạng Sơn – Đình Lập."
            />
          </Reveal>
          <Reveal>
            <div className="map-tabs" role="tablist" aria-label="Chế độ bản đồ">
              <button
                className={`map-tab ${mapTab === 'hanh-trinh' ? 'is-active' : ''}`}
                onClick={() => setMapTab('hanh-trinh')}
                role="tab"
                aria-selected={mapTab === 'hanh-trinh'}
              >
                Bản đồ hành trình
              </button>
              <button
                className={`map-tab ${mapTab === 'tra-cuu' ? 'is-active' : ''}`}
                onClick={() => setMapTab('tra-cuu')}
                role="tab"
                aria-selected={mapTab === 'tra-cuu'}
              >
                Bản đồ tra cứu (OpenStreetMap)
              </button>
            </div>
          </Reveal>
          <Reveal>
            {mapTab === 'hanh-trinh' ? <JourneyMap /> : <LeafletMap />}
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* 03 — Đường lối */}
      <section className="section" id="duong-loi">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="03 · Đường lối kháng chiến"
              title="Bốn trụ cột của đường lối"
              desc="Hình thành qua thực tiễn 1945–1947, thể hiện trong các Chỉ thị Kháng chiến kiến quốc (25-11-1945), Tình hình và chủ trương (3-3-1946), Hòa để tiến (9-3-1946), Toàn dân kháng chiến (12-12-1946), Lời kêu gọi toàn quốc kháng chiến (19-12-1946) và tác phẩm Kháng chiến nhất định thắng lợi của đồng chí Trường Chinh (8-1947)."
            />
          </Reveal>
          <div className="pillar-grid">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="pillar">
                  <div className="pillar-icon" aria-hidden>
                    {p.icon}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* 04 — Quiz */}
      <section className="section" id="quiz">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="04 · Trắc nghiệm"
              title="Thử tài cùng ngân hàng câu hỏi"
              desc="Khoảng 80 câu hỏi chia 4 chủ đề, 3 mức độ. Chế độ luyện tập có giải thích tức thì; chế độ thi thử tính giờ bốc ngẫu nhiên câu hỏi và lưu kỷ lục cá nhân."
            />
          </Reveal>
          <Reveal>
            <Quiz />
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* 05 — Flashcards */}
      <section className="section" id="flashcard">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="05 · Flashcard tri thức"
              title="Ôn nhanh bằng thẻ lật"
              desc="20 thẻ kiến thức cốt lõi: định nghĩa, con số, sự kiện. Đánh dấu “đã thuộc” — tiến độ được lưu ngay trên máy bạn."
            />
          </Reveal>
          <Reveal>
            <Flashcards />
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* 06 — Lộ trình */}
      <section className="section" id="lo-trinh">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="06 · Lộ trình ôn tập"
              title="7 ngày tới biên giới"
              desc="Kế hoạch học 7 ngày, mỗi ngày một trọng tâm với nhiệm vụ nhỏ. Tích vào ô đã hoàn thành để theo dõi tiến độ."
            />
          </Reveal>
          <Reveal>
            <Roadmap />
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* 07 — Trích dẫn */}
      <section className="section" id="trich-dan">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="07 · Thư viện trích dẫn"
              title="Những lời nói đi cùng năm tháng"
              desc="Mỗi trích dẫn gắn nguồn và liên kết đối chiếu để bạn tự kiểm chứng."
            />
          </Reveal>
          <Reveal>
            <Quotes />
          </Reveal>
          <p className="map-note" style={{ marginTop: 18 }}>
            💡 Bản ghi âm lịch sử giọng Chủ tịch Hồ Chí Minh đọc Lời kêu gọi toàn quốc kháng chiến
            hiện được lưu giữ tại Đài Tiếng nói Việt Nam và Bảo tàng Lịch sử quốc gia — website này
            chỉ trích dẫn văn bản, không nhúng file âm thanh.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* 08 — Kiểm chứng */}
      <section className="section" id="kiem-chung">
        <div className="container">
          <Reveal>
            <SectionHeading
              kicker="08 · Bảng kiểm chứng"
              title="Đối chiếu tư liệu"
              desc="Bảng tra cứu 12 thông tin then chốt kèm bằng chứng trong tài liệu và liên kết nguồn mở để đối chiếu."
            />
          </Reveal>
          <Reveal>
            <Verification />
          </Reveal>
        </div>
      </section>

      {/* Closing */}
      <section className="closing">
        <div className="closing-bg" aria-hidden />
        <div className="closing-overlay" aria-hidden />
        <div className="container closing-inner">
          <h2>
            “Đạt được mục tiêu diệt địch, <br />
            kết thúc thời kỳ chiến đấu trong vòng vây.”
          </h2>
          <p>
            Thắng lợi Chiến dịch Biên giới Thu Đông 1950 mở ra cục diện mới, đưa cuộc kháng chiến
            chuyển sang giai đoạn phát triển cao hơn — hành trình từ Hà Nội tới biên giới vẫn còn
            tiếp nối.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center', marginBottom: 0 }}>
            <a href="#quiz" className="btn btn-primary">
              Quay lại luyện tập
            </a>
            <a href="#top" className="btn btn-ghost">
              Về đầu trang
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
