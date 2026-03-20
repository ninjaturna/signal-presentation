export type EmbedType = 'youtube' | 'figma' | 'loom' | 'typeform' | 'webpage'

export function detectEmbedType(url: string): EmbedType {
  if (/youtube\.com|youtu\.be/i.test(url))  return 'youtube'
  if (/figma\.com/i.test(url))              return 'figma'
  if (/loom\.com/i.test(url))               return 'loom'
  if (/typeform\.com/i.test(url))           return 'typeform'
  return 'webpage'
}

export function getEmbedSrc(url: string, type: EmbedType): string {
  if (type === 'youtube') {
    const cleanUrl = url.split('?')[0].split('&')[0]
    const idMatch =
      cleanUrl.match(/youtube\.com\/watch\/([a-zA-Z0-9_-]{11})/) ??
      cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ??
      url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
    const id = idMatch?.[1]
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
      : url
  }
  if (type === 'figma') {
    return `https://www.figma.com/embed?embed_host=signal&url=${encodeURIComponent(url)}`
  }
  if (type === 'loom') {
    const cleanUrl = url.split('?')[0]
    const id = cleanUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)?.[1]
    return id ? `https://www.loom.com/embed/${id}?autoplay=1` : url
  }
  return url
}

export function getYouTubeThumbnail(url: string): string | null {
  const cleanUrl = url.split('?')[0]
  const idMatch =
    cleanUrl.match(/youtube\.com\/watch\/([a-zA-Z0-9_-]{11})/) ??
    cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ??
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  const id = idMatch?.[1]
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export function getEmbedLabel(type: EmbedType): string {
  const labels: Record<EmbedType, string> = {
    youtube:  'YouTube',
    figma:    'Figma',
    loom:     'Loom',
    typeform: 'Typeform',
    webpage:  'Web page',
  }
  return labels[type]
}
