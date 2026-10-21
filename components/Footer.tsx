export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong className="text-gold">Đường tới biên giới</strong>
          <p>
            Website học tập tương tác phỏng theo tài liệu môn Đường lối cách mạng Đảng Cộng sản
            Việt Nam — chương Cuộc kháng chiến toàn quốc (1946–1950) và quá trình tổ chức thực
            hiện đến Chiến dịch Biên giới Thu Đông 1950.
          </p>
          <p>
            Trích dẫn và số liệu được đối chiếu với các nguồn: Hồ Chí Minh Toàn tập (tập 4),
            Tư liệu Văn kiện Đảng, Bảo tàng Lịch sử quốc gia, Học viện Quốc phòng. Xem{' '}
            <a href="#kiem-chung">bảng kiểm chứng</a> để tra cứu.
          </p>
        </div>
        <div className="footer-links">
          <a href="#thoi-gian">Dòng thời gian</a>
          <a href="#ban-do">Bản đồ</a>
          <a href="#quiz">Trắc nghiệm</a>
          <a href="#flashcard">Flashcard</a>
          <a href="#lo-trinh">Lộ trình 7 ngày</a>
          <a href="#trich-dan">Thư viện trích dẫn</a>
          <a href="#kiem-chung">Bảng kiểm chứng</a>
        </div>
      </div>
    </footer>
  );
}
