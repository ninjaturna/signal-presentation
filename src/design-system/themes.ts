export interface DeckTheme {
  id: string
  name: string
  tagline: string
  description: string

  tokens: {
    // Ground colors (slide backgrounds)
    groundPrimary:   string
    groundSecondary: string
    groundAccent:    string

    // Text colors
    textPrimary:     string
    textSecondary:   string
    textMuted:       string
    textReversed:    string

    // Accent system
    accent:          string
    accentDeep:      string
    accentPale:      string
    accentText:      string

    // Data / stats
    statValue:       string
    statCard:        string
    statBorder:      string
    statBorderTop:   string

    // Diagram
    nodeDefault:     string
    nodeAccent:      string
    edgeColor:       string

    // Highlight emphasis
    hlPrimary:       string
    hlSecondary:     string
    hlDanger:        string

    // Accent bar
    barLeft:         string
    barTop:          string
  }

  style: {
    accentBarPosition: 'left' | 'top' | 'none'
    accentBarSize:     'sm' | 'md' | 'lg'
    coverLayout:       'left-aligned' | 'centered'
    statCardStyle:     'bordered' | 'top-border' | 'borderless'
    headlineWeight:    '200' | '300' | '400'
    bodyWeight:        '300' | '400'
    fontSans:          string
    pullquoteStyle:    'border-left' | 'background' | 'italic-only'
  }

  selector: {
    industrySignals:   string[]
    toneSignals:       string[]
    deckTypeSignals:   string[]
    clientSignals:     string[]
    avoid:             string[]
    priority:          number
  }
}

const meridian: DeckTheme = {
  id: 'meridian',
  name: 'Meridian',
  tagline: 'Corporate precision',
  description: 'Warm white surface, deep ink, electric blue accent. The default choice for enterprise technology, consulting, finance.',

  tokens: {
    groundPrimary:   '#F7F6F2',
    groundSecondary: '#EEEEF8',
    groundAccent:    '#0C0C14',
    textPrimary:     '#0C0C14',
    textSecondary:   '#3A3A4A',
    textMuted:       '#70708A',
    textReversed:    '#F7F6F2',
    accent:          '#1A52E8',
    accentDeep:      '#0D2E9A',
    accentPale:      '#E8EFF8',
    accentText:      '#0D2E9A',
    statValue:       '#1A52E8',
    statCard:        '#EEEEF8',
    statBorder:      'rgba(26,82,232,0.15)',
    statBorderTop:   '#1A52E8',
    nodeDefault:     '#EEEEF8',
    nodeAccent:      '#1A52E8',
    edgeColor:       'rgba(26,82,232,0.45)',
    hlPrimary:       'rgba(26,82,232,0.15)',
    hlSecondary:     'rgba(232,150,26,0.18)',
    hlDanger:        'rgba(232,64,26,0.13)',
    barLeft:         '#1A52E8',
    barTop:          '#1A52E8',
  },
  style: {
    accentBarPosition: 'left',
    accentBarSize:     'md',
    coverLayout:       'left-aligned',
    statCardStyle:     'bordered',
    headlineWeight:    '300',
    bodyWeight:        '300',
    fontSans:          '"DM Sans", system-ui, sans-serif',
    pullquoteStyle:    'border-left',
  },
  selector: {
    industrySignals:  ['technology', 'consulting', 'finance', 'banking', 'insurance', 'enterprise', 'saas', 'software', 'b2b', 'telecommunications', 'audit', 'advisory'],
    toneSignals:      ['precision', 'authority', 'corporate', 'professional', 'strategic', 'analytical', 'credible', 'structured'],
    deckTypeSignals:  ['proposal', 'pitch', 'capabilities', 'rfi', 'rfp', 'due diligence', 'partnership', 'co-sell'],
    clientSignals:    ['accenture', 'deloitte', 'pwc', 'kpmg', 'microsoft', 'salesforce', 'servicenow', 'ibm', 'ntt', 'launch'],
    avoid:            [],
    priority:         3,
  },
}

