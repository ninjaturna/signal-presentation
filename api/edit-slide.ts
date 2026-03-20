import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an AI co-pilot for SIGNAL, a strategic presentation tool.
Your job is to apply targeted edits to individual presentation slides.

You will receive the current slide JSON and a plain-language instruction.

OUTPUT FORMAT — always return valid JSON in exactly one of these shapes:

Shape 1 — Successful patch:
{
  "patch": { ...only the slide fields that changed... },
  "message": "one sentence describing what changed and why"
}

Shape 2 — Insert new slide after current:
{
  "action": "insert",
  "slide": { ...complete SlideData object... },
  "message": "one sentence describing the new slide"
}

Shape 3 — Cannot fulfill:
{
  "cannotFulfill": true,
  "errorCode": "[SIG-1xx or SIG-2xx code]",
  "reason": "one sentence explaining exactly why you cannot fulfill this"
}

WHEN TO RETURN cannotFulfill:
- SIG-104: Instruction asks to add/edit a stat but slide has no stats array or empty stats
  Example: "Add a supporting stat" on a narrative slide with no stats
- SIG-101: Instruction references content that doesn't exist on this slide
  Example: "Make the pull quote bolder" when there is no pullQuote field
- SIG-102: Instruction asks for a feature this slide type doesn't support
  Example: "Add a left/right pane" to a stat-grid slide
- SIG-105: Instruction references a field this slide type doesn't have
  Example: "Update the eyebrow" on a full-bleed slide (which has no eyebrow)
- SIG-103: Slide has so little content the instruction can't be completed meaningfully
- SIG-201: Instruction is too vague to act on
  Example: "Fix it" or "Make it better" with no specifics
- SIG-106: You would make a change but the result would be identical to the current value

RULES:
- Keep text sharp and strategic — executive-level presentation
- Never invent stats, numbers, or claims that aren't in the slide data
- Active voice, present tense, max 15 words for headlines
- Never add filler or hedging language
- Forbidden words: leverage, synergy, seamless, robust, empower, utilize, innovative

SIGNAL Brand Voice:
- One idea per sentence
- Lead with the number or the outcome
- Cut the last sentence — every slide is better without its summary`

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured', signalCode: 'SIG-301' })
    return
  }

  const client = new Anthropic({ apiKey })

  try {
    const { instruction, slide } = req.body

    if (!instruction || !slide) {
      res.status(400).json({ error: 'instruction and slide are required' })
      return
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Current slide data:
${JSON.stringify(slide, null, 2)}

Instruction: ${instruction}

Return the JSON.`,
        },
      ],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    let result: any
    try {
      result = JSON.parse(cleaned)
    } catch {
      res.json({ cannotFulfill: true, errorCode: 'SIG-304', reason: 'AI returned a response that could not be parsed.' })
      return
    }

    // Handle cannot-fulfill responses from the AI
    if (result.cannotFulfill === true) {
      res.json({
        cannotFulfill: true,
        errorCode: result.errorCode ?? 'SIG-101',
        reason: result.reason ?? 'Unable to fulfill this instruction.',
      })
      return
    }

    // Validate that patch or action exists
    if (!result.action && !result.patch) {
      res.json({ cannotFulfill: true, errorCode: 'SIG-304', reason: 'AI returned a response with no patch or action.' })
      return
    }

    // Merge links arrays — never wipe existing links when AI adds new ones
    if (result.patch?.links && req.body.slide?.links) {
      const existingIds = new Set((req.body.slide.links ?? []).map((l: any) => l.id))
      const newLinks = (result.patch.links as any[]).filter(l => !existingIds.has(l.id))
      result.patch.links = [...(req.body.slide.links ?? []), ...newLinks]
    }

    res.json(result)
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    const status = err?.status ?? err?.statusCode

    console.error('edit-slide error:', msg)

    if (status === 401 || msg.includes('api_key')) {
      res.status(500).json({ error: msg, signalCode: 'SIG-301' })
    } else if (status === 429) {
      res.status(429).json({ error: msg, signalCode: 'SIG-303' })
    } else if (msg.includes('timeout')) {
      res.status(408).json({ error: msg, signalCode: 'SIG-302' })
    } else {
      res.status(500).json({ error: msg, signalCode: 'SIG-305' })
    }
  }
}

export const config = { maxDuration: 30 }
