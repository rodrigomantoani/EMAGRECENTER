'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
import { WheelPicker } from './WheelPicker';

interface MeasuresQuestionProps {
  question: Question;
}

export function MeasuresQuestion({ question }: MeasuresQuestionProps) {
  const { answers, setAnswers, nextStep } = useQuiz();
  const [altura, setAltura] = useState(answers.altura || 170);
  const [peso, setPeso] = useState(answers.peso || 80);
  const [alturaChanged, setAlturaChanged] = useState(!!answers.altura);
  const [pesoChanged, setPesoChanged] = useState(!!answers.peso);

  const isReady = alturaChanged && pesoChanged;

  const handleAlturaChange = (value: number) => {
    setAltura(value);
    setAlturaChanged(true);
  };

  const handlePesoChange = (value: number) => {
    setPeso(value);
    setPesoChanged(true);
  };

  const handleContinue = () => {
    if (!isReady) return;
    setAnswers({ altura, peso });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title */}
      <div className="space-y-2">
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

      {/* Wheel Pickers */}
      <div className="flex justify-center gap-8 py-8">
        <WheelPicker
          value={altura}
          onChange={handleAlturaChange}
          min={140}
          max={220}
          step={1}
          suffix=" cm"
          label="Altura"
        />
        <WheelPicker
          value={peso}
          onChange={handlePesoChange}
          min={40}
          max={200}
          step={1}
          suffix=" kg"
          label="Peso"
        />
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!isReady}
        className={`w-full cursor-pointer font-bold py-6 text-sm sm:text-base rounded-lg transition-all min-h-[56px] ${isReady
            ? 'bg-accent hover:bg-accent/90 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        Continuar
      </Button>
    </div>
  );
}
