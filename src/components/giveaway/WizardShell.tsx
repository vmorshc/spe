'use client';

import { AnimatePresence } from 'framer-motion';
import { useWizard } from '@/lib/contexts/WizardContext';
import Step1ExportSetup from './Step1ExportSetup';
import Step2PreviewAndLoad from './Step2PreviewAndLoad';
import Step3GiveawaySettings from './Step3GiveawaySettings';
import Step4Winners from './Step4Winners';
import { WizardContainer } from './WizardContainer';

export default function WizardShell() {
  const { currentStep, prompt, exportId } = useWizard();

  return (
    <WizardContainer className="py-8 h-full flex flex-col">
      <div className="text-center mb-8">
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">{prompt}</p>
      </div>

      <div className="flex-1 mb-10">
        <AnimatePresence mode="wait">
          {currentStep === 1 && <Step1ExportSetup key="step1" />}
          {currentStep === 2 && exportId && <Step2PreviewAndLoad key="step2" />}
          {currentStep === 3 && exportId && <Step3GiveawaySettings key="step3" />}
          {currentStep === 4 && <Step4Winners key="step4" />}
        </AnimatePresence>
      </div>
    </WizardContainer>
  );
}
