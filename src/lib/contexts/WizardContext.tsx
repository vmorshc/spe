'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getExportAction } from '@/lib/actions/instagramExport';
import type { InstagramMedia } from '@/lib/facebook/types';
import type { ExportListItem, ExportRecord, NormalizedComment } from '@/lib/instagramExport/types';

type WizardStep = 1 | 2 | 3 | 4;

interface WizardState {
  currentStep: WizardStep;
  maxSteps: number;
  exportId: string | null;
  exportRecord: ExportRecord | null;
  winners: NormalizedComment[];
  postId: string;
  postDetails: InstagramMedia;
  existingExports: ExportListItem[];
  isNextLoading: boolean;
}

interface WizardNavigation {
  canGoBack: boolean;
  canGoNext: boolean;
  goNext: () => void | Promise<void>;
  goBack: () => void;
  setExportId: (id: string) => void;
  setExportRecord: (record: ExportRecord) => void;
  setWinners: (winners: NormalizedComment[]) => void;
  setIsNextLoading: (loading: boolean) => void;
  setCanGoNext: (canGo: boolean) => void;
  registerNextHandler: (handler: (() => void | Promise<void>) | null) => void;
}

interface WizardMetadata {
  prompt: string;
  showDownloadButton: boolean;
}

interface WizardContextValue extends WizardState, WizardNavigation, WizardMetadata {}

const WizardContext = createContext<WizardContextValue | null>(null);

interface WizardProviderProps {
  children: ReactNode;
  postId: string;
  postDetails: InstagramMedia;
  existingExports: ExportListItem[];
}

export function WizardProvider({
  children,
  postId,
  postDetails,
  existingExports,
}: WizardProviderProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [exportId, setExportId] = useState<string | null>(null);
  const [exportRecord, setExportRecord] = useState<ExportRecord | null>(null);
  const [winners, setWinners] = useState<NormalizedComment[]>([]);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [nextHandler, setNextHandler] = useState<(() => void | Promise<void>) | null>(null);

  const maxSteps = 4;

  // Load export record when exportId changes
  useEffect(() => {
    if (!exportId) {
      setExportRecord(null);
      return;
    }

    const loadExportRecord = async () => {
      try {
        const record = await getExportAction(exportId);
        setExportRecord(record);
      } catch (error) {
        console.error('Failed to load export record:', error);
      }
    };

    void loadExportRecord();
  }, [exportId]);

  const registerNextHandler = useCallback((handler: (() => void | Promise<void>) | null) => {
    setNextHandler(() => handler);
  }, []);

  const goNext = useCallback(async () => {
    if (nextHandler) {
      try {
        await nextHandler();
        if (currentStep < maxSteps) {
          setCurrentStep((prev) => (prev + 1) as WizardStep);
          setCanGoNext(false);
        }
      } catch (error) {
        console.error('Next handler error:', error);
      }
    } else if (currentStep < maxSteps) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
      setCanGoNext(false);
    }
  }, [currentStep, nextHandler]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  }, [currentStep]);

  const canGoBack = currentStep > 1;

  const prompt = useMemo(() => {
    switch (currentStep) {
      case 1:
        return 'Для проведення розіграшу потрібно зібрати всіх учасників. Ми завантажимо коментарі з Instagram або використаємо вже збережений список.';
      case 2:
        return 'Перевірте список учасників перед продовженням.';
      case 3:
        return 'Майже готово! Оберіть кількість переможців. Ми виберемо їх випадково зі завантажених коментарів.';
      case 4:
        return 'Вітаємо переможців!';
      default:
        return '';
    }
  }, [currentStep]);

  const showDownloadButton = currentStep === 2 && !!exportId;

  const value = useMemo(
    () => ({
      currentStep,
      maxSteps,
      exportId,
      exportRecord,
      winners,
      postId,
      postDetails,
      existingExports,
      isNextLoading,
      canGoBack,
      canGoNext,
      goNext,
      goBack,
      setExportId,
      setExportRecord,
      setWinners,
      setIsNextLoading,
      setCanGoNext,
      registerNextHandler,
      prompt,
      showDownloadButton,
    }),
    [
      currentStep,
      exportId,
      exportRecord,
      winners,
      postId,
      postDetails,
      existingExports,
      isNextLoading,
      canGoBack,
      canGoNext,
      goNext,
      goBack,
      registerNextHandler,
      prompt,
      showDownloadButton,
    ]
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
}
