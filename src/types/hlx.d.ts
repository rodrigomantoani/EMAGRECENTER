// HLX Tracker - Global Type Declarations
// https://hlx-tracker.pages.dev/hlx.js

interface HLXTracker {
  // Track custom events
  track: (eventName: string, data?: Record<string, unknown>) => void;

  // Identify user by email
  identify: (email: string) => void;

  // Get visitor/session info
  getVisitorId: () => string;
  getSessionId: () => string;
  getEmail: () => string | null;

  // Get metrics
  getTimeOnPage: () => number;
  getScrollDepth: () => number;
  isEngaged: () => boolean;

  // Get attribution
  getFirstTouch: () => Record<string, string>;
  getLastTouch: () => Record<string, string>;
  getUrlParams: () => Record<string, string>;
  getTrafficType: () => string;

  // Server payload helpers
  getServerPayload: (eventName: string, data?: Record<string, unknown>) => Record<string, unknown>;
  getServerPayloadJSON: (eventName: string, data?: Record<string, unknown>) => string;

  // Debug mode
  debug: (enabled: boolean) => void;
}

declare global {
  interface Window {
    HLX?: HLXTracker;
  }

  // Also declare as global variable
  const HLX: HLXTracker | undefined;
}

export {};
