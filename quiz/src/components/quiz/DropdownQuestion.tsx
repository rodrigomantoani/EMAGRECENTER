'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question, QuizData } from '@/types/quiz';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownQuestionProps {
  question: Question;
}

export function DropdownQuestion({ question }: DropdownQuestionProps) {
  const { answers, setAnswer, nextStep } = useQuiz();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentValue = answers[question.id as keyof QuizData];
    if (typeof currentValue === 'string') {
      setSelected(currentValue);
    }
  }, [answers, question.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = question.dropdownOptions?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleContinue = () => {
    if (!selected) return;
    setAnswer(question.id as keyof QuizData, selected as QuizData[keyof QuizData]);
    nextStep();
  };

  const selectedOption = question.dropdownOptions?.find((opt) => opt.value === selected);

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

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 sm:py-4 rounded-lg border-2 bg-white
            text-left text-sm sm:text-base
            flex items-center justify-between
            transition-all
            ${isOpen ? 'border-[var(--evergreen)]' : 'border-[var(--border)]'}
            ${selected ? 'text-primary' : 'text-muted-foreground/50'}
          `}
        >
          <span>{selectedOption?.label || 'Escolha uma opção'}</span>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[var(--border)] rounded-lg shadow-lg max-h-60 sm:max-h-72 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-[var(--border)]">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--evergreen)]"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-48 sm:max-h-56">
              {filteredOptions?.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-3 text-left text-sm sm:text-base
                    flex items-center justify-between
                    hover:bg-[var(--mint-light)] transition-colors
                    ${selected === option.value ? 'bg-[var(--mint-light)] text-[var(--evergreen)]' : 'text-primary'}
                  `}
                >
                  <span>{option.label}</span>
                  {selected === option.value && (
                    <Check className="w-4 h-4 text-[var(--evergreen)]" />
                  )}
                </button>
              ))}
              {filteredOptions?.length === 0 && (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  Nenhum resultado encontrado
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full cursor-pointer bg-accent hover:bg-accent/90 text-white font-bold py-6 text-sm sm:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
      >
        {question.buttonText || 'Continuar'}
      </Button>
    </div>
  );
}
