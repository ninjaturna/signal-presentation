import Anthropic from '@anthropic-ai/sdk'
import type { ParsedContentDoc } from '../src/utils/parseContentDoc'

// ── Inlined from src/utils/logoService — avoids cross-bundle import ────────
const KNOWN_DOMAINS: Record<string, string> = {
  'disney': 'disney.com', 'walt disney': 'disney.com', 'netflix': 'netflix.com',
  'hbo': 'hbo.com', 'apple': 'apple.com', 'google': 'google.com',
  'alphabet': 'google.com', 'nike': 'nike.com', 'adidas': 'adidas.com',
  'hilton': 'hilton.com', 'marriott': 'marriott.com', 'pfizer': 'pfizer.com',
  'microsoft': 'microsoft.com', 'amazon': 'amazon.com', 'meta': 'meta.com',
  'salesforce': 'salesforce.com', 'servicenow': 'servicenow.com',
  'royal caribbean': 'royalcaribbean.com', 'expedia': 'expedia.com',
  'capital one': 'capitalone.com', "lowe's": 'lowes.com', 'lowes': 'lowes.com',
  'verizon': 'verizon.com', 'assurant': 'assurant.com',
  'ntt data': 'nttdata.com', 'ntt': 'nttdata.com', 'launch': 'launchbynttdata.com',
}
function inferDomain(clientName: string): string {
  const lower = clientName.toLowerCase().trim()
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (lower.includes(key)) return domain
  }
  const clean = lower
    .replace(/\b(inc|corp|ltd|llc|co|company|the|group|holdings|global|international)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim().split(/\s+/).join('')
  return `${clean}.com`
}

