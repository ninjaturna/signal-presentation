import React from 'react'
import { modeClasses, defaultModeFor } from '../design-system'
import type { SlideMode } from '../design-system'

interface SlideShellProps {
  slideType?: string
  mode?: SlideMode
  children: React.ReactNode
  className?: string
  fullBleed?: boolean
}

export function SlideShell({
  slideType = 'content',
  mode,
  children,
  className = '',
  fullBleed = false,
}: SlideShellProps) {
  const resolvedMode = mode ?? defaultModeFor(slideType)
  const mc = modeClasses(resolvedMode)
  const padding = fullBleed ? '' : 'px-12 py-10'

  return (
    <div
      className={`
        aspect-slide w-full relative overflow-hidden
        flex flex-col
        ${mc.slide}
        ${padding}
        ${className}
      `.trim()}
      data-slide-type={slideType}
      data-slide-mode={resolvedMode}
    >
      {children}
    </div>
  )
}
