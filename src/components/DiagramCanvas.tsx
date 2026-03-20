import React, { useState, useRef, useCallback, useEffect } from 'react'
import { colors } from '../design-system'
import { chartTokens } from '../design-system/chart-tokens'
import type { DiagramData, DiagramNode, DiagramEdge } from '../types/deck'

// ─── Color helpers ────────────────────────────────────────────────────────────

interface NodeColorSet {
  bg: string
  text: string
  subText: string
  border: string
  selectedBorder: string
}

function getNodeColors(color: DiagramNode['color']): NodeColorSet {
  switch (color) {
    case 'blue':
      return {
        bg: chartTokens.sequence[0], text: '#FFFFFF', subText: 'rgba(255,255,255,0.7)',
        border: chartTokens.sequence[0], selectedBorder: '#FFFFFF',
      }
    case 'accent':
      return {
        bg: chartTokens.sequence[1], text: colors.ink, subText: 'rgba(17,17,19,0.6)',
        border: chartTokens.sequence[1], selectedBorder: colors.ink,
      }
    case 'muted':
      return {
        bg: 'transparent', text: chartTokens.neutral, subText: chartTokens.neutral,
        border: colors.borderDark, selectedBorder: chartTokens.primary,
      }
    case 'dark':
    default:
      return {
        bg: colors.inkSoft, text: '#FFFFFF', subText: chartTokens.neutral,
        border: colors.borderDark, selectedBorder: chartTokens.primary,
      }
  }
}

// Auto-scale font based on label length + node width
function labelFontSize(label: string, nodeWidthPx: number): number {
  const base = Math.min(nodeWidthPx * 0.12, 15)
  const lengthPenalty = Math.max(0, label.length - 10) * 0.3
  return Math.max(9, base - lengthPenalty)
}

// ─── Edge arrow path ──────────────────────────────────────────────────────────

function getEdgePoints(
  from: DiagramNode, to: DiagramNode, W: number, H: number
): { x1: number; y1: number; x2: number; y2: number } {
  const fx = ((from.x + from.width / 2) / 100) * W
  const fy = ((from.y + from.height / 2) / 100) * H
  const tx = ((to.x + to.width / 2) / 100) * W
  const ty = ((to.y + to.height / 2) / 100) * H

  const angle = Math.atan2(ty - fy, tx - fx)

  const fHalfW = (from.width / 100 * W) / 2
  const fHalfH = (from.height / 100 * H) / 2
  const tHalfW = (to.width / 100 * W) / 2
  const tHalfH = (to.height / 100 * H) / 2

  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)

  const tFrom = Math.min(
    cosA !== 0 ? Math.abs(fHalfW / cosA) : Infinity,
    sinA !== 0 ? Math.abs(fHalfH / sinA) : Infinity
  )
  const tTo = Math.min(
    cosA !== 0 ? Math.abs(tHalfW / cosA) : Infinity,
    sinA !== 0 ? Math.abs(tHalfH / sinA) : Infinity
  )

  return {
    x1: fx + cosA * (tFrom + 2),
    y1: fy + sinA * (tFrom + 2),
    x2: tx - cosA * (tTo + 10),
    y2: ty - sinA * (tTo + 10),
  }
}

// ─── Node Inspector ───────────────────────────────────────────────────────────

interface NodeInspectorProps {
  node: DiagramNode
  nodeX: number
  nodeY: number
  nodeW: number
  nodeH: number
  onChange: (patch: Partial<DiagramNode>) => void
  onDelete: () => void
  onAddConnected: () => void
}

const COLOR_OPTIONS: Array<{ value: DiagramNode['color']; label: string; swatch: string }> = [
  { value: 'blue',   label: 'Primary',    swatch: chartTokens.sequence[0] },
  { value: 'accent', label: 'Gate',       swatch: chartTokens.sequence[1] },
  { value: 'dark',   label: 'Secondary',  swatch: colors.inkSoft },
  { value: 'muted',  label: 'Annotation', swatch: 'transparent' },
]

