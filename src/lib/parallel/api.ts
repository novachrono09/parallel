// Pollinations API helper functions
// Documentation: https://text.pollinations.ai/

import { Simulation, Timeline, Event, FinalSnapshot } from './storage';

interface PollinationsResponse {
  decisionYear: number;
  decisionSummary: string;
  timelines: Timeline[];
  insight: string;
}

// Parse JSON from response text
function parseJSONFromText(text: string): unknown {
  let cleaned = text.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  
  cleaned = cleaned.trim();
  
  // Find JSON object in the text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parse error:', e);
    throw new Error('Could not parse JSON from response');
  }
}

// Default fallback timeline generator
function generateFallbackTimelines(decision: string, yearsToSimulate: number, startYear?: number): Simulation {
  const baseYear = startYear || new Date().getFullYear();
  
  const timelineEvents: Record<string, Partial<Event>[]> = {
    'A': [
      { title: 'The Fall', description: 'Everything seemed to crumble at once. The weight of the decision settled in.', mood: 'struggling' },
      { title: 'Rock Bottom', description: 'A moment of clarity found in the deepest valley.', mood: 'struggling' },
      { title: 'The Turn', description: 'Something shifted. A door opened where there was only wall.', mood: 'turning-point' },
      { title: 'Rising Slowly', description: 'Each step forward felt earned, not given.', mood: 'hopeful' },
      { title: 'New Heights', description: 'Looking back, the struggle became the foundation.', mood: 'thriving' },
    ],
    'B': [
      { title: 'Easy Wins', description: 'Success came quickly, almost too easily.', mood: 'thriving' },
      { title: 'Golden Days', description: 'Everything clicked. Life felt like a streak of luck.', mood: 'thriving' },
      { title: 'The Hush', description: 'A quiet settled in. Something felt missing.', mood: 'peaceful' },
      { title: 'Hollow Echo', description: 'The achievements lost their shine.', mood: 'struggling' },
      { title: 'Breaking Point', description: 'The foundation cracked from within.', mood: 'chaotic' },
    ],
    'C': [
      { title: 'Small Steps', description: 'No dramatic turns, just steady movement forward.', mood: 'hopeful' },
      { title: 'Quiet Growth', description: 'Changes happened slowly, almost invisibly.', mood: 'peaceful' },
      { title: 'Crossroads', description: 'A choice that seemed small changed everything.', mood: 'turning-point' },
      { title: 'Finding Flow', description: 'Things started to align naturally.', mood: 'hopeful' },
      { title: 'Quiet Joy', description: 'Not flashy, but deeply, genuinely good.', mood: 'thriving' },
    ],
  };

  const createEvents = (timelineId: string): Event[] => {
    const events = timelineEvents[timelineId] || timelineEvents['A'];
    return events.slice(0, yearsToSimulate).map((e, i) => ({
      year: baseYear + i,
      title: e.title || 'Life Event',
      description: e.description || 'A significant moment unfolds.',
      mood: e.mood as Event['mood'],
      moodScore: 40 + Math.floor(Math.random() * 40),
    }));
  };

  return {
    id: `fallback-${Date.now()}`,
    decision,
    decisionYear: baseYear,
    decisionSummary: 'A choice that echoes through time',
    yearsToSimulate,
    timelines: [
      {
        id: 'A',
        name: 'The Hard Road',
        emoji: '🏔️',
        description: 'A challenging path with great rewards',
        events: createEvents('A'),
        finalSnapshot: {
          career: 'Self-Made Entrepreneur',
          location: 'A bustling city of dreams',
          relationship: 'Late but lasting love',
          keyAchievement: 'Built something from nothing',
          biggestRegret: 'The years lost to the climb',
          happinessScore: 75,
          wealthScore: 85,
          growthScore: 90,
          quote: 'The hardest climbs lead to the best views.',
        },
      },
      {
        id: 'B',
        name: 'Golden Cage',
        emoji: '🏆',
        description: 'Success on paper, emptiness within',
        events: createEvents('B'),
        finalSnapshot: {
          career: 'Corporate Leader',
          location: 'A prestigious neighborhood',
          relationship: 'Distant memories',
          keyAchievement: 'Reached the top of the ladder',
          biggestRegret: 'Forgot to ask why I was climbing',
          happinessScore: 45,
          wealthScore: 95,
          growthScore: 50,
          quote: 'I had everything, except what mattered.',
        },
      },
      {
        id: 'C',
        name: 'Wandering Path',
        emoji: '🌿',
        description: 'Unconventional but fulfilling',
        events: createEvents('C'),
        finalSnapshot: {
          career: 'Creative Freedom',
          location: 'Somewhere that feels like home',
          relationship: 'Deep, genuine connections',
          keyAchievement: 'Found my own definition of success',
          biggestRegret: 'Sometimes wondering "what if"',
          happinessScore: 80,
          wealthScore: 70,
          growthScore: 75,
          quote: 'Contentment is its own kind of success.',
        },
      },
    ],
    insight: 'Every path has its own beauty and its own burdens. The question is not which path is best, but which path is yours.',
    createdAt: new Date().toISOString(),
  };
}

