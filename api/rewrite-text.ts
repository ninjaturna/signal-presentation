import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = { maxDuration: 30 }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { text, tone } = req.body as { text: string; tone: string }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const tonePrompts: Record<string, string> = {
    'executive-concise': 'Rewrite this text for a C-suite audience. Be direct, authoritative, and brief. Use short sentences. Remove any unnecessary explanation. Max 2 sentences.',
    'executive-detailed': 'Rewrite this text for a C-suite audience. Be authoritative and thorough. Include supporting context. Use confident, precise language. 3-4 sentences.',
    'casual-concise': 'Rewrite this text in a friendly, conversational tone. Keep it short and punchy. Remove corporate language. 1-2 sentences.',
    'casual-detailed': 'Rewrite this text in a friendly, conversational tone. Be warm and approachable while still being informative. Include relevant detail. 3-4 sentences.',
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `${tonePrompts[tone]}\n\nOriginal text:\n"${text}"\n\nReturn ONLY the rewritten text. No quotes, no explanation, no preamble.`
    }]
  })

  const rewritten = (message.content[0] as { type: string; text: string }).text.trim()
  res.json({ rewritten })
}
