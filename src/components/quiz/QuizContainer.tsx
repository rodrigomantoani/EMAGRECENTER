'use client';

import { QuizProvider, useQuiz } from '@/store/quiz-store';
import { quizSteps, TOTAL_STEPS } from '@/data/quiz-steps';
import { QuizProgress } from './QuizProgress';
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
import Image from 'next/image';
/* eslint-disable @next/next/no-img-element */

function QuizContent() {
  const { currentStep, prevStep } = useQuiz();
  const step = quizSteps[currentStep];

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  alt="EmagreCenter"
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
      <main className="max-w-3xl mx-auto pt-4 sm:pt-6 lg:pt-8">
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          {renderQuestion()}
        </div>
      </main>

      {/* Footer - visible on larger screens */}
      <footer className="hidden lg:block fixed bottom-0 left-0 right-0 py-4 bg-background/80 backdrop-blur border-t border-border/40">
        <div className="max-w-3xl mx-auto px-8 flex items-center justify-between text-xs text-muted-foreground">
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
      <QuizContent />
    </QuizProvider>
  );
}
