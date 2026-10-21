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
                {q.verbatim ? (
                  <span className="badge-verbatim">Trích nguyên văn</span>
                ) : (
                  <span className="badge-paraphrase">Sắp xếp theo tài liệu</span>
                )}{' '}
                · {q.source}
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
