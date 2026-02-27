'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useWizard } from '@/lib/contexts/WizardContext';

export default function WizardTracker() {
  const { postId, postDetails, existingExports, currentStep } = useWizard();
  const startTimeRef = useRef(Date.now());
  const currentStepRef = useRef(currentStep);

  // Keep ref in sync so cleanup captures latest step
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    trackEvent('wizard_started', {
      post_id: postId,
      media_type: postDetails.media_type,
      comments_count: postDetails.comments_count ?? 0,
      existing_exports_count: existingExports.length,
    });

    const startTime = startTimeRef.current;

    return () => {
      // Only fire wizard_exited if user didn't complete (step 4 = completed)
      if (currentStepRef.current < 4) {
        trackEvent('wizard_exited', {
          last_step_reached: currentStepRef.current,
          time_spent_sec: Math.round((Date.now() - startTime) / 1000),
        });
      }
    };
  }, [postId, postDetails, existingExports]);

  return null;
}
