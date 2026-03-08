'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useId } from 'react';
import { useHaptic } from '@/lib/hooks/useHaptic';
import { tapScale } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface SettingCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: string;
  description: string;
  className?: string;
}

export function SettingCheckbox({
  checked,
  onCheckedChange,
  title,
  description,
  className,
}: SettingCheckboxProps) {
  const id = useId();
  const { haptic } = useHaptic();

  return (
    <motion.label
      htmlFor={id}
      {...tapScale}
      className={cn(
        'flex items-center w-full cursor-pointer gap-3 rounded-lg border p-3 text-left transition-colors',
        checked ? 'border-primary' : 'border-input',
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          haptic('selection');
          onCheckedChange(e.target.checked);
        }}
        className="sr-only"
      />
      <div
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
          checked ? 'border-primary bg-primary' : 'border-input'
        )}
      >
        {checked && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium leading-none">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </motion.label>
  );
}
