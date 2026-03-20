export type LayoutVariant = 'default' | 'centered' | 'split-right' | 'minimal' | 'bold'

export interface LayoutConfig {
  name: string
  description: string
  variant: LayoutVariant
}

export const LAYOUT_VARIANTS: Record<string, LayoutConfig[]> = {
  cover: [
    { name: 'Left aligned', description: 'Title bottom-left, accent bar left', variant: 'default' },
    { name: 'Centered',     description: 'Title centered, full width',         variant: 'centered' },
    { name: 'Bold',         description: 'Large title, minimal metadata',       variant: 'bold' },
  ],
  narrative: [
    { name: 'Standard',          description: 'Headline left, body below',           variant: 'default' },
    { name: 'Pull quote right',  description: 'Body left, pull quote right column',  variant: 'split-right' },
    { name: 'Minimal',           description: 'Headline only, large type',           variant: 'minimal' },
    { name: 'Centered',          description: 'All content centered',               variant: 'centered' },
  ],
  'stat-grid': [
    { name: 'Grid',         description: 'Stats in equal columns',   variant: 'default' },
    { name: 'Bold numbers', description: 'Larger stats, minimal labels', variant: 'bold' },
  ],
  closing: [
    { name: 'Standard', description: 'Headline + CTA button', variant: 'default' },
    { name: 'Centered', description: 'Everything centered',   variant: 'centered' },
    { name: 'Minimal',  description: 'Text only, no button',  variant: 'minimal' },
  ],
}

export function getVariantsForType(type: string): LayoutConfig[] {
  return LAYOUT_VARIANTS[type] ?? [
    { name: 'Default', description: 'Standard layout', variant: 'default' },
  ]
}
