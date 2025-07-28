import type { Metadata } from 'next';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import { getFeatureFlag } from '@/lib/featureFlags';
import { FEATURE_FLAGS } from '@/lib/featureFlags/constants';
import styles from './legal.module.css';

// Force static rendering for all legal pages
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Pickly',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // For static legal pages, we default to false for feature flags
  // since these pages are force-static and can't access session data
  const instagramMvpEnabled = false;

  return (
    <main>
      <Header instagramMvpEnabled={instagramMvpEnabled} />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="legal-content-container">
            <div className={styles.legalContent}>{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
