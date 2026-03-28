// Server-side proxy for Brandfetch brand API
// Keeps BRANDFETCH_API_KEY out of the client bundle

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { domain } = req.query
  if (!domain || typeof domain !== 'string') {
    res.status(400).json({ error: 'domain query param required' })
    return
  }

  // Sanitize — only allow valid domain characters
  const safeDomain = domain.replace(/[^a-z0-9.-]/gi, '').toLowerCase()
  if (!safeDomain || safeDomain.length > 100) {
    res.status(400).json({ error: 'invalid domain' })
    return
  }

  const apiKey = process.env.BRANDFETCH_API_KEY  // No VITE_ prefix — server only
  const headers: Record<string, string> = { 'Accept': 'application/json' }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

  try {
    const upstream = await fetch(
      `https://api.brandfetch.io/v2/brands/${safeDomain}`,
      { headers, signal: AbortSignal.timeout(5000) }
    )

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `Brandfetch returned ${upstream.status}` })
      return
    }

    const data = await upstream.json()

    // Cache aggressively — brand assets don't change often
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    res.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: msg })
  }
}

export const config = { maxDuration: 10 }
