export interface DeckTheme {
  id: string
  name: string
  description: string
  layout: 'classic' | 'modernist' | 'noir' | 'architect' | 'minimal' | 'contrast'
  tokens: {
    // Core color
    primary: string
    coverBg: string
    coverText: string
    sectionBg: string
    accentBar: string
    statColor: string
    // Layout personality — theme sets defaults, per-slide layout overrides
    coverLayout: 'default' | 'centered' | 'bold' | 'split' | 'editorial' | 'cinematic'
    narrativeLayout: 'default' | 'centered' | 'minimal' | 'editorial'
    statLayout: 'default' | 'bold' | 'oversized'
    closingLayout: 'default' | 'centered' | 'minimal' | 'cinematic'
    // Geometric accent system
    accentShape: 'bar' | 'circle' | 'grid' | 'diagonal' | 'none'
    accentColor: string
    accentSecondary: string
    // Typography scale
    headlineScale: 'normal' | 'large' | 'massive'
    // Surface
    cardBg: string
    cardBorder: string
    // Body / muted text on dark slides
    bodyText: string
  }
}

export const DECK_THEMES: DeckTheme[] = [
  {
    id: 'signal-default',
    name: 'Signal',
    description: 'Blue on ink. The default.',
    layout: 'classic',
    tokens: {
      primary:         '#1E5AF2',
      coverBg:         '#111113',
      coverText:       '#FFFFFF',
      sectionBg:       '#1E5AF2',
      accentBar:       '#1E5AF2',
      statColor:       '#1E5AF2',
      coverLayout:     'default',
      narrativeLayout: 'default',
      statLayout:      'default',
      closingLayout:   'default',
      accentShape:     'bar',
      accentColor:     '#1E5AF2',
      accentSecondary: '#FFCC2D',
      headlineScale:   'normal',
      cardBg:          '#1a1a1e',
      cardBorder:      '#333130',
      bodyText:        '#77706F',
    },
  },
  {
    id: 'signal-modernist',
    name: 'Modernist',
    description: 'Editorial boldness. Type as architecture.',
    layout: 'modernist',
    tokens: {
      primary:         '#FF2D2D',
      coverBg:         '#0A0A0A',
      coverText:       '#FFFFFF',
      sectionBg:       '#0A0A0A',
      accentBar:       '#FF2D2D',
      statColor:       '#FF2D2D',
      coverLayout:     'editorial',
      narrativeLayout: 'editorial',
      statLayout:      'oversized',
      closingLayout:   'cinematic',
      accentShape:     'grid',
      accentColor:     '#FF2D2D',
      accentSecondary: '#FFFFFF',
      headlineScale:   'massive',
      cardBg:          '#141414',
      cardBorder:      '#2a2a2a',
      bodyText:        '#999999',
    },
  },
  {
    id: 'signal-noir',
    name: 'Noir',
    description: 'Dark luxury. Restrained power.',
    layout: 'noir',
    tokens: {
      primary:         '#C9A84C',
      coverBg:         '#080808',
      coverText:       '#F5F0E8',
      sectionBg:       '#0D0D0D',
      accentBar:       '#C9A84C',
      statColor:       '#C9A84C',
      coverLayout:     'cinematic',
      narrativeLayout: 'minimal',
      statLayout:      'bold',
      closingLayout:   'cinematic',
      accentShape:     'diagonal',
      accentColor:     '#C9A84C',
      accentSecondary: '#4A3728',
      headlineScale:   'large',
      cardBg:          '#111111',
      cardBorder:      '#1E1E1E',
      bodyText:        '#888880',
    },
  },
  {
    id: 'signal-architect',
    name: 'Architect',
    description: 'Structural. Clean lines. Swiss precision.',
    layout: 'architect',
    tokens: {
      primary:         '#0066FF',
      coverBg:         '#F7F7F5',
      coverText:       '#0A0A0A',
      sectionBg:       '#0A0A0A',
      accentBar:       '#0066FF',
      statColor:       '#0066FF',
      coverLayout:     'split',
      narrativeLayout: 'editorial',
      statLayout:      'oversized',
      closingLayout:   'default',
      accentShape:     'circle',
      accentColor:     '#0066FF',
      accentSecondary: '#E8E8E4',
      headlineScale:   'large',
      cardBg:          '#EFEFEC',
      cardBorder:      '#D8D8D4',
      bodyText:        '#555550',
    },
  },
  {
    id: 'signal-gold',
    name: 'Gold',
    description: 'Warm and premium.',
    layout: 'classic',
    tokens: {
      primary:         '#FFCC2D',
      coverBg:         '#111113',
      coverText:       '#FFCC2D',
      sectionBg:       '#FFCC2D',
      accentBar:       '#FFCC2D',
      statColor:       '#FFCC2D',
      coverLayout:     'bold',
      narrativeLayout: 'default',
      statLayout:      'bold',
      closingLayout:   'default',
      accentShape:     'bar',
      accentColor:     '#FFCC2D',
      accentSecondary: '#333120',
      headlineScale:   'large',
      cardBg:          '#1a1a1e',
      cardBorder:      '#333130',
      bodyText:        '#77706F',
    },
  },
  {
    id: 'signal-frost',
    name: 'Frost',
    description: 'Light background, high contrast.',
    layout: 'minimal',
    tokens: {
      primary:         '#1E5AF2',
      coverBg:         '#FCF8F5',
      coverText:       '#111113',
      sectionBg:       '#111113',
      accentBar:       '#1E5AF2',
      statColor:       '#1E5AF2',
      coverLayout:     'default',
      narrativeLayout: 'default',
      statLayout:      'default',
      closingLayout:   'default',
      accentShape:     'bar',
      accentColor:     '#1E5AF2',
      accentSecondary: '#E8EFFE',
      headlineScale:   'normal',
      cardBg:          '#FFFFFF',
      cardBorder:      '#E8E3DF',
      bodyText:        '#77706F',
    },
  },
  {
    id: 'signal-ink',
    name: 'Ink',
    description: 'Maximum contrast. All black.',
    layout: 'contrast',
    tokens: {
      primary:         '#FFFFFF',
      coverBg:         '#000000',
      coverText:       '#FFFFFF',
      sectionBg:       '#000000',
      accentBar:       '#FFFFFF',
      statColor:       '#FFFFFF',
      coverLayout:     'bold',
      narrativeLayout: 'minimal',
      statLayout:      'oversized',
      closingLayout:   'cinematic',
      accentShape:     'none',
      accentColor:     '#FFFFFF',
      accentSecondary: '#333333',
      headlineScale:   'massive',
      cardBg:          '#0D0D0D',
      cardBorder:      '#1A1A1A',
      bodyText:        '#666666',
    },
  },
]
