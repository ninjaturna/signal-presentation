import { useState } from 'react'
import { colors } from '../design-system'
import type { IntakeData, CompanyBrief } from '../types/deck'

interface IntakeFormProps {
  onBriefGenerated: (intake: IntakeData, brief: CompanyBrief) => void
}

export function IntakeForm({ onBriefGenerated }: IntakeFormProps) {
  const [form, setForm] = useState<IntakeData>({
    clientName: '',
    industry: '',
    engagementType: 'opportunity-pitch',
    challenge: '',
    stakeholders: '',
    context: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k: keyof IntakeData, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.clientName || !form.industry || !form.challenge) {
      setError('Client name, industry, and challenge are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const brief = await res.json()
      if (brief.error) { setError(brief.error); return }
      onBriefGenerated(form, brief)
    } catch {
      setError('Brief generation failed — check Vercel env vars')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#FFFFFF',
    border: `1px solid ${colors.border}`,
    borderRadius: 8, padding: '10px 14px',
    fontSize: 14, color: colors.ink,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    outline: 'none', boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: colors.mutedLight, letterSpacing: '0.06em',
    textTransform: 'uppercase' as const, marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', background: colors.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: colors.blue, marginBottom: 12,
          }}>
            SIGNAL
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 600, color: '#FFFFFF',
            lineHeight: 1.15, marginBottom: 8,
          }}>
            New engagement brief
          </h1>
          <p style={{ fontSize: 15, color: colors.mutedDark, lineHeight: 1.5 }}>
            Complete the intake form. SIGNAL generates a structured brief and suggested deck architecture.
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Client name</label>
              <input
                style={inputStyle}
                value={form.clientName}
                onChange={e => set('clientName', e.target.value)}
                placeholder="e.g. Disney"
              />
            </div>
            <div>
              <label style={labelStyle}>Industry</label>
              <input
                style={inputStyle}
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
                placeholder="e.g. Media & Entertainment"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Engagement type</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.engagementType}
              onChange={e => set('engagementType', e.target.value as IntakeData['engagementType'])}
            >
              <option value="opportunity-pitch">Opportunity pitch</option>
              <option value="solution-brief">Solution brief</option>
              <option value="company-brief">Company brief only</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Key challenge</label>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
              value={form.challenge}
              onChange={e => set('challenge', e.target.value)}
              placeholder="What problem are we solving? What's the strategic context?"
            />
          </div>

          <div>
            <label style={labelStyle}>
              Known stakeholders{' '}
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input
              style={inputStyle}
              value={form.stakeholders}
              onChange={e => set('stakeholders', e.target.value)}
              placeholder="e.g. CTO, Chief Data Officer, VP of Parks Technology"
            />
          </div>

          <div>
            <label style={labelStyle}>
              Additional context{' '}
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
              value={form.context}
              onChange={e => set('context', e.target.value)}
              placeholder="Prior conversations, specific asks, competitive context, internal history..."
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: colors.red }}>{error}</p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            style={{
              background: loading ? colors.mutedDark : colors.blue,
              border: 'none', borderRadius: 8,
              padding: '14px 24px', fontSize: 15, fontWeight: 600,
              color: '#FFFFFF', cursor: loading ? 'default' : 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Generating brief…' : 'Generate brief →'}
          </button>
        </div>
      </div>
    </div>
  )
}
