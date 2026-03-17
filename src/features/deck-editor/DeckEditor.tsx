import { useState, useCallback, useEffect, useRef } from 'react'
import type { Slide, CanvasElement, TextStyleName } from './types'
import { mkText, mkEmbed } from './utils'
import { INITIAL_SLIDES } from './data/initialSlides'
import { CanvasElement as CanvasElementComponent } from './components/CanvasElement'
import { SlideThumbnail } from './components/SlideThumbnail'
import { TopBar } from './components/TopBar'
import { PropertiesPanel } from './components/PropertiesPanel'
import { colors } from '../../design-system'

const CANVAS_W = 1280
const CANVAS_H = 720

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function newBlankSlide(): Slide {
  return { id: crypto.randomUUID(), elements: [] }
}

export function DeckEditor() {
  const [slides, setSlides]             = useState<Slide[]>(() => deepClone(INITIAL_SLIDES))
  const [currentIdx, setCurrentIdx]     = useState(0)
  const [selectedId, setSelectedId]     = useState<string | null>(null)
  const [history, setHistory]           = useState<Slide[][]>([])
  const [future, setFuture]             = useState<Slide[][]>([])
  const [presenting, setPresenting]     = useState(false)
  const [canvasScale, setCanvasScale]   = useState(1)
  const stageRef                        = useRef<HTMLDivElement>(null)

  const currentSlide = slides[currentIdx]
  const selectedElement = currentSlide?.elements.find(e => e.id === selectedId) ?? null

  // ── Scale canvas to fit stage ─────────────────────────────────────────────
  useEffect(() => {
    const updateScale = () => {
      if (!stageRef.current) return
      const { clientWidth: w, clientHeight: h } = stageRef.current
      const padding = presenting ? 0 : 48
      const scale = Math.min((w - padding * 2) / CANVAS_W, (h - padding * 2) / CANVAS_H)
      setCanvasScale(Math.min(scale, 1))
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (stageRef.current) ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [presenting])

  // ── History helpers ───────────────────────────────────────────────────────
  const pushHistory = useCallback((prev: Slide[]) => {
    setHistory(h => [...h.slice(-50), deepClone(prev)])
    setFuture([])
  }, [])

  const undo = useCallback(() => {
    if (!history.length) return
    setFuture(f => [deepClone(slides), ...f])
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setSlides(deepClone(prev))
    setSelectedId(null)
  }, [history, slides])

  const redo = useCallback(() => {
    if (!future.length) return
    setHistory(h => [...h, deepClone(slides)])
    setSlides(deepClone(future[0]))
    setFuture(f => f.slice(1))
    setSelectedId(null)
  }, [future, slides])

  // ── Slide mutations ───────────────────────────────────────────────────────
  const mutateCurrent = useCallback((fn: (slide: Slide) => Slide) => {
    setSlides(prev => {
      pushHistory(prev)
      return prev.map((s, i) => i === currentIdx ? fn(deepClone(s)) : s)
    })
  }, [currentIdx, pushHistory])

  // ── Element operations ────────────────────────────────────────────────────
  const addText = useCallback((styleName: TextStyleName) => {
    const el = mkText(styleName, '', CANVAS_W / 2 - 240, CANVAS_H / 2 - 60)
    mutateCurrent(s => ({ ...s, elements: [...s.elements, el] }))
    setSelectedId(el.id)
  }, [mutateCurrent])

  const addEmbed = useCallback((url: string) => {
    const el = mkEmbed(url, CANVAS_W / 2 - 280, CANVAS_H / 2 - 157)
    mutateCurrent(s => ({ ...s, elements: [...s.elements, el] }))
    setSelectedId(el.id)
  }, [mutateCurrent])

  const updateElement = useCallback((id: string, patch: Partial<CanvasElement>) => {
    mutateCurrent(s => ({
      ...s,
      elements: s.elements.map(e => e.id === id ? { ...e, ...patch } as CanvasElement : e),
    }))
  }, [mutateCurrent])

  const deleteElement = useCallback((id: string) => {
    mutateCurrent(s => ({ ...s, elements: s.elements.filter(e => e.id !== id) }))
    setSelectedId(null)
  }, [mutateCurrent])

  // ── Slide list operations ─────────────────────────────────────────────────
  const addSlide = useCallback(() => {
    const s = newBlankSlide()
    setSlides(prev => { pushHistory(prev); return [...prev, s] })
    setCurrentIdx(slides.length)
    setSelectedId(null)
  }, [slides.length, pushHistory])

  const goToSlide = useCallback((idx: number) => {
    setCurrentIdx(idx)
    setSelectedId(null)
  }, [])

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'Escape') { setSelectedId(null); setPresenting(false) }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) { e.preventDefault(); deleteElement(selectedId) }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault(); redo()
      }
      if (!presenting) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          goToSlide(Math.min(slides.length - 1, currentIdx + 1))
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          goToSlide(Math.max(0, currentIdx - 1))
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, slides.length, currentIdx, deleteElement, undo, redo, goToSlide, presenting])

  // ── Present mode ──────────────────────────────────────────────────────────
  if (presenting) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0,
          background: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}
        onClick={() => goToSlide(Math.min(slides.length - 1, currentIdx + 1))}
      >
        {/* Canvas */}
        <div style={{
          width: `min(100vw, calc(100vh * ${CANVAS_W / CANVAS_H}))`,
          aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
          background: currentSlide?.background ?? '#FCF8F5',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {currentSlide?.elements.map(el => (
            <CanvasElementComponent
              key={el.id}
              element={el}
              selected={false}
              scale={canvasScale}
              onSelect={() => {}}
              onUpdate={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>

        {/* Exit hint */}
        <button
          onClick={e => { e.stopPropagation(); setPresenting(false) }}
          style={{
            position: 'fixed', top: 16, right: 16,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}
        >
          ✕ Exit
        </button>

        {/* Slide counter */}
        <div style={{
          position: 'fixed', bottom: 16, right: 16,
          fontSize: 12, color: 'rgba(255,255,255,0.4)',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          {currentIdx + 1} / {slides.length}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh',
      background: '#0c0c0e',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      <TopBar
        selectedElement={selectedElement}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        presenting={presenting}
        onAddText={addText}
        onAddEmbed={addEmbed}
        onUpdateSelected={patch => selectedId && updateElement(selectedId, patch)}
        onUndo={undo}
        onRedo={redo}
        onTogglePresent={() => setPresenting(v => !v)}
        onAddSlide={addSlide}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Slide list */}
        <div style={{
          width: 212,
          flexShrink: 0,
          background: '#111113',
          borderRight: `1px solid ${colors.borderDark}`,
          overflowY: 'auto',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {slides.map((s, i) => (
            <SlideThumbnail
              key={s.id}
              slide={s}
              index={i}
              active={i === currentIdx}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>

        {/* Canvas stage */}
        <div
          ref={stageRef}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0c0c0e',
            overflow: 'hidden',
            position: 'relative',
          }}
          onClick={() => setSelectedId(null)}
        >
          {currentSlide && (
            <div
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                background: currentSlide.background ?? '#FCF8F5',
                position: 'relative',
                boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
                borderRadius: 4,
                overflow: 'hidden',
                transformOrigin: 'center',
                transform: `scale(${canvasScale})`,
                flexShrink: 0,
              }}
              onClick={e => e.stopPropagation()}
            >
              {currentSlide.elements.map(el => (
                <CanvasElementComponent
                  key={el.id}
                  element={el}
                  selected={el.id === selectedId}
                  scale={canvasScale}
                  onSelect={() => setSelectedId(el.id)}
                  onUpdate={patch => updateElement(el.id, patch)}
                  onDelete={() => deleteElement(el.id)}
                />
              ))}

              {/* Empty state */}
              {currentSlide.elements.length === 0 && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 12,
                  opacity: 0.3,
                  pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: 32 }}>+</div>
                  <div style={{ fontSize: 14, color: colors.mutedDark }}>
                    Add text or embed from the toolbar
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Properties panel */}
        <PropertiesPanel
          element={selectedElement}
          onUpdate={patch => selectedId && updateElement(selectedId, patch)}
          onDelete={() => selectedId && deleteElement(selectedId)}
        />
      </div>
    </div>
  )
}
