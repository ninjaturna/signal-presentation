import { useEffect, useState } from 'react'

export interface LogoResult {
  url:       string
  format:    'svg' | 'png' | 'jpg' | 'placeholder'
  width?:    number
  height?:   number
  domain?:   string
  source:    'brandfetch' | 'placeholder'
}

const KNOWN_DOMAINS: Record<string, string> = {
  'disney':            'disney.com',
  'walt disney':       'disney.com',
  'netflix':           'netflix.com',
  'hbo':               'hbo.com',
  'apple':             'apple.com',
  'google':            'google.com',
  'alphabet':          'google.com',
  'nike':              'nike.com',
  'adidas':            'adidas.com',
  'hilton':            'hilton.com',
  'marriott':          'marriott.com',
  'pfizer':            'pfizer.com',
  'microsoft':         'microsoft.com',
  'amazon':            'amazon.com',
  'meta':              'meta.com',
  'salesforce':        'salesforce.com',
  'servicenow':        'servicenow.com',
  'royal caribbean':   'royalcaribbean.com',
  'expedia':           'expedia.com',
  'capital one':       'capitalone.com',
  "lowe's":            'lowes.com',
  'lowes':             'lowes.com',
  'verizon':           'verizon.com',
  'assurant':          'assurant.com',
  'ntt data':          'nttdata.com',
  'ntt':               'nttdata.com',
  'launch':            'launchbynttdata.com',
}

export function inferDomain(clientName: string): string {
  const lower = clientName.toLowerCase().trim()
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (lower.includes(key)) return domain
  }
  const clean = lower
    .replace(/\b(inc|corp|ltd|llc|co|company|the|group|holdings|global|international)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .join('')
  return `${clean}.com`
}

const CACHE_PREFIX = 'signal-logo-'

function getCached(domain: string): LogoResult | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + domain)
    if (raw) return JSON.parse(raw)
  } catch { /* sessionStorage not available */ }
  return null
}

function setCache(domain: string, result: LogoResult): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + domain, JSON.stringify(result))
  } catch { /* ignore */ }
}

function makePlaceholder(clientName: string): LogoResult {
  return { url: '', format: 'placeholder', source: 'placeholder', domain: clientName || 'Unknown' }
}

async function fetchFromBrandfetch(domain: string): Promise<LogoResult> {
  // Call our own server-side proxy — keeps API key out of the client bundle
  const res = await fetch(`/api/logo?domain=${encodeURIComponent(domain)}`, {
    signal: AbortSignal.timeout(6000),
  })

  if (!res.ok) throw new Error(`Brandfetch ${res.status} for ${domain}`)

  const data = await res.json()
  const logos: Array<{ type: string; formats: Array<{ src: string; format: string; width?: number; height?: number }> }>
    = data.logos ?? []

  const candidates = logos
    .flatMap(l => l.formats.map(f => ({ ...f, logoType: l.type })))
    .filter(f => f.src)

  const svgLogo = candidates.find(c => c.format === 'svg')
  if (svgLogo) return { url: svgLogo.src, format: 'svg', width: svgLogo.width, height: svgLogo.height, domain, source: 'brandfetch' }

  const pngLogo = candidates.find(c => c.format === 'png')
  if (pngLogo) return { url: pngLogo.src, format: 'png', width: pngLogo.width, height: pngLogo.height, domain, source: 'brandfetch' }

  const anyLogo = candidates[0]
  if (anyLogo) return { url: anyLogo.src, format: anyLogo.format as 'svg' | 'png' | 'jpg', width: anyLogo.width, height: anyLogo.height, domain, source: 'brandfetch' }

  throw new Error(`No logos found in Brandfetch response for ${domain}`)
}

export async function fetchClientLogo(clientName: string): Promise<LogoResult> {
  if (!clientName?.trim()) return makePlaceholder('')
  const domain = inferDomain(clientName)
  const cached = getCached(domain)
  if (cached) return cached
  try {
    const result = await fetchFromBrandfetch(domain)
    setCache(domain, result)
    return result
  } catch (err) {
    console.warn(`[SIGNAL] Logo fetch failed for "${clientName}" (${domain}):`, err)
    const placeholder = makePlaceholder(clientName)
    setCache(domain, placeholder)
    return placeholder
  }
}

export function useClientLogo(clientName: string | undefined) {
  const [logo, setLogo]       = useState<LogoResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!clientName?.trim()) {
      setLogo(makePlaceholder(''))
      return
    }
    setLoading(true)
    fetchClientLogo(clientName)
      .then(setLogo)
      .finally(() => setLoading(false))
  }, [clientName])

  return { logo, loading }
}
