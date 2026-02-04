'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init('phc_PsTVdKT6JqHAcEiojPh7CQ5u0Vpbuq2xJvZZ6gpS0Zi', {
        api_host: 'https://app.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

// Analytics helper functions
export const analytics = {
  // Track quiz step view
  trackStepView: (stepId: string, stepNumber: number, stepPhase: string) => {
    posthog.capture('quiz_step_viewed', {
      step_id: stepId,
      step_number: stepNumber,
      step_phase: stepPhase,
    });
  },

  // Track quiz step completion
  trackStepComplete: (stepId: string, stepNumber: number, answer: any) => {
    posthog.capture('quiz_step_completed', {
      step_id: stepId,
      step_number: stepNumber,
      answer_value: JSON.stringify(answer),
    });
  },

  // Track quiz abandonment
  trackAbandon: (stepId: string, stepNumber: number, timeSpent: number) => {
    posthog.capture('quiz_abandoned', {
      step_id: stepId,
      step_number: stepNumber,
      time_spent_seconds: timeSpent,
    });
  },

  // Track quiz completion
  trackQuizComplete: (totalTime: number, answers: Record<string, any>) => {
    posthog.capture('quiz_completed', {
      total_time_seconds: totalTime,
      total_steps: Object.keys(answers).length,
    });
  },

  // Track conversion start (PIX clicked)
  trackConversionStart: (plan: string, price: number) => {
    posthog.capture('conversion_started', {
      plan,
      price,
      currency: 'BRL',
    });

    // Send to Google Ads
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        value: price,
        currency: 'BRL',
        items: [{ item_name: plan, price }],
      });
    }
  },

  // Track PIX payment completed
  trackPurchase: (plan: string, price: number, transactionId: string) => {
    posthog.capture('purchase', {
      plan,
      price,
      currency: 'BRL',
      transaction_id: transactionId,
    });

    // Send to Google Ads conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: price,
        currency: 'BRL',
        items: [{ item_name: plan, price }],
      });
    }

    // Send to Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: price,
        currency: 'BRL',
        content_name: plan,
      });
    }
  },

  // Identify user
  identifyUser: (email: string, properties?: Record<string, any>) => {
    posthog.identify(email, properties);
  },
};
