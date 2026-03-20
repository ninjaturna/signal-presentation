// src/design-system/component-tokens.ts
// Semantic component aliases — import these in components instead of raw values

export const componentTokens = {
  // Buttons
  btn: {
    primary: {
      bg:         'var(--color-blue)',
      bgHover:    'var(--color-blue-hover)',
      text:       '#FFFFFF',
      radius:     'var(--radius-md)',
      shadow:     'var(--shadow-blue)',
    },
    secondary: {
      bg:         'transparent',
      bgHover:    'var(--color-blue-subtle)',
      text:       'var(--color-blue)',
      border:     'var(--color-blue)',
      radius:     'var(--radius-md)',
    },
    ghost: {
      bg:         'transparent',
      bgHover:    'rgba(255,255,255,0.06)',
      text:       'var(--color-text-muted-dark)',
      border:     'var(--color-ink-border)',
      radius:     'var(--radius-md)',
    },
    danger: {
      bg:         'rgba(255,28,82,0.1)',
      bgHover:    'rgba(255,28,82,0.2)',
      text:       'var(--color-error)',
      border:     'rgba(255,28,82,0.3)',
      radius:     'var(--radius-md)',
    },
    gold: {
      bg:         'var(--color-gold)',
      bgHover:    'var(--color-gold-hover)',
      text:       'var(--color-ink)',
      radius:     'var(--radius-md)',
    },
  },

  // Form fields
  field: {
    bg:           'var(--color-ink-elevated)',
    border:       'var(--color-ink-border)',
    borderFocus:  'var(--color-blue)',
    text:         '#FFFFFF',
    placeholder:  'var(--color-text-muted-dark)',
    label:        'var(--color-text-muted-dark)',
    radius:       'var(--radius-md)',
  },

  // Cards
  card: {
    bg:           'var(--color-ink-raised)',
    bgHover:      'var(--color-ink-elevated)',
    border:       'var(--color-ink-border)',
    borderHover:  'var(--color-blue)',
    radius:       'var(--radius-lg)',
    shadow:       'none',
  },

  // Badges
  badge: {
    blue:   { bg: 'rgba(30,90,242,0.15)',   text: 'var(--color-blue)',    border: 'rgba(30,90,242,0.3)' },
    gold:   { bg: 'rgba(255,204,45,0.12)',  text: 'var(--color-gold)',    border: 'rgba(255,204,45,0.3)' },
    green:  { bg: 'rgba(29,158,117,0.12)', text: '#1D9E75',              border: 'rgba(29,158,117,0.3)' },
    red:    { bg: 'rgba(255,28,82,0.12)',   text: 'var(--color-error)',   border: 'rgba(255,28,82,0.3)' },
    muted:  { bg: 'rgba(255,255,255,0.05)', text: 'var(--color-text-muted-dark)', border: 'var(--color-ink-border)' },
  },

  // Slide shells
  slide: {
    dark: {
      bg:       'var(--color-ink)',
      text:     '#FFFFFF',
      muted:    'var(--color-text-muted-dark)',
      border:   'var(--color-ink-border)',
      accent:   'var(--color-blue)',
    },
    light: {
      bg:       'var(--color-surface)',
      text:     'var(--color-ink)',
      muted:    'var(--color-text-muted-light)',
      border:   'var(--color-border)',
      accent:   'var(--color-blue)',
    },
  },
} as const
