'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

import DecisionInput from '@/components/parallel/DecisionInput';
import LoadingState from '@/components/parallel/LoadingState';
import TimelineView from '@/components/parallel/TimelineView';
import CompareSection from '@/components/parallel/CompareSection';
import InsightQuote from '@/components/parallel/InsightQuote';
import History from '@/components/parallel/History';
import BranchModal from '@/components/parallel/BranchModal';

import {
  Simulation,
  Event,
  FinalSnapshot,
  saveSimulation,
  getSimulations,
  deleteSimulation,
} from '@/lib/parallel/storage';
import { generateTimelines } from '@/lib/parallel/api';

// Empty State Component
function EmptyState() {
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto mt-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div className="relative">
        {/* Placeholder timeline columns */}
        <div className="flex justify-center gap-6 md:gap-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-24 md:w-32 h-48 md:h-64 rounded-xl border border-dashed border-border/30 
                       bg-muted/5 flex flex-col items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="w-8 h-8 rounded-full bg-muted/20" />
              <div className="w-16 h-2 rounded bg-muted/20" />
              <div className="w-12 h-2 rounded bg-muted/15" />
              <div className="w-14 h-2 rounded bg-muted/10" />
            </motion.div>
          ))}
        </div>
        
        {/* Text */}
        <motion.p 
          className="mt-10 text-muted-foreground/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Your timelines will appear here
        </motion.p>
      </div>
    </motion.div>
  );
}

