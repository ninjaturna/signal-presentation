import { useState } from 'react'
import { colors } from '../design-system'
import type { SlideData } from '../types/deck'

interface InsertPollModalProps {
  onInsert: (slide: SlideData) => void
  onClose: () => void
}

type PollType = 'yes-no' | 'multiple-choice' | 'rating' | 'likert'

export function InsertPollModal({ onInsert, onClose }: InsertPollModalProps) {
  const [question, setQuestion] = useState('')
  const [pollType, setPollType] = useState<PollType>('yes-no')
  const [options, setOptions] = useState(['', '', '', ''])

  const handleInsert = () => {
    if (!question.trim()) return
    const slide: SlideData = {
      id: `poll-${Date.now()}`,
      type: 'poll',
      mode: 'dark',
      eyebrow: 'AUDIENCE POLL',
      poll: {
        question: question.trim(),
        type: pollType,
        options: pollType === 'multiple-choice' ? options.map(o => o.trim()).filter(Boolean) : [],
        allowMultiple: false,
      },

    }
    onInsert(slide)
  }

  const handleOptionChange = (i: number, val: string) => {
    setOptions(prev => prev.map((o, idx) => idx === i ? val : o))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,0.6)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', zIndex: 1101,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 440,
        background: '#16161a',
        border: `1px solid ${colors.borderDark}`,
        borderRadius: 12,
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 20px',
          borderBottom: `1px solid ${colors.borderDark}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.blue, letterSpacing: '0.08em' }}>
            INSERT POLL SLIDE
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Question */}
          <div>
            <label style={labelStyle}>Question</label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask your audience something…"
              rows={2}
              style={inputStyle}
            />
          </div>

          {/* Type selector */}
          <div>
            <label style={labelStyle}>Poll type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
              {(['yes-no', 'multiple-choice', 'rating', 'likert'] as PollType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setPollType(t)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 6,
                    border: `1px solid ${pollType === t ? colors.blue : colors.borderDark}`,
                    background: pollType === t ? '#1a1a2e' : 'transparent',
                    color: pollType === t ? colors.blue : '#666',
                    fontSize: 10, fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                  }}
                >
                  {t === 'yes-no' ? 'Yes / No' : t === 'multiple-choice' ? 'Multi-choice' : t === 'rating' ? 'Rating 1–5' : 'Likert'}
                </button>
              ))}
            </div>
          </div>

          {/* Multiple choice options */}
          {pollType === 'multiple-choice' && (
            <div>
              <label style={labelStyle}>Options (up to 4)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={e => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    style={{ ...inputStyle, resize: undefined }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rating preview */}
          {pollType === 'rating' && (
            <div style={{ fontSize: 12, color: '#555', padding: '8px 0' }}>
              Renders as a 1–5 numbered scale. Respondents tap a number.
            </div>
          )}

          {/* Likert preview */}
          {pollType === 'likert' && (
            <div style={{ fontSize: 12, color: '#555', padding: '8px 0', lineHeight: 1.5 }}>
              Renders as a 5-point agreement scale:<br/>
              <span style={{ color: '#444' }}>Strongly Disagree · Disagree · Neutral · Agree · Strongly Agree</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '12px 20px',
          borderTop: `1px solid ${colors.borderDark}`,
        }}>
          <button onClick={onClose} style={cancelBtn}>Cancel</button>
          <button
            onClick={handleInsert}
            disabled={!question.trim() || (pollType === 'multiple-choice' && options.filter(o => o.trim()).length < 2)}

            style={{
              background: colors.blue, border: 'none',
              borderRadius: 6, padding: '8px 20px',
              fontSize: 12, fontWeight: 700,
              color: '#fff', cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              opacity: (!question.trim() || (pollType === 'multiple-choice' && options.filter(o => o.trim()).length < 2)) ? 0.4 : 1,
            }}
          >
            Insert slide
          </button>
        </div>
      </div>
    </>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: '#666', letterSpacing: '0.08em', marginBottom: 6,
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#111', border: `1px solid ${colors.borderDark}`,
  borderRadius: 6, padding: '8px 10px',
  fontSize: 13, color: '#ccc',
  fontFamily: '"DM Sans", system-ui, sans-serif',
  resize: 'vertical',
  boxSizing: 'border-box',
  outline: 'none',
}

const cancelBtn: React.CSSProperties = {
  background: 'transparent', border: `1px solid ${colors.borderDark}`,
  borderRadius: 6, padding: '8px 16px',
  fontSize: 12, fontWeight: 600,
  color: '#666', cursor: 'pointer',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}
