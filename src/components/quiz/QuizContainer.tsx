'use client';

import { useEffect, Suspense, useState, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { QuizProvider, useQuiz } from '@/store/quiz-store';
import { quizSteps, TOTAL_STEPS } from '@/data/quiz-steps';
import { QuizProgress } from './QuizProgress';
import { analytics, umami } from '@/lib/analytics';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { InputQuestion } from './InputQuestion';
import { InterstitialCard } from './InterstitialCard';
import { LoadingStep } from './LoadingStep';
import { WelcomePage } from './WelcomePage';
import { DropdownQuestion } from './DropdownQuestion';
import { RadioCardQuestion } from './RadioCardQuestion';
import { TextareaQuestion } from './TextareaQuestion';
import { OverviewPage } from './OverviewPage';
import { BenefitCard } from './BenefitCard';
import { ResultPage } from './ResultPage';
import { MeasuresQuestion } from './MeasuresQuestion';
import { IMCResult } from './IMCResult';
import { GoalWeightQuestion } from './GoalWeightQuestion';
import { GoalDateQuestion } from './GoalDateQuestion';
import { BirthDateQuestion } from './BirthDateQuestion';
import { PregnancyQuestion } from './PregnancyQuestion';
import Image from 'next/image';
/* eslint-disable @next/next/no-img-element */

// Map region names to state codes
const REGION_TO_STATE: Record<string, string> = {
  'Acre': 'AC',
  'Alagoas': 'AL',
  'Amapá': 'AP',
  'Amazonas': 'AM',
  'Bahia': 'BA',
  'Ceará': 'CE',
  'Distrito Federal': 'DF',
  'Espírito Santo': 'ES',
  'Goiás': 'GO',
  'Maranhão': 'MA',
  'Mato Grosso': 'MT',
  'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG',
  'Pará': 'PA',
  'Paraíba': 'PB',
  'Paraná': 'PR',
  'Pernambuco': 'PE',
  'Piauí': 'PI',
  'Rio de Janeiro': 'RJ',
  'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS',
  'Rondônia': 'RO',
  'Roraima': 'RR',
  'Santa Catarina': 'SC',
  'São Paulo': 'SP',
  'Sergipe': 'SE',
  'Tocantins': 'TO',
};

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function QuizContent() {
  const { currentStep, prevStep, answers, setAnswer, setInitialStep, isHydrated, completeQuiz } = useQuiz();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [initialStepSet, setInitialStepSet] = useState(false);

  // Store initial params (without step) to preserve them when updating URL
  const initialParamsRef = useRef<string | null>(null);

  // Track if this is the first render to avoid pushing initial state
  const isFirstRender = useRef(true);

  // Track the last step we pushed to history to avoid duplicate pushes
  const lastPushedStep = useRef<number | null>(null);

  // Set mounted after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Capture initial params (excluding step) once on mount
    if (initialParamsRef.current === null) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('step');
      initialParamsRef.current = params.toString();
    }
  }, [searchParams]);

  // Read medication preference from URL query param
  useEffect(() => {
    const mdParam = searchParams.get('md');
    if (mdParam === 't' && !answers.preferenciaMedicacao) {
      setAnswer('preferenciaMedicacao', 'mounjaro');
    } else if (mdParam === 's' && !answers.preferenciaMedicacao) {
      setAnswer('preferenciaMedicacao', 'wegovy');
    }
  }, [searchParams, answers.preferenciaMedicacao, setAnswer]);

  // Read step from URL query param (only after hydration, once)
  useEffect(() => {
    if (!isHydrated || initialStepSet) return;
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepIndex = parseInt(stepParam, 10);
      if (!isNaN(stepIndex) && stepIndex >= 0) {
        setInitialStep(stepIndex);
      }
    }
    setInitialStepSet(true);
  }, [searchParams, setInitialStep, isHydrated, initialStepSet]);

  // Update URL when step changes (after initial load)
  useEffect(() => {
    if (!mounted || !isHydrated || !initialStepSet) return;

    // Redirect to /recomendacao when reaching the result step
    if (currentStep >= TOTAL_STEPS - 1) {
      completeQuiz();
      router.replace('/recomendacao');
      return;
    }

    // Use stored initial params instead of searchParams (which gets stale)
    const params = new URLSearchParams(initialParamsRef.current || '');

    // Only add step param if not on first step
    if (currentStep > 0) {
      params.set('step', currentStep.toString());
    } else {
      params.delete('step');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // On first render, use replaceState to set initial URL without adding history
    // On subsequent renders, use pushState to add to browser history
    if (isFirstRender.current) {
      window.history.replaceState({ step: currentStep }, '', newUrl);
      isFirstRender.current = false;
      lastPushedStep.current = currentStep;
    } else if (lastPushedStep.current !== currentStep) {
      window.history.pushState({ step: currentStep }, '', newUrl);
      lastPushedStep.current = currentStep;
    }
  }, [currentStep, mounted, isHydrated, initialStepSet, pathname, router, completeQuiz]);

  // Listen for browser back/forward button
  useEffect(() => {
    if (!mounted || !isHydrated) return;

    const handlePopState = (event: PopStateEvent) => {
      // Get step from state or parse from URL
      let targetStep = 0;

      if (event.state?.step !== undefined) {
        targetStep = event.state.step;
      } else {
        // Fallback: parse step from URL
        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = urlParams.get('step');
        if (stepParam) {
          targetStep = parseInt(stepParam, 10);
          if (isNaN(targetStep)) targetStep = 0;
        }
      }

      // Update the quiz step without pushing new history
      lastPushedStep.current = targetStep;
      setInitialStep(targetStep);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mounted, isHydrated, setInitialStep]);

  // Fetch user's state from IP on mount
  useEffect(() => {
    // Skip if already has estado
    if (answers.estado) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    fetch('https://ipinfo.io/json?token=496744718c24a3', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.country === 'BR' && data.region) {
          const stateCode = REGION_TO_STATE[data.region];
          if (stateCode) {
            setAnswer('estado', stateCode);
          }
        }
      })
      .catch(() => {
        // Silently fail - user can select manually
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [answers.estado, setAnswer]);

  const step = quizSteps[currentStep];

  // Track time spent on each step for Umami step_leave tracking
  const stepStartTimeRef = useRef<number>(0);
  const lastTrackedStepRef = useRef<{ id: string; number: number } | null>(null);

  // Track step view
  useEffect(() => {
    if (!mounted || !isHydrated || !step) return;
    
    // Track step leave for previous step (if any)
    if (lastTrackedStepRef.current) {
      const timeSpent = Math.floor((Date.now() - stepStartTimeRef.current) / 1000);
      umami.trackStepLeave(
        lastTrackedStepRef.current.id,
        lastTrackedStepRef.current.number,
        timeSpent
      );
    }
    
    // Track step view (PostHog and Umami)
    analytics.trackStepView(step.id, currentStep, step.phase);
    umami.trackStepView(step.id, currentStep, step.phase);
    
    // Reset timer and save current step for tracking leave
    stepStartTimeRef.current = Date.now();
    lastTrackedStepRef.current = { id: step.id, number: currentStep };
  }, [currentStep, mounted, isHydrated, step]);

  // Track step leave on page unload/close
  useEffect(() => {
    if (!mounted || !isHydrated) return;
    
    const handleBeforeUnload = () => {
      if (lastTrackedStepRef.current) {
        const timeSpent = Math.floor((Date.now() - stepStartTimeRef.current) / 1000);
        umami.trackStepLeave(
          lastTrackedStepRef.current.id,
          lastTrackedStepRef.current.number,
          timeSpent
        );
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mounted, isHydrated]);

  // Wait for mount and hydration to complete before rendering to avoid hydration mismatch
  if (!mounted || !isHydrated) {
    return <LoadingSpinner />;
  }

  if (!step) return null;

  const { question } = step;

  const renderQuestion = () => {
    switch (question.type) {
      case 'welcome':
        return <WelcomePage question={question} />;
      case 'overview':
        return <OverviewPage question={question} />;
      case 'single-choice':
        return <SingleChoiceQuestion question={question} />;
      case 'multiple-choice':
        return <MultipleChoiceQuestion question={question} />;
      case 'dropdown':
        return <DropdownQuestion question={question} />;
      case 'radio-card':
        return <RadioCardQuestion question={question} />;
      case 'input-text':
      case 'input-number':
      case 'input-date':
      case 'input-contact':
        return <InputQuestion question={question} />;
      case 'textarea':
        return <TextareaQuestion question={question} />;
      case 'interstitial':
        return <InterstitialCard question={question} />;
      case 'benefit':
        return <BenefitCard question={question} />;
      case 'measures':
        return <MeasuresQuestion question={question} />;
      case 'imc-result':
        return <IMCResult question={question} />;
      case 'goal-weight':
        return <GoalWeightQuestion question={question} />;
      case 'goal-date':
        return <GoalDateQuestion question={question} />;
      case 'birth-date':
        return <BirthDateQuestion question={question} />;
      case 'pregnancy-check':
        return <PregnancyQuestion question={question} />;
      case 'loading':
        return <LoadingStep question={question} />;
      case 'result':
        return <ResultPage question={question} />;
      default:
        return null;
    }
  };

  // Types that should hide the progress bar
  const hideProgressTypes = ['welcome', 'interstitial', 'benefit', 'loading', 'overview', 'result'];
  const showProgress = !hideProgressTypes.includes(question.type);

  // Types that should hide the back button
  const hideBackTypes = ['welcome', 'loading', 'result'];
  const showBackButton = currentStep > 0 && !hideBackTypes.includes(question.type);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="max-w-[480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Back Button */}
            <div className="w-10">
              {showBackButton && (
                <button
                  onClick={prevStep}
                  className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Voltar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
              )}
            </div>

            {/* Logo/Title */}
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center">
                <Image
                  src="/logo.svg"
                  alt="EmagreCENTER"
                  width={160}
                  height={40}
                  className="w-40 h-10"
                />
                <span className="text-[10px] sm:text-xs text-[#5A6754]/70 tracking-[0.2em] font-semibold -mt-0.5">
                  SEU OBJETIVO, MAIS RÁPIDO
                </span>
              </div>
            </div>

            {/* Spacer for balance */}
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {showProgress && <QuizProgress />}

      {/* Main Content */}
      <main className="max-w-[480px] mx-auto pt-4 sm:pt-6 lg:pt-8 xl:pb-16">
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          {renderQuestion()}
        </div>
      </main>

      {/* Footer - visible only on large desktop screens (1280px+) */}
      <footer className="hidden xl:block fixed bottom-0 left-0 right-0 py-3 bg-background/95 backdrop-blur border-t border-border/40">
        <div className="max-w-[480px] mx-auto px-8 flex items-center justify-between text-xs text-muted-foreground">
          <p>Suas informações são protegidas</p>
          <p>Atendimento 100% online</p>
        </div>
      </footer>
    </div>
  );
}

export function QuizContainer() {
  return (
    <QuizProvider totalSteps={TOTAL_STEPS}>
      <Suspense fallback={<LoadingSpinner />}>
        <QuizContent />
      </Suspense>
    </QuizProvider>
  );
}
