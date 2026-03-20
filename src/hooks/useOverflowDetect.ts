import { useEffect, useState, useCallback } from 'react'
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
  markEdited: () => void
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

  // Re-run density check when text fields change
  useEffect(() => {
    setDensity(checkContentDensity(slide))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    slide.headline, slide.body, slide.pullQuote, slide.eyebrow,
    (slide as any).title, (slide as any).statement, (slide as any).subtitle,
    (slide as any).cta, (slide as any).contact,
    JSON.stringify((slide as any).stats),
    JSON.stringify((slide as any).left),
    JSON.stringify((slide as any).right),
  ])

  // DOM overflow — 24px tolerance (was 4px) to avoid sub-pixel false positives
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

  const markEdited = useCallback(() => setHasBeenEdited(true), [])

  return {
    isOverflowing:  hasBeenEdited && (isDomOverflow || density.isDense),
    isDomOverflow,
    isDenseContent: density.isDense,
    density,
    hasBeenEdited,
    markEdited,
  }
}
