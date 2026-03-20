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
  SlideEmbed,
} from '../components/slides'
import { SlideImageLayer } from '../components/SlideImageLayer'
import { OverflowBadge } from '../components/OverflowBadge'
import type { SlideData } from '../types/deck'
import type { DeckTheme } from '../design-system/themes'

interface RenderSlideOptions {
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme['tokens']
  revealStep?: number
}

function withWrappers(
  slideEl: React.ReactElement,
  slide: SlideData,
  options: RenderSlideOptions
): React.ReactElement {
  // Layer 1: image overlay
  const withImages = (!options.editable && (!slide.images || slide.images.length === 0))
    ? slideEl
    : (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {slideEl}
        <SlideImageLayer
          images={slide.images ?? []}
          editable={!!options.editable}
          onUpdate={imgs => options.onUpdate?.({ images: imgs } as Partial<SlideData>)}
        />
      </div>
    )

  // Layer 2: overflow detection + AI Trim (edit mode only)
  if (!options.editable) return withImages

  return (
    <OverflowBadge
      slide={slide}
      editable={true}
      onUpdate={options.onUpdate}
    >
      {withImages}
    </OverflowBadge>
  )
}

export function renderSlide(slide: SlideData, options: RenderSlideOptions = {}): React.ReactElement {
  const { editable = false, onUpdate, theme, revealStep } = options

  switch (slide.type) {
    case 'cover':
      return withWrappers(
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
      return withWrappers(
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
          links={slide.links}
          highlights={slide.highlights}
          revealStep={revealStep}
        />,
        slide, options
      )

    case 'stat-grid':
      return withWrappers(
        <SlideStatGrid
          eyebrow={slide.eyebrow}
          headline={slide.headline}
          stats={slide.stats ?? []}
          mode={slide.mode}
          theme={theme}
          layout={slide.layout}
          editable={editable}
          onUpdate={onUpdate}
          revealStep={revealStep}
        />,
        slide, options
      )

    case 'two-pane':
      return withWrappers(
        <SlideTwoPane
          left={slide.left ?? { heading: '' }}
          right={slide.right ?? { heading: '' }}
          split={slide.split}
          mode={slide.mode}
          revealStep={revealStep}
        />,
        slide, options
      )

    case 'section-break':
      return withWrappers(
        <SlideSectionBreak
          number={slide.number}
          title={slide.title ?? ''}
          subtitle={slide.subtitle}
          theme={theme}
          revealStep={revealStep}
        />,
        slide, options
      )

    case 'full-bleed':
      return withWrappers(
        <SlideFullBleed
          statement={slide.statement ?? ''}
          accentWord={slide.accentWord}
          highlights={slide.highlights}
        />,
        slide, options
      )

    case 'diagram':
      return (
        <SlideDiagram
          eyebrow={slide.eyebrow}
          title={slide.title}
          svgContent={slide.svgContent}
          diagramData={slide.diagramData}
          placeholder={slide.placeholder}
          mode={slide.mode}
          context={slide.context}
          editable={editable}
          onUpdate={onUpdate}
        />
      )

    case 'closing':
      return withWrappers(
        <SlideClosing
          headline={slide.headline ?? ''}
          cta={slide.cta}
          ctaUrl={slide.ctaUrl}
          ctaTarget={slide.ctaTarget}
          contact={slide.contact}
          layout={slide.layout}
          editable={editable}
          onUpdate={onUpdate}
          theme={theme}
          links={slide.links}
          highlights={slide.highlights}
        />,
        slide, options
      )

    case 'embed':
      return withWrappers(
        <SlideEmbed
          eyebrow={slide.eyebrow}
          title={slide.title}
          embed={slide.embed ?? { url: 'https://', embedType: 'webpage' }}
          mode={slide.mode ?? 'light'}
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
