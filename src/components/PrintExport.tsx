import { createRoot } from 'react-dom/client'
import { renderSlide } from '../utils/renderSlide'
import type { SlideData } from '../types/deck'

// 16:9 at A4 landscape width (297mm)
const PRINT_W = '297mm'
const PRINT_H = '167.0625mm' // 297 × (9/16)

function PrintContainer({ slides }: { slides: SlideData[] }) {
  return (
    <div style={{ width: PRINT_W, margin: 0, padding: 0 }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="signal-print-slide"
          style={{
            width: PRINT_W,
            height: PRINT_H,
            minHeight: PRINT_H,
            maxHeight: PRINT_H,
            overflow: 'hidden',
            position: 'relative',
            display: 'block',
            pageBreakAfter: i < slides.length - 1 ? 'always' : 'avoid',
            breakAfter: i < slides.length - 1 ? 'page' : 'avoid',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
            boxSizing: 'border-box',
          }}
        >
          {/*
            SlideShell uses aspect-ratio: 16/9 which is viewport-relative.
            Override with absolute fill so content fills the fixed mm container.
          */}
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}>
            {renderSlide(slide, { editable: false })}
          </div>
        </div>
      ))}
    </div>
  )
}

export function triggerPrintExport(slides: SlideData[], title: string) {
  // Clean up any stale container
  const existing = document.getElementById('signal-print-container')
  if (existing) existing.remove()

  // Mount container
  const container = document.createElement('div')
  container.id = 'signal-print-container'
  container.style.cssText =
    'position:fixed;top:0;left:0;width:100%;z-index:99999;' +
    'pointer-events:none;background:transparent;overflow:visible;'
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(<PrintContainer slides={slides} />)

  // 600ms gives React time to fully paint all slides before print dialog
  setTimeout(() => {
    const originalTitle = document.title
    document.title = title
    window.print()
    document.title = originalTitle

    setTimeout(() => {
      root.unmount()
      container.remove()
    }, 2000)
  }, 600)
}
