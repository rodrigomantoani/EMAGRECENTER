'use client';

import { useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics';

export function useQuizAnalytics(
  stepId: string,
  stepNumber: number,
  stepPhase: string
) {
  const startTimeRef = useRef<number>(Date.now());
  const trackedRef = useRef(false);

  useEffect(() => {
    // Reset on step change
    startTimeRef.current = Date.now();
    trackedRef.current = false;

    // Track step view
    analytics.trackStepView(stepId, stepNumber, stepPhase);

    // Track abandonment on unmount
    return () => {
      if (!trackedRef.current) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        analytics.trackAbandon(stepId, stepNumber, timeSpent);
      }
    };
  }, [stepId, stepNumber, stepPhase]);

  // Call this when step is completed
  const trackComplete = (answer: any) => {
    trackedRef.current = true;
    analytics.trackStepComplete(stepId, stepNumber, answer);
  };

  return { trackComplete };
}