function NodeInspector({
  node, nodeX, nodeY, nodeW, nodeH,
  onChange, onDelete, onAddConnected,
}: NodeInspectorProps) {
  const INSPECTOR_H = 140
  const showAbove = nodeY > INSPECTOR_H + 16
  const top = showAbove ? nodeY - INSPECTOR_H - 10 : nodeY + nodeH + 10

  const inspectorW = Math.max(nodeW + 40, 220)
  const left = Math.max(4, nodeX + nodeW / 2 - inspectorW / 2)

  return (
    <div
      style={{
        position: 'absolute',
        top, left,
        width: inspectorW,
        background: '#1a1a1e',
        border: `1px solid ${colors.blue}`,
        borderRadius: 10,
        padding: '10px 12px',
        zIndex: 50,
        boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,90,242,0.2)`,
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}
      onClick={e => e.stopPropagation()}
      onPointerDown={e => e.stopPropagation()}
    >
      {/* Arrow pointer */}
      <div style={{
        position: 'absolute',
        [showAbove ? 'bottom' : 'top']: -6,
        left: '50%', transform: 'translateX(-50%)',
        width: 10, height: 6,
        background: '#1a1a1e',
        clipPath: showAbove
          ? 'polygon(0 0, 100% 0, 50% 100%)'
          : 'polygon(50% 0, 0 100%, 100% 100%)',
      }} />

      {/* Label field */}
      <input
        value={node.label}
        onChange={e => onChange({ label: e.target.value })}
        onKeyDown={e => e.stopPropagation()}
        placeholder="Node label"
        autoFocus
        style={{
          width: '100%', background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 6, padding: '5px 8px',
          fontSize: 13, fontWeight: 600, color: '#FFFFFF',
          outline: 'none', fontFamily: '"DM Sans", system-ui, sans-serif',
          boxSizing: 'border-box' as const,
          marginBottom: 5,
        }}
        onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
        onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
      />

      {/* Sublabel field */}
      <input
        value={node.sublabel ?? ''}
        onChange={e => onChange({ sublabel: e.target.value || undefined })}
        onKeyDown={e => e.stopPropagation()}
        placeholder="Sublabel (optional)"
        style={{
          width: '100%', background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 6, padding: '4px 8px',
          fontSize: 11, color: colors.mutedDark,
          outline: 'none', fontFamily: '"DM Sans", system-ui, sans-serif',
          boxSizing: 'border-box' as const,
          marginBottom: 8,
        }}
        onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
        onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
      />

      {/* Color picker + actions row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {COLOR_OPTIONS.map(opt => (
          <button
            key={opt.value}
            title={opt.label}
            onClick={() => onChange({ color: opt.value })}
            style={{
              width: 18, height: 18, borderRadius: '50%',
              background: opt.swatch,
              border: node.color === opt.value
                ? `2px solid #FFFFFF`
                : `1.5px solid ${colors.borderDark}`,
              cursor: 'pointer', padding: 0, flexShrink: 0,
              outline: node.color === opt.value ? `2px solid ${colors.blue}` : 'none',
              outlineOffset: 1,
            }}
          />
        ))}

        <div style={{ flex: 1 }} />

        <button
          onClick={onAddConnected}
          title="Add connected node"
          style={{
            background: 'transparent',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 5, padding: '2px 7px',
            fontSize: 10, color: colors.mutedDark,
            cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
          }}
        >
          + Node
        </button>

        <button
          onClick={onDelete}
          title="Delete node"
          style={{
            background: 'transparent', border: 'none',
            color: '#555', cursor: 'pointer',
            fontSize: 14, lineHeight: 1, padding: '2px 4px',
          }}
        >
          🗑
        </button>
      </div>
    </div>
  )
}

// ─── Main DiagramCanvas ───────────────────────────────────────────────────────

interface DiagramCanvasProps {
  data: DiagramData
  editable?: boolean
  onChange?: (data: DiagramData) => void
  containerWidth: number
  containerHeight: number
}

