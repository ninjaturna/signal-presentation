import { SlideShell } from '../SlideShell'
import { HighlightText } from '../HighlightText'
import { colors } from '../../design-system'
import type { TextHighlight } from '../../types/deck'

interface SlideFullBleedProps {
  statement: string
  sub?: string
  accentWord?: string
  highlights?: TextHighlight[]
}

export function SlideFullBleed({ statement, sub, accentWord, highlights }: SlideFullBleedProps) {
  const parts = accentWord ? statement.split(accentWord) : null

  return (
    <SlideShell slideType="cover" mode="dark" fullBleed>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '48px 80px',
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 3.4vw, 44px)', fontWeight: 600, lineHeight: 1.1,
          color: '#FFFFFF', maxWidth: 720, marginBottom: sub ? 24 : 0,
        }}>
          {highlights && highlights.length > 0 ? (
            <HighlightText text={statement} highlights={highlights} />
          ) : parts ? (
            <>
              {parts[0]}
              <span style={{ color: colors.gold }}>{accentWord}</span>
              {parts[1]}
            </>
          ) : statement}
        </h2>
        {sub && (
          <p style={{
            fontSize: 18, color: colors.mutedDark,
            maxWidth: 520, lineHeight: 1.5,
          }}>
            {sub}
          </p>
        )}
      </div>
    </SlideShell>
  )
}
