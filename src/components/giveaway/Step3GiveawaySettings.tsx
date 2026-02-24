'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { SliderWithInput } from '@/components/ui/slider-with-input';
import { pickWinnersAction } from '@/lib/actions/giveaway';
import { getExportAction } from '@/lib/actions/instagramExport';
import { useWizard } from '@/lib/contexts/WizardContext';

export default function Step3GiveawaySettings() {
  const { exportId, setWinners, currentStep, setCanGoNext, setIsNextLoading, registerNextHandler } =
    useWizard();
  const [winnerCount, setWinnerCount] = useState(1);
  const [maxWinners, setMaxWinners] = useState(1);
  const [exportDate, setExportDate] = useState<string>('');

  useEffect(() => {
    if (!exportId) return;

    const loadExportInfo = async () => {
      try {
        const record = await getExportAction(exportId);
        setMaxWinners(record.list.length);
        setExportDate(new Date(record.createdAt).toLocaleDateString('uk-UA'));
      } catch (error) {
        console.error('Failed to load export info:', error);
      }
    };
    void loadExportInfo();
  }, [exportId]);

  const handleWinnerCountChange = (value: number) => {
    setWinnerCount(value);
  };

  const handleStartGiveaway = useCallback(async () => {
    if (winnerCount < 1 || winnerCount > maxWinners) {
      alert(`Кількість переможців повинна бути від 1 до ${maxWinners}`);
      throw new Error('Invalid winner count');
    }

    if (!exportId) {
      throw new Error('No export ID');
    }

    setIsNextLoading(true);
    try {
      const selectedWinners = await pickWinnersAction(exportId, winnerCount);
      setWinners(selectedWinners);
    } catch (error) {
      console.error('Failed to pick winners:', error);
      alert('Помилка вибору переможців. Спробуйте ще раз.');
      throw error;
    } finally {
      setIsNextLoading(false);
    }
  }, [winnerCount, maxWinners, exportId, setIsNextLoading, setWinners]);

  useEffect(() => {
    if (currentStep === 3) {
      setCanGoNext(true);
      registerNextHandler(handleStartGiveaway);
    }
    return () => {
      registerNextHandler(null);
    };
  }, [currentStep, setCanGoNext, registerNextHandler, handleStartGiveaway]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Налаштування розіграшу</h2>
        <p className="text-muted-foreground">
          Використовується список від {exportDate} ({maxWinners.toLocaleString('uk-UA')} учасників)
        </p>
      </div>
      <div className="space-y-4">
        <Label>Кількість переможців</Label>
        <SliderWithInput
          value={winnerCount}
          min={1}
          max={maxWinners}
          sliderMax={10}
          onChange={handleWinnerCountChange}
        />
        <p className="text-xs text-muted-foreground">
          Максимум: {maxWinners.toLocaleString('uk-UA')} учасників
        </p>
      </div>
    </motion.div>
  );
}
