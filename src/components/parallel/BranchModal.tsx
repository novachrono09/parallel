'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Event, Timeline, FinalSnapshot } from '@/lib/parallel/storage';
import { generateBranch } from '@/lib/parallel/api';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  eventIndex: number;
  timeline: Timeline | null;
  timelineIndex: number;
  onRippleChange: (timelineIndex: number, eventIndex: number, alternateChoice: string, newEvents: Event[], newSnapshot: FinalSnapshot) => void;
}

const moodColors: Record<string, { border: string; dot: string; bg: string }> = {
  hopeful: { border: 'border-sage/30', dot: 'bg-sage', bg: 'bg-sage/10' },
  thriving: { border: 'border-emerald-500/30', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
  struggling: { border: 'border-rose-400/30', dot: 'bg-rose-400', bg: 'bg-rose-400/10' },
  'turning-point': { border: 'border-gold/30', dot: 'bg-gold', bg: 'bg-gold/10' },
  peaceful: { border: 'border-muted-blue/30', dot: 'bg-muted-blue', bg: 'bg-muted-blue/10' },
  chaotic: { border: 'border-amber-500/30', dot: 'bg-amber-500', bg: 'bg-amber-500/10' },
};

export default function BranchModal({
  isOpen,
  onClose,
  event,
  eventIndex,
  timeline,
  timelineIndex,
  onRippleChange,
}: BranchModalProps) {
  const [alternateChoice, setAlternateChoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newEvents, setNewEvents] = useState<Event[]>([]);
  const [newSnapshot, setNewSnapshot] = useState<FinalSnapshot | null>(null);

  const handleRipple = async () => {
    if (!event || !alternateChoice.trim() || !timeline) return;

    setIsGenerating(true);

    try {
      const result = await generateBranch(
        '',
        event.year,
        event.title,
        event.description,
        alternateChoice.trim(),
        timeline.events.length - eventIndex
      );
      
      setNewEvents(result.events);
      setNewSnapshot(result.snapshot);
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackCount = timeline.events.length - eventIndex;
      const fallbacks: Event[] = Array.from({ length: fallbackCount }, (_, i) => ({
        year: event.year + i,
        title: i === 0 ? 'Different Choice' : `New Path ${i}`,
        description: i === 0 ? alternateChoice : 'Your different choice led to new outcomes.',
        mood: 'hopeful' as const,
        moodScore: 50,
      }));
      setNewEvents(fallbacks);
      setNewSnapshot({
        career: 'Unknown', location: 'Unknown', relationship: 'Unknown',
        keyAchievement: 'Your story continues', biggestRegret: 'Only time will tell',
        happinessScore: 50, wealthScore: 50, growthScore: 50,
        quote: 'Every choice opens new doors.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (newEvents.length > 0 && event && newSnapshot) {
      onRippleChange(timelineIndex, eventIndex, alternateChoice, newEvents, newSnapshot);
      handleClose();
    }
  };

  const handleClose = () => {
    setAlternateChoice('');
    setNewEvents([]);
    setNewSnapshot(null);
    onClose();
  };

  if (!event || !timeline) return null;

  const moodStyle = moodColors[event.mood] || moodColors.hopeful;
  const eventsToChange = timeline.events.length - eventIndex;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                       md:w-full md:max-w-md bg-card border border-border rounded-2xl shadow-2xl z-50
                       flex flex-col max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${moodStyle.bg} flex items-center justify-center`}>
                  <Sparkles className="w-4 h-4 text-foreground/60" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground">Change Event</h3>
                  <p className="text-[10px] text-muted-foreground">{timeline.name} • Year {event.year}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Current Event */}
              <div className={`mb-5 p-4 rounded-xl ${moodStyle.bg} border ${moodStyle.border}`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Currently</p>
                <h4 className="text-foreground font-medium text-sm mb-1">{event.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{event.description}</p>
              </div>

              {/* What If Input */}
              <div className="mb-4">
                <label className="text-xs text-foreground font-medium block mb-2">
                  What if instead...
                </label>
                <input
                  type="text"
                  value={alternateChoice}
                  onChange={(e) => setAlternateChoice(e.target.value)}
                  placeholder="you made a different choice?"
                  className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl 
                           text-foreground placeholder:text-muted-foreground/40
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30
                           text-sm transition-all"
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && alternateChoice.trim() && !isGenerating) {
                      handleRipple();
                    }
                  }}
                />
              </div>

              <p className="text-[11px] text-muted-foreground/60 mb-4">
                This will update {eventsToChange} event{eventsToChange > 1 ? 's' : ''} and the final outcome.
              </p>

              {/* Generate Button */}
              <motion.button
                onClick={handleRipple}
                disabled={!alternateChoice.trim() || isGenerating}
                className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/40 border border-border rounded-xl text-sm font-medium
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-muted/30
                         flex items-center justify-center gap-2 mb-5 transition-colors"
                whileHover={{ scale: alternateChoice.trim() && !isGenerating ? 1.01 : 1 }}
                whileTap={{ scale: alternateChoice.trim() && !isGenerating ? 0.99 : 1 }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Generate New Future
                  </>
                )}
              </motion.button>

              {/* New Events Preview */}
              {newEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">New Events</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto mb-4">
                    {newEvents.map((newEvent, index) => {
                      const eventMood = moodColors[newEvent.mood] || moodColors.hopeful;
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${eventMood.bg} border ${eventMood.border}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-muted-foreground">{newEvent.year}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">{newEvent.mood.replace('-', ' ')}</span>
                          </div>
                          <h4 className="text-foreground font-medium text-sm">{newEvent.title}</h4>
                        </div>
                      );
                    })}
                  </div>

                  {/* New Snapshot Preview */}
                  {newSnapshot && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 mb-5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">New Outcome</p>
                      <div className="flex gap-4 text-[11px]">
                        <span>😊 {newSnapshot.happinessScore}</span>
                        <span>💰 {newSnapshot.wealthScore}</span>
                        <span>📈 {newSnapshot.growthScore}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Apply Button */}
                  <motion.button
                    onClick={handleApply}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium
                             flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Apply Changes
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
