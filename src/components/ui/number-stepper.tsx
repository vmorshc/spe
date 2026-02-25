'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface NumberStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export function NumberStepper({ value, min = 1, max, onChange, className }: NumberStepperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = Number.parseInt(inputValue, 10);
    if (!Number.isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    } else {
      setInputValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex w-full items-center">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="flex flex-1 items-center justify-center py-3 text-primary
            disabled:opacity-30 active:opacity-60 transition-opacity"
          aria-label="Decrease"
        >
          <ChevronLeft className="size-8" />
        </button>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={min}
          max={max}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
          className={`
            text-2xl font-bold text-primary bg-transparent border-none outline-none
            cursor-pointer hover:opacity-80 transition-opacity text-center
            w-auto appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none
          `}
          style={{ width: `${Math.max(inputValue.length, 1) + 0.5}ch` }}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="flex flex-1 items-center justify-center py-3 text-primary
            disabled:opacity-30 active:opacity-60 transition-opacity"
          aria-label="Increase"
        >
          <ChevronRight className="size-8" />
        </button>
      </div>
    </div>
  );
}