export function DiagramCanvas({
  data,
  editable = false,
  onChange,
  containerWidth: W,
  containerHeight: H,
}: DiagramCanvasProps) {
  const [nodes, setNodes] = useState<DiagramNode[]>(() => data.nodes)
  const [edges, setEdges] = useState<DiagramEdge[]>(() => data.edges)
  const [selected, setSelected] = useState<string | null>(null)
  const dragRef = useRef<{
    nodeId: string
    startMouseX: number
    startMouseY: number
    origX: number
    origY: number
    moved: boolean
  } | null>(null)

  // Sync when parent data changes (e.g. after AI regenerate)
  useEffect(() => {
    setNodes(data.nodes)
    setEdges(data.edges)
    setSelected(null)
  }, [data])

  const emit = useCallback((nextNodes: DiagramNode[], nextEdges: DiagramEdge[]) => {
    onChange?.({ nodes: nextNodes, edges: nextEdges })
  }, [onChange])

  const updateNode = useCallback((id: string, patch: Partial<DiagramNode>) => {
    setNodes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, ...patch } : n)
      emit(next, edges)
      return next
    })
  }, [edges, emit])

  const deleteNode = useCallback((id: string) => {
    setNodes(prev => {
      const next = prev.filter(n => n.id !== id)
      const nextEdges = edges.filter(e => e.from !== id && e.to !== id)
      setEdges(nextEdges)
      emit(next, nextEdges)
      return next
    })
    setSelected(null)
  }, [edges, emit])

  const addConnectedNode = useCallback((fromId: string) => {
    const fromNode = nodes.find(n => n.id === fromId)
    if (!fromNode) return

    const newId = `node-${Date.now().toString(36)}`
    const newNode: DiagramNode = {
      id: newId,
      label: 'New node',
      x: Math.min(90, fromNode.x + fromNode.width + 5),
      y: fromNode.y,
      width: fromNode.width,
      height: fromNode.height,
      color: 'dark',
    }
    const newEdge: DiagramEdge = {
      id: `edge-${Date.now().toString(36)}`,
      from: fromId,
      to: newId,
    }
    const nextNodes = [...nodes, newNode]
    const nextEdges = [...edges, newEdge]
    setNodes(nextNodes)
    setEdges(nextEdges)
    emit(nextNodes, nextEdges)
    setSelected(newId)
  }, [nodes, edges, emit])

  // ── Drag handlers ─────────────────────────────────────────────────────────

  const onPointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    if (!editable) return
    e.stopPropagation()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    dragRef.current = {
      nodeId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      origX: node.x,
      origY: node.y,
      moved: false,
    }
  }, [editable, nodes])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const { nodeId, startMouseX, startMouseY, origX, origY } = dragRef.current
    const dx = ((e.clientX - startMouseX) / W) * 100
    const dy = ((e.clientY - startMouseY) / H) * 100

    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      dragRef.current.moved = true
    }

    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    updateNode(nodeId, {
      x: Math.max(0, Math.min(100 - node.width, origX + dx)),
      y: Math.max(0, Math.min(100 - node.height, origY + dy)),
    })
  }, [W, H, nodes, updateNode])

  const onPointerUp = useCallback((_e: React.PointerEvent, nodeId: string) => {
    if (!dragRef.current) return
    const { moved } = dragRef.current
    dragRef.current = null
    if (!moved) {
      setSelected(prev => prev === nodeId ? null : nodeId)
    }
  }, [])

  const selectedNode = nodes.find(n => n.id === selected) ?? null

  return (
    <div
      style={{
        position: 'relative', width: W, height: H,
        userSelect: 'none', overflow: 'visible',
      }}
      onClick={() => setSelected(null)}
    >
      {/* SVG layer: arrows only */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          width: W, height: H,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <defs>
          <marker id="dc-arrow" viewBox="0 0 12 12" refX="10" refY="6"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M1 2 L10 6 L1 10" fill="none"
              stroke={chartTokens.neutral} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
          <marker id="dc-arrow-sel" viewBox="0 0 12 12" refX="10" refY="6"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M1 2 L10 6 L1 10" fill="none"
              stroke={chartTokens.primary} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>

        {edges.map(edge => {
          const fromNode = nodes.find(n => n.id === edge.from)
          const toNode   = nodes.find(n => n.id === edge.to)
          if (!fromNode || !toNode) return null

          const { x1, y1, x2, y2 } = getEdgePoints(fromNode, toNode, W, H)
          const isRelated = selected === edge.from || selected === edge.to
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2 - 6

          return (
            <g key={edge.id}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isRelated ? chartTokens.primary : colors.borderDark}
                strokeWidth={isRelated ? 2 : 1.5}
                markerEnd={isRelated ? 'url(#dc-arrow-sel)' : 'url(#dc-arrow)'}
                strokeOpacity={isRelated ? 1 : 0.7}
              />
              {edge.label && (
                <text
                  x={midX} y={midY}
                  textAnchor="middle"
                  fontSize={Math.max(8, Math.min(11, W * 0.012))}
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

      {/* HTML node layer */}
      {nodes.map(node => {
        const px = (node.x / 100) * W
        const py = (node.y / 100) * H
        const pw = (node.width / 100) * W
        const ph = (node.height / 100) * H
        const { bg, text, subText, border, selectedBorder } = getNodeColors(node.color)
        const isSelected = selected === node.id
        const fontSize = labelFontSize(node.label, pw)
        const subFontSize = Math.max(7, fontSize * 0.8)

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: px, top: py,
              width: pw, height: ph,
              background: bg,
              border: `${isSelected ? 2 : 1.5}px solid ${isSelected ? selectedBorder : border}`,
              borderRadius: 8,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '4px 8px',
              boxSizing: 'border-box',
              cursor: editable ? 'grab' : 'default',
              boxShadow: isSelected
                ? `0 0 0 3px rgba(30,90,242,0.25), 0 4px 12px rgba(0,0,0,0.3)`
                : '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'box-shadow 0.1s, border-color 0.1s',
              zIndex: isSelected ? 10 : 2,
              overflow: 'hidden',
            }}
            onPointerDown={e => onPointerDown(e, node.id)}
            onPointerMove={onPointerMove}
            onPointerUp={e => onPointerUp(e, node.id)}
          >
            <div style={{
              fontSize,
              fontWeight: 700,
              color: text,
              fontFamily: '"DM Sans", system-ui, sans-serif',
              textAlign: 'center',
              lineHeight: 1.2,
              width: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            } as React.CSSProperties}>
              {node.label}
            </div>
            {node.sublabel && (
              <div style={{
                fontSize: subFontSize,
                color: subText,
                fontFamily: '"DM Sans", system-ui, sans-serif',
                textAlign: 'center',
                lineHeight: 1.3,
                marginTop: 2,
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {node.sublabel}
              </div>
            )}
          </div>
        )
      })}

      {/* Floating node inspector */}
      {editable && selectedNode && (() => {
        const px = (selectedNode.x / 100) * W
        const py = (selectedNode.y / 100) * H
        const pw = (selectedNode.width / 100) * W
        const ph = (selectedNode.height / 100) * H
        return (
          <NodeInspector
            node={selectedNode}
            nodeX={px} nodeY={py}
            nodeW={pw} nodeH={ph}

            onChange={patch => updateNode(selectedNode.id, patch)}
            onDelete={() => deleteNode(selectedNode.id)}
            onAddConnected={() => addConnectedNode(selectedNode.id)}
          />
        )
      })()}

      {/* Hint overlay */}
      {editable && !selected && nodes.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 6, left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 9, color: colors.mutedDark,
          fontFamily: '"DM Sans", system-ui, sans-serif',
          letterSpacing: '0.04em', pointerEvents: 'none',
          background: 'rgba(17,17,19,0.6)', borderRadius: 4,
          padding: '2px 8px',
          whiteSpace: 'nowrap' as const,
        }}>
          click to select · drag to move · click + Node to connect
        </div>
      )}
    </div>
  )
}
