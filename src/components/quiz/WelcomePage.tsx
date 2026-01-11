'use client';

import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
/* eslint-disable @next/next/no-img-element */
import { Star } from 'lucide-react';

interface WelcomePageProps {
  question: Question;
}

export function WelcomePage({ question }: WelcomePageProps) {
  const { nextStep } = useQuiz();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8 pb-8 xl:pb-16 text-center">
      {/* Profile Image */}
      {question.profileImage && (
        <div className="mb-4 sm:mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-[var(--evergreen)] to-[var(--charcoal)]">
            <img
              src={question.profileImage}
              alt="Time clínico"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>
      )}

      {/* Subtitle - Team name */}
      {question.subtitle && (
        <p className="text-sm sm:text-base font-medium text-muted-foreground mb-2 sm:mb-3">
          {question.subtitle}
        </p>
      )}

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-heading font-bold text-primary mb-4 sm:mb-6 max-w-md sm:max-w-lg lg:max-w-xl leading-tight">
        {question.title}
      </h1>

      {/* Description */}
      {question.description && (
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-sm sm:max-w-md lg:max-w-lg mb-6 sm:mb-8">
          {question.description}
        </p>
      )}

      {/* Social Proof */}
      {question.socialProof && (
        <div className="flex flex-col items-center gap-2 mb-8 sm:mb-10">
          {/* Stars */}
          {question.socialProof.rating && (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FFB800] text-[#FFB800]"
                />
              ))}
            </div>
          )}
          {/* Text */}
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-sm">
            {question.socialProof.highlight ? (
              <>
                Junte-se às mais de{' '}
                <span className="font-bold text-primary">
                  {question.socialProof.highlight}
                </span>{' '}
                {question.socialProof.text}
              </>
            ) : (
              question.socialProof.text
            )}
          </p>
        </div>
      )}

      {/* CTA Button */}
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <Button
          onClick={nextStep}
          className="w-full bg-accent cursor-pointer hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-lg shadow-lg transition-all hover:shadow-xl min-h-[56px]"
        >
          {question.buttonText || 'Verificar sua elegibilidade'}
        </Button>
      </div>

      {/* Footer disclaimer */}
      {question.disclaimer && (
        <p className="mt-4 text-xs text-muted-foreground/70 max-w-xs sm:max-w-sm">
          {question.disclaimer}
        </p>
      )}
    </div>
  );
}
