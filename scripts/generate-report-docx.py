#!/usr/bin/env python3
"""Sinh báo cáo sản phẩm sáng tạo Nhóm 02 (file .docx).

Cách dùng:
    pip install python-docx
    python3 scripts/generate-report-docx.py

Kết quả: docs/bao-cao-san-pham-sang-tao-nhom-02.docx
Muốn điền tên thành viên / giảng viên: sửa bảng THÀNH VIÊN và GIẢNG VIÊN dưới đây rồi chạy lại.
"""

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = "docs/bao-cao-san-pham-sang-tao-nhom-02.docx"

# ---- Điền thông tin nhóm tại đây ------------------------------------------
THANH_VIEN = [
    ("1", "(điền họ tên)", "(điền mã SV)", "(điền phần việc)"),
    ("2", "(điền họ tên)", "(điền mã SV)", "(điền phần việc)"),
    ("3", "(điền họ tên)", "(điền mã SV)", "(điền phần việc)"),
]
GIANG_VIEN = "(điền tên giảng viên hướng dẫn)"
# ---------------------------------------------------------------------------


def set_font(run, size=13, bold=False, italic=False):
    run.font.name = "Times New Roman"
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor(0, 0, 0)
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.get_or_add_rFonts()
    rfonts.set(qn("w:eastAsia"), "Times New Roman")
    return run


def para(doc, text="", size=13, bold=False, align=None, space_after=6, style=None):
    p = doc.add_paragraph(style=style)
    if align is not None:
        p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.25
    if text:
        set_font(p.add_run(text), size=size, bold=bold)
    return p


def heading(doc, text, level=1):
    sizes = {1: 15, 2: 14, 3: 13}
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12 if level == 1 else 8)
    p.paragraph_format.space_after = Pt(6)
    set_font(p.add_run(text), size=sizes.get(level, 13), bold=True)
    return p


def bullet(doc, text, size=13):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    set_font(p.add_run(text), size=size)
    return p


def rich(doc, parts, size=13, space_after=6):
    """parts: list of (text, bold)"""
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.25
    for text, bold in parts:
        set_font(p.add_run(text), size=size, bold=bold)
    return p


