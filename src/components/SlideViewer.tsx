import { useState, useEffect, useCallback } from 'react'
import { colors } from '../design-system'
import { renderSlide } from '../utils/renderSlide'
import { ChatPanel } from './ChatPanel'
import { EditPanel } from './EditPanel'
import { useUndoHistory } from '../hooks/useUndoHistory'
import type { SlideData, ShareMode } from '../types/deck'

interface SlideViewerProps {
  slides: SlideData[]
  title?: string
  mode?: ShareMode
  onBack?: () => void
  onSlidesChange?: (slides: SlideData[]) => void
  onOpenEditor?: () => void
}

export function SlideViewer({ slides: initialSlides, title = 'SIGNAL', mode = 'edit', onBack, onSlidesChange }: SlideViewerProps) {
  const { current: slides, push: pushSlides, undo, redo, canUndo, canRedo } = useUndoHistory<SlideData[]>(initialSlides)
  const [current, setCurrent]         = useState(0)
  const [showChat, setShowChat]       = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showShare, setShowShare]     = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied]           = useState<'review' | 'present' | null>(null)

  const slide = slides[current]
  const canEdit = mode === 'edit'

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

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      // Undo/redo — works even with chat open
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
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
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
          } else {
            document.exitFullscreen()
          }
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

  const copyLink = (shareMode: 'review' | 'present') => {
    const url = `${window.location.origin}/view/${shareMode}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(shareMode)
      setTimeout(() => setCopied(null), 2000)
    })
    setShowShare(false)
  }

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
          borderBottom: `1px solid ${colors.borderDark}`,
          background: '#111113',
          gap: 12,
        }}>
          {/* Back + title */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  background: 'transparent', border: 'none',
                  fontSize: 18, color: colors.mutedDark, cursor: 'pointer',
                  lineHeight: 1, padding: 0, fontFamily: 'system-ui',
                  flexShrink: 0,
                }}
                title="Back to home"
              >
                ‹
              </button>
            )}
            {canEdit && (
              <>
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (⌘Z)"
                  style={undoRedoBtn(!canUndo)}
                >
                  ↩
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (⌘⇧Z)"
                  style={undoRedoBtn(!canRedo)}
                >
                  ↪
                </button>
              </>
            )}
            <span style={{ color: colors.blue, letterSpacing: '0.06em', fontSize: 11 }}>SIGNAL</span>
            <span style={{ color: colors.borderDark }}>·</span>
            <span style={{ fontSize: 12, color: colors.mutedDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          </div>

          {/* Slide counter */}
          <div style={{ fontSize: 12, color: colors.mutedLight, letterSpacing: '0.02em' }}>
            {current + 1} / {slides.length}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 4 }}>
            {canEdit && (
              <button
                onClick={() => setShowChat(v => !v)}
                title="Toggle chat (C)"
                style={topBarBtn(showChat)}
              >
                ✦ Co-pilot
              </button>
            )}

            {canEdit && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowShare(v => !v)}
                  style={topBarBtn(showShare)}
                >
                  Share ↗
                </button>
                {showShare && (
                  <div style={{
                    position: 'absolute', top: 36, right: 0,
                    background: '#1a1a1e',
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 10, padding: 8, width: 220, zIndex: 100,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                  }}>
                    <div style={{ fontSize: 11, color: colors.mutedLight, padding: '4px 8px 8px', letterSpacing: '0.06em' }}>
                      SHARE LINK
                    </div>
                    <ShareOption
                      label="Review mode"
                      description="Stakeholders can comment"
                      onClick={() => copyLink('review')}
                      copied={copied === 'review'}
                    />
                    <ShareOption
                      label="Present mode"
                      description="Clean, fullscreen view"
                      onClick={() => copyLink('present')}
                      copied={copied === 'present'}
                    />
                  </div>
                )}
              </div>
            )}

            {canEdit && (
              <button
                onClick={() => {
                  setShowEditPanel(v => !v)
                  setShowChat(false)
                }}
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
            )}

            <button
              data-no-print
              onClick={() => {
                document.body.classList.add('printing')
                window.print()
                document.body.classList.remove('printing')
              }}
              style={{
                background: 'transparent',
                border: '1px solid #222',
                borderRadius: 6, padding: '6px 12px',
                fontSize: 12, color: '#666', cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              ↓ Export PDF
            </button>

            <button
              onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}
              title="Fullscreen (F)"
              style={topBarBtn(false)}
            >
              {isFullscreen ? '⤢' : '⤡'}
            </button>
          </div>
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
          {/* Slide */}
          <div data-slide={current} style={{
            width: '100%', maxWidth: isFullscreen ? '100vw' : 'min(calc(100% - 0px), calc((100vh - 96px) * 16/9))',
            boxShadow: isFullscreen ? 'none' : '0 4px 32px rgba(0,0,0,0.6)',
            borderRadius: isFullscreen ? 0 : 4,
            overflow: 'hidden',
          }}>
            {renderSlide(slide, {
              editable: canEdit,
              onUpdate: (patch) => updateSlide(slide.id, patch),
            })}
          </div>

          {/* Prev / next arrows */}
          {!isFullscreen && (
            <>
              <button
                data-no-print
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                style={navArrow('left')}
              >
                ‹
              </button>
              <button
                data-no-print
                onClick={() => goTo(current + 1)}
                disabled={current === slides.length - 1}
                style={navArrow('right')}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Edit panel */}
        {canEdit && showEditPanel && (
          <div data-no-print style={{ display: 'flex', height: '100%' }}>
            <EditPanel
              slide={slide}
              onUpdate={(patch) => updateSlide(slide.id, patch)}
              onClose={() => setShowEditPanel(false)}
              onResetDiagrams={resetDiagrams}
            />
          </div>
        )}

        {/* Chat panel — only when edit panel is closed */}
        {canEdit && showChat && !showEditPanel && (
          <div data-no-print style={{ display: 'flex', height: '100%' }}>
            <ChatPanel
              slide={slide}
              onUpdate={(patch) => updateSlide(slide.id, patch)}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </div>

      {/* Bottom progress bar + dot nav */}
      {!isFullscreen && (
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
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? colors.blue : colors.borderDark,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── helpers ───────────────────────────────────────────────────────────────

function undoRedoBtn(disabled: boolean): React.CSSProperties {
  return {
    background: 'transparent',
    border: 'none',
    padding: '2px 4px',
    fontSize: 16,
    color: disabled ? '#2a2a2a' : '#555',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.3 : 1,
    lineHeight: 1,
    fontFamily: 'system-ui',
    flexShrink: 0,
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

function navArrow(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    [side]: 12,
    top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 6,
    width: 32, height: 48,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: colors.mutedDark,
    cursor: 'pointer',
    fontFamily: 'system-ui',
    transition: 'background 0.15s, color 0.15s',
  }
}

interface ShareOptionProps {
  label: string
  description: string
  onClick: () => void
  copied: boolean
}

function ShareOption({ label, description, onClick, copied }: ShareOptionProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        width: '100%', background: 'transparent',
        border: 'none', borderRadius: 6, padding: '8px',
        cursor: 'pointer', textAlign: 'left',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = colors.inkSoft)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: copied ? colors.blue : '#FFFFFF' }}>
        {copied ? 'Copied!' : label}
      </div>
      <div style={{ fontSize: 11, color: colors.mutedLight }}>{description}</div>
    </button>
  )
}
