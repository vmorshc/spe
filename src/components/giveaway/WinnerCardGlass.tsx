'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useState } from 'react';
import type { NormalizedComment } from '@/lib/instagramExport/types';

interface WinnerCardGlassProps {
  winner: NormalizedComment;
  rank: number;
  delay?: number;
  onClick?: () => void;
  layout?: 'horizontal' | 'vertical';
  showFullComment?: boolean;
}

export default function WinnerCardGlass({
  winner,
  rank,
  delay = 0,
  onClick,
  layout = 'horizontal',
  showFullComment = false,
}: WinnerCardGlassProps) {
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x, y });
  };

  const getTierStyles = () => {
    switch (rank) {
      case 1:
        return {
          gradient: 'from-amber-500/20 via-yellow-500/10 to-amber-600/20',
          border: 'border-amber-400/50 shadow-amber-500/20',
          glareColor: 'rgba(251, 191, 36, 0.3)',
          icon: 'text-amber-500',
        };
      case 2:
        return {
          gradient: 'from-slate-400/20 via-gray-300/10 to-slate-500/20',
          border: 'border-slate-400/50 shadow-slate-400/20',
          glareColor: 'rgba(203, 213, 225, 0.3)',
          icon: 'text-slate-400',
        };
      case 3:
        return {
          gradient: 'from-orange-700/20 via-amber-700/10 to-orange-800/20',
          border: 'border-orange-600/50 shadow-orange-700/20',
          glareColor: 'rgba(234, 88, 12, 0.3)',
          icon: 'text-orange-600',
        };
      default:
        return {
          gradient: 'from-blue-500/10 via-purple-500/5 to-blue-600/10',
          border: 'border-border shadow-primary/10',
          glareColor: 'rgba(147, 197, 253, 0.2)',
          icon: 'text-primary',
        };
    }
  };

  const styles = getTierStyles();

  const isVertical = layout === 'vertical';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={onClick ? { scale: 1.01, y: -2 } : undefined}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br ${styles.gradient} border ${styles.border} shadow-lg group ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${styles.glareColor}, transparent 60%)`,
      }}
    >
      <div className={`p-5 ${isVertical ? 'space-y-6' : ''}`}>
        {isVertical ? (
          <>
            {/* Trophy icon at top */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* User avatar and info - vertical layout */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-background">
                <span className="text-white text-5xl font-bold">
                  {winner.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center space-y-2">
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
              </div>
            </div>

            {/* Comment text */}
            <div className="space-y-3 px-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Коментар
              </h4>
              <div className="rounded-xl border bg-muted/30 p-4 max-h-64 overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {winner.text}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-200/20">
                <span className="text-2xl font-bold text-foreground">{winner.likeCount}</span>
                <span className="text-xs text-muted-foreground">Лайків</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200/20">
                <span className="text-xs font-mono text-foreground">
                  {winner.commentId.slice(0, 12)}...
                </span>
                <span className="text-xs text-muted-foreground">ID коментаря</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Horizontal layout: rank + icon + username */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Trophy className={`w-6 h-6 ${styles.icon}`} />
                <span className="text-2xl font-bold">{rank}</span>
              </div>

              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-semibold">
                  {winner.username.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-foreground truncate">@{winner.username}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(winner.timestamp).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Comment text on new line */}
            <p
              className={`text-sm text-foreground/80 pl-1 ${
                showFullComment ? 'whitespace-pre-wrap' : 'line-clamp-2'
              }`}
            >
              {winner.text}
            </p>
          </>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
