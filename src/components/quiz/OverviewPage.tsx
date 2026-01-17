'use client';

import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
/* eslint-disable @next/next/no-img-element */

interface OverviewPageProps {
  question: Question;
}

export function OverviewPage({ question }: OverviewPageProps) {
  const { nextStep } = useQuiz();

  return (
    <div className="flex flex-col gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="text-left space-y-2 sm:space-y-3">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-heading font-bold text-primary">
          {question.title}
        </h1>
      </div>

      {/* Timeline Sections */}
      <div className="flex flex-col">
        {question.overviewSections?.map((section, index) => {
          const isActive = section.status === 'active';
          const isLast = index === (question.overviewSections?.length || 0) - 1;
          const isFirst = index === 0;

          return (
            <div key={section.id}>
              {/* Card */}
              <div className="p-4 rounded-xl bg-white border border-[#e8e5e1] shadow-sm flex items-start gap-3 relative">
                {/* Vertical line - absolute positioned */}
                <div
                  className="absolute"
                  style={{
                    left: 'calc(1rem + 8px)',
                    top: isFirst ? 'calc(1rem + 9px)' : '0',
                    height: isFirst
                      ? 'calc(100% - 1rem - 9px)'
                      : isLast
                        ? 'calc(1rem + 9px)'
                        : '100%',
                    width: '2px',
                    backgroundImage: 'linear-gradient(to bottom, #c9c4be 50%, transparent 50%)',
                    backgroundSize: '2px 6px',
                  }}
                />

                {/* Dot */}
                <div
                  className="w-[18px] h-[18px] rounded-full flex-shrink-0 relative bg-white z-10"
                  style={{
                    border: isActive ? '2px solid var(--primary)' : '2px solid #c9c4be',
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute rounded-full bg-primary"
                      style={{
                        width: '8px',
                        height: '8px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-bold text-primary">
                    {section.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {section.description}
                  </p>
                  {section.duration && (
                    <p className="text-sm font-semibold text-primary mt-2">
                      {section.duration}
                    </p>
                  )}
                </div>

                {/* Image */}
                {section.image && (
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#F5F3EF]">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Line BETWEEN cards */}
              {!isLast && (
                <div
                  className="h-4"
                  style={{
                    marginLeft: 'calc(1rem + 9px)',
                    width: '2px',
                    backgroundImage: 'linear-gradient(to bottom, #c9c4be 50%, transparent 50%)',
                    backgroundSize: '2px 6px',
                  }}
                />
              )}
            </div>
          );
        })}
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
