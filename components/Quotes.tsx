import quotes from '@/data/quotes.json';

export default function Quotes() {
  return (
    <div className="quote-list">
      {quotes.quotes.map((q) => (
        <figure key={q.id} className="quote-item">
          <blockquote className="qt">“{q.text}”</blockquote>
          <figcaption>
            <div className="qa">{q.author}</div>
            <div className="qw">{q.work}</div>
            <div className="qs">
              <span>
                <span className="badge-verbatim">Nguồn</span> · {q.source}
              </span>
              <a
                className="src-btn"
                href={q.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem nguồn ↗
              </a>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
