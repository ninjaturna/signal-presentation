import type { Slide } from '../types'
import { mkText } from '../utils'

export const INITIAL_SLIDES: Slide[] = [
  {
    id: crypto.randomUUID(),
    background: '#111113',
    elements: [
      mkText('eyebrow', 'SIGNAL DECK EDITOR', 64, 64, 480, 40),
      mkText('headline', 'Strategic Presentation\nCanvas', 64, 140, 700, 200),
      mkText('body', 'Drag, resize, and style elements.\nAdd text presets and embedded media.', 64, 380, 560, 100),
    ],
  },
  {
    id: crypto.randomUUID(),
    elements: [
      mkText('subheading', 'Key Metrics', 64, 64, 400, 60),
      mkText('stat', '87%', 64, 160, 300, 120),
      mkText('caption', 'User adoption rate in first quarter', 64, 300, 360, 48),
      mkText('stat', '3.2×', 440, 160, 300, 120),
      mkText('caption', 'Return on investment', 440, 300, 300, 48),
      mkText('stat', '$4.8M', 800, 160, 360, 120),
      mkText('caption', 'Projected annual savings', 800, 300, 360, 48),
    ],
  },
  {
    id: crypto.randomUUID(),
    elements: [
      mkText('eyebrow', 'Next Steps', 64, 64, 300, 40),
      mkText('headline', 'The Path Forward', 64, 130, 640, 120),
      mkText('body', '01 — Pilot with two business units by Q2\n02 — Full rollout to 3,000 employees by Q3\n03 — Measure ROI and expand to partners in Q4', 64, 300, 640, 180),
      mkText('pullquote', '"This is the fastest we\'ve ever moved from pilot to production."', 720, 250, 460, 160),
    ],
  },
]
