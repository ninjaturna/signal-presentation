import { useState, useEffect, useCallback } from 'react'
import { colors } from '../design-system'
import { renderSlide } from '../utils/renderSlide'
import { ChatPanel } from './ChatPanel'
import { EditPanel } from './EditPanel'
import { ShareMenu } from './ShareMenu'
import { CommentSidebar } from './CommentSidebar'
import { GdprBanner } from './GdprBanner'
import { ThemePanel } from './ThemePanel'
import type { TransitionType } from './ThemePanel'
import { InsertPollModal } from './InsertPollModal'
import { DiagramFromTextPanel } from './DiagramFromTextPanel'
import { triggerPrintExport } from './PrintExport'
import { DECK_THEMES } from '../design-system/themes'
import type { DeckTheme } from '../design-system/themes'
import { useUndoHistory } from '../hooks/useUndoHistory'
import type { SlideData, ShareMode } from '../types/deck'

// ─── PdfButton sub-component ───────────────────────────────────────────────

function PdfButton({ slides, title }: { slides: SlideData[]; title: string }) {
  const [pdfLoading, setPdfLoading] = useState(false)

  const handlePdfExport = () => {
    setPdfLoading(true)
    setTimeout(() => {
      triggerPrintExport(slides, title)
      setTimeout(() => setPdfLoading(false), 3500)
    }, 50)
  }

  return (
    <button
      onClick={handlePdfExport}
      disabled={pdfLoading}
      title="Export all slides as PDF"
      style={{
        background: 'transparent',
        border: `1px solid ${colors.borderDark}`,
        borderRadius: 6, padding: '4px 12px',
        fontSize: 12, fontWeight: 600,
        color: pdfLoading ? colors.mutedLight : colors.mutedDark,
        cursor: pdfLoading ? 'default' : 'pointer',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        transition: 'all 0.15s',
        minWidth: 72,
        opacity: pdfLoading ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (!pdfLoading) {
          e.currentTarget.style.color = '#FFFFFF'
          e.currentTarget.style.borderColor = colors.blue
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = pdfLoading ? colors.mutedLight : colors.mutedDark
        e.currentTarget.style.borderColor = colors.borderDark
      }}
    >
      {pdfLoading ? 'Preparing…' : '↓ PDF'}
    </button>
  )
}

// ─── Props ─────────────────────────────────────────────────────────────────

interface SlideViewerProps {
  slides: SlideData[]
  title?: string
  mode?: ShareMode
  deckId?: string
  onBack?: () => void
  onSlidesChange?: (slides: SlideData[]) => void
  onOpenEditor?: () => void
}

// ─── Main component ────────────────────────────────────────────────────────

export function SlideViewer({
  slides: initialSlides,
  title = 'SIGNAL',
  mode = 'edit',
  deckId,
  onBack,
  onSlidesChange,
}: SlideViewerProps) {
  const { current: slides, push: pushSlides, undo, redo, canUndo, canRedo } = useUndoHistory<SlideData[]>(initialSlides)
  const [current, setCurrent]             = useState(0)
  const [showChat, setShowChat]           = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showShare, setShowShare]         = useState(false)
  const [showTheme, setShowTheme]               = useState(false)
  const [showPollModal, setShowPollModal]       = useState(false)
  const [activeTransition, setActiveTransition]   = useState<TransitionType>('fade')
  const [diagramSourceText, setDiagramSourceText] = useState<string | null>(null)
  const [activeTheme, setActiveTheme]     = useState<DeckTheme>(DECK_THEMES[0])
  const [isFullscreen, setIsFullscreen]   = useState(false)
  const [trackingEnabled, setTrackingEnabled] = useState(false)

  // Mode flags
  const canEdit     = mode === 'edit'
  const isReview    = mode === 'review'
  const isPresent   = mode === 'present'
  const canTextEdit = canEdit || isReview   // review can still fix copy

  // Stable key for comment / tracking storage
  const deckKey = deckId ?? (slides[0]?.id ?? 'default')

  const slide = slides[current]

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(slides.length - 1, index)))
  }, [slides.length])

  const updateSlide = useCallback((id: string, patch: Partial<SlideData>) => {
    const next = slides.map(s => s.id === id ? { ...s, ...patch } : s)
    pushSlides(next)
    onSlidesChange?.(next)
  }, [slides, pushSlides, onSlidesChange])

  const resetDiagrams = useCallback(() => {
    const next = slides.map(s => s.type === 'diagram' ? { ...s, svgContent: undefined } : s)
    pushSlides(next)
  }, [slides, pushSlides])

  const insertPollAfterCurrent = useCallback((pollSlide: SlideData) => {
    const next = [...slides.slice(0, current + 1), pollSlide, ...slides.slice(current + 1)]
    pushSlides(next)
    onSlidesChange?.(next)
    setCurrent(current + 1)
    setShowPollModal(false)
  }, [slides, current, pushSlides, onSlidesChange])

  const insertDiagramSlide = useCallback((svgContent: string) => {
    const newSlide: SlideData = {
      id: `diagram-${Date.now()}`,
      type: 'diagram',
      mode: 'dark',
      svgContent,
    }
    const next = [...slides.slice(0, current + 1), newSlide, ...slides.slice(current + 1)]
    pushSlides(next)
    onSlidesChange?.(next)
    setCurrent(current + 1)
    setDiagramSourceText(null)
  }, [slides, current, pushSlides, onSlidesChange])

  // Engagement tracking — store slide view timestamps when consent given
  useEffect(() => {
    if (!trackingEnabled || !isPresent) return
    const key = `signal_engagement_${deckKey}`
    const entry = { slide: current, title: slide?.title ?? slide?.headline ?? slide?.type, ts: Date.now() }
    try {
      const raw = localStorage.getItem(key)
      const log: object[] = raw ? JSON.parse(raw) : []
      log.push(entry)
      localStorage.setItem(key, JSON.stringify(log))
    } catch { /* noop */ }
  }, [current, trackingEnabled, isPresent, deckKey])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      // Undo/redo — edit mode only
      if (canEdit && e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
        return
      }

      if (showChat) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault()
          goTo(current + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          goTo(current - 1)
          break
        case 'f':
        case 'F':
          if (!document.fullscreenElement) document.documentElement.requestFullscreen()
          else document.exitFullscreen()
          break
        case 'c':
        case 'C':
          if (canEdit) setShowChat(v => !v)
          break
        case 'r':
        case 'R':
          if (canEdit) resetDiagrams()
          break
        case 'Escape':
          setShowShare(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo, canEdit, showChat, resetDiagrams, undo, redo])

  // Fullscreen sync
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Diagram-from-text trigger from EditableText badge
  useEffect(() => {
    if (!canEdit) return
    const handler = (e: Event) => {
      const text = (e as CustomEvent<{ text: string }>).detail?.text
      if (text) setDiagramSourceText(text)
    }
    window.addEventListener('signal:diagram-request', handler)
    return () => window.removeEventListener('signal:diagram-request', handler)
  }, [canEdit])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: '#0c0c0e',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Top bar */}
      {!isFullscreen && (
        <div data-no-print style={{
          height: 48, flexShrink: 0,
          display: 'flex', alignItems: 'center',
          padding: '0 16px',
          borderBottom: `1px solid ${isReview ? '#FFCC2D33' : colors.borderDark}`,
          background: '#111113',
          gap: 12,
        }}>
          {/* Left: back + undo/redo + logo + title */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  background: 'transparent', border: 'none',
                  fontSize: 18, color: colors.mutedDark, cursor: 'pointer',
                  lineHeight: 1, padding: 0, fontFamily: 'system-ui', flexShrink: 0,
                }}
                title="Back to home"
              >
                ‹
              </button>
            )}

            {/* Undo/redo — edit mode only */}
            {canEdit && (
              <>
                <button onClick={undo} disabled={!canUndo} title="Undo (⌘Z)" style={undoRedoBtn(!canUndo)}>↩</button>
                <button onClick={redo} disabled={!canRedo} title="Redo (⌘⇧Z)" style={undoRedoBtn(!canRedo)}>↪</button>
              </>
            )}

            <span style={{ color: colors.blue, letterSpacing: '0.06em', fontSize: 11 }}>SIGNAL</span>
            <span style={{ color: colors.borderDark }}>·</span>
            <span style={{ fontSize: 12, color: colors.mutedDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>

            {/* Review mode badge */}
            {isReview && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                color: '#111113', background: '#FFCC2D',
                borderRadius: 3, padding: '2px 7px',
                textTransform: 'uppercase', flexShrink: 0,
              }}>
                Review — view &amp; comment only
              </span>
            )}
          </div>

          {/* Slide counter */}
          <div style={{ fontSize: 12, color: colors.mutedLight, letterSpacing: '0.02em' }}>
            {current + 1} / {slides.length}
          </div>

          {/* Controls — varies by mode */}
          {!isPresent && (
            <div style={{ display: 'flex', gap: 4 }}>
              {/* Edit mode controls */}
              {canEdit && (
                <>
                  <button
                    onClick={() => setShowChat(v => !v)}
                    title="Toggle chat (C)"
                    style={topBarBtn(showChat)}
                  >
                    ✦ Co-pilot
                  </button>
                  <button
                    onClick={() => { setShowEditPanel(v => !v); setShowChat(false) }}
                    title="Toggle edit panel"
                    style={{
                      background: showEditPanel ? colors.blue : 'transparent',
                      border: `1px solid ${showEditPanel ? colors.blue : colors.borderDark}`,
                      borderRadius: 6, padding: '4px 12px',
                      fontSize: 12, fontWeight: 600,
                      color: showEditPanel ? '#FFFFFF' : colors.mutedDark,
                      cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      transition: 'all 0.15s',
                    }}
                  >
                    {showEditPanel ? '✕ Exit edit mode' : 'Edit mode'}
                  </button>
                  <button
                    onClick={() => setShowTheme(v => !v)}
                    title="Change theme"
                    style={topBarBtn(showTheme)}
                  >
                    ◑ Theme
                  </button>
                  <button
                    onClick={() => setShowPollModal(true)}
                    title="Insert a poll slide after this slide"
                    style={topBarBtn(false)}
                  >
                    + Poll
                  </button>
                  <PdfButton slides={slides} title={title} />
                  <ShareMenu open={showShare} onToggle={() => setShowShare(v => !v)} />
                </>
              )}

              {/* Review mode controls — just Share */}
              {isReview && (
                <ShareMenu open={showShare} onToggle={() => setShowShare(v => !v)} />
              )}
            </div>
          )}

          {/* Fullscreen button — all modes */}
          <button
            onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}
            title="Fullscreen (F)"
            style={topBarBtn(false)}
          >
            {isFullscreen ? '⤢' : '⤡'}
          </button>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Slide stage */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: isFullscreen ? 0 : '24px 32px',
          background: '#0c0c0e',
          position: 'relative',
        }}>
          <div data-slide={current} style={{
            width: '100%',
            maxWidth: isFullscreen ? '100vw' : 'min(calc(100% - 0px), calc((100vh - 96px) * 16/9))',
            boxShadow: isFullscreen ? 'none' : '0 4px 32px rgba(0,0,0,0.6)',
            borderRadius: isFullscreen ? 0 : 4,
            overflow: 'hidden',
          }}>
            <div
              key={current}
              style={{ animation: getTransitionAnimation(activeTransition), width: '100%', height: '100%' }}
            >
              {renderSlide(slide, {
                editable: canTextEdit,
                onUpdate: (patch) => updateSlide(slide.id, patch),
                theme: activeTheme.tokens,
              })}
            </div>
          </div>

          {/* Prev / next arrows */}
          {!isFullscreen && (
            <>
              <button data-no-print onClick={() => goTo(current - 1)} disabled={current === 0} style={navArrow('left')}>‹</button>
              <button data-no-print onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} style={navArrow('right')}>›</button>
            </>
          )}
        </div>

        {/* Edit panel — edit mode only */}
        {canEdit && showEditPanel && (
          <div data-no-print style={{ display: 'flex', height: '100%' }}>
            <EditPanel
              slide={slide}
              onUpdate={(patch) => updateSlide(slide.id, patch)}
              onClose={() => setShowEditPanel(false)}
              onResetDiagrams={resetDiagrams}
              onInsertDiagram={(svg) => {
                if (slide.type === 'diagram') {
                  updateSlide(slide.id, { svgContent: svg })
                } else {
                  insertDiagramSlide(svg)
                }
              }}
              onInsertPoll={(poll) => {
                const newSlide: SlideData = {
                  id: `poll-${Date.now()}`,
                  type: 'poll',
                  mode: 'dark',
                  eyebrow: 'AUDIENCE POLL',
                  poll,
                }
                const next = [...slides.slice(0, current + 1), newSlide, ...slides.slice(current + 1)]
                pushSlides(next)
                onSlidesChange?.(next)
                setCurrent(current + 1)
              }}
            />
          </div>
        )}

        {/* Chat panel — edit mode only, when edit panel closed */}
        {canEdit && showChat && !showEditPanel && (
          <div data-no-print style={{ display: 'flex', height: '100%' }}>
            <ChatPanel
              slide={slide}
              onUpdate={(patch) => updateSlide(slide.id, patch)}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}

        {/* Diagram-from-text panel — edit mode, triggered by EditableText badge */}
        {canEdit && diagramSourceText && (
          <div data-no-print style={{ display: 'flex', height: '100%' }}>
            <DiagramFromTextPanel
              sourceText={diagramSourceText}
              onInsert={insertDiagramSlide}
              onClose={() => setDiagramSourceText(null)}
            />
          </div>
        )}

        {/* Comment sidebar — review mode */}
        {isReview && (
          <div data-no-print style={{ display: 'flex', height: '100%' }}>
            <CommentSidebar deckKey={deckKey} slideIndex={current} />
          </div>
        )}
      </div>

      {/* Bottom dot nav */}
      {!isFullscreen && !isPresent && (
        <div data-no-print style={{
          height: 40, flexShrink: 0,
          background: '#111113',
          borderTop: `1px solid ${colors.borderDark}`,
          display: 'flex', alignItems: 'center',
          padding: '0 20px', gap: 6,
          justifyContent: 'center',
        }}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              title={s.title ?? s.headline ?? s.statement ?? s.type}
              style={{
                width: i === current ? 20 : 6, height: 6,
                borderRadius: 3,
                background: i === current
                  ? (isReview ? '#FFCC2D' : colors.blue)
                  : colors.borderDark,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.2s', flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Theme panel — edit mode only, fixed overlay */}
      {canEdit && showTheme && (
        <ThemePanel
          currentThemeId={activeTheme.id}
          onSelect={theme => { setActiveTheme(theme); setShowTheme(false) }}
          onClose={() => setShowTheme(false)}
          activeTransition={activeTransition}
          onTransitionChange={t => setActiveTransition(t)}
        />
      )}

      {/* Insert poll modal — edit mode only */}
      {canEdit && showPollModal && (
        <InsertPollModal
          onInsert={insertPollAfterCurrent}
          onClose={() => setShowPollModal(false)}
        />
      )}

      {/* GDPR banner — present mode only */}
      {isPresent && (
        <GdprBanner
          onAccept={() => setTrackingEnabled(true)}
          onDecline={() => setTrackingEnabled(false)}
        />
      )}
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function undoRedoBtn(disabled: boolean): React.CSSProperties {
  return {
    background: 'transparent', border: 'none',
    padding: '2px 4px', fontSize: 16,
    color: disabled ? '#2a2a2a' : '#555',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.3 : 1,
    lineHeight: 1, fontFamily: 'system-ui', flexShrink: 0,
  }
}

function topBarBtn(active: boolean): React.CSSProperties {
  return {
    background: active ? colors.blue : 'transparent',
    border: `1px solid ${active ? colors.blue : colors.borderDark}`,
    borderRadius: 6, padding: '4px 12px',
    fontSize: 12, fontWeight: 600,
    color: active ? '#FFFFFF' : colors.mutedDark,
    cursor: 'pointer',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    transition: 'all 0.15s',
  }
}

function getTransitionAnimation(type: TransitionType): string {
  switch (type) {
    case 'fade':       return 'signal-fade 0.3s ease'
    case 'slide-left': return 'signal-slide-left 0.3s ease'
    case 'zoom':       return 'signal-zoom 0.25s ease-out'
    default:           return 'none'
  }
}

function navArrow(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', [side]: 12,
    top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 6, width: 32, height: 48,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: colors.mutedDark,
    cursor: 'pointer', fontFamily: 'system-ui',
    transition: 'background 0.15s, color 0.15s',
  }
}
