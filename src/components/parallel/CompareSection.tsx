'use client';

import { motion } from 'framer-motion';
import { Timeline } from '@/lib/parallel/storage';

interface CompareSectionProps {
  timelines: Timeline[];
}

const timelineColors: Record<string, string> = {
  A: '#c4754b', // terracotta
  B: '#7c8c6e', // sage
  C: '#b8945f', // gold
};

export default function CompareSection({ timelines }: CompareSectionProps) {
  // Calculate average scores
  const scores = timelines.map((t) => ({
    id: t.id,
    name: t.name,
    emoji: t.emoji,
    happiness: t.finalSnapshot.happinessScore,
    wealth: t.finalSnapshot.wealthScore,
    growth: t.finalSnapshot.growthScore,
    overall: Math.round(
      (t.finalSnapshot.happinessScore + t.finalSnapshot.wealthScore + t.finalSnapshot.growthScore) / 3
    ),
  }));

  // Find best overall
  const bestOverall = scores.reduce((best, curr) => 
    curr.overall > best.overall ? curr : best
  );

  const maxScore = 100;

  // Create a unique key based on scores to force re-render
  const scoresKey = scores.map(s => `${s.id}-${s.happiness}-${s.wealth}-${s.growth}`).join('|');

  const metrics = [
    { key: 'happiness', label: 'Happiness' },
    { key: 'wealth', label: 'Wealth' },
    { key: 'growth', label: 'Growth' },
  ];

  return (
    <motion.section
      key={scoresKey}
      className="w-full max-w-3xl mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="font-serif text-xl text-foreground text-center mb-8">
        Timeline Comparison
      </h3>

      {/* Comparison Bars */}
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.key} className="space-y-3">
            <h4 className="text-sm text-muted-foreground">{metric.label}</h4>
            <div className="space-y-2">
              {scores.map((score, index) => {
                const value = score[metric.key as keyof typeof score] as number;
                const color = timelineColors[score.id] || timelineColors.A;
                
                return (
                  <div key={`${score.id}-${metric.key}`} className="flex items-center gap-3">
                    <div className="w-6 text-center">
                      <span className="text-xs text-muted-foreground">{score.emoji}</span>
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-5 bg-muted/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / maxScore) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-right">
                      <span className="text-sm text-foreground font-medium">{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Best Overall Indicator */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-full">
          <span className="text-lg">{bestOverall.emoji}</span>
          <span className="text-sm text-muted-foreground">Best overall path:</span>
          <span className="text-sm text-foreground font-medium">{bestOverall.name}</span>
          <span className="text-xs text-muted-foreground">({bestOverall.overall} avg)</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
