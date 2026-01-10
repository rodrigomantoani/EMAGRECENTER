'use client';

import { useEffect } from 'react';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
import { Loader2 } from 'lucide-react';

interface LoadingStepProps {
  question: Question;
}

export function LoadingStep({ question }: LoadingStepProps) {
  const { nextStep } = useQuiz();

  useEffect(() => {
    const timer = setTimeout(() => {
      nextStep();
    }, 3000);

    return () => clearTimeout(timer);
  }, [nextStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 lg:px-8 text-center">
      <div className="mb-6 sm:mb-8">
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-accent animate-spin" />
      </div>

      <div className="space-y-3 sm:space-y-4 max-w-sm sm:max-w-md">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-heading font-bold text-primary">
          {question.title}
        </h1>

        {question.description && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      <div className="mt-6 sm:mt-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
