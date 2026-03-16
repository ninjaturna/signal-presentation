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
