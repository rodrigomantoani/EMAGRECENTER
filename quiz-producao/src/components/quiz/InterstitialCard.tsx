'use client';

import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';

interface InterstitialCardProps {
  question: Question;
}

export function InterstitialCard({ question }: InterstitialCardProps) {
  const { nextStep } = useQuiz();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 lg:px-8 pb-8 text-center">
      {/* Tag */}
      {question.tag && (
        <p className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider mb-4 sm:mb-6">
          {question.tag}
        </p>
      )}

      {/* Image */}
      {question.image && (
        <div className="mb-6 sm:mb-8 w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 relative">
          <Image
            src={question.image}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Subtitle */}
        {question.subtitle && !question.tag && (
          <p className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">
            {question.subtitle}
          </p>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-[32px] sm:leading-[40px] font-heading font-bold text-primary">
          {question.title}
        </h1>

        {/* Description */}
        {question.description && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {question.description}
          </p>
        )}

        {/* Bullet Points */}
        {question.bulletPoints && question.bulletPoints.length > 0 && (
          <div className="space-y-3 sm:space-y-4 text-left mt-4 sm:mt-6">
            {question.bulletPoints.map((point, index) => (
              <div
                key={index}
                className={`
                  flex items-start gap-3 p-3 sm:p-4 rounded-lg
                  ${point.highlight ? 'bg-accent/10 border border-accent/20' : 'bg-white border border-[#e8e5e1]'}
                `}
              >
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${point.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                <p className={`text-sm sm:text-base leading-relaxed ${point.highlight ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      {question.disclaimer && (
        <p className="mt-4 text-xs text-muted-foreground/70 max-w-xs sm:max-w-sm">
          {question.disclaimer}
        </p>
      )}

      {/* Button */}
      {question.buttonText && (
        <div className="mt-6 sm:mt-8 w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <Button
            onClick={nextStep}
            className="w-full cursor-pointer bg-accent hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-lg shadow-lg min-h-[56px]"
          >
            {question.buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}
