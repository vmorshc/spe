import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ViewTransition } from 'react';
import './globals.css';
import MotionProvider from '@/components/ui/MotionProvider';
import { clientConfig } from '@/config';
import { serverConfig } from '@/config/server';
import { AuthProvider } from '@/lib/contexts/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://pickly.com.ua'),
    title: {
      default: 'Pickly — Безкоштовні чесні розіграші в Instagram',
      template: '%s | Pickly',
    },
    description:
      'Безкоштовний сервіс для чесних розіграшів в Instagram. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат — без підписок та прихованих платежів.',
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
      'безкоштовно',
      'безкоштовний розіграш',
      'безкоштовний рандомайзер',
      'free giveaway picker',
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
      title: 'Pickly — Безкоштовні чесні розіграші в Instagram',
      description:
        'Безкоштовний сервіс для чесних розіграшів в Instagram. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат — без підписок та прихованих платежів.',
      images: [{ url: '/images/logo_square.png', width: 1024, height: 1024, alt: 'Pickly' }],
    },
    twitter: {
      card: 'summary',
      title: 'Pickly — Безкоштовні чесні розіграші в Instagram',
      description:
        'Безкоштовний сервіс для чесних розіграшів в Instagram — без підписок та прихованих платежів.',
      images: [{ url: '/images/logo_square.png', width: 1024, height: 1024, alt: 'Pickly' }],
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
    facebook: {
      appId: serverConfig.FACEBOOK_APP_ID,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}>
        <MotionProvider>
          <AuthProvider>
            <ViewTransition>{children}</ViewTransition>
          </AuthProvider>
        </MotionProvider>
      </body>
      {clientConfig.GA_MEASUREMENT_ID ? (
        <GoogleAnalytics gaId={clientConfig.GA_MEASUREMENT_ID} />
      ) : null}
    </html>
  );
}
