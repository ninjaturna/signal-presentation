import { useState, useRef } from 'react'
import { colors } from '../design-system'
import type { SlideData } from '../types/deck'

interface SlidePanelProps {
  slides: SlideData[]
  currentIndex: number
  onNavigate: (index: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onAddSlide?: () => void
  onDeleteSlide?: (index: number) => void
  onDuplicateSlide?: (index: number) => void
}

// Color map per slide type
const TYPE_COLORS: Record<string, string> = {
  cover:           '#1E5AF2',
  narrative:       '#1E5AF2',
  'stat-grid':     '#1E5AF2',
  'two-pane':      '#1E5AF2',
  'section-break': '#252424',
  'full-bleed':    '#252424',
  diagram:         '#1749CC',
  closing:         '#1E5AF2',
  poll:            '#FFCC2D',
}

function SlideTypeBadge({ type }: { type: string; mode: string }) {
  const color = TYPE_COLORS[type] ?? '#1E5AF2'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
      {/* Left accent */}
      {(type === 'cover' || type === 'closing') && (
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: 2,
          background: color,
        }} />
      )}
      {/* Top accent for section-break / full-bleed */}
      {(type === 'section-break' || type === 'full-bleed') && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: '#FFCC2D',
        }} />
      )}
      {/* Type label */}
      <div style={{
        fontSize: 6,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: type === 'poll' ? '#FFCC2D' : color,
        opacity: 0.8,
      }}>
        {type.replace('-', ' ')}
      </div>
    </div>
  )
}

function SlideThumbnailLines({ slide }: { slide: SlideData }) {
  const isDark = slide.mode === 'dark'
  const textColor  = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,19,0.7)'
  const mutedColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(17,17,19,0.2)'

  const eyebrow  = slide.eyebrow ?? ''
  const title    = slide.title ?? slide.headline ?? slide.statement ?? ''
  const hasBody  = !!(slide.body ?? slide.subtitle ?? slide.pullQuote)
  const statCount = slide.stats?.length ?? 0

  return (
    <>
      {/* Eyebrow */}
      {eyebrow && (
        <div style={{
          height: 3,
          width: `${Math.min(eyebrow.length * 3, 50)}%`,
          background: '#1E5AF2',
          borderRadius: 1,
          marginBottom: 1,
        }} />
      )}

      {/* Title lines */}
      {title && (
        <>
          <div style={{
            height: 4,
            width: `${Math.min(60 + (title.length % 20), 90)}%`,
            background: textColor,
            borderRadius: 1,
          }} />
          {title.length > 20 && (
            <div style={{
              height: 4,
              width: `${Math.min(30 + (title.length % 15), 70)}%`,
              background: textColor,
              borderRadius: 1,
              opacity: 0.8,
            }} />
          )}
        </>
      )}

      {/* Body lines */}
      {hasBody && (
        <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[80, 90, 65].map((w, i) => (
            <div key={i} style={{
              height: 2.5,
              width: `${w}%`,
              background: mutedColor,
              borderRadius: 1,
            }} />
          ))}
        </div>
      )}

      {/* Stat grid representation */}
      {statCount > 0 && (
        <div style={{
          display: 'flex', gap: 3, marginTop: 3,
          flex: 1, alignItems: 'flex-end',
        }}>
          {Array.from({ length: statCount }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: 18,
              background: mutedColor,
              borderRadius: 2,
              display: 'flex', flexDirection: 'column',
              padding: 2, gap: 1,
            }}>
              <div style={{ height: 3, background: '#1E5AF2', borderRadius: 1, width: '60%' }} />
              <div style={{ height: 2, background: mutedColor, borderRadius: 1, width: '80%' }} />
            </div>
          ))}
        </div>
      )}

      {/* Poll indicator */}
      {slide.type === 'poll' && (
        <div style={{ marginTop: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[100, 70, 45, 60].map((w, i) => (
            <div key={i} style={{
              height: 3,
              width: `${w}%`,
              background: '#FFCC2D',
              borderRadius: 1,
              opacity: 0.6,
            }} />
          ))}
        </div>
      )}

      {/* Diagram indicator */}
      {slide.type === 'diagram' && (
        <div style={{
          marginTop: 4,
          flex: 1,
          background: mutedColor,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 8,
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
            fontWeight: 700,
          }}>
            {slide.svgContent ? '◈' : '⬡'}
          </div>
        </div>
      )}

      {/* Section break: big number */}
      {slide.type === 'section-break' && slide.number && (
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.15)',
          lineHeight: 1,
          marginTop: 2,
        }}>
          {slide.number}
        </div>
      )}
    </>
  )
}

