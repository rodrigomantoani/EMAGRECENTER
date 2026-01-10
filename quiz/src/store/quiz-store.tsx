'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { QuizData } from '@/types/quiz';

// Helper para adaptar textos por gênero
export interface GenderText {
  m: string; // masculino
  f: string; // feminino
}

interface QuizContextType {
  currentStep: number;
  totalSteps: number;
  answers: QuizData;
  isLoading: boolean;
  isComplete: boolean;
  progress: number;

  // Helpers de gênero
  isFemale: boolean;
  isMale: boolean;
  g: (text: GenderText) => string; // Retorna texto adaptado ao gênero

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setAnswer: <K extends keyof QuizData>(key: K, value: QuizData[K]) => void;
  setAnswers: (data: Partial<QuizData>) => void;
  setLoading: (loading: boolean) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

interface QuizProviderProps {
  children: ReactNode;
  totalSteps: number;
}

export function QuizProvider({ children, totalSteps }: QuizProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswersState] = useState<QuizData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  // Helpers de gênero
  const isFemale = answers.sexo === 'feminino';
  const isMale = answers.sexo === 'masculino';

  // Função para retornar texto adaptado ao gênero
  const g = useCallback((text: GenderText): string => {
    return isFemale ? text.f : text.m;
  }, [isFemale]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const setAnswer = useCallback(<K extends keyof QuizData>(key: K, value: QuizData[K]) => {
    setAnswersState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setAnswers = useCallback((data: Partial<QuizData>) => {
    setAnswersState((prev) => ({ ...prev, ...data }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const completeQuiz = useCallback(() => {
    setIsComplete(true);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentStep(0);
    setAnswersState({});
    setIsLoading(false);
    setIsComplete(false);
  }, []);

  return (
    <QuizContext.Provider
      value={{
        currentStep,
        totalSteps,
        answers,
        isLoading,
        isComplete,
        progress,
        isFemale,
        isMale,
        g,
        nextStep,
        prevStep,
        goToStep,
        setAnswer,
        setAnswers,
        setLoading,
        completeQuiz,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
