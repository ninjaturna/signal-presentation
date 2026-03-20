import React from 'react'
import { componentTokens } from '../component-tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

const sizes = {
  sm: { padding: '4px 10px',  fontSize: 'var(--text-nano)',    height: 28 },
  md: { padding: '7px 16px',  fontSize: 'var(--text-body-sm)', height: 36 },
  lg: { padding: '10px 24px', fontSize: 'var(--text-body)',    height: 44 },
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  fullWidth,
  children,
  style,
  ...props
}: ButtonProps) {
  const t = componentTokens.btn[variant]
  const s = sizes[size]

  return (
    <button
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        background: t.bg,
        color: t.text,
        border: 'border' in t ? `1px solid ${t.border}` : 'none',
        borderRadius: t.radius,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 'var(--weight-demi)',
        fontFamily: 'var(--font-sans)',
        height: s.height,
        width: fullWidth ? '100%' : 'auto',
        cursor: props.disabled ? 'default' : 'pointer',
        opacity: props.disabled ? 0.4 : 1,
        transition: `all var(--duration-fast) var(--ease-default)`,
        whiteSpace: 'nowrap',
        letterSpacing: 'var(--tracking-wide)',
        textDecoration: 'none',
        boxShadow: 'shadow' in t ? t.shadow : 'none',
        ...style,
      }}
      onMouseEnter={e => {
        if (!props.disabled) {
          const token = t as { bg: string; bgHover?: string }
          ;(e.currentTarget as HTMLButtonElement).style.background = token.bgHover ?? token.bg
        }
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = t.bg
        props.onMouseLeave?.(e)
      }}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
}

function Spinner() {
  return (
    <span style={{
      width: 12, height: 12,
      borderRadius: '50%',
      border: '1.5px solid rgba(255,255,255,0.3)',
      borderTopColor: '#FFFFFF',
      animation: 'signal-spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}
