'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Simulation } from '@/lib/parallel/storage';
import { Trash2, Clock } from 'lucide-react';

interface HistoryProps {
  simulations: Simulation[];
  onLoad: (simulation: Simulation) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function History({ simulations, onLoad, onDelete }: HistoryProps) {
  if (simulations.length === 0) return null;

  return (
    <motion.section
      className="w-full max-w-2xl mx-auto py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px w-8 bg-border" />
        <h3 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
          Past Simulations
        </h3>
        <div className="h-px w-8 bg-border" />
      </div>

      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {simulations.map((sim, index) => (
            <motion.div
              key={sim.id}
              layout
              className="group flex items-center gap-4 p-3.5 bg-card/40 border border-transparent
                         hover:bg-card/60 hover:border-border rounded-lg cursor-pointer
                         transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onLoad(sim)}
            >
              {/* Time indicator */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/50 min-w-[70px]">
                <Clock className="w-3 h-3" />
                <span>{formatDate(sim.createdAt)}</span>
              </div>

              {/* Decision text */}
              <p className="flex-1 text-sm text-foreground/80 truncate">
                {sim.decision}
              </p>

              {/* Year badge */}
              <span className="text-[10px] text-muted-foreground/40 bg-muted/20 px-2 py-0.5 rounded">
                {sim.yearsToSimulate}y
              </span>

              {/* Delete button */}
              <button
                className="p-1.5 text-muted-foreground/40 hover:text-rose-400 
                           opacity-50 group-hover:opacity-100 transition-all duration-200
                           hover:bg-rose-400/10 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(sim.id);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