const forge: DeckTheme = {
  id: 'forge',
  name: 'Forge',
  tagline: 'Industrial authority',
  description: 'Near-black ground, electric gold accent. When the numbers do the talking.',

  tokens: {
    groundPrimary:   '#0C0C14',
    groundSecondary: '#18181F',
    groundAccent:    '#18181F',
    textPrimary:     '#F4F2EC',
    textSecondary:   '#C8C6BC',
    textMuted:       '#5A5A6A',
    textReversed:    '#F4F2EC',
    accent:          '#E8961A',
    accentDeep:      '#A86010',
    accentPale:      '#2A2010',
    accentText:      '#E8961A',
    statValue:       '#E8961A',
    statCard:        '#18181F',
    statBorder:      'rgba(232,150,26,0.15)',
    statBorderTop:   '#E8961A',
    nodeDefault:     '#252520',
    nodeAccent:      '#E8961A',
    edgeColor:       'rgba(232,150,26,0.5)',
    hlPrimary:       'rgba(232,150,26,0.25)',
    hlSecondary:     'rgba(232,150,26,0.15)',
    hlDanger:        'rgba(232,64,26,0.25)',
    barLeft:         '#E8961A',
    barTop:          '#E8961A',
  },
  style: {
    accentBarPosition: 'top',
    accentBarSize:     'sm',
    coverLayout:       'left-aligned',
    statCardStyle:     'top-border',
    headlineWeight:    '300',
    bodyWeight:        '300',
    fontSans:          '"DM Sans", system-ui, sans-serif',
    pullquoteStyle:    'background',
  },
  selector: {
    industrySignals:  ['manufacturing', 'industrial', 'operations', 'supply chain', 'logistics', 'energy', 'oil', 'gas', 'mining', 'construction', 'infrastructure', 'utilities', 'automotive'],
    toneSignals:      ['data-driven', 'metrics', 'roi', 'performance', 'results', 'heavy', 'serious', 'operational'],
    deckTypeSignals:  ['qbr', 'quarterly business review', 'investment', 'investor', 'board', 'performance review', 'kpi', 'executive dashboard'],
    clientSignals:    ['ge', 'siemens', 'honeywell', 'caterpillar', 'ford', 'gm', 'ups', 'fedex', 'amazon'],
    avoid:            ['healthcare', 'consumer', 'lifestyle', 'hospitality'],
    priority:         4,
  },
}

const verdant: DeckTheme = {
  id: 'verdant',
  name: 'Verdant',
  tagline: 'Editorial warmth',
  description: 'Warm cream ground, forest green accent. Best for healthcare, sustainability, ESG, life sciences.',

  tokens: {
    groundPrimary:   '#F4F1E4',
    groundSecondary: '#ECE9DC',
    groundAccent:    '#0E2018',
    textPrimary:     '#0E2018',
    textSecondary:   '#3A5444',
    textMuted:       '#7A9084',
    textReversed:    '#F4F1E4',
    accent:          '#1F6640',
    accentDeep:      '#0E3820',
    accentPale:      'rgba(31,102,64,0.08)',
    accentText:      '#0E3820',
    statValue:       '#1F6640',
    statCard:        'rgba(31,102,64,0.06)',
    statBorder:      'rgba(31,102,64,0.18)',
    statBorderTop:   '#1F6640',
    nodeDefault:     'rgba(31,102,64,0.1)',
    nodeAccent:      '#1F6640',
    edgeColor:       'rgba(31,102,64,0.45)',
    hlPrimary:       'rgba(31,102,64,0.14)',
    hlSecondary:     'rgba(232,150,26,0.18)',
    hlDanger:        'rgba(232,64,26,0.12)',
    barLeft:         '#1F6640',
    barTop:          '#1F6640',
  },
  style: {
    accentBarPosition: 'left',
    accentBarSize:     'lg',
    coverLayout:       'left-aligned',
    statCardStyle:     'bordered',
    headlineWeight:    '300',
    bodyWeight:        '300',
    fontSans:          '"DM Sans", system-ui, sans-serif',
    pullquoteStyle:    'border-left',
  },
  selector: {
    industrySignals:  ['healthcare', 'pharma', 'life sciences', 'biotech', 'medical', 'sustainability', 'esg', 'environment', 'climate', 'social impact', 'nonprofit', 'public sector', 'government'],
    toneSignals:      ['warm', 'human', 'trusted', 'evidence-based', 'scientific', 'responsible', 'purpose-driven', 'community'],
    deckTypeSignals:  ['case study', 'impact report', 'esg report', 'white paper', 'thought leadership', 'research', 'discovery'],
    clientSignals:    ['pfizer', 'jnj', 'johnson', 'merck', 'cvs', 'unitedhealth', 'humana', 'who', 'cdc'],
    avoid:            ['dark', 'luxury', 'aggressive'],
    priority:         4,
  },
}

