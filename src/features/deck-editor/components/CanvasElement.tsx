import { useRef, useState, useCallback } from 'react'
import type { CanvasElement as CanvasElementType, TextElement } from '../types'
import { resolveTextStyle } from '../utils'
import { EmbedElement } from './EmbedElement'
import { colors } from '../../../design-system'

const HANDLE_SIZE = 8
const HANDLE_OFFSET = -4

type ResizeDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

const HANDLES: { dir: ResizeDirection; cursor: string; style: React.CSSProperties }[] = [
  { dir: 'nw', cursor: 'nw-resize', style: { top: HANDLE_OFFSET, left: HANDLE_OFFSET } },
  { dir: 'n',  cursor: 'n-resize',  style: { top: HANDLE_OFFSET, left: '50%', transform: 'translateX(-50%)' } },
  { dir: 'ne', cursor: 'ne-resize', style: { top: HANDLE_OFFSET, right: HANDLE_OFFSET } },
  { dir: 'e',  cursor: 'e-resize',  style: { top: '50%', right: HANDLE_OFFSET, transform: 'translateY(-50%)' } },
  { dir: 'se', cursor: 'se-resize', style: { bottom: HANDLE_OFFSET, right: HANDLE_OFFSET } },
  { dir: 's',  cursor: 's-resize',  style: { bottom: HANDLE_OFFSET, left: '50%', transform: 'translateX(-50%)' } },
  { dir: 'sw', cursor: 'sw-resize', style: { bottom: HANDLE_OFFSET, left: HANDLE_OFFSET } },
  { dir: 'w',  cursor: 'w-resize',  style: { top: '50%', left: HANDLE_OFFSET, transform: 'translateY(-50%)' } },
]

interface CanvasElementProps {
  element: CanvasElementType
  selected: boolean
  scale: number
  onSelect: () => void
  onUpdate: (patch: Partial<CanvasElementType>) => void
  onDelete: () => void
}

