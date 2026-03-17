import { useState, useEffect } from 'react'
import './styles/globals.css'
import { LandingPage } from './pages/LandingPage'
import { HowItWasMade } from './pages/HowItWasMade'
import { SlideViewer } from './components/SlideViewer'
import { DeckEditor } from './features/deck-editor'
import type { SlideData, ShareMode } from './types/deck'

type Page = 'landing' | 'deck' | 'how' | 'editor'

// ─── TE Connectivity demo deck (11 slides) ────────────────────────────────────

const teDeck: SlideData[] = [
  {
    id: 'te-cover',
    type: 'cover',
    mode: 'dark',
    eyebrow: 'Sales Enablement',
    title: '500,000 SKUs. One Sales Conversation.',
    body: 'How NTT DATA transforms field sales at TE Connectivity with AI-powered product intelligence.',
    meta: 'NTT DATA · Prepared for TE Connectivity · Confidential',
  },
  {
    id: 'te-challenge-break',
    type: 'section-break',
    mode: 'dark',
    number: '01',
    title: 'The Challenge',
    subtitle: 'Why field sales is broken at scale',
  },
  {
    id: 'te-complexity',
    type: 'narrative',
    mode: 'light',
    eyebrow: 'The problem',
    headline: 'Your reps know connectors. They can\'t know 500,000 of them.',
    body: 'TE Connectivity\'s catalogue spans industrial, aerospace, automotive, and medical — half a million SKUs across 17 product families. Field reps carry 40-page spec sheets and still lose deals because they couldn\'t surface the right part at the right moment. The knowledge exists. It just isn\'t accessible in a customer conversation.',
    pullQuote: 'The knowledge exists. It just isn\'t accessible in a customer conversation.',
  },
  {
    id: 'te-stats',
    type: 'stat-grid',
    mode: 'light',
    eyebrow: 'The scale',
    headline: 'A catalogue too large for any one rep to master',
    stats: [
      { value: '500K+', label: 'Active SKUs', context: 'Across 17 product families' },
      { value: '62%', label: 'Deals lost at spec stage', context: 'Internal sales analysis' },
      { value: '4.2hrs', label: 'Avg. time to correct quote', context: 'Per rep, per opportunity' },
      { value: '$340M', label: 'Addressable pipeline at risk', context: 'North America field sales' },
    ],
  },
  {
    id: 'te-current-future',
    type: 'two-pane',
    mode: 'light',
    eyebrow: 'The gap',
    headline: 'From catalogue lookup to conversational intelligence',
    split: '50/50',
    left: {
      eyebrow: 'Today',
      heading: 'Static, manual, slow',
      bullets: [
        'Rep searches PDF or internal portal',
        'Spec comparison done offline',
        'Wrong part quoted — deal delayed',
        'Manager escalation required',
        'No learning between calls',
      ],
    },
    right: {
      eyebrow: 'With NTT DATA',
      heading: 'Conversational, instant, accurate',
      bullets: [
        'Rep asks in plain language',
        'AI surfaces matching SKUs with context',
        'Quote generated in the conversation',
        'Cross-sell opportunities surfaced',
        'Every interaction improves the model',
      ],
      accent: true,
    },
  },
  {
    id: 'te-solution-break',
    type: 'section-break',
    mode: 'dark',
    number: '02',
    title: 'The Solution',
    subtitle: 'A field-ready AI sales assistant',
  },
  {
    id: 'te-approach',
    type: 'narrative',
    mode: 'light',
    eyebrow: 'Our approach',
    headline: 'A product intelligence layer — not another app.',
    body: 'We don\'t add another tool to the rep\'s workflow. We embed conversational AI into the tools they already use — Salesforce, Teams, mobile. The assistant understands TE\'s full catalogue, cross-references application requirements, flags regulatory constraints, and generates compliant quotes. It runs on a retrieval-augmented architecture fine-tuned on TE\'s own product data, updated continuously.',
  },
  {
    id: 'te-diagram',
    type: 'diagram',
    mode: 'light',
    eyebrow: 'Architecture',
    title: 'How the intelligence layer works',
    placeholder: 'Flow diagram: TE product data → RAG index → AI assistant → Salesforce / Teams / Mobile. Arrows show real-time retrieval and quote generation paths.',
  },
  {
    id: 'te-outcomes',
    type: 'stat-grid',
    mode: 'dark',
    eyebrow: 'Expected outcomes',
    headline: 'What the pilot data shows',
    stats: [
      { value: '3×', label: 'Faster spec-to-quote', context: 'Pilot cohort, Q4 2025' },
      { value: '28%', label: 'Win rate increase', context: 'Competitive accounts' },
      { value: '91%', label: 'Rep satisfaction score', context: 'Post-pilot survey' },
      { value: '6 wks', label: 'Time to first value', context: 'From contract to live' },
    ],
  },
  {
    id: 'te-why-ntt',
    type: 'narrative',
    mode: 'light',
    eyebrow: 'Why NTT DATA',
    headline: 'We\'ve done this for manufacturers like TE before.',
    body: 'NTT DATA has deployed AI sales enablement at scale across industrial manufacturing — including a comparable engagement at a Fortune 100 components supplier. We bring pre-built connectors for Salesforce and SAP, a proprietary RAG framework tuned for technical catalogues, and a team that understands the regulatory and compliance constraints of your sector. The pilot can be live in six weeks.',
  },
  {
    id: 'te-closing',
    type: 'closing',
    mode: 'dark',
    eyebrow: 'Next steps',
    headline: 'Let\'s run a six-week pilot on your top 20 reps.',
    cta: 'Schedule a working session',
    contact: 'signal@nttdata.com',
  },
]