const onyx: DeckTheme = {
  id: 'onyx',
  name: 'Onyx',
  tagline: 'Dark premium',
  description: 'Pure black, violet accent. AI, cybersecurity, deep tech, luxury.',

  tokens: {
    groundPrimary:   '#060608',
    groundSecondary: '#101018',
    groundAccent:    '#101018',
    textPrimary:     '#F2F0FF',
    textSecondary:   '#B8B4D8',
    textMuted:       '#58547A',
    textReversed:    '#F2F0FF',
    accent:          '#7048F8',
    accentDeep:      '#3A1EC8',
    accentPale:      'rgba(112,72,248,0.12)',
    accentText:      '#B09AF8',
    statValue:       '#B09AF8',
    statCard:        'rgba(112,72,248,0.08)',
    statBorder:      'rgba(112,72,248,0.2)',
    statBorderTop:   '#7048F8',
    nodeDefault:     'rgba(112,72,248,0.1)',
    nodeAccent:      '#7048F8',
    edgeColor:       'rgba(112,72,248,0.5)',
    hlPrimary:       'rgba(112,72,248,0.25)',
    hlSecondary:     'rgba(112,72,248,0.15)',
    hlDanger:        'rgba(232,64,26,0.25)',
    barLeft:         '#7048F8',
    barTop:          '#7048F8',
  },
  style: {
    accentBarPosition: 'left',
    accentBarSize:     'sm',
    coverLayout:       'left-aligned',
    statCardStyle:     'top-border',
    headlineWeight:    '300',
    bodyWeight:        '300',
    fontSans:          '"DM Sans", system-ui, sans-serif',
    pullquoteStyle:    'background',
  },
  selector: {
    industrySignals:  ['ai', 'artificial intelligence', 'machine learning', 'cybersecurity', 'security', 'blockchain', 'crypto', 'deep tech', 'semiconductor', 'defense', 'aerospace', 'luxury', 'fashion'],
    toneSignals:      ['premium', 'exclusive', 'dark', 'bold', 'disruptive', 'cutting-edge', 'innovative', 'high-stakes'],
    deckTypeSignals:  ['ai strategy', 'security briefing', 'technology vision', 'product launch', 'innovation', 'transformation'],
    clientSignals:    ['openai', 'anthropic', 'nvidia', 'crowdstrike', 'palantir', 'apple', 'netflix', 'hbo', 'disney', 'tesla'],
    avoid:            ['healthcare', 'government', 'nonprofit'],
    priority:         4,
  },
}

const solana: DeckTheme = {
  id: 'solana',
  name: 'Solana',
  tagline: 'Human warmth',
  description: 'Warm ivory, terracotta accent. Consumer, retail, hospitality, culture.',

  tokens: {
    groundPrimary:   '#FCF7F0',
    groundSecondary: '#F0E8DC',
    groundAccent:    '#180E08',
    textPrimary:     '#180E08',
    textSecondary:   '#4A2E1C',
    textMuted:       '#9A7060',
    textReversed:    '#FCF7F0',
    accent:          '#C04A18',
    accentDeep:      '#7A2A08',
    accentPale:      'rgba(192,74,24,0.08)',
    accentText:      '#7A2A08',
    statValue:       '#C04A18',
    statCard:        'rgba(192,74,24,0.06)',
    statBorder:      'rgba(192,74,24,0.15)',
    statBorderTop:   '#C04A18',
    nodeDefault:     'rgba(192,74,24,0.08)',
    nodeAccent:      '#C04A18',
    edgeColor:       'rgba(192,74,24,0.4)',
    hlPrimary:       'rgba(192,74,24,0.15)',
    hlSecondary:     'rgba(232,150,26,0.18)',
    hlDanger:        'rgba(192,74,24,0.20)',
    barLeft:         '#C04A18',
    barTop:          '#C04A18',
  },
  style: {
    accentBarPosition: 'top',
    accentBarSize:     'lg',
    coverLayout:       'left-aligned',
    statCardStyle:     'bordered',
    headlineWeight:    '300',
    bodyWeight:        '300',
    fontSans:          '"DM Sans", system-ui, sans-serif',
    pullquoteStyle:    'border-left',
  },
  selector: {
    industrySignals:  ['retail', 'consumer', 'hospitality', 'hotel', 'travel', 'tourism', 'food', 'beverage', 'entertainment', 'media', 'sports', 'culture', 'e-commerce', 'dtc', 'brand'],
    toneSignals:      ['warm', 'approachable', 'friendly', 'human', 'emotional', 'relationship', 'community', 'experience', 'guest'],
    deckTypeSignals:  ['brand strategy', 'customer experience', 'cx', 'partnership', 'closing', 'next steps', 'kickoff', 'introduction'],
    clientSignals:    ['disney', 'hilton', 'marriott', 'nike', 'adidas', 'starbucks', 'target', 'walmart', 'gap', 'royal caribbean', 'expedia'],
    avoid:            ['financial', 'legal', 'compliance', 'security'],
    priority:         4,
  },
}

export const DECK_THEMES: DeckTheme[] = [meridian, forge, verdant, onyx, solana]

export const DECK_THEMES_MAP: Record<string, DeckTheme> = Object.fromEntries(
  DECK_THEMES.map(t => [t.id, t])
)

export const DEFAULT_THEME_ID = 'meridian'

export function getTheme(id: string): DeckTheme {
  return DECK_THEMES_MAP[id] ?? DECK_THEMES_MAP[DEFAULT_THEME_ID]
}
