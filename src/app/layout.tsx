import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { clientConfig } from '@/config';
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
  metadataBase: new URL('https://pickly.com.ua'),
  title: {
    default: 'Pickly — Чесні розіграші в Instagram',
    template: '%s | Pickly',
  },
  description:
    'Обери переможця чесно — за хвилину, без сумнівів. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат.',
  keywords: [
    'розіграш',
    'Instagram',
    'переможець',
    'чесний розіграш',
    'прозорий',
    'giveaway',
    'рандомайзер',
    'визначити переможця',
    'коментарі Instagram',
    'розіграш в інстаграм',
    'випадковий переможець',
    'crypto-safe',
  ],
  authors: [{ name: 'Pickly' }],
  creator: 'Pickly',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://pickly.com.ua',
    siteName: 'Pickly',
    title: 'Pickly — Чесні розіграші в Instagram',
    description:
      'Обери переможця чесно — за хвилину, без сумнівів. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат.',
    images: ['/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pickly — Чесні розіграші в Instagram',
    description: 'Обери переможця чесно — за хвилину, без сумнівів.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
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
    <html lang="uk" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
      {clientConfig.GA_MEASUREMENT_ID ? (
        <GoogleAnalytics gaId={clientConfig.GA_MEASUREMENT_ID} />
      ) : null}
    </html>
  );
}
