import React from 'react'
import {
  SlideCover,
  SlideNarrative,
  SlideStatGrid,
  SlideSectionBreak,
  SlideTwoPane,
  SlideDiagram,
  SlideFullBleed,
  SlideClosing,
} from '../components/slides'

export interface DeckSlide {
  id: string
  element: React.ReactElement
}

export const disneyDeck: DeckSlide[] = [
  {
    id: 'cover',
    element: (
      <SlideCover
        eyebrow="Enterprise AI Enablement"
        title="Transforming Guest Intelligence at Disney"
        subtitle="A strategic framework for unifying behavioral data across parks, streaming, and retail — and putting it to work."
        meta="SIGNAL · March 2026 · Confidential"
      />
    ),
  },
  {
    id: 'challenge',
    element: (
      <SlideNarrative
        eyebrow="The challenge"
        headline="Disney captures extraordinary data. It rarely reaches the guests who need it most."
        body="Parks, streaming, retail, and live events generate billions of behavioral signals every day. But siloed systems mean personalization stays surface-level — a recommendation engine that doesn't know you just waited 90 minutes in the rain for the same ride it's about to suggest again."
        pullQuote="The data exists. The connection doesn't."
      />
    ),
  },
  {
    id: 'scale',
    element: (
      <SlideStatGrid
        eyebrow="The scale of the opportunity"
        headline="Disney's data advantage is real — and largely untapped"
        stats={[
          { value: '1.9B+', label: 'Annual park visits', context: 'Across 12 global destinations' },
          { value: '238M+', label: 'Disney+ subscribers', context: 'Active streaming data' },
          { value: '$88B', label: 'Annual revenue', context: 'Across all business units' },
          { value: '< 12%', label: 'Cross-platform personalization', context: 'Current estimate' },
        ]}
      />
    ),
  },
  {
    id: 'section-approach',
    element: (
      <SlideSectionBreak
        number="01"
        title="The Guest Intelligence Platform"
        subtitle="Unify the data. Personalize the experience. Measure what changes."
      />
    ),
  },
  {
    id: 'data-landscape',
    element: (
      <SlideDiagram
        eyebrow="Current state"
        title="Disney's data landscape — siloed by design, unified by opportunity"
        placeholder="AI graphic co-pilot — describe the diagram to generate it live"
      />
    ),
  },
  {
    id: 'approach',
    element: (
      <SlideTwoPane
        split="60/40"
        mode="light"
        left={{
          eyebrow: 'Our approach',
          heading: 'Three layers, one platform',
          body: 'We propose a phased build of the Guest Intelligence Platform — starting with data unification, moving to real-time personalization, and closing with an AI-powered experience loop that learns continuously from guest behavior.',
          bullets: [
            'Layer 1 — Unified Guest Profile (cross-platform identity resolution)',
            'Layer 2 — Real-Time Context Engine (in-park signals + streaming history)',
            'Layer 3 — Experience Orchestration (personalized moments, automated and human)',
          ],
        }}
        right={{
          eyebrow: 'Why now',
          heading: 'The window is closing',
          body: "Competitors are consolidating data infrastructure. Disney's moat is its content and physical experience — but that moat only deepens if the intelligence layer catches up.",
          accent: true,
        }}
      />
    ),
  },
  {
    id: 'full-bleed',
    element: (
      <SlideFullBleed
        statement="The guest who streams, visits, and shops is one person. It's time to treat them that way."
        accentWord="one person"
      />
    ),
  },
  {
    id: 'section-roadmap',
    element: (
      <SlideSectionBreak
        number="02"
        title="Engagement Roadmap"
        subtitle="Three phases. 18 months. Measurable outcomes at each gate."
      />
    ),
  },
  {
    id: 'roadmap',
    element: (
      <SlideDiagram
        eyebrow="18-month roadmap"
        title="Phase-gated delivery with clear outcomes"
        placeholder="AI graphic co-pilot — roadmap diagram generates here in Phase 3"
        mode="light"
      />
    ),
  },
  {
    id: 'investment',
    element: (
      <SlideStatGrid
        eyebrow="Investment summary"
        headline="Three phases, one committed partnership"
        mode="dark"
        stats={[
          { value: 'Ph.1', label: 'Discovery + Architecture', context: '10 weeks · Data audit, platform design, identity resolution POC' },
          { value: 'Ph.2', label: 'Platform Build', context: '6 months · Unified profile, context engine, first personalization loop' },
          { value: 'Ph.3', label: 'Scale + Optimize', context: 'Ongoing · Experience orchestration, continuous learning, global rollout' },
        ]}
      />
    ),
  },
  {
    id: 'closing',
    element: (
      <SlideClosing
        headline="Let's build the intelligence layer Disney's experience deserves."
        cta="Schedule a working session"
        contact="signal.co · hello@signal.co"
      />
    ),
  },
]