// ── Inlined from src/utils/themeSelector — avoids cross-bundle import ─────
const THEME_SELECTORS = [
  { id: 'meridian', priority: 3, clientSignals: ['accenture','deloitte','pwc','kpmg','microsoft','salesforce','servicenow','ibm','ntt','launch'], industrySignals: ['technology','consulting','finance','banking','insurance','enterprise','saas','software','b2b','telecommunications','audit','advisory'], deckTypeSignals: ['proposal','pitch','capabilities','rfi','rfp','due diligence','partnership','co-sell'], toneSignals: ['precision','authority','corporate','professional','strategic','analytical','credible','structured'], avoid: [] },
  { id: 'forge',    priority: 4, clientSignals: ['ge','siemens','honeywell','caterpillar','ford','gm','ups','fedex','amazon'], industrySignals: ['manufacturing','industrial','operations','supply chain','logistics','energy','oil','gas','mining','construction','infrastructure','utilities','automotive'], deckTypeSignals: ['qbr','quarterly business review','investment','investor','board','performance review','kpi','executive dashboard'], toneSignals: ['data-driven','metrics','roi','performance','results','heavy','serious','operational'], avoid: ['healthcare','consumer','lifestyle','hospitality'] },
  { id: 'verdant',  priority: 4, clientSignals: ['pfizer','jnj','johnson','merck','cvs','unitedhealth','humana','who','cdc'], industrySignals: ['healthcare','pharma','life sciences','biotech','medical','sustainability','esg','environment','climate','social impact','nonprofit','public sector','government'], deckTypeSignals: ['case study','impact report','esg report','white paper','thought leadership','research','discovery'], toneSignals: ['warm','human','trusted','evidence-based','scientific','responsible','purpose-driven','community'], avoid: ['dark','luxury','aggressive'] },
  { id: 'onyx',     priority: 4, clientSignals: ['openai','anthropic','nvidia','crowdstrike','palantir','apple','netflix','hbo','disney','tesla'], industrySignals: ['ai','artificial intelligence','machine learning','cybersecurity','security','blockchain','crypto','deep tech','semiconductor','defense','aerospace','luxury','fashion'], deckTypeSignals: ['ai strategy','security briefing','technology vision','product launch','innovation','transformation'], toneSignals: ['premium','exclusive','dark','bold','disruptive','cutting-edge','innovative','high-stakes'], avoid: ['healthcare','government','nonprofit'] },
  { id: 'solana',   priority: 4, clientSignals: ['disney','hilton','marriott','nike','adidas','starbucks','target','walmart','gap','royal caribbean','expedia'], industrySignals: ['retail','consumer','hospitality','hotel','travel','tourism','food','beverage','entertainment','media','sports','culture','e-commerce','dtc','brand'], deckTypeSignals: ['brand strategy','customer experience','cx','partnership','closing','next steps','kickoff','introduction'], toneSignals: ['warm','approachable','friendly','human','emotional','relationship','community','experience','guest'], avoid: ['financial','legal','compliance','security'] },
]
function selectThemeFromDoc(rawText: string): { themeId: string; reason: string; confidence: 'high'|'medium'|'low' } {
  const text = rawText.slice(0, 2000).toLowerCase()
  const scored = THEME_SELECTORS.map(t => {
    let score = t.priority
    const matched: string[] = []
    const check = (signals: string[], w: number) => {
      for (const s of signals) { if (text.includes(s)) { score += w; matched.push(s) } }
    }
    check(t.clientSignals, 5)
    check(t.industrySignals, 3)
    check(t.deckTypeSignals, 3)
    check(t.toneSignals, 2)
    for (const a of t.avoid) { if (text.includes(a)) score -= 4 }
    return { id: t.id, score, matched }
  }).sort((a, b) => b.score - a.score)
  const winner = scored[0]
  const diff = winner.score - scored[1].score
  const confidence: 'high'|'medium'|'low' = diff >= 6 ? 'high' : diff >= 3 ? 'medium' : 'low'
  const top = winner.matched.slice(0, 3).join(', ')
  const reason = top ? `Selected ${winner.id} based on ${top} signals.` : `${winner.id} applied as default.`
  return { themeId: winner.score > 0 ? winner.id : 'meridian', reason, confidence }
}

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
- "poll": Audience engagement slide. mode: "dark".
  Fields: eyebrow ("PULSE CHECK" or "QUICK CHECK"), poll: {question, type ("yes-no"|"multiple-choice"|"rating"|"likert"), options: string[]}

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
19. POLL SLIDE RULE: If a slide has isPoll: true, output type: "poll", mode: "dark", eyebrow: "PULSE CHECK",
    and poll: { question: pollQuestion, type: pollType, options: pollOptions }.
    NEVER output a narrative slide for a poll-marked slide.
    For yes-no type, options should be ["Yes", "No"] unless specific options are provided.

HIGHLIGHT USAGE RULE:
SIGNAL uses background-color text highlights for emphasis — not bold or italic.
When generating narrative slides with a key phrase that deserves emphasis,
add a highlights array to the slide:
  "highlights": [{ "id": "h1", "text": "exact phrase", "color": "blue" }]
Use sparingly: 1–2 highlights per slide maximum.
Use "blue" for primary emphasis, "gold" for secondary emphasis or data.
Never highlight more than 4–5 words at once.
Example: a statement like "The data exists. The connection doesn't."
could highlight "The connection doesn't." in blue.

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

    const rawDocText = req.body._rawText ?? ''
    const themeSelection = selectThemeFromDoc(rawDocText)
    const clientName = doc.clientName ?? ''
    const deckMeta = {
      clientName,
      clientDomain: clientName ? inferDomain(clientName) : undefined,
      themeId:         themeSelection.themeId,
      themeReason:     themeSelection.reason,
      themeConfidence: themeSelection.confidence,
    }

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
      isPoll: s.isPoll,
      pollType: s.pollType,
      pollQuestion: s.pollQuestion,
      pollOptions: s.pollOptions,
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

    res.json({ slides, deckMeta, meta: { clientName: doc.clientName, documentTitle: doc.documentTitle } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('generate-deck error:', message)
    res.status(500).json({ error: message })
  }
}

export const config = { maxDuration: 60 }
