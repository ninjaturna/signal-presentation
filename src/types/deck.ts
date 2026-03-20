import type { SlideMode } from '../design-system'

export interface PaneData {
  eyebrow?: string
  heading: string
  body?: string
  bullets?: string[]
  accent?: boolean
}

export interface StatData {
  value: string
  label: string
  context?: string
}

export interface ImageElement {
  id: string
  src: string
  x: number       // percent of slide width  0–100
  y: number       // percent of slide height 0–100
  width: number   // percent of slide width
  height: number  // percent of slide height
  alt?: string
  objectFit?: 'cover' | 'contain' | 'fill'
  zIndex?: number
  crop?: {
    top: number     // percent clipped from top (0–100)
    right: number
    bottom: number
    left: number
  }
}

export interface SlideData {
  id: string
  type: 'cover' | 'narrative' | 'stat-grid' | 'two-pane' | 'section-break' | 'full-bleed' | 'diagram' | 'closing' | 'poll' | 'embed'
  mode?: SlideMode
  // cover / closing / shared
  eyebrow?: string
  title?: string
  meta?: string
  // narrative
  headline?: string
  body?: string
  pullQuote?: string
  // section-break
  subtitle?: string
  number?: string
  // full-bleed
  statement?: string
  accentWord?: string
  // closing
  cta?: string
  ctaUrl?: string
  ctaTarget?: '_blank' | '_self'
  contact?: string
  footerUrl?: string
  // stat-grid
  stats?: StatData[]
  // two-pane
  left?: PaneData
  right?: PaneData
  split?: '50/50' | '60/40' | '40/60'
  // diagram
  svgContent?: string
  placeholder?: string
  context?: string
  // poll
  poll?: {
    question: string
    type: 'yes-no' | 'multiple-choice' | 'rating' | 'likert'
    options: string[]
    allowMultiple?: boolean
  }
  // embed slide
  embed?: {
    url: string
    embedType: 'youtube' | 'figma' | 'loom' | 'typeform' | 'webpage'
    title?: string
    aspectRatio?: '16:9' | '4:3' | '1:1'
  }
  // images
  images?: ImageElement[]
  // layout variant
  layout?: 'default' | 'centered' | 'split-right' | 'minimal' | 'bold'
}

export type ShareMode = 'edit' | 'review' | 'present'

export type AppPage = 'landing' | 'viewer' | 'how'

// Legacy types kept for BriefView / IntakeForm (still used)
export interface IntakeData {
  clientName: string
  industry: string
  engagementType: 'opportunity-pitch' | 'solution-brief' | 'company-brief'
  challenge: string
  stakeholders?: string
  context?: string
}

export interface CompanyBrief {
  company: string
  industry: string
  oneLiner: string
  strategicContext: string
  keyPriorities: string[]
  painPoints: string[]
  aiOpportunity: string
  competitivePressure: string
  narrativeArc: string
  suggestedSlides: SuggestedSlide[]
}

export interface SuggestedSlide {
  type: string
  eyebrow: string
  headline: string
  notes: string
}

export type AppView = 'intake' | 'brief' | 'presenter'
