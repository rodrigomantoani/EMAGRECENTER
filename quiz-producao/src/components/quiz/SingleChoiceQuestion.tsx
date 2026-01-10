'use client';

import { useQuiz } from '@/store/quiz-store';
import type { Question, QuizData } from '@/types/quiz';
import { Info } from 'lucide-react';

interface SingleChoiceQuestionProps {
  question: Question;
}

export function SingleChoiceQuestion({ question }: SingleChoiceQuestionProps) {
  const { answers, setAnswer, nextStep } = useQuiz();
  const currentValue = answers[question.id as keyof QuizData];

  const handleSelect = (optionId: string) => {
    setAnswer(question.id as keyof QuizData, optionId as QuizData[keyof QuizData]);
    if (question.autoAdvance) {
      setTimeout(() => nextStep(), 300);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title Section */}
      <div className="space-y-2 sm:space-y-3">
        {question.subtitle && (
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            {question.subtitle}
          </p>
        )}
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
        {question.options?.map((option) => {
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
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected
                      ? 'border-[var(--evergreen)]'
                      : 'border-[var(--border)]'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--evergreen)]" />
                  )}
                </div>
              </div>

              {/* Icon (emoji) */}
              {option.icon && (
                <span className="text-3xl sm:text-4xl">{option.icon}</span>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-primary leading-snug">
                  {option.label}
                </p>
                {option.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {question.footer && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <p>{question.footer}</p>
        </div>
      )}
    </div>
  );
}