// Extract year from decision text
function extractYearFromText(text: string): number | null {
  const currentYear = new Date().getFullYear();
  // Match years like 2019, 2020, 2021, etc. (4 digits starting with 19 or 20)
  const yearPattern = /\b(19\d{2}|20\d{2})\b/g;
  const matches = text.match(yearPattern);
  
  if (matches) {
    // Find the most relevant year (prefer years within reasonable range)
    const years = matches.map(y => parseInt(y)).filter(y => y >= 1990 && y <= currentYear + 1);
    if (years.length > 0) {
      // Return the first mentioned year as the decision year
      return years[0];
    }
  }
  return null;
}

export async function generateTimelines(
  decision: string,
  yearsToSimulate: number
): Promise<{ result: Partial<Simulation> }> {
  try {
    // Extract year from decision or use current year
    const extractedYear = extractYearFromText(decision);
    const startYear = extractedYear || new Date().getFullYear();
    
    // Build the prompt
    const systemPrompt = `You are a JSON API. Output ONLY valid JSON, no markdown, no explanation.`;
    
    const userPrompt = `Create 3 alternate life timelines branching from this decision: "${decision}"

IMPORTANT: The decision year is ${startYear}. All events must be CONSECUTIVE years starting from ${startYear}.

CRITICAL RULES FOR EVENTS:
1. Titles must be SHORT (2-5 words max) - like "New Beginnings" or "The Long Winter"
2. NO specific names, places, addresses, or personal details
3. Events must feel UNIVERSAL and RELATABLE - anyone could see themselves in these moments
4. Focus on EMOTIONAL ESSENCE, not specific circumstances
5. Descriptions should capture feelings and themes, not literal play-by-play
6. YEARS MUST BE CONSECUTIVE: ${startYear}, ${startYear + 1}, ${startYear + 2}, etc.

Generate ${yearsToSimulate} events per timeline. Return this exact JSON structure:

{
  "decisionYear": ${startYear},
  "decisionSummary": "Brief universal summary",
  "timelines": [
    {
      "id": "A",
      "name": "The Hard Road",
      "emoji": "🏔️",
      "description": "A challenging path with great rewards",
      "events": [
        {"year": ${startYear}, "title": "Short Title", "description": "Universal emotional description", "mood": "hopeful", "moodScore": 70},
        {"year": ${startYear + 1}, "title": "Next Event", "description": "Description", "mood": "thriving", "moodScore": 75}
      ],
      "finalSnapshot": {
        "career": "General career type (e.g., 'Freelance Creative')",
        "location": "General location (e.g., 'A quiet coastal town')",
        "relationship": "Relationship status",
        "keyAchievement": "Universal achievement",
        "biggestRegret": "Universal regret",
        "happinessScore": 70,
        "wealthScore": 60,
        "growthScore": 80,
        "quote": "Reflective quote"
      }
    }
  ],
  "insight": "Universal philosophical reflection"
}

Mood options: hopeful, thriving, struggling, turning-point, peaceful, chaotic
All scores: 0-100

BAD example (too specific): "Met Sarah at the Blue Moon Café on Oak Street"
GOOD example (universal): "An Unexpected Connection"`;

    // Use Pollinations OpenAI-compatible endpoint
    const url = 'https://gen.pollinations.ai/v1/chat/completions';
    
    console.log('Fetching from Pollinations API...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pk_JheBvIA4tjvHtLnd',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('API request failed:', response.status);
      return { result: generateFallbackTimelines(decision, yearsToSimulate, startYear) };
    }

    // Get response as JSON
    const responseData = await response.json();
    console.log('Response received');
    
    // Extract content from OpenAI response format
    const responseText = responseData.choices?.[0]?.message?.content || '';
    console.log('Content extracted, length:', responseText.length);
    
    // Parse the JSON
    let parsedData: unknown;
    try {
      parsedData = parseJSONFromText(responseText);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return { result: generateFallbackTimelines(decision, yearsToSimulate, startYear) };
    }
    
    // Validate the response structure
    const typedData = parsedData as Partial<PollinationsResponse>;
    
    if (!typedData.timelines || !Array.isArray(typedData.timelines) || typedData.timelines.length === 0) {
      console.error('No timelines in response');
      return { result: generateFallbackTimelines(decision, yearsToSimulate, startYear) };
    }

    // Ensure we have exactly 3 timelines
    let timelines = typedData.timelines;
    while (timelines.length < 3) {
      const fallbackSim = generateFallbackTimelines(decision, yearsToSimulate, startYear);
      timelines.push(fallbackSim.timelines[timelines.length]);
    }
    timelines = timelines.slice(0, 3);

    // Ensure each timeline has required fields
    // FORCE consecutive years - don't trust AI
    timelines = timelines.map((t, idx) => ({
      id: t.id || String.fromCharCode(65 + idx),
      name: t.name || `Timeline ${String.fromCharCode(65 + idx)}`,
      emoji: t.emoji || '✨',
      description: t.description || 'An alternate path',
      events: (t.events || []).slice(0, yearsToSimulate).map((e: Partial<Event>, i: number) => ({
        // FORCE consecutive years starting from startYear
        year: startYear + i,
        title: e.title || 'Life Event',
        description: e.description || 'An important moment',
        mood: e.mood || 'hopeful',
        moodScore: e.moodScore || 50,
      })),
      finalSnapshot: t.finalSnapshot || {
        career: 'Unknown',
        location: 'Unknown',
        relationship: 'Unknown',
        keyAchievement: 'Unknown',
        biggestRegret: 'Unknown',
        happinessScore: 50,
        wealthScore: 50,
        growthScore: 50,
        quote: 'Life is a journey.',
      },
    }));

    console.log('Successfully parsed timelines');
    
    return {
      result: {
        decision,
        decisionYear: typedData.decisionYear || startYear,
        decisionSummary: typedData.decisionSummary || 'A life decision',
        yearsToSimulate,
        timelines,
        insight: typedData.insight || 'Every choice opens doors we\'ll never see closed.',
      },
    };
    
  } catch (error) {
    console.error('Error generating timelines:', error);
    const extractedYear = extractYearFromText(decision);
    return { result: generateFallbackTimelines(decision, yearsToSimulate, extractedYear || undefined) };
  }
}

