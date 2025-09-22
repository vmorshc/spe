'use client';

import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { Dice4, Download, Settings, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { pickWinnerAction } from '@/lib/actions/instagram';
import { startExportAction } from '@/lib/actions/instagramExport';

interface ActionDrawerProps {
  postId: string;
  mode?: 'live' | 'export';
  exportId?: string;
}

export default function ActionDrawer({ postId, mode = 'live', exportId }: ActionDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPickingWinner, setIsPickingWinner] = useState(false);
  const router = useRouter();

  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      if (mode === 'export') {
        if (!exportId) return;
        setIsOpen(false);
        router.push(`/api/exports/${exportId}/csv`);
      } else {
        const { exportId } = await startExportAction(postId);
        setIsOpen(false);
        router.push(`/app/instagram/posts/${postId}/exports/${exportId}`);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Помилка експорту CSV. Спробуйте ще раз.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePickWinner = async () => {
    try {
      setIsPickingWinner(true);
      await pickWinnerAction(postId);
      // Show success message (placeholder for now)
      alert('Функція вибору переможця буде доступна незабаром!');
      setIsOpen(false);
    } catch (error) {
      console.error('Error picking winner:', error);
      alert('Помилка вибору переможця. Спробуйте ще раз.');
    } finally {
      setIsPickingWinner(false);
    }
  };

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.action-drawer')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 10,
          delay: 0.3,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:shadow-xl"
        >
          <Dice4 className="w-6 h-6" />
        </button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={constraintsRef}
            className="fixed inset-x-0 bottom-0 z-50 action-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            dragElastic={0.2}
            onDragEnd={(_event, info) => {
              if (info.offset.y > 100) {
                setIsOpen(false);
              }
            }}
          >
            <div className="bg-white rounded-t-3xl shadow-xl max-h-[75vh] overflow-hidden">
              {/* Drag Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Дії з публікацією</h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 space-y-3">
                {/* Pick Winner Button */}
                <Button
                  onClick={handlePickWinner}
                  disabled={isPickingWinner}
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Dice4 className={`w-5 h-5 ${isPickingWinner ? 'animate-spin' : ''}`} />
                  <span>Обрати переможця</span>
                </Button>

                {/* Export/Download CSV Button */}
                <Button
                  onClick={handleExportCsv}
                  disabled={isExporting}
                  variant="secondary"
                  size="lg"
                  className="w-full flex items-center justify-center space-x-3"
                >
                  <Download className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span>{mode === 'export' ? 'Завантажити CSV' : 'Експорт'}</span>
                </Button>

                {/* Filters Button (Placeholder) */}
                <Button
                  disabled
                  variant="ghost"
                  size="lg"
                  className="w-full flex items-center justify-center space-x-3 opacity-50 cursor-not-allowed"
                >
                  <Settings className="w-5 h-5" />
                  <span>Фільтри</span>
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Незабаром
                  </span>
                </Button>
              </div>

              {/* Safe Area Bottom Spacing */}
              <div className="h-8"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
