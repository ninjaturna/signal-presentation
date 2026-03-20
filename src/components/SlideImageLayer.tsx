import { useState, useRef, useCallback } from 'react'
import { colors } from '../design-system'
import type { ImageElement } from '../types/deck'

interface SlideImageLayerProps {
  images: ImageElement[]
  editable: boolean
  onUpdate: (images: ImageElement[]) => void
}

type ResizeDir = 'nw' | 'ne' | 'sw' | 'se'
type CropDir   = 'top' | 'right' | 'bottom' | 'left'

const HANDLE_SIZE = 10

const RESIZE_HANDLES: { dir: ResizeDir; style: React.CSSProperties }[] = [
  { dir: 'nw', style: { top: -HANDLE_SIZE/2, left: -HANDLE_SIZE/2, cursor: 'nw-resize' } },
  { dir: 'ne', style: { top: -HANDLE_SIZE/2, right: -HANDLE_SIZE/2, cursor: 'ne-resize' } },
  { dir: 'sw', style: { bottom: -HANDLE_SIZE/2, left: -HANDLE_SIZE/2, cursor: 'sw-resize' } },
  { dir: 'se', style: { bottom: -HANDLE_SIZE/2, right: -HANDLE_SIZE/2, cursor: 'se-resize' } },
]

export function SlideImageLayer({ images, editable, onUpdate }: SlideImageLayerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cropId, setCropId]         = useState<string | null>(null)
  const [cropDraft, setCropDraft]   = useState<ImageElement['crop']>({ top: 0, right: 0, bottom: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const dragRef = useRef<{
    type: 'move' | ResizeDir | CropDir
    imgId: string
    startX: number; startY: number
    origX: number; origY: number; origW: number; origH: number
    origCrop: ImageElement['crop']
  } | null>(null)

  const getPct = () => {
    const el = containerRef.current
    return el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 1, h: 1 }
  }

  const updateImage = useCallback((id: string, patch: Partial<ImageElement>) => {
    onUpdate(images.map(img => img.id === id ? { ...img, ...patch } : img))
  }, [images, onUpdate])

  const deleteImage = useCallback((id: string) => {
    onUpdate(images.filter(img => img.id !== id))
    setSelectedId(null)
    setCropId(null)
  }, [images, onUpdate])

  const getZ = (img: ImageElement) => img.zIndex ?? 0

  const bringToFront = (id: string) => {
    const max = Math.max(...images.map(getZ))
    updateImage(id, { zIndex: max + 1 })
  }

  const sendToBack = (id: string) => {
    const min = Math.min(...images.map(getZ))
    updateImage(id, { zIndex: min - 1 })
  }

  const bringForward = (id: string) => {
    const img = images.find(i => i.id === id)
    if (!img) return
    const current = getZ(img)
    const above = images
      .filter(i => i.id !== id && getZ(i) > current)
      .sort((a, b) => getZ(a) - getZ(b))[0]
    if (above) {
      const aboveZ = getZ(above)
      onUpdate(images.map(i => {
        if (i.id === id) return { ...i, zIndex: aboveZ }
        if (i.id === above.id) return { ...i, zIndex: current }
        return i
      }))
    }
  }

  const sendBackward = (id: string) => {
    const img = images.find(i => i.id === id)
    if (!img) return
    const current = getZ(img)
    const below = images
      .filter(i => i.id !== id && getZ(i) < current)
      .sort((a, b) => getZ(b) - getZ(a))[0]
    if (below) {
      const belowZ = getZ(below)
      onUpdate(images.map(i => {
        if (i.id === id) return { ...i, zIndex: belowZ }
        if (i.id === below.id) return { ...i, zIndex: current }
        return i
      }))
    }
  }

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const { w, h } = getPct()
    const dx = ((e.clientX - dragRef.current.startX) / w) * 100
    const dy = ((e.clientY - dragRef.current.startY) / h) * 100
    const { imgId, type, origX, origY, origW, origH, origCrop } = dragRef.current

    if (type === 'move') {
      updateImage(imgId, {
        x: Math.max(0, Math.min(100 - origW, origX + dx)),
        y: Math.max(0, Math.min(100 - origH, origY + dy)),
      })
      return
    }

    if (type === 'se') {
      updateImage(imgId, { width: Math.max(5, origW + dx), height: Math.max(5, origH + dy) })
    } else if (type === 'sw') {
      updateImage(imgId, { x: origX + dx, width: Math.max(5, origW - dx), height: Math.max(5, origH + dy) })
    } else if (type === 'ne') {
      updateImage(imgId, { y: origY + dy, width: Math.max(5, origW + dx), height: Math.max(5, origH - dy) })
    } else if (type === 'nw') {
      updateImage(imgId, { x: origX + dx, y: origY + dy, width: Math.max(5, origW - dx), height: Math.max(5, origH - dy) })
    } else if (type === 'top' || type === 'right' || type === 'bottom' || type === 'left') {
      const c = { ...(origCrop ?? { top: 0, right: 0, bottom: 0, left: 0 }) }
      if (type === 'top')    c.top    = Math.max(0, Math.min(90 - c.bottom, c.top + dy))
      if (type === 'bottom') c.bottom = Math.max(0, Math.min(90 - c.top, c.bottom - dy))
      if (type === 'left')   c.left   = Math.max(0, Math.min(90 - c.right, c.left + dx))
      if (type === 'right')  c.right  = Math.max(0, Math.min(90 - c.left, c.right - dx))
      setCropDraft(c)
    }
  }, [updateImage])

  const onPointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  const commitCrop = () => {
    if (cropId) updateImage(cropId, { crop: cropDraft })
    setCropId(null)
  }

  const cancelCrop = () => setCropId(null)

  const enterCrop = (img: ImageElement) => {
    setCropDraft(img.crop ?? { top: 0, right: 0, bottom: 0, left: 0 })
    setCropId(img.id)
    setSelectedId(img.id)
  }

  if (images.length === 0 && !editable) return null

  const sorted = [...images].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: editable ? 'auto' : 'none' }}
      onClick={() => { setSelectedId(null); setCropId(null) }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {sorted.map(img => {
        const isSelected = selectedId === img.id && editable
        const isCropping = cropId === img.id
        const crop = isCropping ? cropDraft! : (img.crop ?? { top: 0, right: 0, bottom: 0, left: 0 })

        return (
          <div
            key={img.id}
            style={{
              position: 'absolute',
              left: `${img.x}%`,
              top: `${img.y}%`,
              width: `${img.width}%`,
              height: `${img.height}%`,
              zIndex: (img.zIndex ?? 0) + 10,
              outline: isCropping
                ? `2px dashed ${colors.gold}`
                : isSelected
                  ? `2px solid ${colors.blue}`
                  : 'none',
              outlineOffset: 2,
              cursor: editable ? 'move' : 'default',
              userSelect: 'none',
              overflow: 'hidden',
            }}
            onPointerDown={e => {
              if (!editable || isCropping) return
              e.stopPropagation()
              setSelectedId(img.id)
              ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
              dragRef.current = {
                type: 'move', imgId: img.id,
                startX: e.clientX, startY: e.clientY,
                origX: img.x, origY: img.y,
                origW: img.width, origH: img.height,
                origCrop: img.crop,
              }
            }}
            onClick={e => { e.stopPropagation(); if (!isCropping) setSelectedId(img.id) }}
          >
            {/* Image — positioned using crop insets, overflow: hidden clips it */}
            <img
              src={img.src}
              alt={img.alt ?? ''}
              draggable={false}
              style={{
                position: 'absolute',
                top: `${crop.top}%`,
                left: `${crop.left}%`,
                right: `${crop.right}%`,
                bottom: `${crop.bottom}%`,
                width: `${100 - crop.left - crop.right}%`,
                height: `${100 - crop.top - crop.bottom}%`,
                objectFit: (crop.top > 0 || crop.right > 0 || crop.bottom > 0 || crop.left > 0)
                  ? 'fill'
                  : (img.objectFit ?? 'cover'),
                display: 'block',
                pointerEvents: 'none',
              }}
            />

            {/* Crop overlay */}
            {isCropping && (
              <CropOverlay
                crop={crop}
                onDragStart={(dir, e) => {
                  e.stopPropagation()
                  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
                  dragRef.current = {
                    type: dir, imgId: img.id,
                    startX: e.clientX, startY: e.clientY,
                    origX: img.x, origY: img.y,
                    origW: img.width, origH: img.height,
                    origCrop: { ...crop },
                  }
                }}
              />
            )}

            {/* Resize handles */}
            {isSelected && !isCropping && RESIZE_HANDLES.map(({ dir, style }) => (
              <div
                key={dir}
                style={{
                  position: 'absolute',
                  width: HANDLE_SIZE, height: HANDLE_SIZE,
                  background: '#FFFFFF',
                  border: `2px solid ${colors.blue}`,
                  borderRadius: 2,
                  zIndex: 20,
                  ...style,
                }}
                onPointerDown={e => {
                  e.stopPropagation()
                  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
                  dragRef.current = {
                    type: dir, imgId: img.id,
                    startX: e.clientX, startY: e.clientY,
                    origX: img.x, origY: img.y,
                    origW: img.width, origH: img.height,
                    origCrop: img.crop,
                  }
                }}
              />
            ))}

            {/* Selection toolbar */}
            {isSelected && !isCropping && (
              <ImageToolbar
                img={img}
                images={images}
                onCrop={() => enterCrop(img)}
                onDelete={() => deleteImage(img.id)}
                onBringToFront={() => bringToFront(img.id)}
                onBringForward={() => bringForward(img.id)}
                onSendBackward={() => sendBackward(img.id)}
                onSendToBack={() => sendToBack(img.id)}
              />
            )}
          </div>
        )
      })}

      {/* Crop commit/cancel bar */}
      {cropId && (
        <div
          style={{
            position: 'absolute',
            bottom: 12, left: '50%', transform: 'translateX(-50%)',
            background: '#1a1a1e',
            border: `1px solid ${colors.gold}`,
            borderRadius: 8,
            padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            zIndex: 100,
            fontFamily: '"DM Sans", system-ui, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <span style={{ fontSize: 11, color: colors.gold, fontWeight: 600 }}>✂ Crop mode</span>
          <span style={{ fontSize: 11, color: colors.mutedDark }}>Drag edges to crop</span>
          <button
            onClick={commitCrop}
            style={{
              background: '#1D9E75', border: 'none', borderRadius: 5,
              padding: '5px 12px', fontSize: 11, fontWeight: 700,
              color: '#FFFFFF', cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            ✓ Apply
          </button>
          <button
            onClick={cancelCrop}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: 5, padding: '5px 10px',
              fontSize: 11, color: colors.mutedDark,
              cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// ── Crop overlay ───────────────────────────────────────────────────────────

function CropOverlay({
  crop,
  onDragStart,
}: {
  crop: NonNullable<ImageElement['crop']>
  onDragStart: (dir: CropDir, e: React.PointerEvent) => void
}) {
  const EDGE = 8
  const dim: React.CSSProperties = {
    position: 'absolute',
    background: 'rgba(0,0,0,0.55)',
    pointerEvents: 'none',
  }
  const handle = (cursor: string): React.CSSProperties => ({
    position: 'absolute',
    background: colors.gold,
    cursor,
    zIndex: 15,
    opacity: 0.9,
  })

  return (
    <>
      {/* Dimmed regions */}
      <div style={{ ...dim, top: 0, left: 0, right: 0, height: `${crop.top}%` }} />
      <div style={{ ...dim, bottom: 0, left: 0, right: 0, height: `${crop.bottom}%` }} />
      <div style={{ ...dim, top: `${crop.top}%`, bottom: `${crop.bottom}%`, left: 0, width: `${crop.left}%` }} />
      <div style={{ ...dim, top: `${crop.top}%`, bottom: `${crop.bottom}%`, right: 0, width: `${crop.right}%` }} />

      {/* Active area border */}
      <div style={{
        position: 'absolute',
        top: `${crop.top}%`, left: `${crop.left}%`,
        right: `${crop.right}%`, bottom: `${crop.bottom}%`,
        border: `1.5px solid ${colors.gold}`,
        pointerEvents: 'none', zIndex: 14,
      }} />

      {/* Rule-of-thirds grid */}
      {[33.3, 66.6].map(p => (
        <div key={`h${p}`} style={{
          position: 'absolute',
          top: `${crop.top + (p / 100) * (100 - crop.top - crop.bottom)}%`,
          left: `${crop.left}%`, right: `${crop.right}%`,
          height: 1, background: 'rgba(255,204,45,0.25)',
          pointerEvents: 'none', zIndex: 14,
        }} />
      ))}
      {[33.3, 66.6].map(p => (
        <div key={`v${p}`} style={{
          position: 'absolute',
          left: `${crop.left + (p / 100) * (100 - crop.left - crop.right)}%`,
          top: `${crop.top}%`, bottom: `${crop.bottom}%`,
          width: 1, background: 'rgba(255,204,45,0.25)',
          pointerEvents: 'none', zIndex: 14,
        }} />
      ))}

      {/* Draggable edge handles */}
      <div
        style={{ ...handle('n-resize'), top: `calc(${crop.top}% - ${EDGE/2}px)`, left: '10%', right: '10%', height: EDGE, borderRadius: 3 }}
        onPointerDown={e => onDragStart('top', e)}
      />
      <div
        style={{ ...handle('s-resize'), bottom: `calc(${crop.bottom}% - ${EDGE/2}px)`, left: '10%', right: '10%', height: EDGE, borderRadius: 3 }}
        onPointerDown={e => onDragStart('bottom', e)}
      />
      <div
        style={{ ...handle('w-resize'), left: `calc(${crop.left}% - ${EDGE/2}px)`, top: '10%', bottom: '10%', width: EDGE, borderRadius: 3 }}
        onPointerDown={e => onDragStart('left', e)}
      />
      <div
        style={{ ...handle('e-resize'), right: `calc(${crop.right}% - ${EDGE/2}px)`, top: '10%', bottom: '10%', width: EDGE, borderRadius: 3 }}
        onPointerDown={e => onDragStart('right', e)}
      />
    </>
  )
}

// ── Image toolbar ──────────────────────────────────────────────────────────

function ImageToolbar({
  img, images,
  onCrop, onDelete,
  onBringToFront, onBringForward, onSendBackward, onSendToBack,
}: {
  img: ImageElement
  images: ImageElement[]
  onCrop: () => void
  onDelete: () => void
  onBringToFront: () => void
  onBringForward: () => void
  onSendBackward: () => void
  onSendToBack: () => void
}) {
  const hasCrop  = img.crop && Object.values(img.crop).some(v => v > 0)
  const isTop    = (img.zIndex ?? 0) >= Math.max(...images.map(i => i.zIndex ?? 0))
  const isBottom = (img.zIndex ?? 0) <= Math.min(...images.map(i => i.zIndex ?? 0))

  const btn = (disabled?: boolean): React.CSSProperties => ({
    background: 'transparent', border: 'none',
    padding: '4px 7px', fontSize: 11,
    color: disabled ? colors.borderDark : '#FFFFFF',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    fontWeight: 600, whiteSpace: 'nowrap' as const,
  })
  const divider = <div style={{ width: 1, height: 20, background: colors.borderDark }} />

  return (
    <div
      style={{
        position: 'absolute',
        top: -36, left: '50%', transform: 'translateX(-50%)',
        background: '#1a1a1e',
        border: `1px solid ${colors.borderDark}`,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 0,
        zIndex: 30,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        overflow: 'hidden', whiteSpace: 'nowrap',
      }}
      onPointerDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onCrop} style={btn()}>
        {hasCrop ? '✂ Edit crop' : '✂ Crop'}
      </button>
      {divider}
      <button onClick={onBringToFront} disabled={isTop} title="Bring to front" style={btn(isTop)}>⬆⬆</button>
      <button onClick={onBringForward} disabled={isTop} title="Bring forward" style={btn(isTop)}>⬆</button>
      <button onClick={onSendBackward} disabled={isBottom} title="Send backward" style={btn(isBottom)}>⬇</button>
      <button onClick={onSendToBack} disabled={isBottom} title="Send to back" style={btn(isBottom)}>⬇⬇</button>
      {divider}
      <button onClick={onDelete} style={{ ...btn(), color: '#FF1C52' }}>✕</button>
    </div>
  )
}
