'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';

interface GoalDateQuestionProps {
  question: Question;
}

export function GoalDateQuestion({ question }: GoalDateQuestionProps) {
  const { answers, setAnswers, nextStep } = useQuiz();
  const [hasEvent, setHasEvent] = useState<boolean | null>(answers.temEventoMeta !== undefined ? answers.temEventoMeta : null);
  const [eventDate, setEventDate] = useState(answers.dataEventoMeta || '');
  const [eventName, setEventName] = useState(answers.nomeEventoMeta || '');

  const canContinue = hasEvent === false || (hasEvent === true && eventDate);

  const handleContinue = () => {
    if (!canContinue) return;

    if (hasEvent && eventDate) {
      setAnswers({
        temEventoMeta: true,
        dataEventoMeta: eventDate,
        nomeEventoMeta: eventName || undefined,
      });
    } else {
      setAnswers({
        temEventoMeta: false,
        dataEventoMeta: undefined,
        nomeEventoMeta: undefined,
      });
    }
    nextStep();
  };

  // Data mínima: hoje + 30 dias
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 30);
  const minDateStr = minDate.toISOString().split('T')[0];

  // Data máxima: 2 anos
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] leading-tight font-heading font-bold text-primary">
          {question.title || 'Tem algum evento importante?'}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {question.helperText || 'Casamento, formatura, viagem... Uma data ajuda a manter o foco.'}
        </p>
      </div>

      {/* Sim/Não Options */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setHasEvent(true)}
          className={`
            w-full p-4 rounded-xl border-2 text-left transition-all
            ${hasEvent === true
              ? 'border-[#7CB342] bg-[#7CB342]/5'
              : 'border-border bg-white hover:border-[#7CB342]/50'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${hasEvent === true ? 'border-[#7CB342] bg-[#7CB342]' : 'border-gray-300'}
            `}>
              {hasEvent === true && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium text-primary">Sim, tenho uma data em mente</p>
              <p className="text-sm text-muted-foreground">Vou te ajudar a chegar lá a tempo</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setHasEvent(false)}
          className={`
            w-full p-4 rounded-xl border-2 text-left transition-all
            ${hasEvent === false
              ? 'border-[#7CB342] bg-[#7CB342]/5'
              : 'border-border bg-white hover:border-[#7CB342]/50'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${hasEvent === false ? 'border-[#7CB342] bg-[#7CB342]' : 'border-gray-300'}
            `}>
              {hasEvent === false && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium text-primary">Não, só quero emagrecer</p>
              <p className="text-sm text-muted-foreground">Sem pressa, no meu ritmo</p>
            </div>
          </div>
        </button>
      </div>

      {/* Date picker - aparece só se selecionou SIM */}
      {hasEvent === true && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Qual a data do evento?
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              min={minDateStr}
              max={maxDateStr}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-white text-primary focus:outline-none focus:border-[#7CB342] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Que evento é esse? <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ex: Casamento da minha filha"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-white text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#7CB342] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!canContinue}
        className={`w-full cursor-pointer font-bold py-6 text-sm sm:text-base rounded-lg transition-all min-h-[56px] ${canContinue
            ? 'bg-accent hover:bg-accent/90 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        Continuar
      </Button>
    </div>
  );
}
