import {
  SlideCover,
  SlideNarrative,
  SlideStatGrid,
  SlideSectionBreak,
  SlideTwoPane,
  SlideDiagram,
  SlideFullBleed,
  SlideClosing,
  SlidePoll,
} from '../components/slides'
import { SlideImageLayer } from '../components/SlideImageLayer'
import type { SlideData } from '../types/deck'
import type { DeckTheme } from '../design-system/themes'

interface RenderSlideOptions {
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme['tokens']
}

function withImageLayer(
  slideEl: React.ReactElement,
  slide: SlideData,
  options: RenderSlideOptions
): React.ReactElement {
  if (!options.editable && (!slide.images || slide.images.length === 0)) {
    return slideEl
  }
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {slideEl}
      <SlideImageLayer
        images={slide.images ?? []}
        editable={!!options.editable}
        onUpdate={imgs => options.onUpdate?.({ images: imgs } as Partial<SlideData>)}
      />
    </div>
  )
}

export function renderSlide(slide: SlideData, options: RenderSlideOptions = {}): React.ReactElement {
  const { editable = false, onUpdate, theme } = options

  switch (slide.type) {
    case 'cover':
      return withImageLayer(
        <SlideCover
          eyebrow={slide.eyebrow}
          title={slide.title ?? ''}
          subtitle={slide.subtitle}
          meta={slide.meta}
          editable={editable}
          onUpdate={onUpdate}
          theme={theme}
          layout={slide.layout}
        />,
        slide, options
      )

    case 'narrative':
      return withImageLayer(
        <SlideNarrative
          eyebrow={slide.eyebrow}
          headline={slide.headline ?? ''}
          body={slide.body}
          mode={slide.mode}
          pullQuote={slide.pullQuote}
          editable={editable}
          onUpdate={onUpdate}
          theme={theme}
          layout={slide.layout}
        />,
        slide, options
      )

    case 'stat-grid':
      return withImageLayer(
        <SlideStatGrid
          eyebrow={slide.eyebrow}
          headline={slide.headline}
          stats={slide.stats ?? []}
          mode={slide.mode}
          theme={theme}
        />,
        slide, options
      )

    case 'two-pane':
      return withImageLayer(
        <SlideTwoPane
          left={slide.left ?? { heading: '' }}
          right={slide.right ?? { heading: '' }}
          split={slide.split}
          mode={slide.mode}
        />,
        slide, options
      )

    case 'section-break':
      return withImageLayer(
        <SlideSectionBreak
          number={slide.number}
          title={slide.title ?? ''}
          subtitle={slide.subtitle}
          theme={theme}
        />,
        slide, options
      )

    case 'full-bleed':
      return withImageLayer(
        <SlideFullBleed
          statement={slide.statement ?? ''}
          accentWord={slide.accentWord}
        />,
        slide, options
      )

    case 'diagram':
      return withImageLayer(
        <SlideDiagram
          eyebrow={slide.eyebrow}
          title={slide.title}
          svgContent={slide.svgContent}
          placeholder={slide.placeholder}
          mode={slide.mode}
          context={slide.context}
          editable={editable}
          onUpdate={onUpdate}
        />,
        slide, options
      )

    case 'closing':
      return withImageLayer(
        <SlideClosing
          headline={slide.headline ?? ''}
          cta={slide.cta}
          contact={slide.contact}
          theme={theme}
        />,
        slide, options
      )

    case 'poll':
      return (
        <SlidePoll
          id={slide.id}
          eyebrow={slide.eyebrow}
          poll={slide.poll ?? { question: 'What do you think?', type: 'yes-no', options: [] }}
          mode={slide.mode ?? 'dark'}
        />
      )

    default:
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>Unknown slide type</div>
  }
}
