import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a strategic research analyst at SIGNAL, a consultancy that helps
Fortune 500 companies navigate AI transformation. You produce structured company briefs that
inform pitch decks and solution proposals.

Output ONLY valid JSON — no markdown, no backticks, no explanation. Follow this exact schema:
{
  "company": "string",
  "industry": "string",
  "oneLiner": "string — one sentence summary of who they are",
  "strategicContext": "string — 2-3 sentences on their current strategic position",
  "keyPriorities": ["string", "string", "string"],
  "painPoints": ["string", "string", "string"],
  "aiOpportunity": "string — specific AI opportunity most relevant to their situation",
  "competitivePressure": "string — what competitive forces are at play",
  "narrativeArc": "string — recommended story arc for the pitch",
  "suggestedSlides": [
    {
      "type": "cover|narrative|stat-grid|two-pane|section-break|diagram|full-bleed|closing",
      "eyebrow": "string",
      "headline": "string",
      "notes": "string — brief content guidance"
    }
  ]
}`

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const intake = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a strategic company brief for a ${intake.engagementType} pitch.

Client: ${intake.clientName}
Industry: ${intake.industry}
Key challenge: ${intake.challenge}
Known stakeholders: ${intake.stakeholders || 'Not specified'}
Additional context: ${intake.context || 'None'}

Output the JSON brief.`,
        },
      ],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    const brief = JSON.parse(raw)
    return new Response(JSON.stringify(brief), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = { runtime: 'edge' }
