import { colors } from './tokens'

export type SlideMode = 'dark' | 'light'

// Launch "sandwich" pattern: dark covers/breaks, light content, dark close
export const defaultModeFor = (slideType: string): SlideMode => {
  const darkTypes = ['cover', 'section-break', 'closing', 'full-bleed-dark']
  return darkTypes.includes(slideType) ? 'dark' : 'light'
}

export const darkTheme = {
  bg:          colors.ink,
  bgSecondary: colors.inkSoft,
  textPrimary: colors.surfaceAlt,
  textMuted:   colors.mutedDark,
  accent:      colors.blue,
  accentAlt:   colors.gold,
  border:      colors.borderDark,
} as const

export const lightTheme = {
  bg:          colors.surface,
  bgSecondary: colors.surfaceAlt,
  textPrimary: colors.ink,
  textMuted:   colors.mutedLight,
  accent:      colors.blue,
  accentAlt:   colors.gold,
  border:      colors.border,
} as const

export const getTheme = (mode: SlideMode) =>
  mode === 'dark' ? darkTheme : lightTheme

// Tailwind class helpers for slide mode
export const modeClasses = (mode: SlideMode) => ({
  slide: mode === 'dark'
    ? 'bg-signal-ink text-white'
    : 'bg-signal-surface text-signal-ink',
  heading: mode === 'dark'
    ? 'text-white'
    : 'text-signal-ink',
  body: mode === 'dark'
    ? 'text-signal-muted-dark'
    : 'text-signal-muted-light',
  accent: 'text-signal-blue',
  accentAlt: mode === 'dark' ? 'text-signal-gold' : 'text-signal-blue',
  border: mode === 'dark'
    ? 'border-signal-border-dark'
    : 'border-signal-border',
})