// ─── App ──────────────────────────────────────────────────────────────────────

function navigate(path: string) {
  window.history.pushState({}, '', path)
}

export default function App() {
  const [page, setPage]         = useState<Page>('landing')
  const [shareMode, setShareMode] = useState<ShareMode>('edit')
  const [activeDeck, setActiveDeck] = useState<SlideData[]>(teDeck)
  const [deckTitle, setDeckTitle]   = useState('TE Connectivity · SIGNAL')

  // Handle initial URL on load + popstate
  useEffect(() => {
    const handle = () => {
      const path = window.location.pathname
      if (path === '/editor') {
        setPage('editor')
      } else if (path === '/how') {
        setPage('how')
      } else if (path.startsWith('/view')) {
        const mode = path.includes('review') ? 'review' : path.includes('present') ? 'present' : 'edit'
        setShareMode(mode as ShareMode)
        setPage('deck')
      } else {
        setPage('landing')
      }
    }
    handle()
    window.addEventListener('popstate', handle)
    return () => window.removeEventListener('popstate', handle)
  }, [])

  const goTo = (p: Page, path: string) => {
    navigate(path)
    setPage(p)
  }

  const handleDeckGenerated = (slides: SlideData[], title: string) => {
    setActiveDeck(slides)
    setDeckTitle(title)
    setShareMode('edit')
    goTo('deck', '/view')
  }

  const handleViewDemo = () => {
    setActiveDeck(teDeck)
    setDeckTitle('TE Connectivity · SIGNAL')
    setShareMode('edit')
    goTo('deck', '/view')
  }

  if (page === 'editor') {
    return <DeckEditor />
  }

  if (page === 'deck') {
    return (
      <SlideViewer
        slides={activeDeck}
        title={deckTitle}
        mode={shareMode}
        onBack={() => goTo('landing', '/')}
      />
    )
  }

  if (page === 'how') {
    return (
      <HowItWasMade
        onBack={() => goTo('landing', '/')}
        onViewDemo={handleViewDemo}
      />
    )
  }

  return (
    <LandingPage
      onViewDemo={handleViewDemo}
      onHowItsMade={() => goTo('how', '/how')}
      onDeckGenerated={handleDeckGenerated}
    />
  )
}
