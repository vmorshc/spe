import * as React from 'react';
import { cn } from '@/lib/utils';

const WizardContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('max-w-3xl mx-auto px-4 w-full', className)} {...props} />
  )
);
WizardContainer.displayName = 'WizardContainer';

export { WizardContainer };
