'use client';

import { motion } from 'framer-motion';
import { Event } from '@/lib/parallel/storage';

interface EventCardProps {
  event: Event;
  index: number;
  onBranch?: (event: Event) => void;
  isClickable?: boolean;
}

const moodConfig: Record<string, { border: string; dot: string; glow: string }> = {
  hopeful: { 
    border: 'border-sage/20 hover:border-sage/40', 
    dot: 'bg-sage',
    glow: 'shadow-sage/5'
  },
  thriving: { 
    border: 'border-emerald-500/20 hover:border-emerald-500/40', 
    dot: 'bg-emerald-500',
    glow: 'shadow-emerald-500/5'
  },
  struggling: { 
    border: 'border-rose-400/20 hover:border-rose-400/40', 
    dot: 'bg-rose-400',
    glow: 'shadow-rose-400/5'
  },
  'turning-point': { 
    border: 'border-gold/20 hover:border-gold/40', 
    dot: 'bg-gold',
    glow: 'shadow-gold/5'
  },
  peaceful: { 
    border: 'border-muted-blue/20 hover:border-muted-blue/40', 
    dot: 'bg-muted-blue',
    glow: 'shadow-muted-blue/5'
  },
  chaotic: { 
    border: 'border-amber-500/20 hover:border-amber-500/40', 
    dot: 'bg-amber-500',
    glow: 'shadow-amber-500/5'
  },
};

export default function EventCard({ event, index, onBranch, isClickable = true }: EventCardProps) {
  const moodStyle = moodConfig[event.mood] || moodConfig.hopeful;

  const handleClick = () => {
    if (isClickable && onBranch) {
      onBranch(event);
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Connection dot */}
      <div className={`absolute left-1/2 -translate-x-1/2 -top-1.5 w-2.5 h-2.5 rounded-full ${moodStyle.dot} ring-4 ring-background`} />

      {/* Card */}
      <motion.div
        className={`relative bg-card/80 backdrop-blur-sm border ${moodStyle.border} rounded-xl p-4 
                    transition-all duration-300 
                    ${isClickable ? 'cursor-pointer hover:shadow-lg hover:shadow-muted/5' : ''}`}
        onClick={handleClick}
        whileHover={isClickable ? { y: -2 } : {}}
        whileTap={isClickable ? { scale: 0.99 } : {}}
      >
        {/* Year badge and mood indicator */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
            {event.year}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground/60 capitalize">{event.mood.replace('-', ' ')}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${moodStyle.dot}`} />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-foreground font-medium text-sm mb-2 leading-snug">
          {event.title}
        </h4>

        {/* Description */}
        <p className="text-muted-foreground text-xs leading-relaxed">
          {event.description}
        </p>

        {/* Mood score bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-muted/20 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${moodStyle.dot} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${event.moodScore}%` }}
              transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground/50 tabular-nums w-6 text-right">
            {event.moodScore}
          </span>
        </div>

        {/* Click hint */}
        {isClickable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-background/50 rounded-xl backdrop-blur-[2px]">
            <span className="text-[10px] text-primary font-medium bg-background/90 px-3 py-1.5 rounded-full border border-border shadow-sm">
              Click to explore
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
