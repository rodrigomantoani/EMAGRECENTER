'use client';

import { useState, useEffect } from 'react';
import { useQuiz } from '@/store/quiz-store';
import type { Question, QuizData } from '@/types/quiz';
/* eslint-disable @next/next/no-img-element */

interface RadioCardQuestionProps {
  question: Question;
}

export function RadioCardQuestion({ question }: RadioCardQuestionProps) {
  const { answers, setAnswer, nextStep } = useQuiz();
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const currentValue = answers[question.id as keyof QuizData];
    if (typeof currentValue === 'string') {
      setSelected(currentValue);
    }
  }, [answers, question.id]);

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    setAnswer(question.id as keyof QuizData, optionId as QuizData[keyof QuizData]);
    // Auto advance after selection with delay for visual feedback
    setTimeout(() => nextStep(), 400);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title Section */}
      <div className="space-y-2 sm:space-y-3">
        {question.subtitle && (
          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
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

      {/* Radio Cards */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {question.radioCardOptions?.map((option) => {
          const isSelected = selected === option.id;
          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 rounded-xl cursor-pointer transition-all
                bg-white border-2
                ${isSelected
                  ? 'border-[var(--evergreen)] shadow-[0_0_0_1px_var(--evergreen)]'
                  : 'border-[var(--border)] hover:border-[var(--evergreen)]/50'
                }
              `}
              style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}
            >
              {/* Image/Icon */}
              {option.image && (
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[var(--mint-light)]">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-base sm:text-lg font-bold text-primary leading-snug">
                  {option.title}
                </p>
                {option.subtitle && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {option.subtitle}
                  </p>
                )}
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {option.description}
                  </p>
                )}
                {option.price && (
                  <p className="text-sm sm:text-base font-bold text-accent mt-2">
                    {option.price}
                  </p>
                )}
                {option.priceNote && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.priceNote}
                  </p>
                )}
              </div>

              {/* Radio Indicator */}
              <div className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto flex-shrink-0">
                <div
                  className={`
                    w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected
                      ? 'border-[var(--evergreen)]'
                      : 'border-[var(--border)]'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[var(--evergreen)]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer/Disclaimer */}
      {question.footer && (
        <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2">
          {question.footer}
        </p>
      )}
    </div>
  );
}