export async function generateBranch(
  originalDecision: string,
  eventYear: number,
  eventTitle: string,
  eventDescription: string,
  alternateChoice: string,
  yearsToSimulate: number = 3
): Promise<{ events: Event[]; snapshot: FinalSnapshot }> {
  try {
    const systemPrompt = `You are a JSON API. Output ONLY valid JSON, no markdown, no explanation.`;
    
    const userPrompt = `At year ${eventYear}, instead of "${eventTitle}" (${eventDescription}), a different choice was made: "${alternateChoice}"

CRITICAL RULES FOR EVENTS:
1. Titles must be SHORT (2-5 words max)
2. NO specific names, places, addresses, or personal details
3. Events must feel UNIVERSAL and RELATABLE
4. Focus on EMOTIONAL ESSENCE, not specific circumstances
5. Descriptions should capture feelings and themes
6. YEARS MUST BE CONSECUTIVE: ${eventYear}, ${eventYear + 1}, ${eventYear + 2}, etc.

Generate ${yearsToSimulate} events and a final snapshot. Return:

{
  "events": [
    {"year": ${eventYear}, "title": "Short Title", "description": "Universal emotional description", "mood": "hopeful", "moodScore": 70}
  ],
  "finalSnapshot": {
    "career": "General career", "location": "General place", "relationship": "Status",
    "keyAchievement": "Universal achievement", "biggestRegret": "Universal regret",
    "happinessScore": 70, "wealthScore": 60, "growthScore": 75,
    "quote": "Reflective quote"
  }
}

Moods: hopeful, thriving, struggling, turning-point, peaceful, chaotic. Scores: 0-100.`;

    // Use Pollinations OpenAI-compatible endpoint
    const url = 'https://gen.pollinations.ai/v1/chat/completions';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pk_JheBvIA4tjvHtLnd',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error('API failed');

    const responseData = await response.json();
    const responseText = responseData.choices?.[0]?.message?.content || '';
    const parsed = parseJSONFromText(responseText) as { events?: Event[]; finalSnapshot?: FinalSnapshot };
    
    // FORCE consecutive years - don't trust AI
    const events = (parsed.events || []).slice(0, yearsToSimulate).map((e: Partial<Event>, i: number) => ({
      year: eventYear + i,
      title: e.title || 'Event',
      description: e.description || 'An outcome',
      mood: e.mood || 'hopeful',
      moodScore: e.moodScore || 50,
    }));

    const snapshot: FinalSnapshot = parsed.finalSnapshot || {
      career: 'Unknown', location: 'Unknown', relationship: 'Unknown',
      keyAchievement: 'Unknown', biggestRegret: 'Unknown',
      happinessScore: 50, wealthScore: 50, growthScore: 50,
      quote: 'Every choice matters.',
    };

    return { events, snapshot };
    
  } catch (error) {
    console.error('Branch error:', error);
    // Return fallback
    return {
      events: Array.from({ length: yearsToSimulate }, (_, i) => ({
        year: eventYear + i,
        title: i === 0 ? alternateChoice.substring(0, 30) : `New Path ${i + 1}`,
        description: 'Your different choice led to new outcomes.',
        mood: 'hopeful' as const,
        moodScore: 50,
      })),
      snapshot: {
        career: 'Unknown', location: 'Unknown', relationship: 'Unknown',
        keyAchievement: 'Your story continues', biggestRegret: 'Only time will tell',
        happinessScore: 50, wealthScore: 50, growthScore: 50,
        quote: 'Every choice opens new doors.',
      },
    };
  }
}
