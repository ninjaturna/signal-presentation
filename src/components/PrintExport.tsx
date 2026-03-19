import { createRoot } from 'react-dom/client'
import { renderSlide } from '../utils/renderSlide'
import type { SlideData } from '../types/deck'

function PrintContainer({ slides }: { slides: SlideData[] }) {
  return (
    <>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="signal-print-slide"
          style={{
            width: '297mm',
            height: '167.0625mm',
            overflow: 'hidden',
            position: 'relative',
            pageBreakAfter: i < slides.length - 1 ? 'always' : 'avoid',
          }}
        >
          {renderSlide(slide, { editable: false })}
        </div>
      ))}
    </>
  )
}

export function triggerPrintExport(slides: SlideData[], title: string) {
  // Clean up any previous print container
  const existing = document.getElementById('signal-print-container')
  if (existing) existing.remove()

  // Create and attach container
  const container = document.createElement('div')
  container.id = 'signal-print-container'
  container.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'z-index:99999;pointer-events:none;overflow:visible;background:transparent;'
  document.body.appendChild(container)

  // Mount all slides
  const root = createRoot(container)
  root.render(<PrintContainer slides={slides} />)

  // Double rAF ensures React has painted before print dialog opens
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const originalTitle = document.title
      document.title = title
      window.print()
      document.title = originalTitle

      // Clean up after print dialog closes (1.5s grace period)
      setTimeout(() => {
        root.unmount()
        container.remove()
      }, 1500)
    })
  })
}
