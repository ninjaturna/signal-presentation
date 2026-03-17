export type TextStyleName =
  | 'headline'
  | 'subheading'
  | 'body'
  | 'caption'
  | 'eyebrow'
  | 'stat'
  | 'pullquote'

export type EmbedType = 'youtube' | 'figma' | 'image' | 'url'

export interface LinkAttachment {
  url: string
  label?: string
}

export interface BaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  link?: LinkAttachment
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  styleName: TextStyleName
  color?: string
}

export interface EmbedElement extends BaseElement {
  type: 'embed'
  url: string
  embedType: EmbedType
  label?: string
}

export type CanvasElement = TextElement | EmbedElement

export interface Slide {
  id: string
  elements: CanvasElement[]
  background?: string
}
