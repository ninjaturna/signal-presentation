import { useState } from 'react'
import { colors } from '../design-system'

interface ShareMenuProps {
  open: boolean
  onToggle: () => void
}

function getShareOptions() {
  const base = window.location.origin + window.location.pathname
  return [
    {
      id: 'review' as const,
      label: 'Internal review link',
      description: 'Team can view and comment. No AI features.',
      url: `${base}?mode=review`,
      icon: '👁',
    },
    {
      id: 'present' as const,
      label: 'Client view link',
      description: 'Clean read-only. Engagement tracked with opt-in.',
      url: `${base}?mode=present`,
      icon: '🔗',
    },
  ]
}

export function ShareMenu({ open, onToggle }: ShareMenuProps) {
  const [copied, setCopied] = useState<'review' | 'present' | null>(null)

  const copyLink = (id: 'review' | 'present', url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const options = getShareOptions()

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          background: open ? colors.blue : 'transparent',
          border: `1px solid ${open ? colors.blue : colors.borderDark}`,
          borderRadius: 6, padding: '4px 12px',
          fontSize: 12, fontWeight: 600,
          color: open ? '#FFFFFF' : colors.mutedDark,
          cursor: 'pointer',
          fontFamily: '"DM Sans", system-ui, sans-serif',
          transition: 'all 0.15s',
        }}
      >
        Share ↗
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 40, right: 0,
          background: '#16161a',
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 12, padding: '8px 0',
          width: 300, zIndex: 200,
          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: colors.mutedLight,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '4px 16px 10px',
          }}>
            Share link
          </div>

          {options.map(opt => (
            <div key={opt.id} style={{ padding: '10px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: colors.mutedDark, marginTop: 1 }}>{opt.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  readOnly
                  value={opt.url}
                  onFocus={e => e.currentTarget.select()}
                  style={{
                    flex: 1,
                    background: '#111',
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 5, padding: '5px 8px',
                    fontSize: 11, color: colors.mutedDark,
                    fontFamily: '"DM Mono", monospace',
                    outline: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                />
                <button
                  onClick={() => copyLink(opt.id, opt.url)}
                  style={{
                    background: copied === opt.id ? '#1a3a1a' : colors.blue,
                    border: 'none',
                    borderRadius: 5, padding: '5px 10px',
                    fontSize: 11, fontWeight: 600,
                    color: copied === opt.id ? '#4caf50' : '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied === opt.id ? 'Copied!' : 'Copy link'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
