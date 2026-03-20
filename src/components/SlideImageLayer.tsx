import { useState, useRef, useCallback } from 'react'
import { colors } from '../design-system'
import type { ImageElement } from '../types/deck'

interface SlideImageLayerProps {
  images: ImageElement[]
  editable: boolean
  onUpdate: (images: ImageElement[]) => void
}

type HandleType = 'move' | 'resize-se' | 'resize-sw' | 'resize-ne' | 'resize-nw'

export function SlideImageLayer({ images, editable, onUpdate }: SlideImageLayerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    imgId: string
    type: HandleType
    startX: number; startY: number
    origX: number; origY: number; origW: number; origH: number
  } | null>(null)

  const getContainerSize = () => {
    const el = containerRef.current
    return el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 1, h: 1 }
  }

  const updateImage = useCallback((id: string, patch: Partial<ImageElement>) => {
    onUpdate(images.map(img => img.id === id ? { ...img, ...patch } : img))
  }, [images, onUpdate])

  const deleteImage = useCallback((id: string) => {
    onUpdate(images.filter(img => img.id !== id))
    setSelectedId(null)
  }, [images, onUpdate])

  const onPointerDown = (
    e: React.PointerEvent,
    img: ImageElement,
    type: HandleType
  ) => {
    e.stopPropagation()
    e.preventDefault()
    setSelectedId(img.id)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = {
      imgId: img.id, type,
      startX: e.clientX, startY: e.clientY,
      origX: img.x, origY: img.y, origW: img.width, origH: img.height,
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const { w, h } = getContainerSize()
    const dx = ((e.clientX - dragRef.current.startX) / w) * 100
    const dy = ((e.clientY - dragRef.current.startY) / h) * 100
    const { imgId, type, origX, origY, origW, origH } = dragRef.current

    if (type === 'move') {
      updateImage(imgId, {
        x: Math.max(0, Math.min(100 - origW, origX + dx)),
        y: Math.max(0, Math.min(100 - origH, origY + dy)),
      })
    } else if (type === 'resize-se') {
      updateImage(imgId, {
        width:  Math.max(5, origW + dx),
        height: Math.max(5, origH + dy),
      })
    } else if (type === 'resize-sw') {
      updateImage(imgId, {
        x: origX + dx,
        width:  Math.max(5, origW - dx),
        height: Math.max(5, origH + dy),
      })
    } else if (type === 'resize-ne') {
      updateImage(imgId, {
        y: origY + dy,
        width:  Math.max(5, origW + dx),
        height: Math.max(5, origH - dy),
      })
    } else if (type === 'resize-nw') {
      updateImage(imgId, {
        x: origX + dx, y: origY + dy,
        width:  Math.max(5, origW - dx),
        height: Math.max(5, origH - dy),
      })
    }
  }

  const onPointerUp = () => { dragRef.current = null }

  if (images.length === 0 && !editable) return null

  const HANDLE_SIZE = 10
  const HANDLES: { type: HandleType; style: React.CSSProperties }[] = [
    { type: 'resize-nw', style: { top: -HANDLE_SIZE / 2, left:  -HANDLE_SIZE / 2, cursor: 'nw-resize' } },
    { type: 'resize-ne', style: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: 'ne-resize' } },
    { type: 'resize-sw', style: { bottom: -HANDLE_SIZE / 2, left:  -HANDLE_SIZE / 2, cursor: 'sw-resize' } },
    { type: 'resize-se', style: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: 'se-resize' } },
  ]

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: editable ? 'auto' : 'none' }}
      onClick={() => setSelectedId(null)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {images.map(img => {
        const isSelected = selectedId === img.id && editable
        return (
          <div
            key={img.id}
            style={{
              position: 'absolute',
              left: `${img.x}%`,
              top: `${img.y}%`,
              width: `${img.width}%`,
              height: `${img.height}%`,
              outline: isSelected ? `2px solid ${colors.blue}` : 'none',
              outlineOffset: 2,
              cursor: editable ? 'move' : 'default',
              userSelect: 'none',
            }}
            onPointerDown={e => editable && onPointerDown(e, img, 'move')}
            onClick={e => { e.stopPropagation(); setSelectedId(img.id) }}
          >
            <img
              src={img.src}
              alt={img.alt ?? ''}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: img.objectFit ?? 'cover',
                display: 'block',
                pointerEvents: 'none',
              }}
            />

            {/* Resize handles */}
            {isSelected && HANDLES.map(handle => (
              <div
                key={handle.type}
                onPointerDown={e => onPointerDown(e, img, handle.type)}
                style={{
                  position: 'absolute',
                  width: HANDLE_SIZE,
                  height: HANDLE_SIZE,
                  background: '#FFFFFF',
                  border: `2px solid ${colors.blue}`,
                  borderRadius: 2,
                  zIndex: 10,
                  ...handle.style,
                }}
              />
            ))}

            {/* Delete button */}
            {isSelected && (
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); deleteImage(img.id) }}
                style={{
                  position: 'absolute',
                  top: -28, right: 0,
                  background: '#222',
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 10,
                  color: '#FF1C52',
                  cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  zIndex: 20,
                }}
              >
                ✕ Delete image
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
