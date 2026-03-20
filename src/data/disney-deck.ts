import type { SlideData } from '../types/deck'

export const disneyDeck: SlideData[] = [

  // ── 1. COVER ─────────────────────────────────────────────────────────────
  {
    id: 'disney-cover',
    type: 'cover',
    mode: 'dark',
    layout: 'standard',
    eyebrow: 'Enterprise AI Enablement',
    title: 'The intelligence layer Disney\'s experience deserves.',
    subtitle: 'A platform to unify guest data across parks, streaming, and retail — and put it to work.',
    meta: 'Launch by NTT DATA · Prepared for Disney · March 2026 · Confidential',
    notes: 'Cover slide. Open with: "Before I start — tell me what\'s driving this conversation internally right now." Let them frame the problem in their own words. Then begin.',
  },

  // ── 2. THE CHALLENGE ─────────────────────────────────────────────────────
  {
    id: 'disney-challenge',
    type: 'narrative',
    mode: 'light',
    eyebrow: 'The challenge',
    headline: 'Disney captures extraordinary data. It rarely reaches the guests who need it most.',
    body: 'Parks, streaming, retail, and live events generate billions of behavioral signals every day. But siloed systems mean personalization stays surface-level — a recommendation engine that doesn\'t know you just waited 90 minutes in the rain for the same ride it\'s about to suggest again.',
    pullQuote: 'The data exists. The connection doesn\'t.',
    notes: 'Problem slide. Goal: make them nod before you advance. Ask: "Does this match what you\'re seeing internally?" Pause. Let the room sit with it. The pull quote is your anchor — reference it again in the closing.',
  },

  // ── 3. POLL — OPENER ─────────────────────────────────────────────────────
  {
    id: 'disney-poll-opener',
    type: 'poll',
    mode: 'dark',
    eyebrow: 'PULSE CHECK',
    poll: {
      question: 'How would you describe Disney\'s current cross-platform personalization capability?',
      type: 'multiple-choice',
      options: [
        'We personalize well within each business unit',
        'We\'re connecting 2–3 units but it\'s early',
        'We have a roadmap but haven\'t started connecting data',
        'This is largely unsolved and it\'s a known gap',
      ],
      allowMultiple: false,
    },
    notes: 'Poll 1 — Opener. Run after the challenge slide. Give the room 30 seconds. Acknowledge the result: "Interesting — so most of you are saying..." Reference this again in the closing. This data calibrates how you pitch the solution.',
  },

  // ── 4. THE SCALE ─────────────────────────────────────────────────────────
  {
    id: 'disney-scale',
    type: 'stat-grid',
    mode: 'light',
    eyebrow: 'The scale of the opportunity',
    headline: 'Disney\'s data advantage is real — and largely untapped.',
    buildSteps: 4,
    stats: [
      { value: '1.9B+', label: 'Annual park visits', context: 'Across 12 global destinations' },
      { value: '238M+', label: 'Disney+ subscribers', context: 'Active streaming behavioral data' },
      { value: '$88B',  label: 'Annual revenue', context: 'Across all business units' },
      { value: '< 12%', label: 'Cross-platform personalization', context: 'Current internal estimate' },
    ],
    notes: 'Stats slide. Build is enabled — stats reveal one at a time. Lead with 1.9B. Pause after the 12% stat: "Less than 12% of available signal is being used. At Disney\'s scale, that gap has a number." Let them do the math.',
  },

  // ── 5. FULL-BLEED STATEMENT ───────────────────────────────────────────────
  {
    id: 'disney-statement',
    type: 'full-bleed',
    mode: 'dark',
    statement: 'The guest who streams, visits, and shops is one person. It\'s time to treat them that way.',
    accentWord: 'one person',
    notes: 'Full-bleed statement. Hold this slide for 5 full seconds. No talking. Let it land. This is the pivot from problem to solution — don\'t rush it.',
  },

  // ── 6. SECTION BREAK — PLATFORM ──────────────────────────────────────────
  {
    id: 'disney-section-platform',
    type: 'section-break',
    mode: 'dark',
    number: '01',
    title: 'The Guest Intelligence Platform',
    subtitle: 'Unify the data. Personalize the experience. Measure what changes.',
    buildSteps: 2,
    notes: 'Section intro. Build: number appears, then title + subtitle. Set up the three-layer architecture before advancing.',
  },

  // ── 7. CURRENT STATE DIAGRAM ──────────────────────────────────────────────
  {
    id: 'disney-data-landscape',
    type: 'diagram',
    mode: 'light',
    eyebrow: 'Current state',
    title: 'Four business units. Four data silos. One missed guest.',
    placeholder: 'Generate this diagram: Four disconnected boxes labeled Parks, Streaming, Retail, Live Events — each pointing down to a central box labeled "Surface-level personalization". No connections between the four source boxes. Dark background, blue nodes, gold accent on central box. SIGNAL brand style.',
    context: 'Disney enterprise data architecture showing four siloed business units (Parks, Streaming, Retail, Live Events) with no cross-platform data connections, all feeding into a limited personalization layer',
    notes: 'Diagram slide. Click "AI graphic co-pilot" and paste the placeholder text to generate the architecture diagram. The visual shows the problem — four inputs, no interconnection.',
  },

  // ── 8. OUR APPROACH ──────────────────────────────────────────────────────
  {
    id: 'disney-approach',
    type: 'two-pane',
    mode: 'light',
    split: '60/40',
    buildSteps: 1,
    left: {
      eyebrow: 'The platform architecture',
      heading: 'Three layers. Built in sequence.',
      body: 'Each layer delivers standalone value before the next begins. No single point of failure. No bet-everything moment.',
      bullets: [
        'Layer 1 — Unified Guest Profile: cross-platform identity resolution',
        'Layer 2 — Real-Time Context Engine: in-park signals + streaming history + mood inference',
        'Layer 3 — Experience Orchestration: personalized moments, automated and human-assisted',
      ],
    },
    right: {
      eyebrow: 'Why now',
      heading: 'The window is closing.',
      body: 'Competitors are consolidating data infrastructure. Disney\'s moat is content and physical experience — but that moat only deepens if the intelligence layer catches up.',
      accent: true,
    },
    notes: 'Two-pane. Build enabled: left pane appears first. Walk through all three layers. Then reveal the right pane. The "why now" urgency lands harder after the audience has seen the architecture.',
  },

  // ── 9. CASE STUDY — CHALLENGE ────────────────────────────────────────────
  {
    id: 'disney-case-challenge',
    type: 'narrative',
    mode: 'light',
    eyebrow: 'Proof of concept',
    headline: 'A global entertainment brand. 88B in revenue. Zero unified guest view.',
    body: 'The client had behavioral data across parks, streaming, and retail — but no way to connect it. Personalization was siloed by business unit. Guests received suggestions for rides they\'d already ridden, content they\'d already watched, and products they\'d already bought. The data existed. The architecture to use it didn\'t.',
    notes: 'Case study 1 of 3. Problem only — don\'t preview the solution. Ask: "Sound familiar?" before advancing. The pause is intentional.',
  },

  // ── 10. CASE STUDY — WHAT WE DID ─────────────────────────────────────────
  {
    id: 'disney-case-approach',
    type: 'narrative',
    mode: 'light',
    eyebrow: 'What we built',
    headline: 'We connected the data. Then we let the experience do the work.',
    body: 'Six-week data audit across four siloed platforms. Unified guest profile schema with real-time context ingestion. Proof-of-concept personalization loop tested in a single park region. Phase 2 roadmap scoped for enterprise-wide rollout — delivered in week 10.',
    pullQuote: 'We didn\'t replace their systems. We connected them.',
    notes: 'Case study 2 of 3. Keep this tight. The outcome slide does the real work — don\'t oversell the method here.',
  },

  // ── 11. CASE STUDY — OUTCOME ─────────────────────────────────────────────
  {
    id: 'disney-case-outcome',
    type: 'stat-grid',
    mode: 'light',
    eyebrow: 'The outcome',
    headline: 'Phase 1 proof-of-concept. Phase 2 approved within 8 weeks.',
    buildSteps: 3,
    stats: [
      { value: '3–5%', label: 'Projected sales unlock', context: 'From personalized recommendations at scale' },
      { value: '90 days', label: 'Kickoff to working POC', context: 'Delivered within Phase 1 scope' },
      { value: 'Ph. 2', label: 'Enterprise rollout approved', context: '8 weeks after Phase 1 close' },
    ],
    notes: 'Case study 3 of 3. Build enabled — stats reveal one at a time. Pause after the first stat. Ask: "Does a 3–5% revenue unlock matter at Disney scale?" At $88B revenue, 3% = $2.6B. Say that if needed.',
  },

  // ── 12. POLL — DIAGNOSTIC ─────────────────────────────────────────────────
  {
    id: 'disney-poll-diagnostic',
    type: 'poll',
    mode: 'dark',
    eyebrow: 'DIAGNOSTIC',
    poll: {
      question: 'What\'s your biggest barrier to a unified guest intelligence platform right now?',
      type: 'multiple-choice',
      options: [
        'Data is siloed — we can\'t get a unified view across business units',
        'We have the data but lack the infrastructure to act on it in real time',
        'No clear executive mandate to prioritize this above other roadmap items',
        'We don\'t know which signals actually move guest satisfaction',
      ],
      allowMultiple: false,
    },
    notes: 'Poll 2 — Diagnostic. Run before the roadmap slide. Results tell you which part of the solution to emphasize. Reference directly in closing: "Given that most of you said [result], here\'s how Phase 1 addresses that specifically."',
  },

  // ── 13. SECTION BREAK — ROADMAP ───────────────────────────────────────────
  {
    id: 'disney-section-roadmap',
    type: 'section-break',
    mode: 'dark',
    number: '02',
    title: 'Engagement Roadmap',
    subtitle: 'Three phases. 18 months. Measurable outcomes at every gate.',
    buildSteps: 2,
    notes: 'Section intro. Build: number first, then title. Set context: "Today we\'re only asking you to commit to Phase 1."',
  },

  // ── 14. ROADMAP DIAGRAM ───────────────────────────────────────────────────
  {
    id: 'disney-roadmap',
    type: 'diagram',
    mode: 'light',
    eyebrow: '18-month roadmap',
    title: 'Phase-gated delivery with clear outcomes at every gate.',
    placeholder: 'Generate this diagram: Horizontal 3-phase roadmap. Phase 1: "Discovery & Architecture" (10 weeks). Gate 1: "Signal Validated". Phase 2: "Platform Build" (6 months). Gate 2: "POC Approved". Phase 3: "Scale & Optimize" (ongoing). Blue boxes for phases, gold diamonds for gates. Timeline bar below each phase. Left-to-right flow. SIGNAL brand style.',
    context: 'Three-phase project roadmap for Disney AI Guest Intelligence Platform with gate checkpoints between each phase',
    notes: 'Roadmap diagram. Click "AI graphic co-pilot" and paste the placeholder text. Walk through Phase 1 in detail. Phases 2 and 3 are the vision — the ask is Phase 1 only.',
  },

  // ── 15. INVESTMENT SUMMARY ────────────────────────────────────────────────
  {
    id: 'disney-investment',
    type: 'stat-grid',
    mode: 'dark',
    eyebrow: 'Investment summary',
    headline: 'Three phases. One committed partnership.',
    buildSteps: 3,
    stats: [
      { value: 'Ph. 1', label: 'Discovery + Architecture', context: '10 weeks · Data audit, unified profile design, identity resolution POC' },
      { value: 'Ph. 2', label: 'Platform Build', context: '6 months · Context engine, real-time ingestion, first personalization loop' },
      { value: 'Ph. 3', label: 'Scale + Optimize', context: 'Ongoing · Experience orchestration, global rollout, continuous learning' },
    ],
    notes: 'Investment slide. Build enabled — phases reveal one at a time. "Today, we\'re only asking you to commit to Phase 1. Under $300K. 10 weeks. If it doesn\'t prove the model, you don\'t continue. That\'s the deal."',
  },

  // ── 16. CLOSING ───────────────────────────────────────────────────────────
  {
    id: 'disney-closing',
    type: 'closing',
    mode: 'dark',
    layout: 'standard',
    headline: 'Let\'s build the intelligence layer Disney\'s experience deserves.',
    cta: 'Schedule a working session',
    ctaUrl: 'https://cal.com',
    ctaTarget: '_blank',
    contact: 'launch.nttdata.com · hello@launch.nttdata.com',
    notes: 'Closing. Calibrate the ask to poll 2 results. If data infrastructure was the top blocker: "Phase 1 is specifically scoped to solve that first." If executive mandate was the issue: "First call is free. Let us help you build the internal case." Always close with a specific next step — never with "any questions?"',
  },
]
