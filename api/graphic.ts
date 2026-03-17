import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a business diagram generator for SIGNAL, a strategic consultancy.
You output ONLY raw SVG code — no markdown, no backticks, no explanation, nothing before or after the SVG tag.

SIGNAL brand tokens:
- Blue: #1E5AF2 (primary, CTA, key nodes)
- Gold: #FFCC2D (accents, highlights)
- Ink: #111113 (dark backgrounds)
- Ink Soft: #252424 (dark secondary)
- Surface: #FCF8F5 (light backgrounds)
- Muted: #77706F (secondary text)
- Border dark: #333130
- Font: DM Sans, system-ui, sans-serif

SVG rules:
- Output a single <svg> element, viewBox="0 0 800 400", width="100%", height="100%"
- Background: transparent (the slide provides the background)
- All text: font-family="DM Sans, system-ui, sans-serif"
- Nodes/boxes: rounded rects rx="8", filled with #1E5AF2 (primary) or #252424 (secondary)
- Text on dark fills: fill="#FFFFFF" or fill="#CED4FE"
- Text on light fills: fill="#111113"
- Connector lines: stroke="#333130", stroke-width="1.5", fill="none"
- Arrow markers: define once in <defs> with id="arrow"
- Accent elements: stroke="#FFCC2D" or fill="#FFCC2D"
- Keep diagrams clean — max 8 nodes, clear hierarchy, generous spacing
- Label font-size: 13px for node labels, 11px for subtitles/descriptions
- Font weight: 600 for headings, 400 for body
- No drop shadows, no gradients except for emphasis
- Always include an arrowhead marker in <defs> for connector lines`

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured — redeploy after adding to Vercel env vars' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const client = new Anthropic({ apiKey })

  try {
    const { description, context } = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a clean business diagram SVG for this: ${description}${context ? `\n\nContext: ${context}` : ''}`,
        },
      ],
    })

    const svg = (message.content[0] as { type: string; text: string }).text.trim()
    return new Response(JSON.stringify({ svg }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('graphic error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = { maxDuration: 30 }
