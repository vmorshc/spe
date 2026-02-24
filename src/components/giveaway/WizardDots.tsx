'use client';

import { motion } from 'framer-motion';

interface WizardDotsProps {
  currentStep: number;
  totalSteps: number;
}

export default function WizardDots({ currentStep, totalSteps }: WizardDotsProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isPast = stepNumber < currentStep;

        return (
          <motion.div
            key={stepNumber}
            className={`h-2 rounded-full transition-all ${
              isActive
                ? 'w-8 bg-primary'
                : isPast
                  ? 'w-2 bg-primary/60'
                  : 'w-2 bg-muted-foreground/20'
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          />
        );
      })}
    </div>
  );
}
