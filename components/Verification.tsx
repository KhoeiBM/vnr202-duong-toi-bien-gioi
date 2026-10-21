import verification from '@/data/verification.json';

export default function Verification() {
  return (
    <div>
      <div className="verify-table-wrap">
        <table className="verify-table">
          <thead>
            <tr>
              <th style={{ width: '38%' }}>Thông tin cần kiểm chứng</th>
              <th style={{ width: '38%' }}>Bằng chứng / nguồn trong tài liệu</th>
              <th style={{ width: '24%' }}>Đối chiếu</th>
            </tr>
          </thead>
          <tbody>
            {verification.items.map((item) => (
              <tr key={item.id}>
                <td className="claim">{item.claim}</td>
                <td>{item.evidence}</td>
                <td>
                  <a
                    className="src-btn"
                    href={item.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.referenceLabel} ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="map-note">
        Nội dung website phỏng theo tài liệu học tập được cung cấp; các trích dẫn con số, sự kiện
        được đối chiếu với nguồn mở (Đảng Cộng sản Việt Nam, Tư liệu Văn kiện Đảng, Bảo tàng Lịch sử
        quốc gia, Học viện Quốc phòng). Nếu phát hiện sai lệch, xin đối chiếu lại tài liệu gốc.
      </p>
    </div>
  );
}
