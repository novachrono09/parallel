'use client';

import { motion } from 'framer-motion';
import { Timeline, Event } from '@/lib/parallel/storage';
import EventCard from './EventCard';
import FinalSnapshotCard from './FinalSnapshot';

interface TimelineColumnProps {
  timeline: Timeline;
  onBranch: (event: Event, timelineId: string) => void;
}

const timelineAccent: Record<string, { line: string; dot: string }> = {
  A: { line: 'bg-terracotta/20', dot: 'bg-terracotta/60' },
  B: { line: 'bg-sage/20', dot: 'bg-sage/60' },
  C: { line: 'bg-gold/20', dot: 'bg-gold/60' },
};

export default function TimelineColumn({ timeline, onBranch }: TimelineColumnProps) {
  const accent = timelineAccent[timeline.id] || timelineAccent.A;

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <motion.div 
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/20 border border-border mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <span className="text-3xl">{timeline.emoji}</span>
        </motion.div>
        <h3 className="font-serif text-xl text-foreground font-medium mb-2">
          {timeline.name}
        </h3>
        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
          {timeline.description}
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative flex flex-col items-center gap-5">
        {/* The vertical line */}
        <div className={`absolute left-1/2 top-0 bottom-20 w-px ${accent.line} -translate-x-1/2`} />

        {/* Events */}
        {timeline.events.map((event, index) => (
          <div key={`${event.year}-${index}-${event.title}`} className="relative w-full max-w-xs">
            <EventCard
              event={event}
              index={index}
              onBranch={(e) => onBranch(e, timeline.id)}
            />
          </div>
        ))}

        {/* End marker */}
        <div className="relative w-full max-w-xs mt-2">
          <div className={`absolute left-1/2 -translate-x-1/2 -top-3 w-4 h-4 rounded-full ${accent.dot} ring-4 ring-background`} />
          <FinalSnapshotCard
            snapshot={timeline.finalSnapshot}
            timelineId={timeline.id}
          />
        </div>
      </div>
    </motion.div>
  );
}
