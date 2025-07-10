import { CountersRepository } from '@/lib/redis/repositories/counters';
import HeroClient from './HeroClient';

async function getInitialVisitCount(): Promise<number> {
  try {
    const countersRepo = new CountersRepository();
    const count = await countersRepo.get('landing_visits');
    return count;
  } catch (error) {
    console.error('Failed to get initial visit count:', error);
    return 0;
  }
}

export default async function Hero() {
  const initialVisitCount = await getInitialVisitCount();

  return <HeroClient initialVisitCount={initialVisitCount} />;
}