// Share Button Component
function ShareButton({ simulation }: { simulation: Simulation }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `PARALLEL — What if?

Decision: "${simulation.decision}"

${simulation.timelines.map((t, i) => 
  `Path ${['A', 'B', 'C'][i]}: ${t.name} → Happiness ${t.finalSnapshot.happinessScore}%`
).join('\n')}

Best path: ${simulation.timelines.reduce((best, t) => 
  t.finalSnapshot.happinessScore > best.finalSnapshot.happinessScore ? t : best
).name}

"${simulation.insight}"

Explore your parallel lives at parallel.app`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground 
               hover:text-foreground bg-muted/20 hover:bg-muted/30 rounded-full 
               transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Share Result
        </>
      )}
    </motion.button>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  
  // Branch modal state
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [selectedTimeline, setSelectedTimeline] = useState<Simulation['timelines'][0] | null>(null);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);

  // Load simulations from localStorage on mount
  useEffect(() => {
    const saved = getSimulations();
    setSimulations(saved);
  }, []);

  // Generate new timelines
  const handleGenerate = useCallback(async (decision: string, yearsToSimulate: number) => {
    setIsLoading(true);
    
    try {
      const { result } = await generateTimelines(decision, yearsToSimulate);
      
      const simulation = saveSimulation({
        decision: result.decision!,
        decisionYear: result.decisionYear!,
        decisionSummary: result.decisionSummary!,
        yearsToSimulate: result.yearsToSimulate!,
        timelines: result.timelines!,
        insight: result.insight!,
      });
      
      setCurrentSimulation(simulation);
      setSimulations(prev => [simulation, ...prev.filter(s => s.id !== simulation.id)]);
      
      // Show toast if this looks like fallback data
      if (result.timelines?.[0]?.events?.[0]?.title?.includes('Life Event')) {
        toast('AI service unavailable. Showing example timelines.', {
          icon: '💡',
        });
      }
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Failed to generate timelines:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load a past simulation
  const handleLoadSimulation = useCallback((simulation: Simulation) => {
    setCurrentSimulation(simulation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Delete a simulation
  const handleDeleteSimulation = useCallback((id: string) => {
    deleteSimulation(id);
    setSimulations(prev => prev.filter(s => s.id !== id));
    
    if (currentSimulation?.id === id) {
      setCurrentSimulation(null);
    }
    
    toast.success('Simulation deleted');
  }, [currentSimulation]);

  // Open branch modal - with event index and timeline info
  const handleBranch = useCallback((event: Event, timelineId: string) => {
    if (!currentSimulation) return;
    
    const timelineIndex = currentSimulation.timelines.findIndex(t => t.id === timelineId);
    const timeline = currentSimulation.timelines[timelineIndex];
    const eventIndex = timeline.events.findIndex(e => e.year === event.year && e.title === event.title);
    
    setSelectedEvent(event);
    setSelectedEventIndex(eventIndex);
    setSelectedTimeline(timeline);
    setSelectedTimelineIndex(timelineIndex);
    setBranchModalOpen(true);
  }, [currentSimulation]);

  // Close branch modal
  const handleCloseBranchModal = useCallback(() => {
    setBranchModalOpen(false);
    setSelectedEvent(null);
    setSelectedTimeline(null);
  }, []);

  // Handle ripple change - update timeline from this event onward
  const handleRippleChange = useCallback((timelineIndex: number, eventIndex: number, alternateChoice: string, newEvents: Event[], newSnapshot: FinalSnapshot) => {
    if (!currentSimulation) return;

    // Create updated timelines
    const updatedTimelines = currentSimulation.timelines.map((timeline, tIdx) => {
      if (tIdx !== timelineIndex) return timeline;
      
      // Keep events before the changed event, then add all new events
      const eventsBefore = timeline.events.slice(0, eventIndex);
      const updatedEvents = [...eventsBefore, ...newEvents];
      
      return {
        ...timeline,
        events: updatedEvents,
        finalSnapshot: newSnapshot,
      };
    });

    // Update the simulation
    const updatedSimulation: Simulation = {
      ...currentSimulation,
      timelines: updatedTimelines,
    };

    setCurrentSimulation(updatedSimulation);
    
    // Also update in localStorage
    const allSimulations = getSimulations();
    const updatedSimulations = allSimulations.map(s => 
      s.id === currentSimulation.id ? updatedSimulation : s
    );
    localStorage.setItem('parallel_simulations', JSON.stringify(updatedSimulations));
    setSimulations(updatedSimulations);
    
    toast.success('Timeline updated!');
  }, [currentSimulation]);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Input Section */}
          <DecisionInput 
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State - show when no simulation and not loading */}
          <AnimatePresence mode="wait">
            {!currentSimulation && !isLoading && (
              <EmptyState />
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {currentSimulation && !isLoading && (
              <motion.div
                key={`results-${currentSimulation.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Decision Summary */}
                <motion.div 
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                    Your Decision
                  </p>
                  <h2 className="font-serif text-xl md:text-2xl text-foreground max-w-2xl mx-auto leading-snug">
                    "{currentSimulation.decision}"
                  </h2>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <p className="text-sm text-muted-foreground">
                      {currentSimulation.decisionSummary} • {currentSimulation.yearsToSimulate} year simulation
                    </p>
                    <ShareButton simulation={currentSimulation} />
                  </div>
                </motion.div>

                {/* Timeline Visualization */}
                <TimelineView
                  timelines={currentSimulation.timelines}
                  onBranch={handleBranch}
                />

                {/* Comparison Section - only show if 3 timelines */}
                {currentSimulation.timelines.length === 3 && (
                  <CompareSection timelines={currentSimulation.timelines} />
                )}

                {/* Insight Quote */}
                <InsightQuote insight={currentSimulation.insight} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Section */}
          {!isLoading && simulations.length > 0 && (
            <History
              simulations={simulations}
              onLoad={handleLoadSimulation}
              onDelete={handleDeleteSimulation}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-serif text-foreground">PARALLEL</span> — explore the lives you never lived
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <a
              href="https://pollinations.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline"
            >
              Pollinations.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Branch Modal */}
      <BranchModal
        isOpen={branchModalOpen}
        onClose={handleCloseBranchModal}
        event={selectedEvent}
        eventIndex={selectedEventIndex}
        timeline={selectedTimeline}
        timelineIndex={selectedTimelineIndex}
        onRippleChange={handleRippleChange}
      />
    </main>
  );
}
