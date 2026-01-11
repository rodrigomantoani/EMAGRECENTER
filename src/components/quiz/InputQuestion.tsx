'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question, QuizData } from '@/types/quiz';

interface InputQuestionProps {
  question: Question;
}

export function InputQuestion({ question }: InputQuestionProps) {
  const { answers, setAnswers, nextStep } = useQuiz();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialValues: Record<string, string> = {};
    question.fields?.forEach((field) => {
      const value = answers[field.id as keyof QuizData];
      initialValues[field.id] = value !== undefined ? String(value) : '';
    });
    setValues(initialValues);
  }, [question.fields, answers]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Capitaliza nome: joão paulo → João Paulo, MARIA → Maria
  const formatName = (value: string) => {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Extrai primeiro nome: "Fernanda Oliveira Gomes" → "Fernanda"
  const getFirstName = (fullName: string) => {
    const formatted = formatName(fullName);
    return formatted.split(' ')[0] || '';
  };

  const handleChange = (fieldId: string, value: string, type: string, fieldName?: string) => {
    let formattedValue = value;

    if (type === 'tel') {
      formattedValue = formatPhone(value);
    } else if (type === 'number') {
      formattedValue = value.replace(/\D/g, '');
    }
    // Nome é formatado no blur, não durante digitação

    setValues((prev) => ({ ...prev, [fieldId]: formattedValue }));
    setErrors((prev) => ({ ...prev, [fieldId]: '' }));
  };

  // Formata nome quando sai do campo
  const handleBlur = (fieldId: string, fieldName?: string) => {
    if (fieldId === 'nome' || fieldName?.toLowerCase().includes('nome')) {
      const value = values[fieldId] || '';
      if (value.trim()) {
        setValues((prev) => ({ ...prev, [fieldId]: formatName(value) }));
      }
    }
  };

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    question.fields?.forEach((field) => {
      const value = values[field.id] || '';

      if (field.required && !value.trim()) {
        newErrors[field.id] = 'Campo obrigatório';
        isValid = false;
      } else if (field.type === 'email' && value && !value.includes('@')) {
        newErrors[field.id] = 'Email inválido';
        isValid = false;
      } else if (field.type === 'tel' && value && value.replace(/\D/g, '').length < 10) {
        newErrors[field.id] = 'Telefone inválido';
        isValid = false;
      } else if (field.type === 'date' && value) {
        // Formato nativo: YYYY-MM-DD
        if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          newErrors[field.id] = 'Data inválida';
          isValid = false;
        } else {
          // Validar idade (18-100 anos)
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();
          const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

          if (actualAge < 18) {
            newErrors[field.id] = 'Você precisa ter pelo menos 18 anos';
            isValid = false;
          } else if (actualAge > 64) {
            newErrors[field.id] = 'Atendemos até 64 anos. Consulte seu médico.';
            isValid = false;
          }
        }
      } else if (field.type === 'number' && value) {
        const num = Number(value);
        // Validação de peso (40-250kg)
        if (field.id === 'peso' || field.id === 'maiorPeso' || field.id === 'pesoMeta') {
          if (num < 40 || num > 250) {
            newErrors[field.id] = 'Peso deve estar entre 40 e 250 kg';
            isValid = false;
          }
        }
        // Validação de altura (100-250cm)
        if (field.id === 'altura') {
          if (num < 100 || num > 250) {
            newErrors[field.id] = 'Altura deve estar entre 100 e 250 cm';
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = () => {
    if (!validateFields()) return;

    const data: Record<string, unknown> = {};
    question.fields?.forEach((field) => {
      let value = values[field.id];

      // Formata e extrai primeiro nome
      if (field.id === 'nome' || field.label?.toLowerCase().includes('nome')) {
        value = formatName(value || '');
        data[field.id] = value;
        data['primeiroNome'] = getFirstName(value);
      } else if (field.type === 'number') {
        data[field.id] = Number(value);
      } else {
        data[field.id] = value;
      }
    });

    setAnswers(data as Partial<QuizData>);
    nextStep();
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Title Section */}
      <div className="space-y-2 sm:space-y-3">
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

      {/* Input Fields */}
      <div className="flex flex-col gap-4">
        {question.fields?.map((field) => (
          <div key={field.id} className="space-y-1.5 sm:space-y-2">
            <label htmlFor={field.id} className="text-sm font-medium text-primary">
              {field.label}
            </label>
            {field.helper && (
              <p className="text-xs text-muted-foreground">
                {field.helper}
              </p>
            )}
            <div className="relative">
              <input
                id={field.id}
                type={field.type === 'number' ? 'text' : field.type === 'date' ? 'date' : field.type}
                inputMode={field.type === 'number' || field.type === 'tel' ? 'numeric' : undefined}
                placeholder={field.placeholder}
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value, field.type, field.label)}
                onBlur={() => handleBlur(field.id, field.label)}
                max={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                className={`
                  w-full px-4 py-3 sm:py-4 rounded-lg border-2 bg-white
                  text-sm sm:text-base text-primary placeholder:text-muted-foreground/50
                  focus:outline-none focus:border-[var(--evergreen)] transition-colors
                  ${field.suffix ? 'pr-12 sm:pr-14' : ''}
                  ${errors[field.id] ? 'border-destructive' : 'border-[var(--border)]'}
                `}
              />
              {field.suffix && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
                  {field.suffix}
                </span>
              )}
            </div>
            {errors[field.id] && (
              <p className="text-xs text-destructive">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        className="w-full cursor-pointer bg-accent hover:bg-accent/90 text-white font-bold py-6 text-sm sm:text-base rounded-lg min-h-[56px]"
      >
        {question.buttonText || 'Continuar'}
      </Button>
    </div>
  );
}
