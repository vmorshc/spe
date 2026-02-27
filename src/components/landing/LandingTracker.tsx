'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function LandingTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    trackEvent('landing_page_view', {
      referrer: document.referrer || 'direct',
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
    });
  }, []);

  return null;
}
