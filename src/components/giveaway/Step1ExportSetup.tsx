'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { startExportAction } from '@/lib/actions/instagramExport';
import { useWizard } from '@/lib/contexts/WizardContext';

export default function Step1ExportSetup() {
  const {
    postId,
    postDetails,
    existingExports,
    setExportId,
    setCanGoNext,
    setIsNextLoading,
    registerNextHandler,
    currentStep,
  } = useWizard();
  const [selectedValue, setSelectedValue] = useState<string>('new');

  const handleNext = useCallback(async () => {
    setIsNextLoading(true);
    try {
      if (selectedValue === 'new') {
        const { exportId } = await startExportAction(postId);
        setExportId(exportId);
      } else {
        setExportId(selectedValue);
      }
    } catch (error) {
      console.error('Failed to start export:', error);
      alert('Помилка створення експорту. Спробуйте ще раз.');
      throw error;
    } finally {
      setIsNextLoading(false);
    }
  }, [selectedValue, postId, setExportId, setIsNextLoading]);

  useEffect(() => {
    if (currentStep === 1) {
      setCanGoNext(true);
      registerNextHandler(handleNext);
    }
    return () => {
      registerNextHandler(null);
    };
  }, [currentStep, setCanGoNext, registerNextHandler, handleNext]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Оберіть джерело даних</h2>
        <p className="text-muted-foreground">
          Завантажте нові коментарі або використайте існуючий експорт
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="export-select">Список учасників</Label>
        <Select value={selectedValue} onValueChange={setSelectedValue}>
          <SelectTrigger id="export-select">
            <SelectValue placeholder="Оберіть варіант" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">
              Завантажити зараз ({postDetails.comments_count.toLocaleString('uk-UA')} коментарів)
            </SelectItem>
            {existingExports.map((exp) => {
              const date = new Date(exp.createdAt);
              const formatted = new Intl.DateTimeFormat('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(date);
              return (
                <SelectItem key={exp.exportId} value={exp.exportId}>
                  {formatted} ({exp.counters.appended.toLocaleString('uk-UA')} коментарів)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
