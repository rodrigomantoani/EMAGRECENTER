'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProvider, useQuiz } from '@/store/quiz-store';
import { TOTAL_STEPS } from '@/data/quiz-steps';
import { ResultPage } from '@/components/quiz/ResultPage';

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
      {/* Main Content */}
      <main className="max-w-[480px] mx-auto xl:pb-16">
        <ResultPage
          question={{
            id: 'resultado',
            type: 'result',
            title: 'Seu plano EmagreCENTER',
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
