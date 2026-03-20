import { useState, useRef, useCallback, useEffect } from 'react'
import type { DiagramData, DiagramNode } from '../types/deck'
import { colors } from '../design-system'
import type { SlideMode } from '../design-system'

interface DiagramCanvasProps {
  data: DiagramData
  editable?: boolean
  mode?: SlideMode
  onChange?: (data: DiagramData) => void
}

export function DiagramCanvas({ data, editable = true, mode = 'light', onChange }: DiagramCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 800, h: 400 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const dragRef = useRef<{
    nodeId: string
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) setDims({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const nodeCenter = (node: DiagramNode) => ({
    x: (node.x + node.width / 2) / 100 * dims.w,
    y: (node.y + node.height / 2) / 100 * dims.h,
  })

  const onPointerDownNode = useCallback((e: React.PointerEvent, node: DiagramNode) => {
    if (!editable || editingId === node.id) return
    e.stopPropagation()
    setSelectedId(node.id)
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    dragRef.current = {
      nodeId: node.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.x,
      origY: node.y,
    }
  }, [editable, editingId])

  const onPointerMoveNode = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const dx = (e.clientX - dragRef.current.startX) / rect.width * 100
    const dy = (e.clientY - dragRef.current.startY) / rect.height * 100
    const newX = Math.max(0, Math.min(95, dragRef.current.origX + dx))
    const newY = Math.max(0, Math.min(90, dragRef.current.origY + dy))
    onChange?.({
      ...data,
      nodes: data.nodes.map(n =>
        n.id === dragRef.current!.nodeId ? { ...n, x: newX, y: newY } : n
      ),
    })
  }, [data, onChange])

  const onPointerUpNode = useCallback(() => {
    dragRef.current = null
  }, [])

  const startEdit = useCallback((e: React.MouseEvent, node: DiagramNode) => {
    if (!editable) return
    e.stopPropagation()
    setEditingId(node.id)
    setEditDraft(node.label)
  }, [editable])

  const commitEdit = useCallback(() => {
    if (!editingId) return
    onChange?.({
      ...data,
      nodes: data.nodes.map(n =>
        n.id === editingId ? { ...n, label: editDraft.trim() || n.label } : n
      ),
    })
    setEditingId(null)
    setEditDraft('')
  }, [editingId, editDraft, data, onChange])

  const textColor = mode === 'dark' ? '#FFFFFF' : colors.ink

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onClick={() => setSelectedId(null)}
    >
      {/* SVG edge layer */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
        width={dims.w}
        height={dims.h}
      >
        <defs>
          <marker
            id="signal-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={colors.mutedDark} />
          </marker>
        </defs>
        {data.edges.map(edge => {
          const fromNode = data.nodes.find(n => n.id === edge.from)
          const toNode = data.nodes.find(n => n.id === edge.to)
          if (!fromNode || !toNode) return null
          const from = nodeCenter(fromNode)
          const to = nodeCenter(toNode)
          const midX = (from.x + to.x) / 2
          const midY = (from.y + to.y) / 2
          return (
            <g key={edge.id}>
              <path
                d={`M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`}
                stroke={colors.borderDark}
                strokeWidth={1.5}
                fill="none"
                markerEnd="url(#signal-arrow)"
              />
              {edge.label && (
                <text
                  x={midX}
                  y={midY - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill={colors.mutedDark}
                  fontFamily='"DM Sans", system-ui, sans-serif'
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Node divs */}
      {data.nodes.map(node => {
        const isSelected = selectedId === node.id
        const isEditing = editingId === node.id
        const nodeBg =
          node.style === 'primary' ? colors.blue
          : node.style === 'accent' ? colors.gold
          : mode === 'dark' ? '#252424' : '#FFFFFF'
        const nodeText =
          node.style === 'primary' || node.style === 'accent' ? '#FFFFFF' : textColor
        const sublabelColor =
          node.style === 'primary' ? 'rgba(255,255,255,0.65)'
          : node.style === 'accent' ? 'rgba(17,17,19,0.65)'
          : colors.mutedDark

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.width}%`,
              height: `${node.height}%`,
              background: nodeBg,
              borderRadius: 8,
              border: isSelected
                ? `2px solid ${colors.blue}`
                : `1px solid ${mode === 'dark' ? colors.borderDark : 'rgba(0,0,0,0.12)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: editable ? (isEditing ? 'text' : 'move') : 'default',
              boxSizing: 'border-box',
              padding: '8px 12px',
              userSelect: 'none',
              boxShadow: mode === 'dark' ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
            }}
            onPointerDown={e => onPointerDownNode(e, node)}
            onPointerMove={onPointerMoveNode}
            onPointerUp={onPointerUpNode}
            onDoubleClick={e => startEdit(e, node)}
            onClick={e => { e.stopPropagation(); setSelectedId(node.id) }}
          >
            {isEditing ? (
              <input
                autoFocus
                value={editDraft}
                onChange={e => setEditDraft(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => {
                  e.stopPropagation()
                  if (e.key === 'Enter') commitEdit()
                  if (e.key === 'Escape') { setEditingId(null); setEditDraft('') }
                }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: nodeText,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  textAlign: 'center',
                  width: '100%',
                }}
              />
            ) : (
              <>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: nodeText,
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}>
                  {node.label}
                </span>
                {node.sublabel && (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: sublabelColor,
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    textAlign: 'center',
                    marginTop: 3,
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}>
                    {node.sublabel}
                  </span>
                )}
              </>
            )}
          </div>
        )
      })}

      {/* Drag hint */}
      {editable && data.nodes.length > 0 && !selectedId && !editingId && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10,
          color: colors.mutedDark,
          fontFamily: '"DM Sans", system-ui, sans-serif',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          background: mode === 'dark' ? 'rgba(17,17,19,0.7)' : 'rgba(255,255,255,0.8)',
          padding: '3px 8px',
          borderRadius: 4,
          backdropFilter: 'blur(4px)',
        }}>
          drag to move · double-click to edit text
        </div>
      )}
    </div>
  )
}
