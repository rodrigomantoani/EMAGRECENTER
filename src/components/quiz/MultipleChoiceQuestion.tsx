'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question, QuizData } from '@/types/quiz';
import { Check } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: Question;
}

export function MultipleChoiceQuestion({ question }: MultipleChoiceQuestionProps) {
  const { answers, setAnswer, nextStep } = useQuiz();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const currentValue = answers[question.id as keyof QuizData];
    if (Array.isArray(currentValue)) {
      setSelected(currentValue as string[]);
    }
  }, [answers, question.id]);

  const handleToggle = (optionId: string, isExclusive?: boolean) => {
    setSelected((prev) => {
      // Se for opção exclusiva (como "Nenhuma")
      if (isExclusive) {
        return prev.includes(optionId) ? [] : [optionId];
      }

      // Remove qualquer opção exclusiva quando selecionar outra
      const exclusiveIds = [
        ...(question.options?.filter(o => o.exclusive).map(o => o.id) || []),
        ...(question.groups?.flatMap(g => g.options.filter(o => o.exclusive).map(o => o.id)) || [])
      ];
      const withoutExclusive = prev.filter(id => !exclusiveIds.includes(id));

      if (withoutExclusive.includes(optionId)) {
        return withoutExclusive.filter((id) => id !== optionId);
      }
      return [...withoutExclusive, optionId];
    });
  };

  const handleContinue = () => {
    setAnswer(question.id as keyof QuizData, selected as QuizData[keyof QuizData]);
    nextStep();
  };

  const renderOption = (option: { id: string; label: string; description?: string; helper?: string; exclusive?: boolean }) => {
    const isSelected = selected.includes(option.id);
    const isExclusive = option.exclusive || option.id === 'nenhuma' || option.id === 'nenhum' || option.id === 'nunca-usei';

    return (
      <div
        key={option.id}
        onClick={() => handleToggle(option.id, isExclusive)}
        className={`
          flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-pointer transition-all
          border-2
          ${isSelected
            ? 'border-[var(--evergreen)] shadow-[0_0_0_1px_var(--evergreen)] bg-white'
            : isExclusive
              ? 'border-[var(--border)] bg-[var(--border)]/30'
              : 'border-[var(--border)] bg-white hover:border-[var(--evergreen)]/50'
          }
        `}
        style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}
      >
        {/* Checkbox Indicator */}
        <div className="flex-shrink-0 mt-0.5">
          <div
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center
              ${isSelected
                ? 'border-[var(--evergreen)] bg-[var(--evergreen)]'
                : 'border-[var(--border)]'
              }
            `}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base text-primary leading-snug">
            {option.label}
          </p>
          {option.helper && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {option.helper}
            </p>
          )}
          {option.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {option.description}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title Section */}
      <div className="space-y-2 sm:space-y-3">
        {question.subtitle && (
          <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
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

      {/* Options by groups */}
      <div className="flex flex-col gap-4 sm:gap-6">
        {question.groups?.map((group) => (
          <div key={group.title} className="space-y-2 sm:space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </p>
            <div className="flex flex-col gap-2">
              {group.options.map((option) => renderOption(option))}
            </div>
          </div>
        ))}

        {/* Standalone options */}
        {question.options && question.options.length > 0 && (
          <div className="flex flex-col gap-2">
            {question.options.map((option) => renderOption(option))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="w-full bg-accent cursor-pointer hover:bg-accent/90 text-white font-bold py-6 text-sm sm:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
      >
        {question.buttonText || 'Continuar'}
      </Button>
    </div>
  );
}
