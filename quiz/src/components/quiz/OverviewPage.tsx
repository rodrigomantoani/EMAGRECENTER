'use client';

import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
import { User, Stethoscope, Clock, CheckCircle } from 'lucide-react';

interface OverviewPageProps {
  question: Question;
}

export function OverviewPage({ question }: OverviewPageProps) {
  const { nextStep } = useQuiz();

  const getIcon = (iconName?: string, status?: string) => {
    const iconClass = `w-6 h-6 sm:w-7 sm:h-7 ${status === 'completed' ? 'text-success' : status === 'active' ? 'text-accent' : 'text-muted-foreground'
      }`;

    switch (iconName) {
      case 'handshake':
      case 'personal_data':
        return <User className={iconClass} />;
      case 'doctor':
      case 'medical_screening':
        return <Stethoscope className={iconClass} />;
      default:
        return <User className={iconClass} />;
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-heading font-bold text-primary">
          {question.title}
        </h1>
        {question.subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Section Title */}
      {question.tag && (
        <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {question.tag}
        </p>
      )}

      {/* Sections */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {question.overviewSections?.map((section, index) => (
          <div
            key={section.id}
            className={`
              relative flex items-start gap-4 p-4 sm:p-5 rounded-xl
              border-2 transition-all
              ${section.status === 'active'
                ? 'border-accent bg-white shadow-md'
                : section.status === 'completed'
                  ? 'border-success/30 bg-success/5'
                  : 'border-[#e8e5e1] bg-white/50'
              }
            `}
          >
            {/* Icon */}
            <div
              className={`
                flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                ${section.status === 'active'
                  ? 'bg-accent/10'
                  : section.status === 'completed'
                    ? 'bg-success/10'
                    : 'bg-muted/30'
                }
              `}
            >
              {section.status === 'completed' ? (
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-success" />
              ) : (
                getIcon(section.icon, section.status)
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-bold text-primary">
                {section.title}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {section.description}
              </p>
              {section.duration && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {section.duration}
                  </span>
                </div>
              )}
            </div>

            {/* Status Badge */}
            {section.status === 'active' && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <span className="px-2 py-1 text-xs font-bold bg-accent text-white rounded-full">
                  Atual
                </span>
              </div>
            )}

            {/* Connection Line */}
            {index < (question.overviewSections?.length || 0) - 1 && (
              <div className="absolute left-[2.25rem] sm:left-[2.5rem] top-[4.5rem] sm:top-[5rem] w-0.5 h-4 bg-[#e8e5e1]" />
            )}
          </div>
        ))}
      </div>

      {/* Start Button */}
      <Button
        onClick={nextStep}
        className="w-full bg-accent cursor-pointer hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-lg shadow-lg min-h-[56px]"
      >
        {question.buttonText || 'Responder'}
      </Button>
    </div>
  );
}
