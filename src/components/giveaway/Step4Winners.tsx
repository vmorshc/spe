'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useWizard } from '@/lib/contexts/WizardContext';
import type { NormalizedComment } from '@/lib/instagramExport/types';
import ConfettiCanvas from './ConfettiCanvas';
import WinnerCardGlass from './WinnerCardGlass';
import WinnerDetailsOverlay from './WinnerDetailsOverlay';

export default function Step4Winners() {
  const { winners, uniqueUsers, uniqueWinners } = useWizard();
  const router = useRouter();
  const [showRoulette, setShowRoulette] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<NormalizedComment | null>(null);
  const giveawayTracked = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRoulette(false);
      setShowConfetti(true);

      // Track giveaway completion when winners are revealed
      if (!giveawayTracked.current) {
        giveawayTracked.current = true;
        trackEvent('giveaway_completed', {
          winners_count: winners.length,
          unique_users_enabled: uniqueUsers,
          unique_winners_enabled: uniqueWinners,
        });
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [winners, uniqueUsers, uniqueWinners]);

  if (showRoulette) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            className="w-24 h-24 mx-auto rounded-full border-4 border-primary border-t-transparent"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-foreground"
          >
            Обираємо переможців...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {showConfetti && <ConfettiCanvas />}
      <div className="relative z-10 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Переможці розіграшу!
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {winners.map((winner, index) => (
            <WinnerCardGlass
              key={winner.commentId}
              winner={winner}
              rank={index + 1}
              delay={index * 0.15}
              onClick={() => {
                trackEvent('winner_card_clicked', {
                  winner_position: index + 1,
                  winner_username: winner.username,
                });
                setSelectedWinner(winner);
              }}
            />
          ))}
        </div>
      </div>
      <WinnerDetailsOverlay winner={selectedWinner} onClose={() => setSelectedWinner(null)} />

      {/* Minimal back button — fixed bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 flex justify-center py-4 z-50"
      >
        <button
          type="button"
          onClick={() => router.push('/app/instagram/posts')}
          className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 px-4 py-2 rounded-lg bg-transparent hover:bg-muted/30"
        >
          До публікацій
        </button>
      </motion.div>
    </motion.div>
  );
}
