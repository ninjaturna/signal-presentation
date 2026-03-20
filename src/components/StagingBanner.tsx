export function StagingBanner() {
  const isStaging = import.meta.env.VITE_APP_ENV !== 'production'

  if (!isStaging) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#FFCC2D',
      color: '#111113',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      textAlign: 'center',
      padding: '4px 0',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      ⚠ Staging — not for client sharing
    </div>
  )
}
