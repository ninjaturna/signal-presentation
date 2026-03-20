import React from 'react'
import { componentTokens } from '../component-tokens'

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  multiline?: boolean
  rows?: number
  fieldRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>
}

export function Field({
  label, hint, error, multiline, rows = 3,
  fieldRef, style, ...props
}: FieldProps) {
  const t = componentTokens.field
  const baseStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    background: t.bg,
    border: `1px solid ${error ? 'var(--color-error)' : t.border}`,
    borderRadius: t.radius,
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--text-body-sm)',
    color: t.text,
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: `border-color var(--duration-fast) var(--ease-default)`,
    resize: multiline ? 'vertical' : 'none',
    lineHeight: 'var(--leading-relaxed)',
    ...style,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label style={{
          fontSize: 'var(--text-eyebrow)',
          fontWeight: 'var(--weight-demi)',
          color: t.label,
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
        }}>
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          ref={fieldRef as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          style={baseStyle as React.CSSProperties}
          onFocus={e => {
            e.currentTarget.style.borderColor = t.borderFocus
            ;(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>).onFocus?.(e as any)
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = error ? 'var(--color-error)' : t.border
            ;(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>).onBlur?.(e as any)
          }}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={fieldRef as React.Ref<HTMLInputElement>}
          style={baseStyle}
          onFocus={e => {
            e.currentTarget.style.borderColor = t.borderFocus
            props.onFocus?.(e)
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = error ? 'var(--color-error)' : t.border
            props.onBlur?.(e)
          }}
          {...props}
        />
      )}
      {(hint || error) && (
        <span style={{
          fontSize: 'var(--text-micro)',
          color: error ? 'var(--color-error)' : t.label,
          lineHeight: 'var(--leading-normal)',
        }}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
