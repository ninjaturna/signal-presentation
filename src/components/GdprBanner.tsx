import { useState, useEffect } from 'react'
import { colors } from '../design-system'

interface GdprBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export function GdprBanner({ onAccept, onDecline }: GdprBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('signal_gdpr_consent')
    if (!consent) setVisible(true)
    else if (consent === 'accepted') onAccept()
  }, [])

  if (!visible) return null

  const handleAccept = () => {
    localStorage.setItem('signal_gdpr_consent', 'accepted')
    setVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('signal_gdpr_consent', 'declined')
    setVisible(false)
    onDecline()
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#16161a', borderTop: '1px solid #1e1e24',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, flexWrap: 'wrap',
    }}>
      <p style={{ fontSize: 13, color: '#666', margin: 0, flex: 1, lineHeight: 1.5 }}>
        This presentation uses anonymous tracking to help understand how you engage with this content.{' '}
        <span style={{ color: '#444' }}>No personal data is collected.</span>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={handleDecline} style={{
          background: 'transparent', border: '1px solid #222',
          borderRadius: 6, padding: '7px 14px', fontSize: 12,
          color: '#444', cursor: 'pointer',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          Decline
        </button>
        <button onClick={handleAccept} style={{
          background: colors.blue, border: 'none',
          borderRadius: 6, padding: '7px 14px', fontSize: 12,
          fontWeight: 600, color: '#fff', cursor: 'pointer',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          Accept
        </button>
      </div>
    </div>
  )
}
