import quotes from '@/data/quotes.json';

const main = quotes.quotes[0];

export default function QuoteBanner() {
  return (
    <section className="quote-banner" aria-label="Trích dẫn Lời kêu gọi toàn quốc kháng chiến">
      <div className="container quote-banner-inner">
        <div className="quote-mark" aria-hidden>
          “
        </div>
        <p className="quote-text">{main.text}</p>
        <div className="quote-author">{main.author}</div>
        <em className="quote-source">
          {main.work} · {main.source}
        </em>
      </div>
    </section>
  );
}
