import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Benefits from '@/components/landing/Benefits'
import FuturePlans from '@/components/landing/FuturePlans'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <Benefits />
      <FuturePlans />
      <FAQ />
      <Footer />
    </main>
  )
}
