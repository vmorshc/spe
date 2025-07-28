import Benefits from '@/components/landing/Benefits';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import FuturePlans from '@/components/landing/FuturePlans';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import { getFeatureFlag } from '@/lib/featureFlags';
import { FEATURE_FLAGS } from '@/lib/featureFlags/constants';

export default async function Home() {
  const instagramMvpEnabled = await getFeatureFlag(FEATURE_FLAGS.INSTAGRAM_MVP);

  return (
    <main>
      <Header instagramMvpEnabled={instagramMvpEnabled} />
      <Hero />
      <HowItWorks />
      <Benefits />
      <FuturePlans />
      <FAQ />
      <Footer />
    </main>
  );
}
