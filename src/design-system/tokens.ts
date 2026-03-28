// ── Core palette ──────────────────────────────────────────────────────────
export const palette = {
  // Ink family
  ink:        '#0C0C14',
  inkSoft:    '#1A1A24',
  inkMid:     '#2E2E3C',
  inkMuted:   '#70708A',
  inkSubtle:  '#BCBCCC',

  // Surfaces
  surface:    '#F7F6F2',
  surfaceAlt: '#EEEEF8',
  surfaceWarm:'#FCF7F0',

  // Blues
  blue:       '#1A52E8',
  blueDeep:   '#0D2E9A',
  bluePale:   '#E8EFF8',
  blueHover:  '#1644CC',

  // Golds / Amber
  gold:       '#E8961A',
  goldDeep:   '#A86010',
  goldPale:   '#FFF4E0',

  // Forest / Verdant
  forest:     '#1F6640',
  forestDeep: '#0E3820',
  forestPale: '#E8F4EC',

  // Violet / Onyx
  violet:     '#7048F8',
  violetDeep: '#3A1EC8',
  violetPale: '#F0ECFF',
  ghostWhite: '#F2F0FF',

  // Terracotta / Solana
  terra:      '#C04A18',
  terraDeep:  '#7A2A08',
  terraPale:  '#FCF0E8',

  // Semantic
  success:    '#1D9E75',
  warning:    '#E8961A',
  error:      '#E8401A',
  info:       '#1A52E8',

  // Pure
  white:      '#FFFFFF',
  black:      '#000000',

  // Legacy border aliases (used by existing components)
  border:     'rgba(0,0,0,0.08)',
  borderDark: 'rgba(255,255,255,0.08)',
} as const

// ── Typography scale ────────────────────────────────────────────────────────
export const typography = {
  fontSans:  '"DM Sans", system-ui, sans-serif',
  fontMono:  '"DM Mono", "JetBrains Mono", monospace',

  sizeHero:       'clamp(36px, 6.25vw, 96px)',
  sizeHeadlineLg: 'clamp(28px, 4.375vw, 72px)',
  sizeHeadline:   'clamp(22px, 3.5vw, 52px)',
  sizeHeadlineSm: 'clamp(18px, 2.5vw, 36px)',
  sizeBodyLg:     'clamp(14px, 1.375vw, 22px)',
  sizeBody:       'clamp(12px, 1.125vw, 18px)',
  sizeBodySm:     'clamp(10px, 0.875vw, 15px)',
  sizeStatValue:  'clamp(32px, 5.625vw, 80px)',
  sizeStatLabel:  'clamp(11px, 1.125vw, 16px)',
  sizeEyebrow:    'clamp(9px, 0.75vw, 13px)',
  sizeCaption:    'clamp(8px, 0.625vw, 11px)',
  sizeNodeLabel:  'clamp(9px, 0.75vw, 12px)',

  // Legacy aliases used by existing slide components
  sizeTitle:   '32px',
  sizeSection: '24px',
  sizeSmall:   '12px',

  weightLight:   '300',
  weightRegular: '400',
  weightMedium:  '500',
  weightDemi:    '600',

  leadingTight:   '1.0',
  leadingSnug:    '1.1',
  leadingNormal:  '1.5',
  leadingRelaxed: '1.7',

  // Legacy line-height aliases
  lineHeightTight:  '1.1',
  lineHeightSnug:   '1.3',
  lineHeightNormal: '1.5',
  lineHeightRelaxed:'1.7',

  trackingTight:   '-0.035em',
  trackingSnug:    '-0.025em',
  trackingNormal:  '0',
  trackingWide:    '0.06em',
  trackingWidest:  '0.12em',
} as const

// ── Spacing scale (4px base) ────────────────────────────────────────────────
export const spacing = {
  px:   '1px',
  '0':  '0px',
  '1':  '4px',
  '2':  '8px',
  '3':  '12px',
  '4':  '16px',
  '5':  '20px',
  '6':  '24px',
  '8':  '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
  '32': '128px',

  slideGutter:   '80px',
  slideGutterSm: '48px',
  slideGutterXs: '32px',
  gridGap:       '20px',
  gridGapLg:     '32px',

  // Legacy aliases
  stackSm: '8px',
  stackMd: '16px',
  stackLg: '32px',
  stackXl: '48px',
} as const

// ── Border radius ─────────────────────────────────────────────────────────────
export const radius = {
  none: '0px',
  xs:   '2px',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '20px',
  full: '9999px',
} as const

