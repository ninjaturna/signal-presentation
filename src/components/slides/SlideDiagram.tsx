import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'

interface SlideDiagramProps {
  eyebrow?: string
  title?: string
  svgContent?: string
  placeholder?: string
  mode?: SlideMode
}

export function SlideDiagram({ eyebrow, title, svgContent, placeholder, mode = 'light' }: SlideDiagramProps) {
  const textPrimary  = mode === 'dark' ? '#FFFFFF' : colors.ink
  const canvasBg     = mode === 'dark' ? colors.inkSoft : colors.surfaceAlt
  const canvasBorder = mode === 'dark' ? colors.borderDark : colors.border

  return (
    <SlideShell slideType="content" mode={mode}>
      {(eyebrow || title) && (
        <div style={{ marginBottom: 20 }}>
          {eyebrow && (
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: colors.blue, marginBottom: 6,
            }}>
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 style={{ fontSize: 24, fontWeight: 600, color: textPrimary }}>{title}</h2>
          )}
        </div>
      )}
      <div style={{
        flex: 1,
        background: canvasBg,
        border: `1px solid ${canvasBorder}`,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {svgContent ? (
          <div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: mode === 'dark' ? colors.borderDark : colors.border,
              margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" stroke={colors.blue} strokeWidth="1.5"/>
                <rect x="13" y="3" width="8" height="8" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
                <rect x="3" y="13" width="8" height="8" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
                <rect x="13" y="13" width="8" height="8" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
                <line x1="7" y1="11" x2="7" y2="13" stroke={colors.blue} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="17" y1="11" x2="17" y2="13" stroke={colors.mutedDark} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ fontSize: 14, color: colors.mutedDark }}>
              {placeholder ?? 'AI graphic canvas — Phase 3'}
            </p>
          </div>
        )}
      </div>
    </SlideShell>
  )
}
