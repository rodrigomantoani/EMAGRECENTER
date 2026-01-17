'use client';

import { useState } from 'react';
import { useQuiz } from '@/store/quiz-store';
import type { Question, QuizData } from '@/types/quiz';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PregnancyQuestionProps {
  question: Question;
}

export function PregnancyQuestion({ question }: PregnancyQuestionProps) {
  const router = useRouter();
  const { answers, setAnswer, nextStep } = useQuiz();
  const currentValue = answers[question.id as keyof QuizData] as string | undefined;

  const [showBlockScreen, setShowBlockScreen] = useState(false);
  const [agreedToHonesty, setAgreedToHonesty] = useState(false);

  const handleSelect = (optionId: string) => {
    setAnswer(question.id as keyof QuizData, optionId as QuizData[keyof QuizData]);

    if (optionId === 'sim') {
      // Show block screen
      setTimeout(() => setShowBlockScreen(true), 300);
    } else {
      // Continue normally
      setTimeout(() => nextStep(), 300);
    }
  };

  const handleReviewAnswers = () => {
    // Go back to question view but keep "sim" selected
    setShowBlockScreen(false);
    setAgreedToHonesty(false);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Block Screen
  if (showBlockScreen) {
    return (
      <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 pb-8">
        {/* X Icon */}
        <div className="flex justify-center pt-4">
          <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center">
            <X className="w-7 h-7 text-primary" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl lg:text-[28px] leading-tight font-heading font-bold text-primary">
            Pensando na sua saúde, melhor parar por aqui.
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pelo seu histórico, recomendamos uma consulta médica presencial para um exame aprofundado.
          </p>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Você pode revisar suas respostas para corrigir erros. Atenção: dados errados podem prejudicar sua saúde.
          </p>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3 mt-2">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="honesty-checkbox"
              checked={agreedToHonesty}
              onChange={(e) => setAgreedToHonesty(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-[var(--border)] text-[var(--evergreen)] focus:ring-[var(--evergreen)] focus:ring-offset-0 cursor-pointer"
            />
          </div>
          <label
            htmlFor="honesty-checkbox"
            className="text-sm sm:text-base text-primary cursor-pointer select-none"
          >
            Me comprometo a ser honesto nas respostas
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleReviewAnswers}
            disabled={!agreedToHonesty}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-base transition-all
              ${agreedToHonesty
                ? 'bg-[var(--evergreen)] text-white hover:bg-[var(--evergreen)]/90 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Revisar respostas
          </button>

          <button
            onClick={handleGoHome}
            className="w-full py-4 px-6 rounded-lg font-semibold text-base border-2 border-[var(--evergreen)] text-[var(--evergreen)] hover:bg-[var(--evergreen)]/5 transition-all"
          >
            Voltar à página inicial
          </button>
        </div>
      </div>
    );
  }

  // Question View
  const options = [
    { id: 'sim', label: 'Sim' },
    { id: 'nao', label: 'Não, e estou ciente' },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title Section */}
      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] leading-tight font-heading font-bold text-primary">
          {question.title}
        </h1>
        {question.helperText && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {question.helperText}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {options.map((option) => {
          const isSelected = currentValue === option.id;
          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-pointer transition-all
                bg-white border-2
                ${isSelected
                  ? 'border-[var(--evergreen)] shadow-[0_0_0_1px_var(--evergreen)]'
                  : 'border-[var(--border)] hover:border-[var(--evergreen)]/50'
                }
              `}
              style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}
            >
              {/* Radio Indicator */}
              <span
                className={`
                  flex-shrink-0 mt-0.5 inline-block w-5 h-5 rounded-full
                  border-2 border-solid
                  ${isSelected ? 'border-[#779d7c] bg-[#779d7c]' : 'border-[#dfe6e0] bg-white'}
                `}
                style={{
                  boxShadow: isSelected ? 'inset 0 0 0 3px white' : 'none',
                }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-primary leading-snug">
                  {option.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
