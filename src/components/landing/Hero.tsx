import { getLandingVisits } from '@/lib/actions/counters';
import { getFeatureFlag } from '@/lib/featureFlags';
import { FEATURE_FLAGS } from '@/lib/featureFlags/constants';
import HeroClient from './HeroClient';

export default async function Hero() {
  const initialVisitCount = await getLandingVisits();
  const instagramMvpEnabled = await getFeatureFlag(FEATURE_FLAGS.INSTAGRAM_MVP);

  return (
    <HeroClient initialVisitCount={initialVisitCount} instagramMvpEnabled={instagramMvpEnabled} />
  );
}
