import { NextResponse } from 'next/server';
import { CountersRepository } from '@/lib/redis/repositories/counters';

const countersRepo = new CountersRepository();

/**
 * Increment landing visits counter
 */
export async function POST() {
  try {
    const newCount = await countersRepo.increment('landing_visits');

    return NextResponse.json({
      count: newCount,
    });
  } catch (error) {
    console.error('Failed to increment landing visits:', error);
    return NextResponse.json({
      count: 1,
    });
  }
}
