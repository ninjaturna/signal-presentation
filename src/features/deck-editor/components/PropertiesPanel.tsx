import { useState } from 'react'
import type { CanvasElement, TextElement, EmbedElement, TextStyleName } from '../types'
import { TEXT_STYLES, resolveTextStyle, detectEmbedType } from '../utils'
import { colors } from '../../../design-system'

interface PropertiesPanelProps {
  element: CanvasElement | null
  onUpdate: (patch: Partial<CanvasElement>) => void
  onDelete: () => void
}

export function PropertiesPanel({ element, onUpdate, onDelete }: PropertiesPanelProps) {
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkLabel, setNewLinkLabel] = useState('')

  if (!element) {
    return (
      <div style={panelStyle}>
        <div style={{ padding: '20px 16px', fontSize: 12, color: colors.mutedDark, textAlign: 'center', lineHeight: 1.6 }}>
          Select an element<br />to edit its properties
        </div>
      </div>
    )
  }

  const isText = element.type === 'text'
  const isEmbed = element.type === 'embed'
  const textEl = isText ? element as TextElement : null
  const embedEl = isEmbed ? element as EmbedElement : null

  return (
    <div style={panelStyle}>
      {/* Position & size */}
      <Section title="Position">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <Field label="X" value={Math.round(element.x)} onChange={v => onUpdate({ x: +v } as Partial<CanvasElement>)} />
          <Field label="Y" value={Math.round(element.y)} onChange={v => onUpdate({ y: +v } as Partial<CanvasElement>)} />
          <Field label="W" value={Math.round(element.width)} onChange={v => onUpdate({ width: +v } as Partial<CanvasElement>)} />
          <Field label="H" value={Math.round(element.height)} onChange={v => onUpdate({ height: +v } as Partial<CanvasElement>)} />
        </div>
      </Section>

      {/* Text style */}
      {textEl && (
        <Section title="Text Style">
          <select
            value={textEl.styleName}
            onChange={e => onUpdate({ styleName: e.target.value as TextStyleName } as Partial<CanvasElement>)}
            style={selectStyle}
          >
            {(Object.keys(TEXT_STYLES) as TextStyleName[]).map(name => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>

          {/* Style preview */}
          <div style={{
            marginTop: 8,
            padding: '8px 10px',
            background: '#1a1a1e',
            borderRadius: 6,
            fontSize: 10,
            color: colors.mutedDark,
            lineHeight: 1.6,
          }}>
            {(() => {
              const def = resolveTextStyle(textEl.styleName)
              return <>
                {def.fontSize}px · weight {def.fontWeight} · lh {def.lineHeight}
                {def.letterSpacing ? ` · ls ${def.letterSpacing}` : ''}
                {def.textTransform ? ` · ${def.textTransform}` : ''}
                {def.fontStyle ? ` · ${def.fontStyle}` : ''}
              </>
            })()}
          </div>

          <button
            onClick={() => {
              const def = resolveTextStyle(textEl.styleName)
              onUpdate({ color: '#111113' } as Partial<CanvasElement>)
              void def // preset font props are already in styleName
            }}
            style={{ ...smallBtnStyle, marginTop: 6 }}
          >
            Reset to preset defaults
          </button>
        </Section>
      )}

      {/* Embed */}
      {embedEl && (
        <Section title="Embed">
          <div style={{ fontSize: 10, color: colors.mutedDark, marginBottom: 6 }}>
            Type: <span style={{ color: colors.blue }}>{embedEl.embedType}</span>
          </div>
          <label style={labelStyle}>URL</label>
          <input
            value={embedEl.url}
            onChange={e => {
              const url = e.target.value
              onUpdate({ url, embedType: detectEmbedType(url) } as Partial<CanvasElement>)
            }}
            onKeyDown={e => e.stopPropagation()}
            style={inputStyle}
            placeholder="https://..."
          />
          <label style={{ ...labelStyle, marginTop: 6 }}>Label</label>
          <input
            value={embedEl.label ?? ''}
            onChange={e => onUpdate({ label: e.target.value } as Partial<CanvasElement>)}
            onKeyDown={e => e.stopPropagation()}
            style={inputStyle}
            placeholder="Optional label"
          />
        </Section>
      )}

      {/* Link */}
      <Section title="Link">
        {element.link ? (
          <>
            <div style={{ fontSize: 11, color: colors.blue, marginBottom: 4, wordBreak: 'break-all' }}>
              {element.link.label || element.link.url}
            </div>
            <div style={{ fontSize: 10, color: colors.mutedDark, marginBottom: 8, wordBreak: 'break-all' }}>
              {element.link.url}
            </div>
            <button
              onClick={() => onUpdate({ link: undefined } as Partial<CanvasElement>)}
              style={{ ...smallBtnStyle, color: colors.red, borderColor: 'rgba(255,28,82,0.3)' }}
            >
              Remove link
            </button>
          </>
        ) : (
          <>
            <label style={labelStyle}>URL</label>
            <input
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              onKeyDown={e => e.stopPropagation()}
              style={inputStyle}
              placeholder="https://..."
            />
            <label style={{ ...labelStyle, marginTop: 6 }}>Label (optional)</label>
            <input
              value={newLinkLabel}
              onChange={e => setNewLinkLabel(e.target.value)}
              onKeyDown={e => e.stopPropagation()}
              style={inputStyle}
              placeholder="Link label"
            />
            <button
              onClick={() => {
                if (!newLinkUrl.trim()) return
                onUpdate({ link: { url: newLinkUrl.trim(), label: newLinkLabel.trim() || undefined } } as Partial<CanvasElement>)
                setNewLinkUrl('')
                setNewLinkLabel('')
              }}
              disabled={!newLinkUrl.trim()}
              style={{ ...smallBtnStyle, marginTop: 8, opacity: newLinkUrl.trim() ? 1 : 0.4 }}
            >
              Attach link ↗
            </button>
            <p style={{ fontSize: 10, color: colors.mutedDark, marginTop: 6, lineHeight: 1.4 }}>
              Attaching a link renders the element as a blue CTA button in the presentation.
            </p>
          </>
        )}
      </Section>

      {/* Delete */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.borderDark}` }}>
        <button
          onClick={onDelete}
          style={{ ...smallBtnStyle, color: colors.red, borderColor: 'rgba(255,28,82,0.3)', width: '100%' }}
        >
          Delete element
        </button>
      </div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: `1px solid ${colors.borderDark}`, padding: '12px 16px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: colors.mutedDark, marginBottom: 8 }}>
        {title.toUpperCase()}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ ...labelStyle, marginBottom: 2 }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.stopPropagation()}
        style={{ ...inputStyle, width: '100%' }}
      />
    </div>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  width: 220,
  flexShrink: 0,
  background: '#111113',
  borderLeft: `1px solid ${colors.borderDark}`,
  overflowY: 'auto',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 600,
  color: colors.mutedDark,
  marginBottom: 3,
  letterSpacing: '0.04em',
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  background: '#1a1a1e',
  border: `1px solid ${colors.borderDark}`,
  borderRadius: 5,
  padding: '5px 8px',
  fontSize: 12,
  color: '#fff',
  outline: 'none',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}

const selectStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: '#1a1a1e',
  border: `1px solid ${colors.borderDark}`,
  borderRadius: 5,
  padding: '5px 8px',
  fontSize: 12,
  color: '#fff',
  fontFamily: '"DM Sans", system-ui, sans-serif',
  cursor: 'pointer',
}

const smallBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${colors.borderDark}`,
  borderRadius: 5,
  padding: '5px 10px',
  fontSize: 11,
  fontWeight: 600,
  color: colors.mutedDark,
  cursor: 'pointer',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}
