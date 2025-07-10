import { getLandingVisits } from '@/lib/actions/counters';
import HeroClient from './HeroClient';

export default async function Hero() {
  const initialVisitCount = await getLandingVisits();

  return <HeroClient initialVisitCount={initialVisitCount} />;
}
