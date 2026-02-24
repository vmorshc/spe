'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useWizard } from '@/lib/contexts/WizardContext';
import { WizardContainer } from './WizardContainer';
import WizardDots from './WizardDots';

export default function WizardBottomNav() {
  const {
    currentStep,
    maxSteps,
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    exportId,
    exportRecord,
    showDownloadButton,
    isNextLoading,
  } = useWizard();
  const router = useRouter();

  const handleDownload = () => {
    if (exportId) {
      router.push(`/api/exports/${exportId}/csv`);
    }
  };

  if (currentStep === maxSteps) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50"
    >
      <WizardContainer className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <WizardDots currentStep={currentStep} totalSteps={maxSteps} />
          </div>
          <div className="flex items-center gap-2">
            {exportRecord && exportRecord.counters.appended > 0 && (
              <div className="text-sm text-muted-foreground mr-2">
                Коментарів {exportRecord.counters.appended.toLocaleString('uk-UA')}
              </div>
            )}
            {showDownloadButton && (
              <Button
                variant="outline"
                onClick={handleDownload}
                className="h-9 px-3 lg:h-10 lg:px-8"
              >
                <Download className="h-4 w-4" />
                <span className="hidden lg:inline lg:ml-2">Завантажити</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={goBack}
              disabled={!canGoBack}
              className="h-9 px-3 sm:h-10 sm:px-8"
            >
              <ChevronLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Назад</span>
            </Button>
            <Button
              onClick={goNext}
              disabled={!canGoNext || isNextLoading}
              className="h-9 px-3 sm:h-10 sm:px-8"
            >
              {isNextLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Далі</span>
                </>
              ) : (
                <>
                  <span>Далі</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </WizardContainer>
    </motion.div>
  );
}
