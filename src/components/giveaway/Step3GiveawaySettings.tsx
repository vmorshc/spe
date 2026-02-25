'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { NumberStepper } from '@/components/ui/number-stepper';
import { SettingCheckbox } from '@/components/ui/setting-checkbox';
import { SliderWithInput } from '@/components/ui/slider-with-input';
import { runGiveawayAction } from '@/lib/actions/giveaway';
import { getExportAction } from '@/lib/actions/instagramExport';
import { useWizard } from '@/lib/contexts/WizardContext';

export default function Step3GiveawaySettings() {
  const {
    exportId,
    postDetails,
    setWinners,
    currentStep,
    setCanGoNext,
    setIsNextLoading,
    registerNextHandler,
    uniqueUsers,
    uniqueWinners,
    setUniqueUsers,
    setUniqueWinners,
  } = useWizard();
  const [winnerCount, setWinnerCount] = useState(1);
  const [totalComments, setTotalComments] = useState(1);
  const [uniqUsers, setUniqUsers] = useState(1);
  const [exportDate, setExportDate] = useState<string>('');

  const maxWinners = uniqueUsers ? uniqUsers : totalComments;

  useEffect(() => {
    if (!exportId) return;

    const loadExportInfo = async () => {
      try {
        const record = await getExportAction(exportId);
        setTotalComments(record.list.length);
        setUniqUsers(record.counters.uniqUsers);
        setExportDate(new Date(record.createdAt).toLocaleDateString('uk-UA'));
      } catch (error) {
        console.error('Failed to load export info:', error);
      }
    };
    void loadExportInfo();
  }, [exportId]);

  // Clamp winnerCount when maxWinners changes
  useEffect(() => {
    if (winnerCount > maxWinners) {
      setWinnerCount(maxWinners);
    }
  }, [maxWinners, winnerCount]);

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
      const { winners } = await runGiveawayAction({
        exportId,
        media: postDetails,
        winnerCount,
        uniqueUsers,
        uniqueWinners,
      });
      setWinners(winners);
    } catch (error) {
      console.error('Failed to pick winners:', error);
      alert('Помилка вибору переможців. Спробуйте ще раз.');
      throw error;
    } finally {
      setIsNextLoading(false);
    }
  }, [
    winnerCount,
    maxWinners,
    exportId,
    postDetails,
    setIsNextLoading,
    setWinners,
    uniqueUsers,
    uniqueWinners,
  ]);

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
      <div className="space-y-3">
        <SettingCheckbox
          checked={uniqueUsers}
          onCheckedChange={setUniqueUsers}
          title="Унікальні учасники"
          description="Враховувати лише перший коментар від кожного користувача"
        />
        <SettingCheckbox
          checked={uniqueWinners}
          onCheckedChange={setUniqueWinners}
          title="Унікальні переможці"
          description="Кожен користувач може виграти лише один раз"
        />
      </div>
      <div className="space-y-4">
        <Label>Кількість переможців</Label>
        <p className="text-xs text-muted-foreground">
          Максимум: {maxWinners.toLocaleString('uk-UA')} учасників
        </p>
        <SliderWithInput
          value={winnerCount}
          min={1}
          max={maxWinners}
          sliderMax={10}
          onChange={handleWinnerCountChange}
          className="hidden lg:block"
        />
        <NumberStepper
          value={winnerCount}
          min={1}
          max={maxWinners}
          onChange={handleWinnerCountChange}
          className="block max-w-md lg:hidden"
        />
      </div>
    </motion.div>
  );
}
