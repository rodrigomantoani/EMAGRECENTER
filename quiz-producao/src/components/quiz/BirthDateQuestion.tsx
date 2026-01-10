'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
import { WheelPicker } from './WheelPicker';

interface BirthDateQuestionProps {
  question: Question;
}

export function BirthDateQuestion({ question }: BirthDateQuestionProps) {
  const { answers, setAnswers, nextStep } = useQuiz();

  // Parse existing date if available
  const parseExistingDate = () => {
    if (answers.dataNascimento) {
      const date = new Date(answers.dataNascimento);
      return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    }
    return { day: 15, month: 6, year: 1990 };
  };

  const initial = parseExistingDate();
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  const [dayChanged, setDayChanged] = useState(!!answers.dataNascimento);
  const [monthChanged, setMonthChanged] = useState(!!answers.dataNascimento);
  const [yearChanged, setYearChanged] = useState(!!answers.dataNascimento);
  const [error, setError] = useState('');

  const isReady = dayChanged && monthChanged && yearChanged;

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 64; // Máximo 64 anos
  const maxYear = currentYear - 18; // Mínimo 18 anos

  const months = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
  ];

  // Dias no mês selecionado
  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m, 0).getDate();
  };

  const maxDays = getDaysInMonth(month, year);

  // Ajustar dia se necessário
  if (day > maxDays) {
    setDay(maxDays);
  }

  const handleDayChange = (value: number) => {
    setDay(value);
    setDayChanged(true);
    setError('');
  };

  const handleMonthChange = (value: number) => {
    setMonth(value);
    setMonthChanged(true);
    setError('');
  };

  const handleYearChange = (value: number) => {
    setYear(value);
    setYearChanged(true);
    setError('');
  };

  const validateAge = () => {
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < 18) {
      setError('Você precisa ter pelo menos 18 anos');
      return false;
    }
    if (actualAge > 64) {
      setError('Atendemos até 64 anos. Consulte seu médico.');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!isReady) return;
    if (!validateAge()) return;

    // Formatar como YYYY-MM-DD
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setAnswers({ dataNascimento: dateStr });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] leading-tight font-heading font-bold text-primary">
          {question.title || 'Qual sua data de nascimento?'}
        </h1>
        {question.helperText && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {question.helperText}
          </p>
        )}
      </div>

      {/* Date Wheel Pickers */}
      <div className="flex justify-center gap-2 py-6">
        {/* Dia */}
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-muted-foreground mb-2">DIA</p>
          <div className="bg-white rounded-xl border-2 border-border px-2">
            <WheelPicker
              value={day}
              onChange={handleDayChange}
              min={1}
              max={maxDays}
              step={1}
              suffix=""
            />
          </div>
        </div>

        {/* Mês */}
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-muted-foreground mb-2">MÊS</p>
          <div className="bg-white rounded-xl border-2 border-border px-2">
            <MonthWheelPicker
              value={month}
              onChange={handleMonthChange}
              months={months}
            />
          </div>
        </div>

        {/* Ano */}
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-muted-foreground mb-2">ANO</p>
          <div className="bg-white rounded-xl border-2 border-border px-2">
            <WheelPicker
              value={year}
              onChange={handleYearChange}
              min={minYear}
              max={maxYear}
              step={1}
              suffix=""
            />
          </div>
        </div>
      </div>

      {/* Data selecionada */}
      {isReady && (
        <div className="text-center">
          <p className="text-lg font-medium text-primary">
            {String(day).padStart(2, '0')} de {months[month - 1]} de {year}
          </p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!isReady}
        className={`w-full font-bold py-6 text-sm sm:text-base rounded-lg transition-all min-h-[56px] ${
          isReady
            ? 'bg-accent hover:bg-accent/90 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continuar
      </Button>
    </div>
  );
}

// Componente especial para mês (mostra nome ao invés de número)
function MonthWheelPicker({
  value,
  onChange,
  months,
}: {
  value: number;
  onChange: (value: number) => void;
  months: string[];
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [startValue, setStartValue] = React.useState(value);

  const ITEM_HEIGHT = 48;
  const VISIBLE_ITEMS = 5;

  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const currentIndex = values.indexOf(value);

  const handleStart = React.useCallback((clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    setStartValue(value);
  }, [value]);

  const handleMove = React.useCallback((clientY: number) => {
    if (!isDragging) return;

    const delta = startY - clientY;
    const indexDelta = Math.round(delta / (ITEM_HEIGHT / 2));
    const newIndex = Math.max(0, Math.min(values.length - 1, values.indexOf(startValue) + indexDelta));

    if (values[newIndex] !== value) {
      onChange(values[newIndex]);
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
    }
  }, [isDragging, startY, startValue, values, value, onChange]);

  const handleEnd = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleMouseUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(values.length - 1, currentIndex + direction));
    onChange(values[newIndex]);
  };

  const handleItemClick = (val: number) => {
    onChange(val);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-16 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onWheel={handleWheel}
    >
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

      <div
        className="absolute inset-x-1 bg-[var(--evergreen)]/10 rounded-xl z-0 border-2 border-[var(--evergreen)]"
        style={{
          top: ITEM_HEIGHT * 2,
          height: ITEM_HEIGHT,
        }}
      />

      <div
        className="transition-transform duration-150 ease-out"
        style={{
          transform: `translateY(${(2 - currentIndex) * ITEM_HEIGHT}px)`,
        }}
      >
        {values.map((val, idx) => {
          const distance = Math.abs(idx - currentIndex);
          const isSelected = idx === currentIndex;

          return (
            <div
              key={val}
              onClick={() => handleItemClick(val)}
              className={`
                h-12 flex items-center justify-center text-center transition-all
                ${isSelected
                  ? 'text-base font-bold text-[var(--evergreen)]'
                  : distance === 1
                    ? 'text-sm text-primary/60'
                    : 'text-sm text-primary/30'
                }
              `}
            >
              {months[val - 1]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
