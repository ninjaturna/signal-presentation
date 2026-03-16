import { useState, useEffect, useCallback } from 'react'
import { colors } from '../design-system'
import { renderSlide } from '../utils/renderSlide'
import { ChatPanel } from './ChatPanel'
import type { SlideData, ShareMode } from '../types/deck'

interface SlideViewerProps {
  initialSlides: SlideData[]
  title?: string
  mode?: ShareMode
}

export function SlideViewer({ initialSlides, title = 'SIGNAL', mode = 'edit' }: SlideViewerProps) {
  const [slides, setSlides]           = useState<SlideData[]>(initialSlides)
  const [current, setCurrent]         = useState(0)
  const [showChat, setShowChat]       = useState(false)
  const [showShare, setShowShare]     = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied]           = useState<'review' | 'present' | null>(null)

  const slide = slides[current]
  const canEdit = mode === 'edit'

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(slides.length - 1, index)))
  }, [slides.length])

  const updateSlide = useCallback((id: string, patch: Partial<SlideData>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
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
        case 'Escape':
          setShowShare(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo, canEdit])

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
        <div style={{
          height: 48, flexShrink: 0,
          display: 'flex', alignItems: 'center',
          padding: '0 16px',
          borderBottom: `1px solid ${colors.borderDark}`,
          background: '#111113',
          gap: 12,
        }}>
          {/* Title + slide count */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', flex: 1, minWidth: 0 }}>
            <span style={{ color: colors.blue, letterSpacing: '0.06em', fontSize: 11 }}>SIGNAL</span>
            <span style={{ color: colors.borderDark, margin: '0 8px' }}>·</span>
            <span style={{ fontSize: 12, color: colors.mutedDark }}>{title}</span>
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
          <div style={{
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
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                style={navArrow('left')}
              >
                ‹
              </button>
              <button
                onClick={() => goTo(current + 1)}
                disabled={current === slides.length - 1}
                style={navArrow('right')}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Chat panel */}
        {canEdit && showChat && (
          <ChatPanel
            slide={slide}
            onUpdate={(patch) => updateSlide(slide.id, patch)}
          />
        )}
      </div>

      {/* Bottom progress bar + dot nav */}
      {!isFullscreen && (
        <div style={{
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
