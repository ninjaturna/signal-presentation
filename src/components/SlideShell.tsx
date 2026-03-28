import React from 'react'
import { modeClasses, defaultModeFor } from '../design-system'
import type { SlideMode } from '../design-system'
import type { DeckTheme } from '../design-system/themes'

interface SlideShellProps {
  slideType?: string
  mode?: SlideMode
  theme?: DeckTheme
  children: React.ReactNode
  className?: string
  fullBleed?: boolean
  style?: React.CSSProperties
}

export function SlideShell({
  slideType = 'content',
  mode,
  theme,
  children,
  className = '',
  fullBleed = false,
  style,
}: SlideShellProps) {
  const resolvedMode = mode ?? defaultModeFor(slideType)
  const mc = modeClasses(resolvedMode)
  const padding = fullBleed ? '' : 'px-12 py-10'

  // Theme-driven background — overrides Tailwind class when present
  const themeBackground = theme
    ? (resolvedMode === 'dark'
        ? theme.tokens.groundAccent
        : theme.tokens.groundPrimary)
    : undefined

  return (
    <div
      className={`
        aspect-slide w-full relative overflow-hidden
        flex flex-col
        ${mc.slide}
        ${padding}
        ${className}
      `.trim()}
      style={{ ...style, ...(themeBackground ? { background: themeBackground } : {}) }}
      data-slide-type={slideType}
      data-slide-mode={resolvedMode}
    >
      {children}
    </div>
  )
}
