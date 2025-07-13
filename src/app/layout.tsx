import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sure Pick Engine - Чесні розіграші в Instagram',
  description:
    'Обери переможця чесно — за хвилину, без сумнівів. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат.',
  keywords: 'розіграш, Instagram, переможець, чесний, прозорий, API, crypto-safe',
  authors: [{ name: 'Sure Pick Engine' }],
  creator: 'Sure Pick Engine',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://surepick.com',
    siteName: 'Sure Pick Engine',
    title: 'Sure Pick Engine - Чесні розіграші в Instagram',
    description:
      'Обери переможця чесно — за хвилину, без сумнівів. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sure Pick Engine - Чесні розіграші в Instagram',
    description: 'Обери переможця чесно — за хвилину, без сумнівів.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
