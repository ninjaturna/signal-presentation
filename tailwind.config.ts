import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        signal: {
          blue:          '#1E5AF2',
          'blue-dim':    '#1749CC',
          'blue-light':  '#E8EFFE',
          lavender:      '#CED4FE',
          gold:          '#FFCC2D',
          'gold-dim':    '#E6B800',
          warm:          '#FFEFE3',
          red:           '#FF1C52',
          coral:         '#FECED9',
          ink:           '#111113',
          'ink-soft':    '#252424',
          'muted-dark':  '#77706F',
          'muted-light': '#908A89',
          surface:       '#FCF8F5',
          white:         '#FFFFFF',
          border:        '#E8E3DF',
          'border-dark': '#333130',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'slide-hero':    ['44px', { lineHeight: '1.1', fontWeight: '600' }],
        'slide-title':   ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'slide-section': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'slide-body':    ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'slide-eyebrow': ['13px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.08em' }],
        'slide-small':   ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'slide-caption': ['10px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      aspectRatio: {
        'slide':    '16 / 9',
        'slide-43': '4 / 3',
      },
    },
  },
  plugins: [],
} satisfies Config
