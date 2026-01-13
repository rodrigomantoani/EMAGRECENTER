'use client';

import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/store/quiz-store';

// Função que faz o progresso parecer mais rápido no início e mais lento no final
function easeOutProgress(realProgress: number): number {
  // Normaliza para 0-1
  const t = realProgress / 100;
  // Ease-out cubic: começa rápido, termina devagar
  const eased = 1 - Math.pow(1 - t, 2);
  // Volta para 0-100
  return Math.round(eased * 100);
}

export function QuizProgress() {
  const { progress } = useQuiz();

  // Aplica o easing para parecer mais rápido no início
  const visualProgress = easeOutProgress(progress);

  return (
    <div className="bg-background">
      <div className="max-w-[480px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Progress value={visualProgress} className="flex-1 h-1.5 sm:h-2" />
          <span className="text-xs sm:text-sm text-muted-foreground font-medium min-w-[2.5rem] sm:min-w-[3rem] text-right">
            {visualProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}
