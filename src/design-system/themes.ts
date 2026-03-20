export interface DeckTheme {
  id: string
  name: string
  description: string
  tokens: {
    primary: string    // accent color (replaces blue in active elements)
    coverBg: string    // cover slide background
    coverText: string  // cover slide headline color
    sectionBg: string  // section break background
    accentBar: string  // decorative bars/lines
    statColor: string  // stat number color
  }
  layout: 'classic' | 'bold' | 'minimal' | 'editorial' | 'contrast'
}

export const DECK_THEMES: DeckTheme[] = [
  {
    id: 'signal-default',
    name: 'Signal',
    description: 'Blue on ink. The default.',
    tokens: {
      primary:    '#1E5AF2',
      coverBg:    '#111113',
      coverText:  '#FFFFFF',
      sectionBg:  '#1E5AF2',
      accentBar:  '#1E5AF2',
      statColor:  '#1E5AF2',
    },
    layout: 'classic',
  },
  {
    id: 'signal-gold',
    name: 'Gold',
    description: 'Warm and premium.',
    tokens: {
      primary:    '#FFCC2D',
      coverBg:    '#111113',
      coverText:  '#FFCC2D',
      sectionBg:  '#FFCC2D',
      accentBar:  '#FFCC2D',
      statColor:  '#FFCC2D',
    },
    layout: 'bold',
  },
  {
    id: 'signal-frost',
    name: 'Frost',
    description: 'Light background, high contrast.',
    tokens: {
      primary:    '#1E5AF2',
      coverBg:    '#FCF8F5',
      coverText:  '#111113',
      sectionBg:  '#111113',
      accentBar:  '#1E5AF2',
      statColor:  '#1E5AF2',
    },
    layout: 'minimal',
  },
  {
    id: 'signal-slate',
    name: 'Slate',
    description: 'Muted and editorial.',
    tokens: {
      primary:    '#908A89',
      coverBg:    '#1a1a1c',
      coverText:  '#FFFFFF',
      sectionBg:  '#252424',
      accentBar:  '#908A89',
      statColor:  '#FFFFFF',
    },
    layout: 'editorial',
  },
  {
    id: 'signal-ink',
    name: 'Ink',
    description: 'Maximum contrast. All black.',
    tokens: {
      primary:    '#FFFFFF',
      coverBg:    '#000000',
      coverText:  '#FFFFFF',
      sectionBg:  '#000000',
      accentBar:  '#FFFFFF',
      statColor:  '#FFFFFF',
    },
    layout: 'contrast',
  },
]
