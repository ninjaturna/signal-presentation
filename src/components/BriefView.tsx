import type { ReactNode } from 'react'
import { colors } from '../design-system'
import type { CompanyBrief, IntakeData } from '../types/deck'

interface BriefViewProps {
  intake: IntakeData
  brief: CompanyBrief
  onViewDeck: () => void
  onStartOver: () => void
}

export function BriefView({ brief, onViewDeck, onStartOver }: BriefViewProps) {
  const chip = (text: string, i: number) => (
    <div key={i} style={{
      background: '#FFFFFF', border: `1px solid ${colors.border}`,
      borderRadius: 6, padding: '6px 12px',
      fontSize: 13, color: colors.ink, lineHeight: 1.4,
    }}>
      {text}
    </div>
  )

  const section = (label: string, content: ReactNode) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: colors.blue, marginBottom: 10,
      }}>
        {label}
      </div>
      {content}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: colors.surface,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 4,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: colors.blue,
            }}>
              SIGNAL · Company Brief
            </div>
            <button
              onClick={onStartOver}
              style={{
                background: 'transparent', border: 'none',
                fontSize: 13, color: colors.mutedLight, cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              ← New brief
            </button>
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 600, color: colors.ink,
            lineHeight: 1.1, marginBottom: 8,
          }}>
            {brief.company}
          </h1>
          <p style={{ fontSize: 16, color: colors.mutedLight, lineHeight: 1.5 }}>
            {brief.oneLiner}
          </p>
        </div>

        {/* Brief content */}
        <div style={{
          background: '#FFFFFF', border: `1px solid ${colors.border}`,
          borderRadius: 12, padding: '32px',
        }}>
          {section('Strategic context',
            <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.ink }}>
              {brief.strategicContext}
            </p>
          )}

          {section('Key priorities',
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
              {brief.keyPriorities.map(chip)}
            </div>
          )}

          {section('Pain points',
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
              {brief.painPoints.map(chip)}
            </div>
          )}

          {section('AI opportunity',
            <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.ink }}>
              {brief.aiOpportunity}
            </p>
          )}

          {section('Competitive pressure',
            <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.ink }}>
              {brief.competitivePressure}
            </p>
          )}

          {section('Recommended narrative arc',
            <div style={{ borderLeft: `3px solid ${colors.blue}`, paddingLeft: 16 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: colors.ink, fontStyle: 'italic' }}>
                {brief.narrativeArc}
              </p>
            </div>
          )}

          {section(`Suggested deck — ${brief.suggestedSlides.length} slides`,
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              {brief.suggestedSlides.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '10px 14px', background: colors.surface,
                  borderRadius: 8, border: `1px solid ${colors.border}`,
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: colors.blue,
                    background: '#E8EFFE', borderRadius: 4, padding: '2px 6px',
                    minWidth: 90, textAlign: 'center' as const, marginTop: 1,
                    textTransform: 'uppercase' as const, letterSpacing: '0.04em',
                  }}>
                    {s.type}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: colors.ink, marginBottom: 2 }}>
                      {s.headline}
                    </div>
                    <div style={{ fontSize: 12, color: colors.mutedLight }}>
                      {s.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={onViewDeck}
            style={{
              background: colors.blue, border: 'none',
              borderRadius: 8, padding: '12px 24px',
              fontSize: 14, fontWeight: 600, color: '#FFFFFF',
              cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            View deck →
          </button>
          <button
            onClick={onStartOver}
            style={{
              background: 'transparent', border: `1px solid ${colors.border}`,
              borderRadius: 8, padding: '12px 24px',
              fontSize: 14, color: colors.mutedLight, cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            New engagement
          </button>
        </div>
      </div>
    </div>
  )
}
