'use client';

import { motion } from 'framer-motion';
import { Dice4, Download, RefreshCw, Settings } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { exportCsvAction, pickWinnerAction, refreshCommentsAction } from '@/lib/actions/instagram';

interface ActionBarProps {
  postId: string;
}

export default function ActionBar({ postId }: ActionBarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPickingWinner, setIsPickingWinner] = useState(false);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const response = await exportCsvAction(postId);

      // Create blob and download
      const blob = new Blob([await response.text()], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instagram_comments_${postId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Помилка експорту CSV. Спробуйте ще раз.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshComments = async () => {
    try {
      setIsRefreshing(true);
      await refreshCommentsAction(postId);
      // Refresh the page to show updated comments
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing comments:', error);
      alert('Помилка оновлення коментарів. Спробуйте ще раз.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePickWinner = async () => {
    try {
      setIsPickingWinner(true);
      await pickWinnerAction(postId);
      // Show success message (placeholder for now)
      alert('Функція вибору переможця буде доступна незабаром!');
    } catch (error) {
      console.error('Error picking winner:', error);
      alert('Помилка вибору переможця. Спробуйте ще раз.');
    } finally {
      setIsPickingWinner(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Pick Winner Button */}
          <Button
            onClick={handlePickWinner}
            disabled={isPickingWinner}
            variant="primary"
            size="lg"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Dice4 className={`w-5 h-5 ${isPickingWinner ? 'animate-spin' : ''}`} />
            <span>Обрати переможця</span>
          </Button>

          {/* Export CSV Button */}
          <Button
            onClick={handleExportCsv}
            disabled={isExporting}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Download className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>Експорт CSV</span>
          </Button>

          {/* Refresh Comments Button */}
          <Button
            onClick={handleRefreshComments}
            disabled={isRefreshing}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Оновити коментарі</span>
          </Button>

          {/* Filters Button (Placeholder) */}
          <Button
            disabled
            variant="ghost"
            size="lg"
            className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
          >
            <Settings className="w-5 h-5" />
            <span>Фільтри</span>
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              Незабаром
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
