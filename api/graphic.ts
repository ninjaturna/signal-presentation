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

// ── Static SVG generator from structured DiagramData ─────────────────────────

interface DiagramNode {
  id: string
  label: string
  sublabel?: string
  x: number
  y: number
  width: number
  height: number
  style?: 'primary' | 'secondary' | 'accent'
}

interface DiagramEdge {
  id: string
  from: string
  to: string
  label?: string
}

function diagramDataToSvg(data: { nodes: DiagramNode[]; edges: DiagramEdge[] }): string {
  const W = 800
  const H = 400

  const px = (node: DiagramNode) => ({
    cx: (node.x + node.width / 2) / 100 * W,
    cy: (node.y + node.height / 2) / 100 * H,
    x:  node.x / 100 * W,
    y:  node.y / 100 * H,
    w:  node.width / 100 * W,
    h:  node.height / 100 * H,
  })

  const nodeMap = new Map(data.nodes.map(n => [n.id, n]))

  const edges = data.edges.map(edge => {
    const fn = nodeMap.get(edge.from)
    const tn = nodeMap.get(edge.to)
    if (!fn || !tn) return ''
    const f = px(fn), t = px(tn)
    const midY = (f.cy + t.cy) / 2
    const label = edge.label
      ? `<text x="${(f.cx + t.cx) / 2}" y="${midY - 6}" text-anchor="middle" font-size="10" fill="#77706F" font-family="DM Sans, system-ui, sans-serif">${edge.label}</text>`
      : ''
    return `<path d="M ${f.cx} ${f.cy} C ${f.cx} ${midY}, ${t.cx} ${midY}, ${t.cx} ${t.cy}" stroke="#333130" stroke-width="1.5" fill="none" marker-end="url(#arrow)"/>${label}`
  }).join('\n  ')

  const nodes = data.nodes.map(node => {
    const p = px(node)
    const fill = node.style === 'primary' ? '#1E5AF2' : node.style === 'accent' ? '#FFCC2D' : '#252424'
    const tc   = node.style === 'accent' ? '#111113' : '#FFFFFF'
    const labelY = node.sublabel ? p.cy - 8 : p.cy + 5
    const sub  = node.sublabel
      ? `<text x="${p.cx}" y="${p.cy + 9}" text-anchor="middle" font-size="11" fill="${node.style === 'accent' ? 'rgba(17,17,19,0.65)' : 'rgba(255,255,255,0.65)'}" font-family="DM Sans, system-ui, sans-serif">${node.sublabel}</text>`
      : ''
    return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="8" fill="${fill}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <text x="${p.cx}" y="${labelY}" text-anchor="middle" font-size="13" font-weight="600" fill="${tc}" font-family="DM Sans, system-ui, sans-serif">${node.label}</text>${sub}`
  }).join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#77706F"/>
    </marker>
  </defs>
  ${edges}
  ${nodes}
</svg>`
}

// ─────────────────────────────────────────────────────────────────────────────

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

    // Also derive a static SVG for legacy consumers (EditPanel, DiagramFromTextPanel)
    const svg = diagramDataToSvg(diagramData)
    res.json({ diagramData, svg })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('graphic error:', message)
    res.status(500).json({ error: message })
  }
}

export const config = { maxDuration: 30 }
