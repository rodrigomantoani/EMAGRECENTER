'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface WheelPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  label?: string;
}

export function WheelPicker({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  label,
}: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);

  const ITEM_HEIGHT = 48;
  const VISIBLE_ITEMS = 5;

  // Gerar valores
  const values: number[] = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  const currentIndex = values.indexOf(value);

  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    setStartValue(value);
  }, [value]);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;

    const delta = startY - clientY;
    const indexDelta = Math.round(delta / (ITEM_HEIGHT / 2));
    const newIndex = Math.max(0, Math.min(values.length - 1, values.indexOf(startValue) + indexDelta));

    if (values[newIndex] !== value) {
      onChange(values[newIndex]);
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
    }
  }, [isDragging, startY, startValue, values, value, onChange]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };

  useEffect(() => {
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

  // Scroll wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(values.length - 1, currentIndex + direction));
    onChange(values[newIndex]);
  };

  // Click on item
  const handleItemClick = (val: number) => {
    onChange(val);
  };

  return (
    <div className="flex flex-col items-center">
      {label && (
        <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      )}

      <div
        ref={containerRef}
        className="relative w-32 overflow-hidden select-none cursor-grab active:cursor-grabbing"
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onWheel={handleWheel}
      >
        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

        {/* Selection highlight */}
        <div
          className="absolute inset-x-2 bg-[var(--evergreen)]/10 rounded-xl z-0 border-2 border-[var(--evergreen)]"
          style={{
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
          }}
        />

        {/* Items */}
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
                    ? 'text-2xl font-bold text-[var(--evergreen)]'
                    : distance === 1
                      ? 'text-xl text-primary/60'
                      : 'text-lg text-primary/30'
                  }
                `}
              >
                {val}{suffix}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
