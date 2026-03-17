import { useState, useEffect } from 'react'
import './styles/globals.css'
import { LandingPage }   from './pages/LandingPage'
import { DeckDashboard } from './pages/DeckDashboard'
import { HowItWasMade }  from './pages/HowItWasMade'
import { SlideViewer }   from './components/SlideViewer'
import { DeckEditor }    from './features/deck-editor'
import { disneyDeck }    from './data/disney-deck'
import { deckStore }     from './utils/deckStore'
import type { SlideData, ShareMode } from './types/deck'

type Page = 'landing' | 'dashboard' | 'deck' | 'how' | 'editor'

function navigate(path: string) {
  window.history.pushState({}, '', path)
}

export default function App() {
  const [page, setPage]             = useState<Page>('landing')
  const [shareMode, setShareMode]   = useState<ShareMode>('edit')
  const [activeDeck, setActiveDeck] = useState<SlideData[]>(disneyDeck)
  const [deckTitle, setDeckTitle]   = useState('Disney AI Enablement · SIGNAL')
  const [activeDeckId, setActiveDeckId] = useState<string | undefined>()

  // URL-based routing on load + back/forward
  useEffect(() => {
    const sync = () => {
      const path   = window.location.pathname
      const params = new URLSearchParams(window.location.search)
      const mode   = params.get('mode') as ShareMode | null

      if (path === '/dashboard')      setPage('dashboard')
      else if (path === '/how')       setPage('how')
      else if (path === '/editor')    setPage('editor')
      else if (path.startsWith('/deck')) {
        setShareMode(mode ?? 'edit')
        setPage('deck')
      }
      else                            setPage('landing')
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

  // Landing → generate → save to store → dashboard
  const handleDeckGenerated = (slides: SlideData[], title: string) => {
    goTo('dashboard', '/dashboard')
    // Note: deckStore.add() is already called inside LandingPage.generateDeck
    // We still receive slides/title here in case App needs them for immediate open
    setActiveDeck(slides)
    setDeckTitle(title)
  }

  // Dashboard / anywhere → open a deck in the viewer
  const handleOpenDeck = (slides: SlideData[], title: string, deckId?: string) => {
    setActiveDeck(slides)
    setDeckTitle(title)
    setActiveDeckId(deckId)
    setShareMode('edit')
    goTo('deck', '/deck')
  }

  // SlideViewer co-pilot edits → persist back to store
  const handleSlideUpdate = (slides: SlideData[]) => {
    if (activeDeckId) deckStore.update(activeDeckId, slides)
  }

  if (page === 'editor') {
    return <DeckEditor />
  }

  if (page === 'how') {
    return (
      <HowItWasMade
        onBack={() => goTo('dashboard', '/dashboard')}
        onViewDemo={() => handleOpenDeck(disneyDeck, 'Disney AI Enablement · SIGNAL')}
      />
    )
  }

  if (page === 'deck') {
    return (
      <SlideViewer
        slides={activeDeck}
        title={deckTitle}
        mode={shareMode}
        onBack={() => goTo('dashboard', '/dashboard')}
        onSlidesChange={handleSlideUpdate}
        onOpenEditor={() => goTo('editor', '/editor')}
      />
    )
  }

  if (page === 'dashboard') {
    return (
      <DeckDashboard
        onOpenDeck={handleOpenDeck}
        onNewDeck={() => goTo('landing', '/')}
        onHowItsMade={() => goTo('how', '/how')}
      />
    )
  }

  // Default: landing
  return (
    <LandingPage
      onViewDemo={() => handleOpenDeck(disneyDeck, 'Disney AI Enablement · SIGNAL')}
      onHowItsMade={() => goTo('how', '/how')}
      onDeckGenerated={handleDeckGenerated}
    />
  )
}
