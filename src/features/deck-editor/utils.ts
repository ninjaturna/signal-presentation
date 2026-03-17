import type { TextStyleName, EmbedType, TextElement, EmbedElement } from './types'

export interface TextStyleDef {
  fontSize: number
  fontWeight: string
  lineHeight: number
  letterSpacing?: string
  textTransform?: string
  fontStyle?: string
}

export const TEXT_STYLES: Record<TextStyleName, TextStyleDef> = {
  headline: {
    fontSize: 44,
    fontWeight: '600',
    lineHeight: 1.08,
  },
  subheading: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 1.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 1.65,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 1.5,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 1.2,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  stat: {
    fontSize: 56,
    fontWeight: '600',
    lineHeight: 1.0,
  },
  pullquote: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
}

export function resolveTextStyle(styleName: TextStyleName): TextStyleDef {
  return TEXT_STYLES[styleName]
}

export function detectEmbedType(url: string): EmbedType {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube'
  if (/figma\.com/i.test(url)) return 'figma'
  if (/\.(png|jpg|jpeg|gif|svg|webp)(\?.*)?$/i.test(url)) return 'image'
  return 'url'
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

export function getEmbedIframeSrc(url: string, embedType: EmbedType): string {
  if (embedType === 'youtube') {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url
  }
  if (embedType === 'figma') {
    return `https://www.figma.com/embed?embed_host=signal&url=${encodeURIComponent(url)}`
  }
  return url
}

export function mkText(
  styleName: TextStyleName,
  content: string,
  x: number,
  y: number,
  width?: number,
  height?: number,
): TextElement {
  const style = TEXT_STYLES[styleName]
  return {
    id: crypto.randomUUID(),
    type: 'text',
    content,
    styleName,
    x,
    y,
    width: width ?? 480,
    height: height ?? Math.max(80, Math.round(style.fontSize * style.lineHeight * 3)),
  }
}

export function mkEmbed(
  url: string,
  x: number,
  y: number,
  width?: number,
  height?: number,
): EmbedElement {
  const embedType = detectEmbedType(url)
  return {
    id: crypto.randomUUID(),
    type: 'embed',
    url,
    embedType,
    x,
    y,
    width: width ?? 560,
    height: height ?? 315,
  }
}
