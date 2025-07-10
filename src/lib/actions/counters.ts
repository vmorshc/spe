'use server';

import { serverConfig } from '@/config';
import { CountersRepository } from '@/lib/redis/repositories/counters';

const countersRepo = new CountersRepository();

/**
 * Get current landing visits count
 */
export async function getLandingVisits(): Promise<number> {
  try {
    const count = await countersRepo.get('landing_visits');
    return count;
  } catch (error) {
    console.error('Failed to get landing visits count:', error);
    return 0;
  }
}

/**
 * Increment landing visits counter
 */
export async function incrementLandingVisits(): Promise<number> {
  if (serverConfig.NEXT_PUBLIC_NODE_ENV !== 'production') {
    return await getLandingVisits();
  }

  try {
    const newCount = await countersRepo.increment('landing_visits');
    return newCount;
  } catch (error) {
    console.error('Failed to increment landing visits:', error);
    return 1;
  }
}
