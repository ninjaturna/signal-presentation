import Anthropic from '@anthropic-ai/sdk'
import type { ParsedContentDoc } from '../src/utils/parseContentDoc'

// Do NOT instantiate at module level on Edge Runtime —
// env vars are only available at request time, not at cold start

const SYSTEM_PROMPT = `You are a presentation designer for SIGNAL, a strategic consultancy.
You receive a structured content document and output a JSON array of SlideData objects.

Available slide types and when to use them:
- "cover": ALWAYS first slide. mode: "dark". Fields: eyebrow, title, body (subtitle), meta (agency/client line)
- "narrative": Strong headline + paragraph or short bullets. mode: "light" usually, "dark" for impact statements.
  Fields: eyebrow, headline, body, pullQuote (optional — a single powerful line pulled from body)
- "stat-grid": 2–4 statistics or metrics with values, labels, context. mode: "light" or "dark".
  Fields: eyebrow, headline, stats: [{value, label, context}]
- "two-pane": Two parallel concepts (problem/solution, before/after, left/right columns). mode: "light".
  Fields: split ("50/50"|"60/40"), left: {eyebrow, heading, body, bullets}, right: {eyebrow, heading, body, bullets, accent}
- "section-break": Transition slide between major sections. mode: "dark".
  Fields: number ("01","02"...), title, subtitle
- "full-bleed": Single powerful statement. No bullets. mode: "dark".
  Fields: statement, accentWord (one word or phrase to highlight in gold), body (optional sub)
- "diagram": Slide that needs a visual diagram or framework. mode: "light".
  Fields: eyebrow, title, placeholder (describe what diagram should show)
- "closing": ALWAYS last non-appendix slide. mode: "dark".
  Fields: headline, cta (call to action button text), contact (optional)

Rules:
1. Slide 1 (cover) is ALWAYS type "cover", mode "dark"
2. Last main slide (closing/ask) is ALWAYS type "closing", mode "dark"
3. Slides with 2–4 clear statistics or metrics → "stat-grid"
4. Slides with LEFT:/RIGHT: body or two clear parallel sides → "two-pane"
5. Slides that bridge between topics or introduce a new section → "section-break"
6. Pure impact statements (no bullets, one idea) → "full-bleed"
7. Content that explicitly needs a visual, process, or diagram → "diagram"
8. Default for most slides → "narrative"
9. Use "dark" mode for: cover, closing, section-break, full-bleed, and slides where impact > information
10. Use "light" mode for content-heavy slides
11. eyebrow labels should be SHORT (2–4 words, uppercase implied)
12. Pull quotes should be the most provocative or memorable line from the body
13. For stat-grid: extract the actual numbers/percentages from body bullets into {value, label, context}
14. For closing: cta should be a short action phrase like "Start the Sprint" or "Schedule a working session"
15. Appendix slides → always "narrative" type, mode "light", eyebrow: "APPENDIX [letter]"
16. NEVER include NOTES content in any slide output — notes are internal only
17. Keep all text from the content doc — do not invent or embellish content
18. For [XX] placeholders: keep them as-is in the output (they signal items needing review)

Output ONLY a valid JSON array. No markdown, no backticks, no explanation.
Each object must have: id (string), type, mode, and the type-specific fields above.`

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set in environment variables')
    res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured. Add it in Vercel → Project → Settings → Environment Variables, then redeploy.' })
    return
  }

  const client = new Anthropic({ apiKey })

  try {
    const doc: ParsedContentDoc = req.body

    const slideSummary = doc.slides.map(s => ({
      number: s.number,
      title: s.title,
      isAppendix: s.isAppendix,
      heading: s.heading,
      subheading: s.subheading,
      body: s.body,
      hasLeftRight: s.hasLeftRight,
      left: s.left,
      right: s.right,
      footer: s.footer,
      // notes intentionally excluded
    }))

    const userContent = `Generate a SIGNAL branded deck from this content document.

Document: ${doc.documentTitle}
Client: ${doc.clientName}
Summary: ${doc.summary ?? 'Not provided'}
Engagement type: ${doc.engagementType ?? 'Pitch'}

Slides to generate:
${JSON.stringify(slideSummary, null, 2)}

Return a SlideData[] JSON array with one object per slide in order.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const raw     = (message.content[0] as { type: string; text: string }).text.trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    const slides  = JSON.parse(cleaned)

    res.json({ slides, meta: { clientName: doc.clientName, documentTitle: doc.documentTitle } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('generate-deck error:', message)
    res.status(500).json({ error: message })
  }
}

export const config = { maxDuration: 60 }
