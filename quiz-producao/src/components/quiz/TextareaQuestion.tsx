'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question, QuizData } from '@/types/quiz';

interface TextareaQuestionProps {
  question: Question;
}

export function TextareaQuestion({ question }: TextareaQuestionProps) {
  const { answers, setAnswer, nextStep } = useQuiz();
  const [value, setValue] = useState('');

  useEffect(() => {
    const currentValue = answers[question.id as keyof QuizData];
    if (typeof currentValue === 'string') {
      setValue(currentValue);
    }
  }, [answers, question.id]);

  const handleContinue = () => {
    // Textarea é opcional, pode continuar mesmo vazio
    if (value.trim()) {
      setAnswer(question.id as keyof QuizData, value as QuizData[keyof QuizData]);
    }
    nextStep();
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

      {/* Textarea */}
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={question.fields?.[0]?.placeholder || 'Digite aqui...'}
          rows={question.fields?.[0]?.rows || 5}
          className={`
            w-full px-4 py-3 sm:py-4 rounded-lg border-2 bg-white
            text-sm sm:text-base text-primary placeholder:text-muted-foreground/50
            focus:outline-none focus:border-[var(--evergreen)] transition-colors
            resize-none border-[var(--border)]
          `}
        />
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        className="w-full bg-accent cursor-pointer hover:bg-accent/90 text-white font-bold py-6 text-sm sm:text-base rounded-lg min-h-[56px]"
      >
        {question.buttonText || 'Continuar'}
      </Button>
    </div>
  );
}
