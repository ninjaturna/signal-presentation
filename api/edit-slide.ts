import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an AI co-pilot for SIGNAL, a strategic presentation tool.
Your job is to apply targeted edits to individual presentation slides based on user instructions.

You will receive the current slide's JSON data and a plain-language instruction.
Respond with a JSON patch — only include the fields that should change.

Output ONLY valid JSON in this exact shape:
{
  "patch": { ...only the slide fields that changed... },
  "message": "one sentence describing what you changed and why"
}

Rules:
- Keep text sharp, strategic, and professional — this is an executive-level presentation
- Maintain the slide type unless explicitly asked to change it
- If asked to improve a headline, only return the headline field
- If asked to rewrite body text, only return the body field
- Numbers and stats should be specific and credible
- Tone: confident, direct, intelligent — like a senior McKinsey consultant
- Never add filler words or hedging language`

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured — redeploy after adding to Vercel env vars' })
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

Return the JSON patch.`,
        },
      ],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
    const result = JSON.parse(cleaned)

    // Merge links arrays — never wipe existing links when AI adds new ones
    if (result.patch?.links && req.body.slide?.links) {
      const existingIds = new Set((req.body.slide.links ?? []).map((l: any) => l.id))
      const newLinks = (result.patch.links as any[]).filter(l => !existingIds.has(l.id))
      result.patch.links = [...(req.body.slide.links ?? []), ...newLinks]
    }

    res.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('edit-slide error:', msg)
    res.status(500).json({ error: msg })
  }
}

export const config = { maxDuration: 30 }
