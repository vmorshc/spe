import Benefits from '@/components/landing/Benefits';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import FuturePlans from '@/components/landing/FuturePlans';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import LandingTracker from '@/components/landing/LandingTracker';

export default async function Home() {
  return (
    <main>
      <LandingTracker />
      <Header />
      <Hero />
      <HowItWorks />
      <Benefits />
      <FuturePlans />
      <FAQ />
      <Footer />
    </main>
  );
}
