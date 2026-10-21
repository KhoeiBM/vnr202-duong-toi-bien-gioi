# Đường tới biên giới

Website học tập tương tác về **cuộc kháng chiến toàn quốc 1946–1950** — từ tiếng súng đêm
19-12-1946 tại Hà Nội đến thắng lợi **Chiến dịch Biên giới Thu Đông 1950** (16-9 → 17-10-1950).

> Phỏng theo tài liệu môn Đường lối cách mạng Đảng Cộng sản Việt Nam — chương “Đường lối kháng
> chiến toàn quốc và quá trình tổ chức thực hiện từ năm 1946 đến năm 1950”.

## Trải nghiệm

| Mục | Nội dung |
| --- | --- |
| **Dòng thời gian** | 26 mốc sự kiện 1945–1950, bấm mở chi tiết |
| **Bản đồ tương tác** | Bản đồ SVG hành trình (Hà Nội → ATK Việt Bắc → Cao Bằng → Đình Lập) + bản đồ tra cứu OpenStreetMap |
| **Trắc nghiệm** | ~80 câu / 4 chủ đề / 3 độ khó; chế độ **luyện tập** (có giải thích) và **thi thử tính giờ** (lưu kỷ lục) |
| **Flashcard** | 20 thẻ tri thức, lật mặt, đánh dấu “đã thuộc” |
| **Lộ trình 7 ngày** | Kế hoạch ôn tập có checklist, lưu tiến độ |
| **Âm thanh lịch sử** | Bản ghi gốc giọng Bác đọc Lời kêu gọi 19-12-1946 & Tuyên ngôn Độc lập 2-9-1945 — nhúng trực tiếp từ hochiminh.vn, kèm nút “Nghe tại nguồn” |
| **Trích dẫn & kiểm chứng** | 8 trích dẫn có nguồn + bảng kiểm chứng 12 thông tin then chốt với liên kết đối chiếu |

## Công nghệ

- Next.js 15 (App Router) + React 19 + TypeScript
- Leaflet + OpenStreetMap (bản đồ tra cứu)
- Font: Be Vietnam Pro & Lora (qua `@fontsource`, không phụ thuộc Google Fonts lúc build)
- Xuất tĩnh (`output: 'export'`) — deploy được trên **Vercel**, GitHub Pages, Netlify…
- Không có backend, không có media: tiến độ học tập lưu trong `localStorage` của trình duyệt.

## Chạy local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build production, xuất ra thư mục out/
npm run verify:content   # kiểm chứng nội dung (quiz, trích dẫn, nguồn...)
```

## Deploy trên Vercel

1. Import repository vào [vercel.com](https://vercel.com) (hoặc `npx vercel`).
2. Vercel tự nhận diện Next.js — để nguyên cấu hình, hoặc đặt:
   - **Build Command:** `npm run build`
   - **Output Directory:** `out`
3. Deploy — không cần biến môi trường nào.

## Kiểm chứng nội dung

`npm run verify:content` kiểm tra: số lượng câu quiz ≥ 80, id duy nhất, đáp án hợp lệ, mọi trích
dẫn có nguồn + URL, timeline tăng dần, bản đồ đủ điểm, lộ trình 7 ngày… Bảng kiểm chứng hiển thị
ngay trên trang (mục **09**) kèm liên kết tới:

- dangcongsan.vn — Lời kêu gọi Toàn quốc kháng chiến (19-12-1946)
- tulieuvankien.dangcongsan.vn — Hồ Chí Minh: Biên niên tiểu sử, tập 4
- baotanglichsu.vn — Chiến dịch Biên giới Thu Đông 1950
- nda.edu.vn (Học viện Quốc phòng) — Chiến dịch Biên giới 1950
- hochiminh.vn — Chủ tịch Hồ Chí Minh với Chiến dịch Biên giới 1950

## Ghi chú

- **Âm thanh**: website không tự host file — trình phát gọi trực tiếp file mp3 từ máy chủ
  hochiminh.vn (kho Tư liệu Audio, Văn phòng Trung ương Đảng) và luôn kèm nút “Nghe tại nguồn”.
  Nếu nguồn chặn nhúng/đổi đường dẫn, nút mở tại nguồn vẫn hoạt động. Bản ghi Tuyên ngôn Độc lập
  là băng giọng Bác được Đài Phát thanh Hà Nội thu lại sau năm 1954.
- Tọa độ trên bản đồ mang tính xấp xỉ, phục vụ minh họa học tập.
