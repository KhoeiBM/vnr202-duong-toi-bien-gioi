# Đường tới biên giới

Website học tập tương tác về **cuộc kháng chiến toàn quốc 1946–1950** — từ tiếng súng đêm
19-12-1946 tại Hà Nội đến thắng lợi **Chiến dịch Biên giới Thu Đông 1950** (16-9 → 17-10-1950).

> Phỏng theo tài liệu môn Đường lối cách mạng Đảng Cộng sản Việt Nam — chương “Đường lối kháng
> chiến toàn quốc và quá trình tổ chức thực hiện từ năm 1946 đến năm 1950”.

## Trải nghiệm

| Mục | Nội dung |
| --- | --- |
| **Dòng thời gian** | 26 mốc sự kiện 1945–1950, bấm mở chi tiết |
| **Trắc nghiệm** | ~80 câu / 4 chủ đề / 3 độ khó; chế độ **luyện tập** (có giải thích) và **thi thử tính giờ** (bốc ngẫu nhiên, lưu kỷ lục) |
| **Flashcard** | 20 thẻ tri thức, lật mặt, đánh dấu “đã thuộc” |
| **Lộ trình 7 ngày** | “Nắm chắc kiến thức giai đoạn 1946-1950 trong 7 ngày” — checklist, lưu tiến độ |
| **Âm thanh lịch sử** | Bản ghi gốc giọng Bác đọc Lời kêu gọi 19-12-1946 & Tuyên ngôn Độc lập 2-9-1945 — nhúng trực tiếp từ hochiminh.vn, kèm nút “Nghe tại nguồn” |
| **Trích dẫn & kiểm chứng** | 8 trích dẫn có nguồn + bảng kiểm chứng 12 thông tin then chốt với liên kết đối chiếu |
| **Tài khoản & thành tích** | Đăng nhập Email/Google (Firebase) — lưu lịch sử làm bài, đồng bộ đa thiết bị |

## Công nghệ

- Next.js 15 (App Router) + React 19 + TypeScript
- **Firebase Authentication** (Email + mật khẩu, Google) + **Cloud Firestore** (lưu thành tích quiz)
- Font: Be Vietnam Pro & Lora (qua `@fontsource`, không phụ thuộc Google Fonts lúc build)
- Xuất tĩnh (`output: 'export'`) — deploy được trên **Vercel**, GitHub Pages, Netlify…
- Khách chưa đăng nhập vẫn dùng đầy đủ (localStorage); khi đăng nhập, lịch sử được **hợp nhất
  và đồng bộ** lên tài khoản.

## Chạy local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build production, xuất ra thư mục out/
npm run verify:content   # kiểm chứng nội dung (quiz, trích dẫn, nguồn, audio...)
```

## Deploy trên Vercel

1. Import repository vào [vercel.com](https://vercel.com) (hoặc `npx vercel`).
2. Vercel tự nhận diện Next.js — để nguyên cấu hình, hoặc đặt:
   - **Build Command:** `npm run build`
   - **Output Directory:** `out`
3. Deploy — không bắt buộc biến môi trường nào (cấu hình Firebase có sẵn trong
   `lib/firebase.ts`, có thể override bằng `NEXT_PUBLIC_FIREBASE_*`).

## Tài khoản & Firebase

Cấu trúc dữ liệu (Firestore):

```
users/{uid}                  # hồ sơ: email, displayName, updatedAt
users/{uid}/quiz_results/*   # mỗi lần làm bài 1 doc: mode, total, correct, pct, seconds, createdAt
```

- **Bảo mật**: dán nội dung [`firestore.rules`](firestore.rules) vào Firestore → Rules
  (mỗi user chỉ đọc/ghi được dữ liệu của chính mình; thành tích chỉ tạo mới/xóa, không sửa).
- **Firebase console** cần bật: Authentication → Sign-in method → **Email/Password** + **Google**;
  Authorized domains: `localhost` + domain Vercel của bạn.
- **Quản lý user**: Firebase console → Authentication (xem/khóa/xóa tài khoản) và Firestore
  (xuất/xóa dữ liệu). Trong app có mục **Lịch sử làm bài** và nút **Xóa tài khoản & dữ liệu**.
- Luồng đồng bộ: khách lưu máy (localStorage) → đăng nhập → hợp nhất (union theo id) hai chiều
  máy ↔ đám mây → các lần sau tự lưu lên tài khoản.

## Kiểm chứng nội dung

`npm run verify:content` kiểm tra: số lượng câu quiz ≥ 80, id duy nhất, đáp án hợp lệ, mọi trích
dẫn có nguồn + URL, timeline tăng dần, lộ trình 7 ngày, audio là file media trên hochiminh.vn…
Bảng kiểm chứng hiển thị ngay trên trang (mục **08**) kèm liên kết tới:

- dangcongsan.vn — Lời kêu gọi Toàn quốc kháng chiến (19-12-1946)
- tulieuvankien.dangcongsan.vn — Hồ Chí Minh: Biên niên tiểu sử, tập 4
- baotanglichsu.vn — Chiến dịch Biên giới Thu Đông 1950
- nda.edu.vn (Học viện Quốc phòng) — Chiến dịch Biên giới 1950
- hochiminh.vn — Chủ tịch Hồ Chí Minh với Chiến dịch Biên giới 1950

## Ghi chú

- **Âm thanh**: website không tự host file — trình phát gọi trực tiếp file mp3 từ máy chủ
  hochiminh.vn (kho Tư liệu Audio, Văn phòng Trung ương Đảng) và luôn kèm nút “Nghe tại nguồn”.
  Bản ghi Tuyên ngôn Độc lập là băng giọng Bác được Đài Phát thanh Hà Nội thu lại sau năm 1954.
- Thành tích quiz lưu cục bộ ngay cả khi không đăng nhập; đăng nhập để đồng bộ đa thiết bị.
