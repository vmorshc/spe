'use client';

import { useEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface SliderWithInputProps {
  value: number;
  min?: number;
  max?: number;
  sliderMax?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function SliderWithInput({
  value,
  min = 1,
  max,
  sliderMax = 10,
  onChange,
  className,
}: SliderWithInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveMax = max ?? sliderMax;
  const effectiveSliderMax = Math.min(sliderMax, effectiveMax);
  const isAtSliderMax = value === effectiveSliderMax;

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (shouldFocusInput && isAtSliderMax && !isEditing) {
      inputRef.current?.focus();
      setIsEditing(true);
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput, isAtSliderMax, isEditing]);

  const handleSliderChange = (newValue: number[]) => {
    const val = newValue[0];
    onChange(val);
    if (val === effectiveSliderMax) {
      setShouldFocusInput(true);
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
    if (!Number.isNaN(numValue) && numValue >= min && numValue <= effectiveMax) {
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
      <div className="flex items-center gap-4">
        <Slider
          min={min}
          max={effectiveSliderMax}
          step={1}
          value={[Math.min(value, effectiveSliderMax)]}
          onValueChange={handleSliderChange}
          className="flex-1"
        />
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={min}
          max={effectiveMax}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
          className={`
            text-2xl font-bold text-primary bg-transparent border-none outline-none
            cursor-pointer hover:opacity-80 transition-opacity text-right
            w-auto appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none
            ${isAtSliderMax ? 'ring-2 ring-primary ring-offset-2 rounded px-2' : ''}
          `}
          style={{ width: `${Math.max(inputValue.length, 1) + 0.5}ch` }}
        />
      </div>
    </div>
  );
}
