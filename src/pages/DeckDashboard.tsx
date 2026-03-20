import { useState, useEffect } from 'react'

const preloadViewer = () => { import('../components/SlideViewer') }
import { colors } from '../design-system'
import { deckStore } from '../utils/deckStore'
import type { StoredDeck } from '../utils/deckStore'
import type { SlideData } from '../types/deck'
import { disneyDeck } from '../data/disney-deck'

interface DeckDashboardProps {
  onOpenDeck: (slides: SlideData[], title: string, deckId?: string) => void
  onNewDeck: () => void
  onHowItsMade: () => void
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function MenuBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: 'transparent', border: 'none',
        borderRadius: 5, padding: '7px 10px',
        fontSize: 13, color: danger ? colors.red : colors.mutedDark,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = colors.inkSoft)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  )
}

function DeckCard({
  deck,
  onOpen,
  onDelete,
  onRename,
}: {
  deck: StoredDeck
  onOpen: () => void
  onDelete?: () => void
  onRename?: (title: string) => void
}) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(deck.title)
  const [showMenu, setShowMenu] = useState(false)

  const commit = () => {
    setEditing(false)
    if (draft.trim() && draft.trim() !== deck.title) onRename?.(draft.trim())
  }

  const firstSlide  = deck.slides[0]
  const previewBg   = firstSlide?.mode === 'dark' ? colors.ink : '#1c1c21'
  const previewAccent = colors.blue

  return (
    <div
      style={{
        background: '#16161a',
        border: `1px solid ${colors.borderDark}`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = colors.blue)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = colors.borderDark)}
    >
      {/* Thumbnail */}
      <div
        onClick={onOpen}
        onMouseEnter={preloadViewer}
        style={{
          aspectRatio: '16/9',
          background: previewBg,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '16px 20px',
          cursor: 'pointer',
        }}
      >
        {/* Accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: 4, height: '100%', background: previewAccent,
        }} />

        {/* Demo badge */}
        {deck.isDemo && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(30,90,242,0.15)',
            border: '1px solid rgba(30,90,242,0.3)',
            borderRadius: 4, padding: '2px 8px',
            fontSize: 10, fontWeight: 600, color: colors.blue,
            letterSpacing: '0.06em',
          }}>
            DEMO
          </div>
        )}

        {/* Content preview */}
        <div style={{ paddingLeft: 10 }}>
          {firstSlide?.eyebrow && (
            <div style={{
              fontSize: 9, fontWeight: 600, color: colors.blue,
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
            }}>
              {firstSlide.eyebrow}
            </div>
          )}
          <div style={{
            fontSize: 13, fontWeight: 600, lineHeight: 1.2,
            color: '#FFFFFF', maxWidth: 220,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}>
            {firstSlide?.title ?? firstSlide?.headline ?? deck.title}
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={e => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') { setEditing(false); setDraft(deck.title) }
                e.stopPropagation()
              }}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.blue}`,
                borderRadius: 4,
                fontSize: 13, fontWeight: 600, color: '#FFFFFF',
                outline: 'none', padding: '2px 6px',
                width: '100%', fontFamily: 'inherit',
              }}
            />
          ) : (
            <div style={{
              fontSize: 13, fontWeight: 600, color: '#FFFFFF',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {deck.title}
            </div>
          )}
          <div style={{ fontSize: 11, color: colors.mutedDark, marginTop: 2 }}>
            {deck.slideCount} slides · {timeAgo(deck.createdAt)}
          </div>
        </div>

        {/* Three-dot menu (user decks only) */}
        {!deck.isDemo && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(v => !v) }}
              style={{
                background: 'transparent', border: 'none',
                color: colors.mutedDark, cursor: 'pointer',
                fontSize: 18, lineHeight: 1, padding: '4px 6px',
                fontFamily: 'inherit',
              }}
            >
              ···
            </button>
            {showMenu && (
              <div
                style={{
                  position: 'absolute', bottom: 36, right: 0, zIndex: 50,
                  background: '#1a1a1e', border: `1px solid ${colors.borderDark}`,
                  borderRadius: 8, padding: 6, width: 140,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
                onMouseLeave={() => setShowMenu(false)}
              >
                <MenuBtn onClick={() => { setShowMenu(false); onOpen() }}>Open</MenuBtn>
                <MenuBtn onClick={() => { setShowMenu(false); setEditing(true) }}>Rename</MenuBtn>
                <MenuBtn danger onClick={() => { setShowMenu(false); onDelete?.() }}>Delete</MenuBtn>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function DeckDashboard({ onOpenDeck, onNewDeck, onHowItsMade }: DeckDashboardProps) {
  const [decks, setDecks] = useState<StoredDeck[]>(deckStore.getAll())

  useEffect(() => {
    return deckStore.subscribe(() => setDecks(deckStore.getAll()))
  }, [])

  const demoCard: StoredDeck = {
    id: 'demo-disney',
    title: 'Disney AI Enablement (demo)',
    clientName: 'Disney',
    createdAt: new Date(0),
    slideCount: disneyDeck.length,
    slides: disneyDeck,
    isDemo: true,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.ink,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: '#FFFFFF',
    }}>
      {/* Nav */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 32px', height: 56,
        borderBottom: `1px solid ${colors.borderDark}`,
        background: '#111113',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: colors.blue,
        }}>
          SIGNAL
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={onHowItsMade}
            style={{
              background: 'transparent', border: `1px solid ${colors.borderDark}`,
              borderRadius: 6, padding: '6px 14px',
              fontSize: 13, color: colors.mutedDark, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            How this was made →
          </button>
          <button
            onClick={onNewDeck}
            style={{
              background: colors.blue, border: 'none',
              borderRadius: 6, padding: '7px 16px',
              fontSize: 13, fontWeight: 600, color: '#FFFFFF',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            + New deck
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>
            Your decks
          </h1>
          <p style={{ fontSize: 14, color: colors.mutedDark }}>
            {decks.length > 0
              ? `${decks.length} deck${decks.length !== 1 ? 's' : ''} created from content docs`
              : 'Upload a content doc to create your first deck'}
          </p>
        </div>

        {/* Empty state */}
        {decks.length === 0 && (
          <div style={{
            background: '#16161a',
            border: `1px dashed ${colors.borderDark}`,
            borderRadius: 12, padding: '48px 32px',
            textAlign: 'center', marginBottom: 56,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>
              No decks yet
            </div>
            <div style={{ fontSize: 13, color: colors.mutedDark, marginBottom: 24 }}>
              Upload a content doc to generate your first branded presentation
            </div>
            <button
              onClick={onNewDeck}
              style={{
                background: colors.blue, border: 'none',
                borderRadius: 8, padding: '10px 24px',
                fontSize: 13, fontWeight: 600, color: '#FFFFFF',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Upload content doc →
            </button>
          </div>
        )}

        {/* User decks grid */}
        {decks.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
              marginBottom: 56,
            }}>
              {decks.map(deck => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onOpen={() => onOpenDeck(deck.slides, deck.title, deck.id)}
                  onDelete={() => deckStore.remove(deck.id)}
                  onRename={title => deckStore.rename(deck.id, title)}
                />
              ))}
            </div>

            <button
              onClick={onNewDeck}
              style={{
                background: 'transparent',
                border: `1px dashed ${colors.borderDark}`,
                borderRadius: 10, padding: '14px 24px',
                fontSize: 13, color: colors.mutedDark,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'block', width: '100%', textAlign: 'center',
                marginBottom: 56,
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = colors.blue
                e.currentTarget.style.color = colors.blue
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = colors.borderDark
                e.currentTarget.style.color = colors.mutedDark
              }}
            >
              + Upload another content doc
            </button>
          </>
        )}

        {/* Demo deck — always pinned */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: colors.mutedDark, marginBottom: 16,
          }}>
            Demo deck
          </div>
          <div style={{ maxWidth: 320 }}>
            <DeckCard
              deck={demoCard}
              onOpen={() => onOpenDeck(disneyDeck, 'Disney AI Enablement · SIGNAL')}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '20px 24px',
        borderTop: `1px solid ${colors.borderDark}`,
        fontSize: 12, color: '#333', marginTop: 40,
      }}>
        Made by Tam Danier
      </div>
    </div>
  )
}
