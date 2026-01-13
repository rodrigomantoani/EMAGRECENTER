'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
import { WheelPicker } from './WheelPicker';

interface GoalWeightQuestionProps {
  question: Question;
}

export function GoalWeightQuestion({ question }: GoalWeightQuestionProps) {
  const { answers, setAnswers, nextStep } = useQuiz();

  // Calculate suggested weight based on medication's expected weight loss
  const pesoAtual = answers.peso || 80;
  const medication = answers.preferenciaMedicacao;

  // Tirzepatida (mounjaro): 25% loss, Semaglutida (wegovy): 17% loss
  const perdaPercentual = medication === 'mounjaro' ? 0.25 : 0.17;
  const sugestao = Math.round(pesoAtual * (1 - perdaPercentual));

  const [pesoMeta, setPesoMeta] = useState(answers.pesoMeta || sugestao);
  const [changed, setChanged] = useState(true); // Always enabled by default

  const handleChange = (value: number) => {
    setPesoMeta(value);
    setChanged(true);
  };

  const handleContinue = () => {
    if (!changed) return;
    setAnswers({ pesoMeta });
    nextStep();
  };

  // Calcular quanto precisa perder
  const perder = pesoAtual - pesoMeta;

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] leading-tight font-heading font-bold text-primary">
          {question.title || 'Qual peso você quer alcançar?'}
        </h1>
        {question.helperText && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {question.helperText}
          </p>
        )}
      </div>

      {/* Wheel Picker */}
      <div className="flex justify-center py-8">
        <WheelPicker
          value={pesoMeta}
          onChange={handleChange}
          min={40}
          max={180}
          step={1}
          suffix=" kg"
          label="Peso desejado"
        />
      </div>

      {/* Info de quanto vai perder */}
      {changed && perder > 0 && (
        <div className="bg-[#7CB342]/10 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Você quer perder</p>
          <p className="text-2xl font-bold text-[#7CB342]">{perder} kg</p>
          <p className="text-xs text-muted-foreground mt-1">
            Meta totalmente alcançável com o tratamento certo
          </p>
        </div>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!changed}
        className={`w-full cursor-pointer font-bold py-6 text-sm sm:text-base rounded-lg transition-all min-h-[56px] ${changed
            ? 'bg-accent hover:bg-accent/90 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        Continuar
      </Button>
    </div>
  );
}
