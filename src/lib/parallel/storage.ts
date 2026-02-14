// LocalStorage helpers for saving/loading simulations

export interface Simulation {
  id: string;
  decision: string;
  decisionYear: number;
  decisionSummary: string;
  yearsToSimulate: number;
  timelines: Timeline[];
  insight: string;
  createdAt: string;
}

export interface Timeline {
  id: string;
  name: string;
  emoji: string;
  description: string;
  events: Event[];
  finalSnapshot: FinalSnapshot;
}

export interface Event {
  year: number;
  title: string;
  description: string;
  mood: 'hopeful' | 'thriving' | 'struggling' | 'turning-point' | 'peaceful' | 'chaotic';
  moodScore: number;
}

export interface FinalSnapshot {
  career: string;
  location: string;
  relationship: string;
  keyAchievement: string;
  biggestRegret: string;
  happinessScore: number;
  wealthScore: number;
  growthScore: number;
  quote: string;
}

export interface BranchEvent {
  id: string;
  parentEventYear: number;
  parentEventTitle: string;
  alternateChoice: string;
  followUpEvents: Event[];
  createdAt: string;
}

const STORAGE_KEY = 'parallel_simulations';
const BRANCHES_KEY = 'parallel_branches';

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Save a simulation to localStorage
export function saveSimulation(simulation: Omit<Simulation, 'id' | 'createdAt'>): Simulation {
  if (typeof window === 'undefined') {
    return { ...simulation, id: generateId(), createdAt: new Date().toISOString() };
  }
  
  const simulations = getSimulations();
  const newSimulation: Simulation = {
    ...simulation,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  simulations.unshift(newSimulation);
  
  // Keep only the last 20 simulations
  const trimmedSimulations = simulations.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSimulations));
  
  return newSimulation;
}

// Get all simulations from localStorage
export function getSimulations(): Simulation[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Delete a simulation by ID
export function deleteSimulation(id: string): void {
  if (typeof window === 'undefined') return;
  
  const simulations = getSimulations();
  const filtered = simulations.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Get a single simulation by ID
export function getSimulationById(id: string): Simulation | null {
  const simulations = getSimulations();
  return simulations.find(s => s.id === id) || null;
}

// Save a branch event
export function saveBranchEvent(simulationId: string, branch: Omit<BranchEvent, 'id' | 'createdAt'>): BranchEvent {
  if (typeof window === 'undefined') {
    return { ...branch, id: generateId(), createdAt: new Date().toISOString() };
  }
  
  const branches = getBranches();
  const newBranch: BranchEvent = {
    ...branch,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  if (!branches[simulationId]) {
    branches[simulationId] = [];
  }
  branches[simulationId].push(newBranch);
  
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  
  return newBranch;
}

// Get all branches for a simulation
export function getBranchesForSimulation(simulationId: string): BranchEvent[] {
  if (typeof window === 'undefined') return [];
  
  const branches = getBranches();
  return branches[simulationId] || [];
}

// Get all branches
function getBranches(): Record<string, BranchEvent[]> {
  if (typeof window === 'undefined') return {};
  
  const data = localStorage.getItem(BRANCHES_KEY);
  if (!data) return {};
  
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}
