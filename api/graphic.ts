import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a business diagram generator for SIGNAL, a strategic consultancy.
You output ONLY a raw JSON object — no markdown, no backticks, no explanation, nothing before or after the JSON.

Output format:
{
  "nodes": [
    {
      "id": "unique-id",
      "label": "Node Label",
      "sublabel": "Optional subtitle",
      "x": 5,       // % of canvas width, top-left origin (0–100)
      "y": 10,      // % of canvas height, top-left origin (0–100)
      "width": 20,  // % of canvas width
      "height": 18, // % of canvas height
      "style": "primary" | "secondary" | "accent"
    }
  ],
  "edges": [
    {
      "id": "e1",
      "from": "node-id",
      "to": "node-id",
      "label": "Optional edge label"
    }
  ]
}

SIGNAL brand style:
- style "primary" → blue (#1E5AF2) fill, white text — use for key/hero nodes
- style "secondary" → dark fill (#252424) — use for supporting nodes
- style "accent" → gold (#FFCC2D) fill — use for emphasis nodes
- Max 8 nodes, clear hierarchy, generous spacing
- Use sublabel for context or metrics beneath the main label
- Canvas is 100×100 coordinate space; keep nodes within 5–95% x and 5–85% y
- Typical node: width 18–25%, height 14–20%
- Leave breathing room between nodes (at least 5% gap)
- Edges connect logical flow; use labels sparingly (key transitions only)`

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured — redeploy after adding to Vercel env vars' })
    return
  }

  const client = new Anthropic({ apiKey })

  try {
    const { description, context } = req.body

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a clean business diagram for: ${description}${context ? `\n\nContext: ${context}` : ''}`,
        },
      ],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()

    // Parse JSON — strip any accidental markdown fences
    const jsonText = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()
    let diagramData
    try {
      diagramData = JSON.parse(jsonText)
    } catch {
      console.error('graphic: failed to parse JSON, raw:', raw.slice(0, 200))
      res.status(500).json({ error: 'Model returned invalid JSON — please try again' })
      return
    }

    res.json({ diagramData })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('graphic error:', message)
    res.status(500).json({ error: message })
  }
}

export const config = { maxDuration: 30 }