def add_table(doc, headers, rows, widths=None, size=12):
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for j, h in enumerate(headers):
        cell = t.rows[0].cells[j]
        cell.text = ""
        set_font(cell.paragraphs[0].add_run(h), size=size, bold=True)
    for i, row in enumerate(rows):
        for j, val in enumerate(row):
            cell = t.rows[1 + i].cells[j]
            cell.text = ""
            set_font(cell.paragraphs[0].add_run(val), size=size)
    if widths:
        for j, w in enumerate(widths):
            for r in t.rows:
                r.cells[j].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def main():
    doc = Document()

    # Lề trang & font mặc định
    for s in doc.sections:
        s.top_margin = Cm(2.5)
        s.bottom_margin = Cm(2.5)
        s.left_margin = Cm(3)
        s.right_margin = Cm(2)
    normal = doc.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(13)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")

    # ---------------- Trang bìa ----------------
    para(doc, "BÁO CÁO SẢN PHẨM SÁNG TẠO", size=18, bold=True,
         align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
    para(doc, 'Website học tập tương tác "Đường tới biên giới"',
         size=15, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=12)
    para(doc, "Nhóm 02 — Lớp VNR202 - FIN1902-CF", size=13, bold=True,
         align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)

    add_table(
        doc,
        ["STT", "Họ và tên", "Mã sinh viên", "Đóng góp"],
        THANH_VIEN,
        widths=[1.2, 5.2, 3.4, 5.2],
    )
    rich(doc, [("Giảng viên hướng dẫn: ", True), (GIANG_VIEN, False)], space_after=14)

    # ---------------- 1. Thông tin chung ----------------
    heading(doc, "1. THÔNG TIN CHUNG")
    add_table(
        doc,
        ["Hạng mục", "Nội dung"],
        [
            ("Tên sản phẩm", 'Website "Đường tới biên giới"'),
            ("Loại hình", "Trang web học tập tương tác (one-page web app)"),
            ("Địa chỉ", "https://vnr202-duong-toi-bien-gioi.vercel.app"),
            ("Mã nguồn", "https://github.com/KhoeiBM/vnr202-duong-toi-bien-gioi"),
            ("Chủ đề", "Cuộc kháng chiến toàn quốc chống thực dân Pháp (1946–1950)"),
        ],
        widths=[4.5, 11.5],
    )
    rich(doc, [
        ("Ý nghĩa tên gọi: ", True),
        ('"Đường tới biên giới" là hành trình từ tiếng súng mở đầu cuộc Toàn quốc kháng chiến '
         "đêm 19-12-1946 tại Hà Nội đến thắng lợi Chiến dịch Biên giới Thu Đông 1950 — chặng "
         "mở đầu của những năm đầu cuộc kháng chiến toàn quốc chống thực dân Pháp.", False),
    ])

    # ---------------- 2. Đặt vấn đề & mục tiêu ----------------
    heading(doc, "2. ĐẶT VẤN ĐỀ VÀ MỤC TIÊU")
    para(doc,
         "Giai đoạn 1946–1950 là chương học giàu sự kiện, văn kiện và số liệu: từ chủ trương "
         "nhân nhượng, tự vệ đến toàn quốc kháng chiến, rồi chiến dịch lớn đầu tiên thắng lợi. "
         "Khi ôn tập, sinh viên thường gặp khó trong việc hệ thống hóa mốc sự kiện, ghi nhớ các "
         "quan điểm đường lối và tra cứu nguồn gốc của các trích dẫn.")
    para(doc,
         "Nhóm đặt mục tiêu xây dựng một công cụ học tập số, tương tác, trực quan, giúp người "
         "học nắm chắc kiến thức giai đoạn 1946–1950 qua nhiều hình thức: đọc — nghe — làm bài "
         "— ôn tập theo lộ trình. Ba tiêu chí xuyên suốt:")
    bullet(doc, "Nội dung bám sát tài liệu chính thống và truy được nguồn;")
    bullet(doc, "Thao tác đơn giản, không cần cài đặt;")
    bullet(doc, "Chạy tốt trên cả máy tính và điện thoại.")

    # ---------------- 3. Giới thiệu tổng quan ----------------
    heading(doc, "3. GIỚI THIỆU TỔNG QUAN SẢN PHẨM")
    para(doc,
         'Website "Đường tới biên giới" là trang web một trang dài gồm 8 phần học tập được sắp '
         "xếp theo dòng phát triển của sự kiện, mở đầu bằng phần hình ảnh tiêu đề với 4 số liệu "
         "tiêu biểu (60 ngày đêm Hà Nội, 75 ngày đêm Việt Bắc, 30 ngày đêm Biên giới, ~80 câu "
         "hỏi trắc nghiệm). Người dùng có thể học ngay mà không cần đăng nhập; đăng nhập để lưu "
         "thành tích ôn tập.")

    # ---------------- 4. Mô tả chi tiết ----------------
    heading(doc, "4. MÔ TẢ CHI TIẾT CÁC TÍNH NĂNG")
    add_table(
        doc,
        ["#", "Hạng mục", "Mô tả"],
        [
            ("01", "Dòng thời gian",
             "26 mốc sự kiện từ 1946 đến 17-10-1950 (Hội nghị Vạn Phúc 18-12-1946, nổ súng "
             "19-12-1946, Chiến dịch Biên giới Thu Đông 1950…), mỗi mốc có chi tiết mở rộng"),
            ("02", "Đường lối cách mạng",
             "Các trụ cột quan điểm và hệ thống đường lối của Đảng trong kháng chiến chống Pháp"),
            ("03", "Trắc nghiệm",
             "~80 câu hỏi 4 lựa chọn, chấm điểm tức thì, hiển thị đáp án đúng/sai và đáp án "
             "chi tiết"),
            ("04", "Flashcard",
             "20 thẻ lật hai mặt (mặt trước — sự kiện/khái niệm, mặt sau — nội dung) để ghi "
             "nhớ nhanh"),
            ("05", "Lộ trình ôn tập",
             '"Nắm chắc kiến thức giai đoạn 1946-1950 trong 7 ngày" — checklist 7 ngày, mỗi '
             "ngày có nhiệm vụ cụ thể, tiến độ được lưu trên máy"),
            ("06", "Âm thanh lịch sử",
             "2 bản ghi gốc giọng Chủ tịch Hồ Chí Minh từ kho tư liệu chính thống "
             "hochiminh.vn: Lời kêu gọi toàn quốc kháng chiến (19-12-1946) và Tuyên ngôn Độc "
             'lập (2-9-1945, bản ghi thu lại sau 1954) — có nút "Nghe tại nguồn" khi trình '
             "duyệt chặn phát trực tiếp"),
            ("07", "Trích dẫn",
             '8 trích dẫn nguyên văn kèm nhãn "Nguồn" và nút "Xem nguồn ↗" dẫn tới tài liệu gốc'),
            ("08", "Kiểm chứng",
             'Bảng 12 mục đối chiếu "khẳng định ↔ nguồn trong tài liệu" (Hồ Chí Minh Toàn tập '
             "tập 4, Tư liệu Văn kiện Đảng, Bảo tàng Lịch sử quốc gia, Học viện Quốc phòng)"),
        ],
        widths=[1.2, 3.6, 11.2],
    )
    para(doc, "Tính năng tài khoản (đăng nhập/đăng ký):", bold=True)
    bullet(doc, "Đăng nhập bằng Email/mật khẩu hoặc Google; có quên mật khẩu và xoá tài khoản.")
    bullet(doc, "Khi làm trắc nghiệm, điểm số, kỷ lục và lịch sử làm bài được lưu lên hệ thống "
                "(mỗi tài khoản một vùng dữ liệu riêng, người khác không xem được).")
    bullet(doc, "Người dùng chưa đăng nhập vẫn làm bài thoải mái, dữ liệu lưu ngay trên máy; khi "
                "đăng nhập, dữ liệu được tự động đồng bộ hai chiều giữa máy và tài khoản.")
    bullet(doc, 'Có mục "Lịch sử làm bài" với các lựa chọn xoá lịch sử, đăng xuất.')

    # ---------------- 5. Thiết kế ----------------
    heading(doc, "5. THIẾT KẾ GIAO DIỆN VÀ TRẢI NGHIỆM")
    bullet(doc, "Phong cách hình ảnh theo hướng hoài cổ – trang trọng: nền tối, tông đỏ lịch sử "
                "– vàng đồng, tiêu đề kiểu chữ serif, ảnh nền vùng chiến khu.")
    bullet(doc, "Thanh điều hướng bám theo phần đang đọc; hiệu ứng xuất hiện khi cuộn; bố cục "
                "responsive cho điện thoại.")
    bullet(doc, "Logo trang là ảnh tư liệu lịch sử giai đoạn 1946–1950, đặt ở đầu trang và chân "
                "trang.")

    # ---------------- 6. Điểm sáng tạo ----------------
    heading(doc, "6. ĐIỂM SÁNG TẠO CỦA SẢN PHẨM")
    bullet(doc, "Đa phương thức trong một trang: kết hợp đọc (dòng thời gian, đường lối), nghe "
                "(bản ghi gốc giọng Bác), làm bài (trắc nghiệm) và ôn tập (flashcard, lộ "
                "trình 7 ngày).")
    bullet(doc, "Học mà kiểm chứng được: mọi trích dẫn đều có nhãn nguồn, kèm bảng kiểm chứng "
                "12 mục đối chiếu hai chiều — tạo thói quen tra cứu tư liệu gốc.")
    bullet(doc, "Tư liệu audio chính thống: chỉ dùng bản ghi gốc giọng Bác từ kho tư liệu của "
                "Bảo tàng Hồ Chí Minh, có liên kết về trang nguồn.")
    bullet(doc, "Tích hợp tài khoản thông minh: khách học không bị làm phiền bởi đăng nhập, "
                "nhưng thành tích vẫn được giữ và đồng bộ tự động khi muốn lưu lâu dài.")

    # ---------------- 7. Công nghệ ----------------
    heading(doc, "7. CÔNG NGHỆ SỬ DỤNG")
    add_table(
        doc,
        ["Thành phần", "Công nghệ"],
        [
            ("Front-end", "Next.js (React, TypeScript), xuất tĩnh (static export)"),
            ("Lưu trữ & triển khai",
             "Vercel — https://vnr202-duong-toi-bien-gioi.vercel.app"),
            ("Xác thực & dữ liệu",
             "Firebase Authentication (Email + Google) và Cloud Firestore, có rules phân "
             "quyền theo từng người dùng"),
            ("Kiểm thử nội dung",
             "Script tự động kiểm tra số lượng và tính nhất quán của dữ liệu (80 câu hỏi, "
             "8 trích dẫn, 12 mục kiểm chứng, 26 mốc, 20 flashcard, 7 ngày lộ trình, "
             "2 clip âm thanh) trước mỗi lần triển khai"),
        ],
        widths=[4.5, 11.5],
    )
    para(doc,
         "Toàn bộ giao diện được viết bằng CSS thuần, không dùng thư viện giao diện có sẵn; "
         "dữ liệu nội dung tách riêng dạng JSON để dễ kiểm tra, đối chiếu nguồn.")

    # ---------------- 8. Hướng dẫn sử dụng ----------------
    heading(doc, "8. HƯỚNG DẪN SỬ DỤNG")
    bullet(doc, "Truy cập địa chỉ website, cuộn lần lượt qua 8 phần theo thanh điều hướng "
                '(hoặc bấm "Bắt đầu hành trình").')
    bullet(doc, "Ở phần Trắc nghiệm: chọn đáp án → xem điểm và đáp án chi tiết; làm lại để phá "
                "kỷ lục.")
    bullet(doc, 'Bấm "Đăng nhập" (góc trên bên phải) để tạo tài khoản — điểm số và lịch sử làm '
                "bài được lưu lại cho những lần sau.")
    bullet(doc, 'Ở phần Âm thanh: bấm phát để nghe bản ghi gốc; nếu không phát được, bấm "Nghe '
                'tại nguồn" để mở trang tư liệu gốc.')
    bullet(doc, "Ở phần Lộ trình: đánh dấu hoàn thành mỗi ngày, tiến độ được lưu tự động.")

    # ---------------- 9. Kết quả ----------------
    heading(doc, "9. KẾT QUẢ ĐẠT ĐƯỢC")
    bullet(doc, "Đầy đủ 8 phần nội dung với: 26 mốc thời gian, ~80 câu trắc nghiệm, 20 "
                "flashcard, lộ trình 7 ngày, 8 trích dẫn có nguồn, 12 mục kiểm chứng, "
                "2 clip âm thanh gốc giọng Bác.")
    bullet(doc, "Hệ thống tài khoản hoạt động: đăng nhập, lưu/đồng bộ thành tích, quản lý lịch "
                "sử làm bài.")
    bullet(doc, "Website triển khai công khai, chạy ổn định trên máy tính và điện thoại; nội "
                "dung được kiểm tra tự động trước mỗi lần cập nhật.")

    # ---------------- 10. Kết luận ----------------
    heading(doc, "10. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN")
    para(doc,
         "Sản phẩm đã đạt các mục tiêu đề ra: một công cụ học tập số về giai đoạn 1946–1950 có "
         "chiều sâu nội dung, tương tác, dễ dùng và đặc biệt coi trọng tính truy xuất nguồn gốc "
         "tư liệu. Trong tương lai, nhóm hướng tới: bổ sung bộ đề tổng hợp cuối lộ trình, bảng "
         "xếp hạng thành tích, chế độ ôn tập nhanh trước thi, và mở rộng kho âm thanh – ảnh tư "
         "liệu theo các mốc sự kiện.")

    # ---------------- 11. Tài liệu tham khảo ----------------
    heading(doc, "11. TÀI LIỆU THAM KHẢO")
    bullet(doc, "Hồ Chí Minh Toàn tập, tập 4, Nhà xuất bản Sự thật.")
    bullet(doc, "Tư liệu Văn kiện Đảng Cộng sản Việt Nam.")
    bullet(doc, "Bảo tàng Lịch sử quốc gia; Học viện Quốc phòng.")
    bullet(doc, "hochiminh.vn — Kho Tư liệu Audio (bản ghi Lời kêu gọi toàn quốc kháng chiến "
                "19-12-1946; Tuyên ngôn Độc lập 2-9-1945).")
    bullet(doc, "Website sản phẩm và mã nguồn như mục 1.")

    # ---------------- Chữ ký ----------------
    para(doc, "", space_after=12)
    para(doc, "Hà Nội, ngày .... tháng .... năm ......", align=WD_ALIGN_PARAGRAPH.RIGHT,
         space_after=10)
    para(doc, "Người đại diện nhóm", bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=2)
    para(doc, "(Ký và ghi rõ họ tên)", align=WD_ALIGN_PARAGRAPH.RIGHT)

    import os
    os.makedirs("docs", exist_ok=True)
    doc.save(OUT)
    print("Đã tạo:", OUT)


if __name__ == "__main__":
    main()
