'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProvider, useQuiz } from '@/store/quiz-store';
import { TOTAL_STEPS } from '@/data/quiz-steps';
import { ResultPage } from '@/components/quiz/ResultPage';
import Image from 'next/image';

function RecomendacaoContent() {
  const router = useRouter();
  const { answers, isQuizCompleted, isHydrated, resetQuiz } = useQuiz();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    // Only allow access if quiz was completed
    if (!isQuizCompleted) {
      // Build redirect URL with md param if user had medication preference
      const mdParam = answers.preferenciaMedicacao === 'mounjaro' ? 't' :
                      answers.preferenciaMedicacao === 'wegovy' ? 's' : null;

      // Reset quiz to clear localStorage and start fresh
      resetQuiz();

      // Redirect to quiz start with md param if applicable
      const redirectUrl = mdParam ? `/?md=${mdParam}` : '/';
      router.replace(redirectUrl);
      return;
    }

    setIsReady(true);
  }, [isHydrated, isQuizCompleted, answers.preferenciaMedicacao, resetQuiz, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando sua recomendação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="max-w-[480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-14 sm:h-16">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[480px] mx-auto pt-4 sm:pt-6 lg:pt-8 xl:pb-16">
        <ResultPage
          question={{
            id: 'resultado',
            type: 'result',
            title: 'Seu plano Emagrecenter',
          }}
        />
      </main>
    </div>
  );
}

export default function RecomendacaoPage() {
  return (
    <QuizProvider totalSteps={TOTAL_STEPS}>
      <RecomendacaoContent />
    </QuizProvider>
  );
}
