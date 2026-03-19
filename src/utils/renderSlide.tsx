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
import type { SlideData } from '../types/deck'
import type { DeckTheme } from '../design-system/themes'

interface RenderSlideOptions {
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme['tokens']
}

export function renderSlide(slide: SlideData, options: RenderSlideOptions = {}): React.ReactElement {
  const { editable = false, onUpdate, theme } = options

  switch (slide.type) {
    case 'cover':
      return (
        <SlideCover
          eyebrow={slide.eyebrow}
          title={slide.title ?? ''}
          subtitle={slide.subtitle}
          meta={slide.meta}
          editable={editable}
          onUpdate={onUpdate}
          theme={theme}
        />
      )

    case 'narrative':
      return (
        <SlideNarrative
          eyebrow={slide.eyebrow}
          headline={slide.headline ?? ''}
          body={slide.body}
          mode={slide.mode}
          pullQuote={slide.pullQuote}
          editable={editable}
          onUpdate={onUpdate}
          theme={theme}
        />
      )

    case 'stat-grid':
      return (
        <SlideStatGrid
          eyebrow={slide.eyebrow}
          headline={slide.headline}
          stats={slide.stats ?? []}
          mode={slide.mode}
          theme={theme}
        />
      )

    case 'two-pane':
      return (
        <SlideTwoPane
          left={slide.left ?? { heading: '' }}
          right={slide.right ?? { heading: '' }}
          split={slide.split}
          mode={slide.mode}
        />
      )

    case 'section-break':
      return (
        <SlideSectionBreak
          number={slide.number}
          title={slide.title ?? ''}
          subtitle={slide.subtitle}
          theme={theme}
        />
      )

    case 'full-bleed':
      return (
        <SlideFullBleed
          statement={slide.statement ?? ''}
          accentWord={slide.accentWord}
        />
      )

    case 'diagram':
      return (
        <SlideDiagram
          eyebrow={slide.eyebrow}
          title={slide.title}
          svgContent={slide.svgContent}
          placeholder={slide.placeholder}
          mode={slide.mode}
          context={slide.context}
          editable={editable}
          onUpdate={onUpdate}
        />
      )

    case 'closing':
      return (
        <SlideClosing
          headline={slide.headline ?? ''}
          cta={slide.cta}
          contact={slide.contact}
          theme={theme}
        />
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
