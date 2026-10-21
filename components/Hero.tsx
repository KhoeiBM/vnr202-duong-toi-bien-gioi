export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden />
      <div className="hero-overlay" aria-hidden />
      <div className="container hero-content">
        <div className="hero-eyebrow">1946 — 1950 · Kháng chiến toàn quốc</div>
        <h1 className="hero-title">
          Đường tới <span className="accent">biên giới</span>
        </h1>
        <p className="hero-lead">
          Từ tiếng súng đêm 19-12-1946 tại Hà Nội đến thắng lợi Chiến dịch Biên giới Thu Đông
          1950 — hành trình bốn năm “thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất
          định không chịu làm nô lệ”. Khám phá qua dòng thời gian, bản đồ tương tác, quiz và
          flashcard.
        </p>
        <div className="hero-actions">
          <a href="#thoi-gian" className="btn btn-primary">
            Bắt đầu hành trình
          </a>
          <a href="#quiz" className="btn btn-ghost">
            Thử tài trắc nghiệm
          </a>
        </div>
        <div className="hero-stats">
          <div>
            <div className="hero-stat-num">60</div>
            <div className="hero-stat-label">ngày đêm Hà Nội</div>
          </div>
          <div>
            <div className="hero-stat-num">75</div>
            <div className="hero-stat-label">ngày đêm Việt Bắc</div>
          </div>
          <div>
            <div className="hero-stat-num">30</div>
            <div className="hero-stat-label">ngày đêm Biên giới</div>
          </div>
          <div>
            <div className="hero-stat-num">~80</div>
            <div className="hero-stat-label">câu hỏi trắc nghiệm</div>
          </div>
        </div>
      </div>
      <div className="hero-scroll">Cuộn để khám phá</div>
    </section>
  );
}
