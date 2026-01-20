'use client';

import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
/* eslint-disable @next/next/no-img-element */
import { Check, Package, MessageCircle, Utensils, Home, Zap, Heart, BarChart3 } from 'lucide-react';

interface BenefitCardProps {
  question: Question;
}

export function BenefitCard({ question }: BenefitCardProps) {
  const { nextStep } = useQuiz();

  const getIcon = (iconName?: string) => {
    const iconClass = 'w-5 h-5 sm:w-6 sm:h-6 text-accent';
    switch (iconName) {
      case 'check':
        return <Check className={iconClass} />;
      case 'package':
        return <Package className={iconClass} />;
      case 'whatsapp':
        return <MessageCircle className={iconClass} />;
      case 'nutrition':
        return <Utensils className={iconClass} />;
      case 'home':
        return <Home className={iconClass} />;
      case 'lightning':
        return <Zap className={iconClass} />;
      case 'heart':
        return <Heart className={iconClass} />;
      case 'chart':
        return <BarChart3 className={iconClass} />;
      default:
        return <Check className={iconClass} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Tag */}
      {question.tag && (
        <p className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider text-center">
          {question.tag}
        </p>
      )}

      {/* Image */}
      {question.image && (
        <div className="w-full max-w-sm sm:max-w-md">
          {question.image.match(/\.(png|jpg|jpeg)$/i) ? (
            <picture>
              <source
                srcSet={question.image.replace(/\.(png|jpg|jpeg)$/i, '.avif')}
                type="image/avif"
              />
              <source
                srcSet={question.image.replace(/\.(png|jpg|jpeg)$/i, '.webp')}
                type="image/webp"
              />
              <img
                src={question.image}
                alt=""
                className="w-full h-auto rounded-xl"
              />
            </picture>
          ) : (
            <img
              src={question.image}
              alt=""
              className="w-full h-auto"
            />
          )}
        </div>
      )}

      {/* Badge */}
      {question.badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
          <span className="text-xs sm:text-sm font-medium text-primary">
            {question.badge}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-heading font-bold text-primary text-center max-w-md leading-tight">
        {question.title}
      </h1>

      {/* Description or Bullet Points */}
      {question.description && !question.bulletPoints && (
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-sm sm:max-w-md leading-relaxed">
          {question.description}
        </p>
      )}

      {/* Bullet Points */}
      {question.bulletPoints && question.bulletPoints.length > 0 && (
        <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
          {question.bulletPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 sm:gap-4"
            >
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center">
                {getIcon(point.icon)}
              </div>
              <p
                className={`
                  text-sm sm:text-base leading-relaxed pt-1
                  ${point.highlight ? 'font-bold text-primary' : 'text-muted-foreground'}
                `}
              >
                {point.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Benefits list (alternative format) */}
      {question.benefits && question.benefits.length > 0 && (
        <div className="w-full max-w-sm sm:max-w-md space-y-3">
          {question.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg border border-[#e8e5e1]"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                {getIcon(benefit.icon)}
              </div>
              <p className="text-sm sm:text-base text-primary">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      {question.disclaimer && (
        <p className="text-xs text-muted-foreground/70 text-center max-w-xs sm:max-w-sm">
          {question.disclaimer}
        </p>
      )}

      {/* Continue Button */}
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mt-2">
        <Button
          onClick={nextStep}
          className="w-full cursor-pointer bg-accent hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-lg shadow-lg min-h-[56px]"
        >
          {question.buttonText || 'Continuar'}
        </Button>
      </div>
    </div>
  );
}
