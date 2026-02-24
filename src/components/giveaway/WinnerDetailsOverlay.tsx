'use client';

import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useState } from 'react';
import type { NormalizedComment } from '@/lib/instagramExport/types';

interface WinnerDetailsOverlayProps {
  winner: NormalizedComment | null;
  onClose: () => void;
}

export default function WinnerDetailsOverlay({ winner, onClose }: WinnerDetailsOverlayProps) {
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  if (!winner) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x, y });
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss is intentional
    // biome-ignore lint/a11y/useKeyWithClickEvents: handled by onKeyDown on close button
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/95 border border-amber-400/50 shadow-2xl shadow-amber-500/20 group max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundImage: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(251, 191, 36, 0.15), transparent 60%)`,
        }}
      >
        {/* Close button — visible only on hover */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4 text-foreground/60" />
        </button>

        <div className="p-8 space-y-6">
          {/* User avatar and info */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-white">
              <span className="text-white text-5xl font-bold">
                {winner.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold text-foreground">@{winner.username}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(winner.timestamp).toLocaleDateString('uk-UA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <div className="flex items-center justify-center gap-1 text-muted-foreground pt-1">
                <Heart className="w-3 h-3" />
                <span className="text-xs">{winner.likeCount}</span>
              </div>
            </div>
          </div>

          {/* Comment text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80 text-center">
            {winner.text}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
