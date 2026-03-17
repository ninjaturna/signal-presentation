import type { Slide, TextElement } from '../types'
import { resolveTextStyle } from '../utils'
import { colors } from '../../../design-system'

const CANVAS_W = 1280
const CANVAS_H = 720
const THUMB_W = 180
const TH = Math.round(THUMB_W * CANVAS_H / CANVAS_W)
const SCALE = THUMB_W / CANVAS_W

interface SlideThumbnailProps {
  slide: Slide
  index: number
  active: boolean
  onClick: () => void
}

export function SlideThumbnail({ slide, index, active, onClick }: SlideThumbnailProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: THUMB_W,
        height: TH,
        flexShrink: 0,
        cursor: 'pointer',
        border: active ? `2px solid ${colors.blue}` : `2px solid transparent`,
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
        background: slide.background ?? '#FCF8F5',
        transition: 'border-color 0.15s',
      }}
    >
      {/* Slide number */}
      <div style={{
        position: 'absolute',
        bottom: 4,
        left: 6,
        fontSize: 9,
        fontWeight: 600,
        color: slide.background === '#111113' ? colors.borderDark : colors.mutedLight,
        fontFamily: '"DM Sans", system-ui, sans-serif',
        zIndex: 5,
        letterSpacing: '0.05em',
      }}>
        {index + 1}
      </div>

      {/* Scaled canvas */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: CANVAS_W,
        height: CANVAS_H,
        transformOrigin: 'top left',
        transform: `scale(${SCALE})`,
        pointerEvents: 'none',
      }}>
        {slide.elements.map(el => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              overflow: 'hidden',
            }}
          >
            {el.type === 'text' ? (
              <div style={{
                ...buildTextStyle(el as TextElement),
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflow: 'hidden',
              }}>
                {(el as TextElement).content}
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: colors.border,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ fontSize: 10, color: colors.mutedLight }}>⊞</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function buildTextStyle(el: TextElement): React.CSSProperties {
  const def = resolveTextStyle(el.styleName)
  return {
    fontSize: def.fontSize,
    fontWeight: def.fontWeight,
    lineHeight: def.lineHeight,
    letterSpacing: def.letterSpacing,
    textTransform: def.textTransform as React.CSSProperties['textTransform'],
    fontStyle: def.fontStyle,
    color: el.color ?? '#111113',
    fontFamily: '"DM Sans", system-ui, sans-serif',
  }
}
