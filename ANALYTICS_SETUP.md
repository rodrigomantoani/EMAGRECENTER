# Analytics Setup Guide

## PostHog Setup (5 minutes)

### 1. Create Account
- Go to https://posthog.com/signup
- Sign up (free tier: 1M events/month)

### 2. Get API Key
- After signup, you'll see your Project API Key
- Copy it (starts with `phc_`)

### 3. Add to .env.local
```bash
NEXT_PUBLIC_POSTHOG_KEY="phc_your_actual_key_here"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### 4. Deploy
```bash
npm run build
vercel --prod
```

## What Gets Tracked

### Quiz Funnel Events
- `quiz_step_viewed` - Every step view
- `quiz_step_completed` - Step completion with answer
- `quiz_abandoned` - When user leaves (time spent tracked)
- `quiz_completed` - Full quiz completion

### Conversion Events
- `conversion_started` - PIX button clicked
- `purchase` - Payment completed

### All events automatically sync to:
- ✅ Google Ads (via gtag)
- ✅ Facebook Pixel (via fbq)
- ✅ PostHog dashboards

## Usage in Code

### Track in QuizContainer
```tsx
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';

// Inside component
const { trackComplete } = useQuizAnalytics(
  step.id, 
  currentStep, 
  step.phase
);

// When user answers
const handleAnswer = (answer) => {
  trackComplete(answer);
  nextStep();
};
```

### Track Conversion on Checkout
```tsx
import { analytics } from '@/lib/analytics';

// When user clicks PIX
analytics.trackConversionStart('plano-premium', 1799.99);

// When payment confirms
analytics.trackPurchase('plano-premium', 1799.99, 'TXN_123');
```

### Identify User
```tsx
// After email collected
analytics.identifyUser(email, {
  name: nome,
  peso: peso,
  altura: altura,
});
```

## PostHog Dashboards

### 1. Create Funnel
1. Go to PostHog → Insights → New Insight
2. Select "Funnel"
3. Add steps:
   - `quiz_step_viewed` (step_number = 0)
   - `quiz_step_viewed` (step_number = 1)
   - ... (add all 24 steps)
   - `conversion_started`
   - `purchase`
4. Save as "Quiz Conversion Funnel"

### 2. Drop-off Analysis
- Funnel shows % drop-off at each step
- Click any step to see session recordings
- Watch recordings to see why users abandoned

### 3. Google Ads Integration
1. PostHog → Settings → Integrations
2. Enable "Google Ads"
3. Map events:
   - `conversion_started` → "Begin Checkout"
   - `purchase` → "Purchase"
4. Conversion data flows back to Google Ads automatically

## Alternative: Mixpanel

If you prefer Mixpanel instead:
```bash
npm install mixpanel-browser
```

Replace PostHog with Mixpanel in `src/lib/analytics.tsx`:
```tsx
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!);

export const analytics = {
  trackStepView: (stepId, stepNumber, stepPhase) => {
    mixpanel.track('quiz_step_viewed', { stepId, stepNumber, stepPhase });
  },
  // ... rest of methods
};
```

## Cost Comparison

| Tool | Free Tier | Paid |
|------|-----------|------|
| PostHog | 1M events/month | $200/month |
| Mixpanel | 20M events/month | $20/month |
| Amplitude | 10M events/month | Custom |
| GA4 | Unlimited | Free |

**Recommendation**: Start with PostHog free tier. You'll get ~30k quiz sessions/month.

## Support

Questions? Check:
- PostHog Docs: https://posthog.com/docs
- Google Ads Conversion Tracking: https://support.google.com/google-ads/answer/6331314
