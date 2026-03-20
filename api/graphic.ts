import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a business diagram generator for SIGNAL.
Output ONLY valid JSON with NO markdown, NO backticks, NO explanation.

Return exactly this shape:
{
  "nodes": [
    {
      "id": "string — short unique slug e.g. discovery, gate-1",
      "label": "string — max 3 words",
      "sublabel": "string — optional, max 5 words",
      "x": 10,
      "y": 30,
      "width": 18,
      "height": 13,
      "color": "blue|accent|dark|muted"
    }
  ],
  "edges": [
    {
      "id": "string",
      "from": "node-id",
      "to": "node-id",
      "label": "string — optional, max 2 words"
    }
  ]
}

COORDINATE RULES (critical — follow exactly):
- x, y, width, height are percentages of the canvas (0–100)
- Canvas is 16:9 aspect ratio (wider than tall)
- Keep all nodes within: x 4–92, y 8–88
- Minimum gap between nodes: 3 percentage points
- Typical node: width 15–22, height 12–16
- For horizontal flow (process/pipeline): y between 35–65, spread x evenly
- For 2-row layout: row 1 y=20–35, row 2 y=60–75
- For hierarchy: root y=10–20, children y=45–60, leaves y=75–88
- NEVER place nodes so they overlap (check x+width and y+height)

COLOR MEANINGS:
- "blue"   = primary action/phase node (#1E5AF2 bg, white text)
- "accent" = gate/checkpoint/milestone (#FFCC2D bg, dark text)
- "dark"   = secondary/output node (#252424 bg, muted text)
- "muted"  = transparent, border only, muted text (annotations)

RULES:
- Max 8 nodes
- Keep labels short — overflow is the #1 failure mode
- Process flows: left to right
- Hierarchy: top to bottom
- Gates/checkpoints should use "accent" color
- Final/outcome node should use "dark" color`

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
    return
  }

  const client = new Anthropic({ apiKey })

  try {
    const { description, context } = req.body

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Generate a diagram for: ${description}${context ? `\n\nContext: ${context}` : ''}`,
      }],
    })

    const raw     = (message.content[0] as { type: string; text: string }).text.trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    const diagramData = JSON.parse(cleaned)

    // Validate structure before returning
    if (!diagramData.nodes || !Array.isArray(diagramData.nodes)) {
      throw new Error('Invalid diagram structure: missing nodes array')
    }

    res.json({ diagramData })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('graphic error:', message)
    res.status(500).json({ error: message })
  }
}

export const config = { maxDuration: 30 }
