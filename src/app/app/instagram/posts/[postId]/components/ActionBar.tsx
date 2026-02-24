'use client';

import { motion } from 'framer-motion';
import { Dice4, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface ActionBarProps {
  postId: string;
  exportId?: string;
}

export default function ActionBar({ postId }: ActionBarProps) {
  const router = useRouter();

  const handlePickWinner = async () => {
    router.push(`/app/instagram/export/${postId}`);
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
            variant="default"
            size="lg"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Dice4 className="w-5 h-5" />
            <span>Обрати переможця</span>
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
