'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';

interface BirthDateQuestionProps {
  question: Question;
}

export function BirthDateQuestion({ question }: BirthDateQuestionProps) {
  const { answers, setAnswers, nextStep } = useQuiz();
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse existing date if available
  const parseExistingDate = () => {
    if (answers.dataNascimento) {
      const [year, month, day] = answers.dataNascimento.split('-');
      return `${day}/${month}/${year}`;
    }
    return '';
  };

  const [value, setValue] = useState(parseExistingDate());
  const [error, setError] = useState('');

  // Apply mask as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (input.length > 8) {
      input = input.slice(0, 8);
    }

    // Apply mask DD/MM/AAAA
    let formatted = '';
    if (input.length > 0) {
      formatted = input.slice(0, 2);
    }
    if (input.length > 2) {
      formatted += '/' + input.slice(2, 4);
    }
    if (input.length > 4) {
      formatted += '/' + input.slice(4, 8);
    }

    setValue(formatted);
    setError('');
  };

  const parseDate = (dateStr: string): { day: number; month: number; year: number } | null => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    return { day, month, year };
  };

  const validateDate = () => {
    const parsed = parseDate(value);
    if (!parsed) {
      setError('Digite uma data válida');
      return false;
    }

    const { day, month, year } = parsed;

    // Validate day/month ranges
    if (month < 1 || month > 12) {
      setError('Mês inválido');
      return false;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      setError('Dia inválido para este mês');
      return false;
    }

    // Validate age
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

  const isComplete = value.length === 10; // DD/MM/AAAA

  const handleContinue = () => {
    if (!isComplete) return;
    if (!validateDate()) return;

    const parsed = parseDate(value);
    if (!parsed) return;

    // Format as YYYY-MM-DD for storage
    const dateStr = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
    setAnswers({ dataNascimento: dateStr });
    nextStep();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isComplete) {
      handleContinue();
    }
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

      {/* Date Input with Mask */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary">
          Data de nascimento
        </label>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/AAAA"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-4 text-base sm:text-lg bg-white border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
          autoComplete="bday"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!isComplete}
        className={`w-full font-bold py-6 text-sm sm:text-base rounded-lg transition-all min-h-[56px] ${
          isComplete
            ? 'bg-accent hover:bg-accent/90 text-white cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continuar
      </Button>
    </div>
  );
}
