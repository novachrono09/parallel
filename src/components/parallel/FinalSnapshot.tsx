'use client';

import { motion } from 'framer-motion';
import { FinalSnapshot } from '@/lib/parallel/storage';

interface FinalSnapshotCardProps {
  snapshot: FinalSnapshot;
  timelineId: string;
}

const timelineAccent: Record<string, { bg: string; border: string; text: string }> = {
  A: { bg: 'bg-terracotta/10', border: 'border-terracotta/20', text: 'text-terracotta' },
  B: { bg: 'bg-sage/10', border: 'border-sage/20', text: 'text-sage' },
  C: { bg: 'bg-gold/10', border: 'border-gold/20', text: 'text-gold' },
};

export default function FinalSnapshotCard({ snapshot, timelineId }: FinalSnapshotCardProps) {
  const accent = timelineAccent[timelineId] || timelineAccent.A;

  return (
    <motion.div
      className="relative bg-card/60 backdrop-blur-sm border border-border rounded-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1.5 h-1.5 rounded-full ${accent.bg.replace('/10', '')}`} />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Final Outcome
        </span>
      </div>

      {/* Info Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-xs text-muted-foreground">Career</span>
          <span className="text-sm text-foreground text-right max-w-[55%] leading-snug">{snapshot.career}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Location</span>
          <span className="text-sm text-foreground">{snapshot.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Relationship</span>
          <span className="text-sm text-foreground">{snapshot.relationship}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/50 my-4" />

      {/* Achievements */}
      <div className="space-y-3">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">Achievement</span>
          <p className="text-sm text-foreground leading-snug">{snapshot.keyAchievement}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">Regret</span>
          <p className="text-sm text-muted-foreground/80 italic leading-snug">{snapshot.biggestRegret}</p>
        </div>
      </div>

      {/* Score Bars */}
      <div className="mt-5 pt-4 border-t border-border/30 space-y-2.5">
        {[
          { label: '😊 Happiness', score: snapshot.happinessScore },
          { label: '💰 Wealth', score: snapshot.wealthScore },
          { label: '📈 Growth', score: snapshot.growthScore },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground w-20">{item.label}</span>
            <div className="flex-1 h-1 bg-muted/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${accent.bg.replace('/10', '')}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums w-5 text-right">
              {item.score}
            </span>
          </div>
        ))}
      </div>

      {/* Quote */}
      <motion.div 
        className={`mt-5 p-4 rounded-lg ${accent.bg} border ${accent.border}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-foreground/90 italic leading-relaxed">
          "{snapshot.quote}"
        </p>
      </motion.div>
    </motion.div>
  );
}
