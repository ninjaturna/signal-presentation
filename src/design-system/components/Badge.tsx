import React from 'react'
import { componentTokens } from '../component-tokens'

type BadgeVariant = 'blue' | 'gold' | 'green' | 'red' | 'muted'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Badge({ variant = 'muted', size = 'md', dot, children, style }: BadgeProps) {
  const t = componentTokens.badge[variant]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: t.bg,
      color: t.text,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-full)',
      padding: size === 'sm' ? '1px 6px' : '2px 8px',
      fontSize: size === 'sm' ? 'var(--text-nano)' : 'var(--text-eyebrow)',
      fontWeight: 'var(--weight-demi)',
      fontFamily: 'var(--font-sans)',
      letterSpacing: 'var(--tracking-wide)',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {dot && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: t.text, flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  )
}