export function CanvasElement({
  element,
  selected,
  scale,
  onSelect,
  onUpdate,
  onDelete,
}: CanvasElementProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const resizeRef = useRef<{
    dir: ResizeDirection
    startX: number; startY: number
    origX: number; origY: number; origW: number; origH: number
  } | null>(null)

  // ── Drag ─────────────────────────────────────────────────────────────────
  const onPointerDownDrag = useCallback((e: React.PointerEvent) => {
    if (editing) return
    e.stopPropagation()
    onSelect()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
    }
  }, [editing, element.x, element.y, onSelect])

  const onPointerMoveDrag = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const dx = (e.clientX - dragRef.current.startX) / scale
    const dy = (e.clientY - dragRef.current.startY) / scale
    onUpdate({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy } as Partial<CanvasElementType>)
  }, [scale, onUpdate])

  const onPointerUpDrag = useCallback(() => {
    dragRef.current = null
  }, [])

  // ── Resize ────────────────────────────────────────────────────────────────
  const onPointerDownResize = useCallback((e: React.PointerEvent, dir: ResizeDirection) => {
    e.stopPropagation()
    e.preventDefault()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    resizeRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
      origW: element.width,
      origH: element.height,
    }
  }, [element.x, element.y, element.width, element.height])

  const onPointerMoveResize = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return
    const { dir, startX, startY, origX, origY, origW, origH } = resizeRef.current
    const dx = (e.clientX - startX) / scale
    const dy = (e.clientY - startY) / scale

    let nx = origX, ny = origY, nw = origW, nh = origH

    if (dir.includes('e')) nw = Math.max(80, origW + dx)
    if (dir.includes('w')) { nx = origX + dx; nw = Math.max(80, origW - dx) }
    if (dir.includes('s')) nh = Math.max(40, origH + dy)
    if (dir.includes('n')) { ny = origY + dy; nh = Math.max(40, origH - dy) }

    onUpdate({ x: nx, y: ny, width: nw, height: nh } as Partial<CanvasElementType>)
  }, [scale, onUpdate])

  const onPointerUpResize = useCallback(() => {
    resizeRef.current = null
  }, [])

  // ── Text editing ──────────────────────────────────────────────────────────
  const startEdit = useCallback((e: React.MouseEvent) => {
    if (element.type !== 'text') return
    e.stopPropagation()
    setDraft((element as TextElement).content)
    setEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 10)
  }, [element])

  const commitEdit = useCallback(() => {
    if (element.type !== 'text') return
    setEditing(false)
    if (draft !== (element as TextElement).content) {
      onUpdate({ content: draft } as Partial<CanvasElementType>)
    }
  }, [draft, element, onUpdate])

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Escape') { setEditing(false); setDraft('') }
  }, [])

  const sel = selected && !editing
  const styleBase: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    cursor: editing ? 'text' : 'move',
    outline: sel ? `2px solid ${colors.blue}` : editing ? `1.5px dashed ${colors.blue}` : 'none',
    outlineOffset: 2,
    boxSizing: 'border-box',
  }

  return (
    <div
      style={styleBase}
      onPointerDown={onPointerDownDrag}
      onPointerMove={dragRef.current ? onPointerMoveDrag : resizeRef.current ? onPointerMoveResize : undefined}
      onPointerUp={() => { onPointerUpDrag(); onPointerUpResize() }}
      onDoubleClick={element.type === 'text' ? startEdit : undefined}
    >
      {/* Content */}
      {element.type === 'text' ? (
        editing ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={onKeyDown}
            style={{
              ...buildTextStyle(element as TextElement),
              width: '100%',
              height: '100%',
              background: 'rgba(30,90,242,0.06)',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
              margin: 0,
              fontFamily: '"DM Sans", system-ui, sans-serif',
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <div
            style={{
              ...buildTextStyle(element as TextElement),
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
            onDoubleClick={startEdit}
          >
            {(element as TextElement).content || (
              <span style={{ opacity: 0.3 }}>Double-click to edit</span>
            )}
          </div>
        )
      ) : (
        <EmbedElement element={element} scale={scale} />
      )}

      {/* Link badge */}
      {element.link?.url && (
        <div style={{
          position: 'absolute',
          top: -10,
          right: -10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: colors.blue,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: '#fff',
          fontWeight: 700,
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          ↗
        </div>
      )}

      {/* Delete button (shown when selected) */}
      {sel && (
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onDelete() }}
          style={{
            position: 'absolute',
            top: -28,
            right: 0,
            background: '#222',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 4,
            padding: '2px 7px',
            fontSize: 10,
            color: '#888',
            cursor: 'pointer',
            zIndex: 30,
            fontFamily: '"DM Sans", system-ui, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          ✕ Delete
        </button>
      )}

      {/* Resize handles */}
      {sel && HANDLES.map(({ dir, cursor, style }) => (
        <div
          key={dir}
          style={{
            position: 'absolute',
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            background: '#fff',
            border: `1.5px solid ${colors.blue}`,
            borderRadius: 2,
            cursor,
            zIndex: 20,
            ...style,
          }}
          onPointerDown={e => onPointerDownResize(e, dir)}
          onPointerMove={onPointerMoveResize}
          onPointerUp={onPointerUpResize}
        />
      ))}
    </div>
  )
}

function buildTextStyle(el: TextElement): React.CSSProperties {
  const def = resolveTextStyle(el.styleName)
  return {
    fontSize: def.fontSize,
    fontWeight: def.fontWeight,
    lineHeight: def.lineHeight,
    letterSpacing: def.letterSpacing,
    textTransform: def.textTransform as React.CSSProperties['textTransform'],
    fontStyle: def.fontStyle,
    color: el.color ?? '#111113',
    fontFamily: '"DM Sans", system-ui, sans-serif',
  }
}
