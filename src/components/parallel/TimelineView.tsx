'use client';

import { motion } from 'framer-motion';
import { Timeline, Event } from '@/lib/parallel/storage';
import TimelineColumn from './TimelineColumn';

interface TimelineViewProps {
  timelines: Timeline[];
  onBranch: (event: Event, timelineId: string) => void;
}

export default function TimelineView({ timelines, onBranch }: TimelineViewProps) {
  // Create a unique key based on timeline content to force re-render
  const timelinesKey = timelines.map(t => 
    `${t.id}-${t.events.map(e => `${e.year}-${e.title}`).join(',')}-${t.finalSnapshot.happinessScore}`
  ).join('|');

  return (
    <motion.section
      key={timelinesKey}
      className="w-full py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Timeline Grid - 3 columns on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
        {timelines.map((timeline, index) => (
          <motion.div
            key={timeline.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <TimelineColumn timeline={timeline} onBranch={onBranch} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
