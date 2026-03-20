import { useState } from 'react'
import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import { detectEmbedType, getEmbedSrc, getEmbedLabel, getYouTubeThumbnail } from '../../utils/embedDetect'
import type { SlideData } from '../../types/deck'

interface SlideEmbedProps {
  eyebrow?: string
  title?: string
  embed: NonNullable<SlideData['embed']>
  mode?: 'light' | 'dark'
}

export function SlideEmbed({ eyebrow, title, embed, mode = 'light' }: SlideEmbedProps) {
  const [active, setActive] = useState(false)
  const embedType = detectEmbedType(embed.url)
  const embedSrc  = getEmbedSrc(embed.url, embedType)
  const label     = getEmbedLabel(embedType)

  const textPrimary = mode === 'dark' ? '#FFFFFF' : colors.ink

  return (
    <SlideShell slideType="embed" mode={mode}>
      {/* Header */}
      {(eyebrow || title) && (
        <div style={{ marginBottom: 16, flexShrink: 0 }}>
          {eyebrow && (
            <div style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: colors.blue, marginBottom: 6,
            }}>
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 style={{ fontSize: 22, fontWeight: 600, color: textPrimary, margin: 0 }}>
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Embed container */}
      <div style={{
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${mode === 'dark' ? colors.borderDark : colors.border}`,
        background: mode === 'dark' ? colors.inkSoft : '#F5F5F5',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 0,
      }}>
        {active ? (
          <iframe
            src={embedSrc}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen; clipboard-read; clipboard-write"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div
            onClick={() => setActive(true)}
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          >
            {embedType === 'youtube' ? (
              /* YouTube: thumbnail + play button overlay */
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {(() => {
                  const thumb = getYouTubeThumbnail(embed.url)
                  return thumb ? (
                    <img
                      src={thumb}
                      alt="YouTube thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#000' }} />
                  )
                })()}
                {/* Dark overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                {/* Play button */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(255,0,0,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}>
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                {/* Title overlay */}
                {embed.title && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '20px 16px 12px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                  }}>
                    {embed.title}
                  </div>
                )}
              </div>
            ) : (
              /* Non-YouTube: icon + label + button */
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 16, padding: 32,
              }}>
                <EmbedIcon type={embedType} size={48} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>
                    {embed.title ?? label}
                  </div>
                  <div style={{
                    fontSize: 12, color: colors.mutedDark,
                    maxWidth: 320, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {embed.url}
                  </div>
                </div>
                <div style={{
                  background: colors.blue, borderRadius: 8,
                  padding: '8px 20px',
                  fontSize: 13, fontWeight: 600, color: '#FFFFFF',
                }}>
                  Click to open {label} →
                </div>
              </div>
            )}
          </div>
        )}

        {active && (
          <button
            onClick={e => { e.stopPropagation(); setActive(false) }}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 6,
              padding: '4px 10px', fontSize: 11, color: '#FFFFFF',
              cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
              zIndex: 10,
            }}
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Source URL footer */}
      <div style={{ marginTop: 8, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <EmbedIcon type={embedType} size={12} />
        <a
          href={embed.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            fontSize: 11, color: colors.blue, textDecoration: 'none',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 400,
          }}
        >
          {embed.url} ↗
        </a>
      </div>
    </SlideShell>
  )
}

function EmbedIcon({ type, size }: { type: string; size: number }) {
  const s = size
  if (type === 'youtube') return (
    <div style={{
      width: s, height: s,
      background: '#FF0000', borderRadius: s * 0.2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="white">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
  )
  if (type === 'figma') return (
    <svg width={s * 0.6} height={s} viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5A9.5 9.5 0 1128.5 19 9.5 9.5 0 0119 28.5z" fill="#1ABCFE"/>
      <path d="M9.5 47.5A9.5 9.5 0 019.5 28.5H19v9.5a9.5 9.5 0 01-9.5 9.5z" fill="#0ACF83"/>
      <path d="M19 .5h-9.5a9.5 9.5 0 000 19H19z" fill="#FF7262"/>
      <path d="M28.5 .5H19v19h9.5a9.5 9.5 0 000-19z" fill="#F24E1E"/>
      <path d="M28.5 19H19v19h9.5a9.5 9.5 0 000-19z" fill="#A259FF"/>
    </svg>
  )
  if (type === 'loom') return (
    <div style={{
      width: s, height: s, borderRadius: '50%',
      background: 'linear-gradient(135deg, #625DF5, #FF7C6E)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="white">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
  )
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        stroke={colors.blue} strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        stroke={colors.blue} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
