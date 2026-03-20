import { useState, useEffect } from 'react'
import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import { pollStore } from '../../utils/pollStore'
import type { SlideData } from '../../types/deck'

interface SlidePollProps {
  id: string
  eyebrow?: string
  poll: NonNullable<SlideData['poll']>
  mode?: 'light' | 'dark'
}

function resolveOptions(poll: NonNullable<SlideData['poll']>): string[] {
  if (poll.type === 'yes-no')  return ['Yes', 'No']
  if (poll.type === 'rating')  return ['1', '2', '3', '4', '5']
  if (poll.type === 'likert')  return ['1', '2', '3', '4', '5']
  return (poll.options ?? []).filter(o => o.trim() !== '')
}

export function SlidePoll({ id, eyebrow, poll, mode = 'dark' }: SlidePollProps) {
  const options = resolveOptions(poll)
  const [voted, setVoted]       = useState(() => pollStore.hasVoted(id))
  const [selected, setSelected] = useState<string[]>([])
  const [results, setResults]   = useState<Record<string, number>>({})
  const [total, setTotal]       = useState(0)

  const textPrimary = mode === 'dark' ? '#FFFFFF' : colors.ink
  const textMuted   = mode === 'dark' ? colors.mutedDark : colors.mutedLight
  const cardBg      = mode === 'dark' ? colors.inkSoft : '#FFFFFF'
  const cardBorder  = mode === 'dark' ? colors.borderDark : colors.border

  useEffect(() => {
    const unsub = pollStore.subscribe(id, () => {
      setResults(pollStore.getResults(id))
      setTotal(pollStore.getTotalVotes(id))
    })
    setResults(pollStore.getResults(id))
    setTotal(pollStore.getTotalVotes(id))
    return unsub
  }, [id])

  const toggleOption = (opt: string) => {
    if (voted) return
    if (poll.allowMultiple) {
      setSelected(prev =>
        prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
      )
    } else {
      setSelected([opt])
    }
  }

  const submitVote = () => {
    if (selected.length === 0 || voted) return
    const answer = poll.allowMultiple ? selected : selected[0]
    pollStore.save({ slideId: id, answer, respondedAt: new Date() })
    pollStore.markVoted(id)
    setVoted(true)
  }

  const maxVotes = Math.max(...options.map(o => results[o] ?? 0), 1)

  return (
    <SlideShell slideType="poll" mode={mode}>
      {/* Gold top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: colors.gold,
      }} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', maxWidth: 720, margin: '0 auto',
        width: '100%',
      }}>
        {eyebrow && (
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: colors.gold,
            marginBottom: 16,
          }}>
            {eyebrow}
          </div>
        )}

        <h2 style={{
          fontSize: 28, fontWeight: 600, lineHeight: 1.2,
          color: textPrimary, marginBottom: 32,
        }}>
          {poll.question}
        </h2>

        {/* Likert — voting */}
        {!voted && poll.type === 'likert' && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '10%', right: '10%',
                top: '50%', height: 2, background: cardBorder, zIndex: 0,
              }} />
              {['1','2','3','4','5'].map(opt => {
                const isSelected = selected.includes(opt)
                return (
                  <div key={opt} style={{ flex: 1, display: 'flex', justifyContent: 'center', zIndex: 1 }}>
                    <button
                      onClick={() => toggleOption(opt)}
                      style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: isSelected ? colors.blue : cardBg,
                        border: `2px solid ${isSelected ? colors.blue : cardBorder}`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700,
                        color: isSelected ? '#FFFFFF' : textPrimary,
                        transition: 'all 0.15s',
                        boxShadow: isSelected ? '0 0 0 4px rgba(30,90,242,0.2)' : 'none',
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                      }}
                    >
                      {opt}
                    </button>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <span style={{ fontSize: 11, color: textMuted }}>Strongly disagree</span>
              <span style={{ fontSize: 11, color: textMuted }}>Strongly agree</span>
            </div>
          </div>
        )}

        {/* Likert — results */}
        {voted && poll.type === 'likert' && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
              {['1','2','3','4','5'].map(opt => {
                const count = results[opt] ?? 0
                const pct = total > 0 ? count / total : 0
                return (
                  <div key={opt} style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ fontSize: 11, color: textMuted }}>{count}</span>
                    <div style={{
                      width: '100%', height: Math.max(4, pct * 64),
                      background: colors.blue, borderRadius: '3px 3px 0 0',
                      transition: 'height 0.6s ease',
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>{opt}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 10, color: textMuted }}>Strongly disagree</span>
              <span style={{ fontSize: 10, color: textMuted }}>Strongly agree</span>
            </div>
          </div>
        )}

        {/* Standard options — voting (non-likert) */}
        {!voted && poll.type !== 'likert' && (
          <div style={{
            display: 'flex',
            flexDirection: poll.type === 'rating' ? 'row' : 'column',
            gap: 12,
            marginBottom: 24,
          }}>
            {options.map(opt => {
              const isSelected = selected.includes(opt)
              return (
                <button
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  style={{
                    background: isSelected ? colors.blue : cardBg,
                    border: `2px solid ${isSelected ? colors.blue : cardBorder}`,
                    borderRadius: 10,
                    padding: poll.type === 'rating' ? '16px 0' : '14px 20px',
                    flex: poll.type === 'rating' ? 1 : undefined,
                    fontSize: poll.type === 'rating' ? 20 : 15,
                    fontWeight: 600,
                    color: isSelected ? '#FFFFFF' : textPrimary,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 0 0 3px rgba(30,90,242,0.25)' : 'none',
                  }}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* Standard results — bar chart (non-likert) */}
        {voted && poll.type !== 'likert' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {options.map(opt => {
              const count = results[opt] ?? 0
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              const isWinner = count === maxVotes && count > 0
              return (
                <div key={opt}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: 6, alignItems: 'baseline',
                  }}>
                    <span style={{
                      fontSize: 14, fontWeight: 600, color: textPrimary,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      {opt}
                      {isWinner && (
                        <span style={{ fontSize: 10, color: colors.gold, fontWeight: 700 }}>LEADING</span>
                      )}
                    </span>
                    <span style={{ fontSize: 13, color: textMuted }}>
                      {pct}% · {count} vote{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={{ height: 10, background: cardBorder, borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 5, width: `${pct}%`,
                      background: isWinner ? colors.gold : colors.blue,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!voted ? (
            <button
              onClick={submitVote}
              disabled={selected.length === 0}
              style={{
                background: selected.length > 0 ? colors.blue : cardBorder,
                border: 'none', borderRadius: 8,
                padding: '12px 28px',
                fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                cursor: selected.length > 0 ? 'pointer' : 'default',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                opacity: selected.length === 0 ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              Submit →
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontSize: 13, fontWeight: 600, color: '#1D9E75',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                ✓ Response recorded
              </span>
              <span style={{ fontSize: 12, color: textMuted }}>
                {total} total response{total !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 24, right: 40,
        fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: colors.borderDark,
      }}>
        SIGNAL
      </div>
    </SlideShell>
  )
}