// ── Motion ────────────────────────────────────────────────────────────────────
export const motion = {
  durationInstant: '0ms',
  durationFast:    '120ms',
  durationNormal:  '240ms',
  durationSlow:    '400ms',
  durationBuild:   '600ms',
  easeDefault:  'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut:      'cubic-bezier(0, 0, 0.2, 1)',
  easeIn:       'cubic-bezier(0.4, 0, 1, 1)',
  easeSpring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
  buildTranslateY: '12px',
  buildStagger:    '80ms',
} as const

// ── Elevation (box-shadow) ────────────────────────────────────────────────────
export const elevation = {
  none:    'none',
  sm:      '0 1px 3px rgba(0,0,0,0.08)',
  md:      '0 4px 16px rgba(0,0,0,0.10)',
  lg:      '0 12px 40px rgba(0,0,0,0.14)',
  slide:   '0 40px 80px rgba(0,0,0,0.40)',
} as const

// ── Highlight system ───────────────────────────────────────────────────────────
export const highlights = {
  blue: 'rgba(26, 82, 232, 0.16)',
  gold: 'rgba(232, 150, 26, 0.20)',
  red:  'rgba(232, 64, 26, 0.14)',
  ink:  'rgba(12, 12, 20, 0.10)',
  blueDark: 'rgba(26, 82, 232, 0.30)',
  goldDark: 'rgba(232, 150, 26, 0.30)',
  redDark:  'rgba(232, 64, 26, 0.25)',
  inkDark:  'rgba(242, 240, 255, 0.12)',
} as const

// ── Accent bar dimensions ─────────────────────────────────────────────────────
export const accentBar = {
  widthLeft:   '4px',
  widthTop:    '3px',
  widthFat:    '5px',
} as const

// ── Logo slot dimensions ──────────────────────────────────────────────────────
export const logoSlot = {
  widthSm:   '80px',
  widthMd:   '120px',
  heightSm:  '32px',
  heightMd:  '48px',
  placeholderBg: 'rgba(0,0,0,0.06)',
  placeholderBgDark: 'rgba(255,255,255,0.08)',
} as const

// ── Slide aspect ratio ────────────────────────────────────────────────────────
export const slideAspect = {
  widescreen: '16/9',
  standard:   '4/3',
} as const

// ── CSS custom property export ────────────────────────────────────────────────
export const cssVars = {
  '--color-ink':           palette.ink,
  '--color-ink-soft':      palette.inkSoft,
  '--color-ink-mid':       palette.inkMid,
  '--color-ink-muted':     palette.inkMuted,
  '--color-ink-subtle':    palette.inkSubtle,
  '--color-surface':       palette.surface,
  '--color-surface-alt':   palette.surfaceAlt,
  '--color-surface-warm':  palette.surfaceWarm,
  '--color-blue':          palette.blue,
  '--color-blue-deep':     palette.blueDeep,
  '--color-blue-pale':     palette.bluePale,
  '--color-gold':          palette.gold,
  '--color-forest':        palette.forest,
  '--color-violet':        palette.violet,
  '--color-terra':         palette.terra,
  '--color-success':       palette.success,
  '--color-warning':       palette.warning,
  '--color-error':         palette.error,
  '--font-sans':           typography.fontSans,
  '--font-mono':           typography.fontMono,
  '--duration-fast':       motion.durationFast,
  '--duration-normal':     motion.durationNormal,
  '--ease-default':        motion.easeDefault,
  '--ease-out':            motion.easeOut,
  '--radius-sm':           radius.sm,
  '--radius-md':           radius.md,
  '--radius-lg':           radius.lg,
} as const

// ── Legacy 'colors' export for backward compatibility ──────────────────────────
// Existing components import `colors` — this keeps them working while we migrate
export const colors = {
  blue:       palette.blue,
  blueDim:    palette.blueHover,
  blueLight:  palette.bluePale,
  lavender:   '#CED4FE',
  gold:       palette.gold,
  goldDim:    palette.goldDeep,
  warm:       palette.surfaceWarm,
  red:        palette.error,
  coral:      '#FECED9',
  ink:        palette.ink,
  inkSoft:    palette.inkSoft,
  mutedDark:  palette.inkMuted,
  mutedLight: palette.inkSubtle,
  surface:    palette.surface,
  surfaceAlt: palette.surfaceAlt,
  border:     palette.border,
  borderDark: palette.borderDark,
  success:    palette.success,
} as const
