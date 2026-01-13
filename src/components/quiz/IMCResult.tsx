'use client';

import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';

interface IMCResultProps {
  question: Question;
}

// Classificação do IMC - na cara dura
function getIMCClassification(imc: number): {
  label: string;
  color: string;
  message: string;
  emoji: string;
} {
  if (imc < 18.5) {
    return {
      label: 'Abaixo do peso',
      color: '#3B82F6',
      message: 'Você está magro demais. O tratamento pode não ser indicado.',
      emoji: '⚠️',
    };
  } else if (imc < 25) {
    return {
      label: 'Peso normal',
      color: '#22C55E',
      message: 'Seu peso está ok, mas se quer secar mais, podemos ajudar.',
      emoji: '✅',
    };
  } else if (imc < 30) {
    return {
      label: 'Sobrepeso',
      color: '#EAB308',
      message: 'Você está acima do peso. É hora de agir antes que piore.',
      emoji: '⚡',
    };
  } else if (imc < 35) {
    return {
      label: 'Obesidade Grau I',
      color: '#F97316',
      message: 'Você está gordo. A boa notícia? Isso tem solução.',
      emoji: '🔥',
    };
  } else if (imc < 40) {
    return {
      label: 'Obesidade Grau II',
      color: '#EF4444',
      message: 'Obesidade severa. Você PRECISA de tratamento. Sua saúde está em risco.',
      emoji: '🚨',
    };
  } else {
    return {
      label: 'Obesidade Grau III',
      color: '#DC2626',
      message: 'Obesidade mórbida. Isso é emergência. Vamos resolver isso AGORA.',
      emoji: '🆘',
    };
  }
}

export function IMCResult({ question }: IMCResultProps) {
  const { answers, nextStep } = useQuiz();

  const altura = answers.altura || 170;
  const peso = answers.peso || 80;
  const alturaMetros = altura / 100;
  const imc = peso / (alturaMetros * alturaMetros);
  const classification = getIMCClassification(imc);

  // Posição no gráfico (0-100%)
  const getIMCPosition = (imcValue: number) => {
    const min = 15;
    const max = 45;
    const position = ((imcValue - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, position));
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] leading-tight font-heading font-bold text-primary">
          {question.title || 'Seu resultado'}
        </h1>
      </div>

      {/* IMC Display */}
      <div className="bg-white rounded-2xl border-2 border-border p-6 space-y-5">
        {/* IMC Number */}
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Seu IMC</p>
          <span className="text-5xl font-bold" style={{ color: classification.color }}>
            {imc.toFixed(1)}
          </span>
        </div>

        {/* IMC Bar Container */}
        <div>
          {/* Bar with indicator */}
          <div className="relative h-4">
            {/* Background gradient bar */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to right, #3B82F6 0%, #22C55E 17%, #EAB308 33%, #F97316 50%, #EF4444 67%, #DC2626 100%)',
              }}
            />

            {/* Indicator - centralizado em cima da barra */}
            <div
              className="absolute z-10"
              style={{
                left: `${getIMCPosition(imc)}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  backgroundColor: classification.color,
                  opacity: 0.4,
                  width: '28px',
                  height: '28px',
                }}
              />
              {/* Main indicator */}
              <div
                className="relative w-7 h-7 rounded-full bg-white border-4 shadow-lg"
                style={{ borderColor: classification.color }}
              />
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
            <span>Magro</span>
            <span>Normal</span>
            <span>Sobrepeso</span>
            <span>Obeso</span>
            <span>Mórbido</span>
          </div>
        </div>

        {/* Classification Card */}
        <div
          className="p-5 rounded-xl text-center"
          style={{ backgroundColor: `${classification.color}15` }}
        >
          <p
            className="text-xl font-bold mb-2"
            style={{ color: classification.color }}
          >
            {classification.label}
          </p>
          <p className="text-base text-primary leading-relaxed">
            {classification.message}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 pt-2 text-sm text-muted-foreground">
          <div className="text-center">
            <p className="font-bold text-primary">{altura} cm</p>
            <p>Altura</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-primary">{peso} kg</p>
            <p>Peso</p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <Button
        onClick={nextStep}
        className="w-full cursor-pointer bg-accent hover:bg-accent/90 text-white font-bold py-6 text-sm sm:text-base rounded-lg min-h-[56px]"
      >
        {question.buttonText || 'Continuar'}
      </Button>
    </div>
  );
}
