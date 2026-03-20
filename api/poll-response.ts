import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = { maxDuration: 10 }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { deckId, slideIndex, question, answer } = req.body

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/poll_responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ deck_id: deckId, slide_index: slideIndex, question, answer }),
  })

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to save response' })
  }

  res.json({ ok: true })
}
