// src/design-system/chart-tokens.ts
// Color palette for charts and diagrams

export const chartTokens = {
  // Node/bar colors — always use in this sequence
  sequence: [
    '#1E5AF2',  // Blue — primary
    '#FFCC2D',  // Gold — secondary
    '#1D9E75',  // Green — positive
    '#FF6B35',  // Orange — warning
    '#8B5CF6',  // Purple — alternative
    '#06B6D4',  // Cyan — additional
    '#EC4899',  // Pink — contrast
    '#77706F',  // Muted — neutral
  ] as const,

  // Semantic chart colors
  positive:  '#1D9E75',
  negative:  '#FF1C52',
  neutral:   '#77706F',
  highlight: '#FFCC2D',
  primary:   '#1E5AF2',

  // Grid lines + axis labels
  gridLine:  'rgba(255,255,255,0.06)',
  axisLabel: '#77706F',
  axisLine:  '#333130',
} as const
