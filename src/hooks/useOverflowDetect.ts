import { useEffect, useState, useRef } from 'react'
import type { RefObject } from 'react'
import type { SlideData } from '../types/deck'
import { checkContentDensity } from '../utils/wordCount'
import type { ContentDensityResult } from '../utils/wordCount'

export type OverflowState = {
  isOverflowing: boolean
  isDomOverflow: boolean
  isDenseContent: boolean
  density: ContentDensityResult
  hasBeenEdited: boolean
}

export function useOverflowDetect(
  ref: RefObject<HTMLElement | null>,
  slide: SlideData,
): OverflowState {
  const [isDomOverflow, setIsDomOverflow] = useState(false)
  const [hasBeenEdited, setHasBeenEdited] = useState(false)
  const [density, setDensity] = useState<ContentDensityResult>(
    () => checkContentDensity(slide)
  )

  // Track whether this is the initial mount — skip marking edited on first render
  const mounted = useRef(false)

  // Watch all text fields. Any change after mount = user edited the slide.
  // This fires for BOTH inline EditableText edits AND EditPanel sidebar edits.
  const textKey = [
    slide.headline, slide.body, slide.pullQuote, slide.eyebrow,
    (slide as any).title, (slide as any).statement, (slide as any).subtitle,
    (slide as any).cta, (slide as any).contact,
    JSON.stringify((slide as any).stats),
    JSON.stringify((slide as any).left),
    JSON.stringify((slide as any).right),
  ].join('§')

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    setHasBeenEdited(true)
    setDensity(checkContentDensity(slide))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textKey])

  // DOM overflow — 24px tolerance to avoid sub-pixel false positives
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      setIsDomOverflow(
        el.scrollHeight > el.clientHeight + 24 ||
        el.scrollWidth  > el.clientWidth  + 24
      )
    }

    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  return {
    isOverflowing:  hasBeenEdited && (isDomOverflow || density.isDense),
    isDomOverflow,
    isDenseContent: density.isDense,
    density,
    hasBeenEdited,
  }
}
