import { useState, useEffect, lazy, Suspense } from 'react'
import './styles/globals.css'
import { StagingBanner }  from './components/StagingBanner'
import { LandingPage }    from './pages/LandingPage'
import { AudienceView }   from './components/AudienceView'
import { disneyDeck, disneyDeckMeta } from './data/disney-deck'
import { deckStore }      from './utils/deckStore'
import type { SlideData, ShareMode, DeckMeta } from './types/deck'

const DECK_META_KEY = 'signal-deck-meta'

function loadDeckMeta(): DeckMeta {
  try {
    const raw = localStorage.getItem(DECK_META_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return disneyDeckMeta
}

// Everything except LandingPage + AudienceView is lazy-loaded
const DeckDashboard = lazy(() =>
  import('./pages/DeckDashboard').then(m => ({ default: m.DeckDashboard }))
)
const HowItWasMade = lazy(() =>
  import('./pages/HowItWasMade').then(m => ({ default: m.HowItWasMade }))
)
const SlideViewer = lazy(() =>
  import('./components/SlideViewer').then(m => ({ default: m.SlideViewer }))
)
const DeckEditor = lazy(() =>
  import('./features/deck-editor').then(m => ({ default: m.DeckEditor }))
)

type Page = 'landing' | 'dashboard' | 'deck' | 'how' | 'editor' | 'audience'

function navigate(path: string) {
  window.history.pushState({}, '', path)
}

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#111113',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 32, height: 32,
          border: '2px solid #1E5AF2',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <span style={{
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.1em', color: '#333',
          textTransform: 'uppercase',
        }}>
          SIGNAL
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage]             = useState<Page>('landing')
  const [shareMode, setShareMode]   = useState<ShareMode>('edit')
  const [activeDeck, setActiveDeck] = useState<SlideData[]>(disneyDeck)
  const [deckTitle, setDeckTitle]   = useState('Disney AI Enablement · SIGNAL')
  const [activeDeckId, setActiveDeckId] = useState<string | undefined>()
  const [deckMeta, setDeckMeta]     = useState<DeckMeta>(loadDeckMeta)

  const handleDeckMetaChange = (meta: DeckMeta) => {
    setDeckMeta(meta)
    try { localStorage.setItem(DECK_META_KEY, JSON.stringify(meta)) } catch { /* ignore */ }
  }

  // URL-based routing on load + back/forward
  useEffect(() => {
    const sync = () => {
      const path   = window.location.pathname
      const params = new URLSearchParams(window.location.search)
      const mode   = params.get('mode') as ShareMode | null

      // Audience view — opened by PresentMode in a popup
      if (params.get('mode') === 'audience') {
        setPage('audience')
        return
      }

      if (path === '/dashboard')        setPage('dashboard')
      else if (path === '/how')         setPage('how')
      else if (path === '/editor')      setPage('editor')
      else if (path.startsWith('/deck')) {
        setShareMode(mode ?? 'edit')
        setPage('deck')
      }
      else                              setPage('landing')
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const goTo = (p: Page, path: string, mode?: ShareMode) => {
    navigate(path)
    if (mode) setShareMode(mode)
    setPage(p)
  }

  const handleDeckGenerated = (slides: SlideData[], title: string, meta?: DeckMeta) => {
    goTo('dashboard', '/dashboard')
    setActiveDeck(slides)
    setDeckTitle(title)
    if (meta) handleDeckMetaChange(meta)
  }

  const handleOpenDeck = (slides: SlideData[], title: string, deckId?: string, meta?: DeckMeta) => {
    setActiveDeck(slides)
    setDeckTitle(title)
    setActiveDeckId(deckId)
    setShareMode('edit')
    if (meta) handleDeckMetaChange(meta)
    goTo('deck', '/deck')
  }

  const handleSlideUpdate = (slides: SlideData[]) => {
    if (activeDeckId) deckStore.update(activeDeckId, slides)
  }

  // Audience view — clean popup, no StagingBanner
  if (page === 'audience') {
    return <AudienceView />
  }

  if (page === 'editor') {
    return (
      <Suspense fallback={<PageLoader />}>
        <StagingBanner />
        <DeckEditor />
      </Suspense>
    )
  }

  if (page === 'how') {
    return (
      <Suspense fallback={<PageLoader />}>
        <StagingBanner />
        <HowItWasMade
          onBack={() => goTo('dashboard', '/dashboard')}
          onViewDemo={() => handleOpenDeck(disneyDeck, 'Disney AI Enablement · SIGNAL', undefined, disneyDeckMeta)}
        />
      </Suspense>
    )
  }

  if (page === 'deck') {
    return (
      <Suspense fallback={<PageLoader />}>
        <StagingBanner />
        <SlideViewer
          slides={activeDeck}
          title={deckTitle}
          mode={shareMode}
          deckMeta={deckMeta}
          onDeckMetaChange={handleDeckMetaChange}
          onBack={() => goTo('dashboard', '/dashboard')}
          onSlidesChange={handleSlideUpdate}
          onOpenEditor={() => goTo('editor', '/editor')}
        />
      </Suspense>
    )
  }

  if (page === 'dashboard') {
    return (
      <Suspense fallback={<PageLoader />}>
        <StagingBanner />
        <DeckDashboard
          onOpenDeck={handleOpenDeck}
          onNewDeck={() => goTo('landing', '/')}
          onHowItsMade={() => goTo('how', '/how')}
        />
      </Suspense>
    )
  }

  // Landing page — NO Suspense needed, loads eagerly
  return (
    <>
      <StagingBanner />
      <LandingPage
        onViewDemo={() => handleOpenDeck(disneyDeck, 'Disney AI Enablement · SIGNAL', undefined, disneyDeckMeta)}
        onHowItsMade={() => goTo('how', '/how')}
        onDeckGenerated={handleDeckGenerated}
      />
    </>
  )
}
