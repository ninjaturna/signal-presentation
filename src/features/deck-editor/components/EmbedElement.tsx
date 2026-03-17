import { useState } from 'react'
import type { EmbedElement as EmbedElementType } from '../types'
import { getYouTubeThumbnail, getEmbedIframeSrc } from '../utils'
import { colors } from '../../../design-system'

interface EmbedElementProps {
  element: EmbedElementType
  scale?: number
}

export function EmbedElement({ element, scale = 1 }: EmbedElementProps) {
  const [expanded, setExpanded] = useState(false)
  const { url, embedType, label } = element

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    background: colors.inkSoft,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: `1px solid ${colors.borderDark}`,
  }

  if (embedType === 'image') {
    return (
      <div style={containerStyle}>
        <img
          src={url}
          alt={label ?? 'Embedded image'}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          draggable={false}
        />
      </div>
    )
  }

  if (embedType === 'youtube') {
    const thumbnail = getYouTubeThumbnail(url)
    const iframeSrc = getEmbedIframeSrc(url, 'youtube')

    if (expanded) {
      return (
        <div style={containerStyle}>
          <iframe
            src={iframeSrc}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )
    }

    return (
      <div
        style={{ ...containerStyle, cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); setExpanded(true) }}
      >
        {thumbnail && (
          <img
            src={thumbnail}
            alt="YouTube thumbnail"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            draggable={false}
          />
        )}
        {/* Play button */}
        <div style={{
          position: 'absolute',
          width: Math.max(48 * scale, 28),
          height: Math.max(48 * scale, 28),
          borderRadius: '50%',
          background: 'rgba(255,0,0,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          <svg width={Math.max(20 * scale, 12)} height={Math.max(20 * scale, 12)} viewBox="0 0 20 20" fill="none">
            <path d="M6 4L16 10L6 16V4Z" fill="white" />
          </svg>
        </div>
        {label && (
          <div style={{
            position: 'absolute', bottom: 8, left: 8, right: 8,
            fontSize: 11, color: '#fff', fontWeight: 600,
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {label}
          </div>
        )}
      </div>
    )
  }

  if (embedType === 'figma') {
    const iframeSrc = getEmbedIframeSrc(url, 'figma')

    if (expanded) {
      return (
        <div style={containerStyle}>
          <iframe
            src={iframeSrc}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        </div>
      )
    }

    return (
      <div
        style={{ ...containerStyle, cursor: 'pointer', flexDirection: 'column', gap: 12 }}
        onClick={e => { e.stopPropagation(); setExpanded(true) }}
      >
        {/* Figma icon */}
        <svg width={40 * scale} height={40 * scale} viewBox="0 0 38 57" fill="none">
          <path d="M19 28.5A9.5 9.5 0 1128.5 19 9.5 9.5 0 0119 28.5z" fill="#1ABCFE"/>
          <path d="M9.5 47.5A9.5 9.5 0 019.5 28.5H19v9.5a9.5 9.5 0 01-9.5 9.5z" fill="#0ACF83"/>
          <path d="M19 .5h-9.5a9.5 9.5 0 000 19H19z" fill="#FF7262"/>
          <path d="M28.5 .5H19v19h9.5a9.5 9.5 0 000-19z" fill="#F24E1E"/>
          <path d="M28.5 19H19v19h9.5a9.5 9.5 0 000-19z" fill="#A259FF"/>
        </svg>
        <div style={{ fontSize: 12 * scale, color: colors.mutedDark, textAlign: 'center' }}>
          {label ?? 'Click to open Figma'}
        </div>
      </div>
    )
  }

  // Generic URL
  return (
    <div style={{ ...containerStyle, flexDirection: 'column', gap: 10 }}>
      <svg width={32 * scale} height={32 * scale} viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={colors.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={colors.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontSize: 11 * scale, color: colors.mutedDark, textAlign: 'center', padding: '0 8px' }}>
        <div style={{ fontSize: 12 * scale, fontWeight: 600, color: colors.blue, marginBottom: 4 }}>
          {label ?? 'Open link →'}
        </div>
        <div style={{
          maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', opacity: 0.7,
        }}>
          {url}
        </div>
      </div>
    </div>
  )
}