export function SlidePanel({
  slides,
  currentIndex,
  onNavigate,
  onReorder,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
}: SlidePanelProps) {
  const [draggingIdx, setDraggingIdx]     = useState<number | null>(null)
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null)
  const [contextMenu, setContextMenu]     = useState<{ x: number; y: number; idx: number } | null>(null)
  const dragNode = useRef<HTMLDivElement | null>(null)

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggingIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== draggingIdx) setDropTargetIdx(idx)
  }

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (draggingIdx !== null && draggingIdx !== idx) {
      onReorder(draggingIdx, idx)
    }
    setDraggingIdx(null)
    setDropTargetIdx(null)
  }

  const handleDragEnd = () => {
    setDraggingIdx(null)
    setDropTargetIdx(null)
  }

  const handleContextMenu = (e: React.MouseEvent, idx: number) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, idx })
  }

  const closeContext = () => setContextMenu(null)

  return (
    <div
      style={{
        width: 168,
        flexShrink: 0,
        background: '#111113',
        borderRight: `1px solid ${colors.borderDark}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
      onClick={() => contextMenu && closeContext()}
    >
      {/* Header */}
      <div style={{
        padding: '10px 12px 6px',
        fontSize: 10, fontWeight: 700,
        color: colors.mutedDark,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderBottom: `1px solid ${colors.borderDark}`,
        flexShrink: 0,
      }}>
        Slides · {slides.length}
      </div>

      {/* Slide list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {slides.map((slide, idx) => {
          const isActive     = idx === currentIndex
          const isDragging   = idx === draggingIdx
          const isDropTarget = idx === dropTargetIdx

          return (
            <div
              key={slide.id}
              ref={idx === draggingIdx ? dragNode : undefined}
              draggable
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onContextMenu={e => handleContextMenu(e, idx)}
              onClick={() => onNavigate(idx)}
              style={{
                position: 'relative',
                border: `2px solid ${
                  isActive     ? colors.blue :
                  isDropTarget ? colors.gold :
                  'transparent'
                }`,
                borderRadius: 6,
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: isDragging ? 0.4 : 1,
                transition: 'border-color 0.12s, opacity 0.12s',
                flexShrink: 0,
                boxShadow: isDropTarget ? `0 -2px 0 0 ${colors.gold}` : 'none',
              }}
            >
              {/* Lightweight slide preview — no renderSlide() */}
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                overflow: 'hidden',
                pointerEvents: 'none',
                background: slide.mode === 'dark' ? '#111113' : '#FCF8F5',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '6px 8px',
                gap: 3,
              }}>
                <SlideTypeBadge type={slide.type} mode={slide.mode ?? 'light'} />
                <SlideThumbnailLines slide={slide} />
              </div>

              {/* Slide number */}
              <div style={{
                position: 'absolute',
                bottom: 3, left: 5,
                fontSize: 9, fontWeight: 700,
                color: slide.mode === 'dark' ? colors.borderDark : colors.mutedLight,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {idx + 1}
              </div>

              {/* Drag handle */}
              <div style={{
                position: 'absolute',
                top: 4, right: 4,
                display: 'flex', flexDirection: 'column', gap: 2,
                opacity: 0.3,
                pointerEvents: 'none',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 12, height: 1.5,
                    background: slide.mode === 'dark' ? '#FFFFFF' : '#111',
                    borderRadius: 1,
                  }} />
                ))}
              </div>
            </div>
          )
        })}

        {/* Add slide */}
        {onAddSlide && (
          <button
            onClick={onAddSlide}
            style={{
              background: 'transparent',
              border: `1px dashed ${colors.borderDark}`,
              borderRadius: 6, padding: '10px',
              fontSize: 11, color: colors.mutedDark,
              cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              transition: 'border-color 0.12s, color 0.12s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = colors.blue
              e.currentTarget.style.color = colors.blue
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = colors.borderDark
              e.currentTarget.style.color = colors.mutedDark
            }}
          >
            + Add slide
          </button>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x,
          background: '#1a1a1e',
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 8,
          padding: 4,
          zIndex: 1000,
          minWidth: 160,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          {[
            { label: 'Duplicate slide', action: () => { onDuplicateSlide?.(contextMenu.idx); closeContext() } },
            { label: 'Move to top',     action: () => { onReorder(contextMenu.idx, 0); closeContext() } },
            { label: 'Move to bottom',  action: () => { onReorder(contextMenu.idx, slides.length - 1); closeContext() } },
            { label: 'Delete slide',    action: () => { onDeleteSlide?.(contextMenu.idx); closeContext() }, danger: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: 'block', width: '100%',
                background: 'transparent', border: 'none',
                borderRadius: 5, padding: '8px 10px',
                fontSize: 13, color: item.danger ? '#FF1C52' : '#FFFFFF',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = colors.inkSoft)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
