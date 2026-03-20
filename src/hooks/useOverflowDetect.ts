import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export function useOverflowDetect(ref: RefObject<HTMLElement | null>): boolean {
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      const isOver =
        el.scrollHeight > el.clientHeight + 4 ||
        el.scrollWidth  > el.clientWidth  + 4
      setOverflowing(isOver)
    }

    check()

    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  return overflowing
}
