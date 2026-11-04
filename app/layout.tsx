import type { Metadata } from 'next';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/lora/500.css';
import '@fontsource/lora/600.css';
import '@fontsource/lora/700.css';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Đường tới biên giới — Kháng chiến toàn quốc 1946–1950',
  description:
    'Trải nghiệm tương tác về cuộc kháng chiến toàn quốc 1946–1950: dòng thời gian, quiz ~80 câu, flashcard, lộ trình ôn tập 7 ngày và âm thanh lịch sử giọng Bác.',
  keywords: [
    'Đường tới biên giới',
    'kháng chiến toàn quốc 1946',
    'Chiến dịch Biên giới Thu Đông 1950',
    'đường lối cách mạng',
    'VNR202',
  ],
  openGraph: {
    title: 'Đường tới biên giới — Kháng chiến toàn quốc 1946–1950',
    description:
      'Dòng thời gian, quiz, flashcard và âm thanh lịch sử về cuộc kháng chiến chống Pháp 1946–1950.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
