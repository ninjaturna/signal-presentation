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
    const { instruction, slide } = await req.json()

    if (!instruction || !slide) {
      return new Response(JSON.stringify({ error: 'instruction and slide are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
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
    const result = JSON.parse(raw)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('edit-slide error:', msg)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = { runtime: 'edge' }
