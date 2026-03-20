import { colors } from '../design-system'
import type { SignalError } from '../utils/signalErrors'

interface ErrorMessageProps {
  error: SignalError
  compact?: boolean
}

const SEVERITY_STYLES = {
  info: {
    icon: 'ℹ',
    bg: 'rgba(255,255,255,0.04)',
    border: colors.borderDark,
    iconColor: colors.mutedDark,
    codeColor: colors.mutedDark,
  },
  warning: {
    icon: '⚠',
    bg: 'rgba(255,204,45,0.06)',
    border: 'rgba(255,204,45,0.25)',
    iconColor: colors.gold,
    codeColor: colors.gold,
  },
  error: {
    icon: '✕',
    bg: 'rgba(255,28,82,0.06)',
    border: 'rgba(255,28,82,0.25)',
    iconColor: '#FF1C52',
    codeColor: '#FF1C52',
  },
}

export function ErrorMessage({ error, compact = false }: ErrorMessageProps) {
  const style = SEVERITY_STYLES[error.severity]

  if (compact) {
    return (
      <span style={{
        fontSize: 11, color: style.iconColor,
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}>
        {style.icon} {error.message}
      </span>
    )
  }

  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: 8,
      padding: '10px 12px',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      maxWidth: '90%',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        marginBottom: error.hint ? 6 : 0,
      }}>
        <span style={{ fontSize: 12, color: style.iconColor, flexShrink: 0, marginTop: 1 }}>
          {style.icon}
        </span>
        <span style={{ fontSize: 12, color: '#FFFFFF', lineHeight: 1.5 }}>
          {error.message}
        </span>
      </div>

      {error.hint && (
        <div style={{
          fontSize: 11, color: colors.mutedDark,
          lineHeight: 1.5, paddingLeft: 20,
        }}>
          {error.hint}
        </div>
      )}

      <div style={{
        fontSize: 9, color: style.codeColor,
        opacity: 0.5, textAlign: 'right' as const,
        marginTop: 4, letterSpacing: '0.06em',
        fontFamily: '"DM Mono", monospace',
      }}>
        {error.code}
      </div>
    </div>
  )
}
