export const colors = {
  // Core brand
  blue:       '#1E5AF2',   // Primary CTA, interactive, highlights (dark mode)
  blueDim:    '#1749CC',   // Hover state for blue
  blueLight:  '#E8EFFE',   // Blue tint for light mode backgrounds
  lavender:   '#CED4FE',   // Supporting accent

  gold:       '#FFCC2D',   // Highlights on light mode, strong accents
  goldDim:    '#E6B800',   // Hover state for gold
  warm:       '#FFEFE3',   // Soft highlights, light mode accent (also N5)

  red:        '#FF1C52',   // Warning / corrective only
  coral:      '#FECED9',   // Soft red, supporting

  // Neutrals
  ink:        '#111113',   // Dark mode primary background
  inkSoft:    '#252424',   // Dark mode secondary background
  mutedDark:  '#77706F',   // Muted text on dark
  mutedLight: '#908A89',   // Lighter muted text

  surface:    '#FCF8F5',   // Light mode primary background
  surfaceAlt: '#FFFFFF',   // Pure white — cards on light
  border:     '#E8E3DF',   // Light mode border
  borderDark: '#333130',   // Dark mode border
} as const

export const typography = {
  fontSans:  '"DM Sans", system-ui, sans-serif',
  fontMono:  '"DM Mono", "JetBrains Mono", monospace',

  // Scale (mirrors Launch deck type rules)
  sizeHero:    '44px',   // Cover / big statement
  sizeTitle:   '32px',   // Slide title
  sizeSection: '24px',   // Section header
  sizeBody:    '16px',   // Body / description
  sizeEyebrow: '13px',   // Uppercase label
  sizeSmall:   '12px',   // Small label
  sizeCaption: '10px',   // Footnote / caption

  // Weight — SIGNAL uses named weights, never CSS bold shortcut
  weightLight:   '300',
  weightRegular: '400',
  weightMedium:  '500',
  weightDemi:    '600',  // Equivalent to Avenir "Demi" — use for all headings

  lineHeightTight:  '1.1',
  lineHeightSnug:   '1.3',
  lineHeightNormal: '1.5',
  lineHeightRelaxed:'1.7',
} as const

export const spacing = {
  slideGutter:   '48px',   // Outer padding on all sides of a slide
  slideGutterSm: '32px',   // Compact slides
  gridGap:       '24px',   // Default gap between grid items
  stackSm:       '8px',
  stackMd:       '16px',
  stackLg:       '32px',
  stackXl:       '48px',
} as const

export const radius = {
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '20px',
  full: '9999px',
} as const

export const slideAspect = {
  widescreen: '16/9',
  standard:   '4/3',
} as const

// CSS variable references — use in inline styles instead of raw hex values
// when component-tokens don't cover the case
export const cssVars = {
  blue:         'var(--color-blue)',
  blueHover:    'var(--color-blue-hover)',
  blueSubtle:   'var(--color-blue-subtle)',
  gold:         'var(--color-gold)',
  goldSubtle:   'var(--color-gold-subtle)',
  ink:          'var(--color-ink)',
  inkRaised:    'var(--color-ink-raised)',
  inkElevated:  'var(--color-ink-elevated)',
  inkBorder:    'var(--color-ink-border)',
  surface:      'var(--color-surface)',
  surfaceCard:  'var(--color-surface-card)',
  border:       'var(--color-border)',
  textDark:     'var(--color-text-primary-dark)',
  textLight:    'var(--color-text-primary-light)',
  mutedDark:    'var(--color-text-muted-dark)',
  mutedLight:   'var(--color-text-muted-light)',
  success:      'var(--color-success)',
  error:        'var(--color-error)',
  warning:      'var(--color-warning)',
} as const
