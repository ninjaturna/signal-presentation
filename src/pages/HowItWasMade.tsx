import React from 'react'
import { colors } from '../design-system'

interface HowItWasMadeProps {
  onBack: () => void
  onViewDemo?: () => void
}

interface SectionProps {
  phase: string
  title: string
  description: string
  children?: React.ReactNode
}

function Section({ phase, title, description, children }: SectionProps) {
  return (
    <div style={{ marginBottom: 64 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: colors.blue, marginBottom: 8,
      }}>
        {phase}
      </div>
      <h2 style={{
        fontSize: 26, fontWeight: 600, color: '#FFFFFF',
        marginBottom: 14, lineHeight: 1.2,
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: 15, lineHeight: 1.7,
        color: colors.mutedDark, maxWidth: 620, marginBottom: children ? 28 : 0,
      }}>
        {description}
      </p>
      {children}
    </div>
  )
}

const bodyStyle: React.CSSProperties = {
  fontSize: 15,
  color: '#666',
  lineHeight: 1.7,
  margin: 0,
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase' as const, color: colors.blue,
        marginBottom: 16,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
      {lines.map((line, i) => (
        <p key={i} style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: 0 }}>
          {line}
        </p>
      ))}
    </div>
  )
}

const STATS = [
  { value: '$0.25', label: 'per AI-generated deck' },
  { value: '2 hrs', label: 'to build this prototype' },
  { value: '1 day', label: 'for a full production build' },
  { value: '0', label: 'designer hours per self-serve deck' },
]

const MODES = [
  { name: 'Edit mode', desc: 'Click any element to edit text directly on the slide.' },
  { name: 'AI generation mode', desc: 'Describe a diagram or slide in plain language. The AI builds it inline.' },
  { name: 'Internal feedback mode', desc: 'Share a review link with your team before the client ever sees it.' },
  { name: 'Client view mode', desc: 'A clean, read-only link you send to the client. No editing UI, no chrome.' },
  { name: 'Client interaction mode', desc: 'Embed questions, polls, and surveys directly in the deck so clients respond inside the presentation.' },
]

const STACK = [
  { name: 'GitHub', desc: 'Design system + deck templates. Every push auto-deploys.', url: 'https://github.com' },
  { name: 'Vercel', desc: 'Hosting + serverless functions. Free tier handles this comfortably.', url: 'https://vercel.com' },
  { name: 'Anthropic API', desc: 'The AI generation layer. ~$0.25/deck at current rates.', url: 'https://anthropic.com' },
  { name: 'Launch deck URL', desc: 'e.g. decks.launchbynttdata.com — Launch owns it, no vendor lock-in.', url: null },
]

export function HowItWasMade({ onBack }: HowItWasMadeProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.ink,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: '#FFFFFF',
    }}>
      {/* Nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid #1a1a1c',
      }}>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: colors.blue,
        }}>
          SIGNAL
        </div>
        <button onClick={onBack} style={{
          background: 'transparent', border: '1px solid #222',
          borderRadius: 6, padding: '6px 14px',
          fontSize: 13, color: '#666', cursor: 'pointer',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          ← Back
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '72px 24px 96px' }}>

        {/* ── HERO ─────────────────────────────────────── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: colors.blue, marginBottom: 20,
          }}>
            For Woody
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600, lineHeight: 1.15,
            color: '#FFFFFF', marginBottom: 16,
          }}>
            Goodbye Powerpoint. Hello, the Future of Storytelling.
          </h1>
          <p style={{ fontSize: 16, color: '#77706F', lineHeight: 1.7, maxWidth: 560 }}>
            It's a prototype. Took about 2 hours with Claude Code.
            Here's what it does and why it matters.
          </p>
        </div>

        {/* ── THE PROBLEM ──────────────────────────────── */}
        <Block label="The problem">
          <Lines lines={[
            'Making a good deck takes forever.',
            'We loop in design. We email files back and forth.',
            'The client gets a PDF. It goes stale.',
            'We have no idea if they even looked at it.',
          ]} />
        </Block>

        {/* ── THE INSIGHT ──────────────────────────────── */}
        <Block label="The insight">
          <p style={bodyStyle}>
            The real issue isn't that decks take effort — it's that we're working from templates.
            Templates feel like they're helping but they're actually constraining.
          </p>
          <p style={{ ...bodyStyle, marginTop: 16 }}>
            What we actually want is consistency, and that's easy to solve with a design system.
          </p>
          <div style={{
            borderLeft: `3px solid ${colors.blue}`,
            paddingLeft: 20, margin: '20px 0',
          }}>
            <p style={{ ...bodyStyle, color: '#FFFFFF', fontStyle: 'italic' }}>
              Brand lives in code, not a file.
            </p>
          </div>
          <p style={bodyStyle}>
            A design system gives you maximum flexibility and creativity while automatically
            controlling for brand voice, look, and feel. You can't make an off-brand slide
            because the system won't let you.
          </p>
        </Block>

        {/* ── THE TREND ────────────────────────────────── */}
        <Block label="The trend">
          <p style={bodyStyle}>
            Live links are replacing PDFs. That's just where things are going.
            They're easier to update, version control is automatic, and you can track engagement —
            who opened it, which slide they spent time on, when they shared it.
          </p>
          <p style={{ ...bodyStyle, marginTop: 16 }}>
            Pitch, Gamma, and Beautiful.ai are all racing to own this space.
            The question is whether Launch builds this or pays someone else for it.
            Each deck costs $0.25 with the Anthropic API.
          </p>
        </Block>

        {/* ── WHAT I BUILT ────────────────────────────── */}
        <Block label="What we built">
          <p style={bodyStyle}>
            A self-serve web presentation system. The UI is simple enough that anyone on the
            team can use it without any training.
          </p>
          <p style={{ ...bodyStyle, marginTop: 16, marginBottom: 24 }}>
            Upload a content doc using the provided template. The system designs a presentation
            using Launch's brand guidelines. That's it.
            Note: This prototype is for demonstration purposes only. It contains no proprietary information from Launch or its clients, and is not intended for production use.
          </p>
          <div style={{
            background: '#16161a', border: '1px solid #1e1e24',
            borderRadius: 10, overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid #1e1e24',
              fontSize: 11, fontWeight: 600, color: '#555',
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
            }}>
              The modes
            </div>
            {MODES.map((mode, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                borderBottom: i < MODES.length - 1 ? '1px solid #1e1e24' : 'none',
                display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: colors.blue,
                  minWidth: 160, flexShrink: 0, paddingTop: 1,
                }}>
                  {mode.name}
                </div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                  {mode.desc}
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...bodyStyle, marginTop: 20 }}>
            Every deck is a live URL. Update it after you've already sent it.
            The client's link reflects the changes automatically.
          </p>
        </Block>

        {/* ── THE NUMBERS ──────────────────────────────── */}
        <Block label="The numbers">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: '#16161a', border: '1px solid #1e1e24',
                borderRadius: 10, padding: '20px',
              }}>
                <div style={{
                  fontSize: 32, fontWeight: 600, color: colors.blue,
                  lineHeight: 1, marginBottom: 8,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: '#555', lineHeight: 1.4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* ── THE OPPORTUNITY ──────────────────────────── */}
        <Block label="The opportunity">
          <p style={bodyStyle}>
            We could use this internally to cut deck production time and keep brand consistent
            across every seller.
          </p>
          <p style={{ ...bodyStyle, marginTop: 16 }}>
            We could also offer it as a premium deliverable — a living, trackable presentation
            instead of a PDF attachment.
          </p>
          <p style={{
            ...bodyStyle, marginTop: 20,
            color: '#FFFFFF', fontStyle: 'italic',
            borderLeft: `3px solid ${colors.gold}`,
            paddingLeft: 20,
          }}>
            It positions Launch as a firm that operates this way, not just advises clients to.
          </p>
        </Block>

        {/* ── TRY IT YOURSELF ──────────────────────────── */}
        <Block label="Try it yourself">
          <p style={bodyStyle}>
            Here's everything you need. Takes about 3 minutes.
          </p>

          <div style={{
            background: '#16161a', border: '1px solid #1e1e24',
            borderRadius: 10, padding: '24px', marginTop: 20, marginBottom: 20,
          }}>
            {[
              { step: '1', text: 'Download the sample content doc below (Netflix AI enablement example)' },
              { step: '2', text: 'Go to the homepage and upload it' },
              { step: '3', text: 'Hit generate and watch it build' },
              { step: '4', text: 'Navigate the deck, try the co-pilot, open the share menu' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                marginBottom: i < 3 ? 16 : 0,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: colors.blue, color: '#FFFFFF',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: 14, color: '#888', lineHeight: 1.5, paddingTop: 3 }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <button
              onClick={onBack}
              style={{
                background: colors.blue, border: 'none',
                borderRadius: 8, padding: '10px 20px',
                fontSize: 13, fontWeight: 600, color: '#FFFFFF',
                cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              Go to homepage →
            </button>
            <a
              href="/sample-brief.md"
              download="netflix-brief.md"
              style={{
                background: 'transparent',
                border: '1px solid #222',
                borderRadius: 8, padding: '10px 20px',
                fontSize: 13, color: '#666', cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                textDecoration: 'none', display: 'inline-flex',
                alignItems: 'center', gap: 6,
              }}
            >
              ↓ Download sample: netflix-brief.md
            </a>
          </div>

          {/* Bug caveat */}
          <div style={{
            marginTop: 20,
            background: 'rgba(255,204,45,0.06)',
            border: '1px solid rgba(255,204,45,0.15)',
            borderRadius: 8, padding: '12px 16px',
          }}>
            <p style={{ fontSize: 13, color: '#77706F', lineHeight: 1.5, margin: 0 }}>
              <span style={{ color: colors.gold, fontWeight: 600 }}>Fair warning:</span>{' '}
              this was built in 2 hours. There will be bugs. That's kind of the point —
              imagine what a proper build looks like.
            </p>
          </div>
        </Block>

        {/* ── TECH STACK ───────────────────────────────── */}
        <Block label="If you want to take this further">
          <p style={{ ...bodyStyle, marginBottom: 20 }}>
            This is the entire stack. No proprietary platform. No vendor lock-in. Launch owns it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            {STACK.map((item, i) => (
              <div key={i} style={{
                background: '#16161a', border: '1px solid #1e1e24',
                borderRadius: 8, padding: '14px 16px',
                display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                  minWidth: 140, flexShrink: 0,
                }}>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colors.blue, textDecoration: 'none' }}
                    >
                      {item.name} ↗
                    </a>
                  ) : (
                    <span style={{ color: '#888' }}>{item.name}</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* ── BUILD LOG DIVIDER ────────────────────────── */}
        <div style={{
          marginTop: 72, paddingTop: 48,
          borderTop: '1px solid #1a1a1c',
          textAlign: 'center' as const,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#333',
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            marginBottom: 8,
          }}>
            Build log
          </div>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6 }}>
            How it was actually built — architecture, phases, and tech decisions.
          </p>
          <div style={{ fontSize: 20, color: '#2a2a2a', marginTop: 12 }}>↓</div>
        </div>
      </div>

      {/* ── ARCHITECTURE (existing phases) ───────────────── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 96px' }}>

        {/* Phase 1 */}
        <Section
          phase="Phase 1"
          title="Design system foundation"
          description="Before writing any components, the entire visual language was defined as code. Color tokens, type scale, spacing, slide modes (dark/light), and a core SlideShell component — all in TypeScript, all as constants. Tailwind was configured with custom tokens and the 16:9 aspect ratio class. The goal: make every decision explicit, not arbitrary."
        >
          <div style={{
            background: '#16161a',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{ fontSize: 11, color: colors.mutedLight, marginBottom: 16, letterSpacing: '0.06em' }}>
              DESIGN SYSTEM ARCHITECTURE
            </div>
            <svg viewBox="0 0 620 180" style={{ width: '100%', height: 'auto' }}>
              <rect x="20" y="20" width="120" height="48" rx="6" fill={colors.inkSoft} stroke={colors.borderDark} strokeWidth="1"/>
              <text x="80" y="40" textAnchor="middle" fontSize="10" fill={colors.blue} fontFamily="DM Mono, monospace" fontWeight="600">tokens.ts</text>
              <text x="80" y="56" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">colors · spacing</text>
              <rect x="20" y="88" width="120" height="48" rx="6" fill={colors.inkSoft} stroke={colors.borderDark} strokeWidth="1"/>
              <text x="80" y="108" textAnchor="middle" fontSize="10" fill={colors.blue} fontFamily="DM Mono, monospace" fontWeight="600">theme.ts</text>
              <text x="80" y="124" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">SlideMode · classes</text>
              <line x1="140" y1="44" x2="190" y2="80" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>
              <line x1="140" y1="112" x2="190" y2="90" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>
              <rect x="190" y="62" width="120" height="48" rx="6" fill={colors.inkSoft} stroke={colors.blue} strokeWidth="1"/>
              <text x="250" y="82" textAnchor="middle" fontSize="10" fill={colors.blue} fontFamily="DM Mono, monospace" fontWeight="600">index.ts</text>
              <text x="250" y="98" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">barrel export</text>
              <line x1="310" y1="86" x2="370" y2="86" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>
              <rect x="370" y="62" width="130" height="48" rx="6" fill={colors.inkSoft} stroke={colors.borderDark} strokeWidth="1"/>
              <text x="435" y="82" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontFamily="DM Mono, monospace" fontWeight="600">SlideShell.tsx</text>
              <text x="435" y="98" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">aspect-slide · mode</text>
              <line x1="500" y1="86" x2="550" y2="86" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>
              <rect x="550" y="62" width="55" height="48" rx="6" fill="#1E5AF220" stroke={colors.blue} strokeWidth="1"/>
              <text x="577" y="86" textAnchor="middle" fontSize="9" fill={colors.blue} fontFamily="DM Mono, monospace" fontWeight="600">8 slide</text>
              <text x="577" y="99" textAnchor="middle" fontSize="9" fill={colors.blue} fontFamily="DM Mono, monospace">types</text>
              <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={colors.borderDark}/>
                </marker>
              </defs>
            </svg>
          </div>
        </Section>

        {/* Phase 2 */}
        <Section
          phase="Phase 2"
          title="Slide engine + Disney deck"
          description="Eight slide type components were built on top of SlideShell — Cover, Narrative, StatGrid, TwoPane, SectionBreak, FullBleed, Diagram, and Closing. Each component accepts typed props and renders consistently within the 16:9 canvas. A Presenter component handled keyboard navigation, fullscreen, and progress dots. The Disney AI Enablement deck was authored as the reference content for all eight slide types."
        >
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
          }}>
            {['Cover', 'Narrative', 'StatGrid', 'TwoPane', 'SectionBreak', 'FullBleed', 'Diagram', 'Closing'].map(name => (
              <div key={name} style={{
                background: colors.inkSoft,
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 6, padding: '8px 12px',
                fontSize: 11, fontWeight: 600,
                color: colors.mutedDark,
                textAlign: 'center',
              }}>
                {name}
              </div>
            ))}
          </div>
        </Section>

        {/* Phase 3 */}
        <Section
          phase="Phase 3"
          title="AI pipeline — brief generation + graphic co-pilot"
          description="Two Vercel Edge Functions were added to the project. The first generates a structured company brief from intake form data — strategic context, key priorities, pain points, and a suggested slide architecture — using Claude claude-sonnet-4-5 with a targeted system prompt. The second generates SVG diagrams from natural language descriptions, constrained to the SIGNAL color palette and 16:9 aspect ratio. Both functions stream tokens and return clean JSON. The SlideDiagram component was upgraded with a co-pilot UI — a toggle button opens a prompt input, Enter generates, and the SVG renders inline."
        >
          <div style={{
            background: '#16161a',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 10, padding: '16px 20px',
            fontFamily: '"DM Mono", monospace',
            fontSize: 12, lineHeight: 1.8,
            color: colors.mutedDark,
          }}>
            <div style={{ color: colors.blue, marginBottom: 4 }}>// Edge function pattern</div>
            <div><span style={{ color: colors.mutedLight }}>POST</span> /api/brief → CompanyBrief JSON</div>
            <div><span style={{ color: colors.mutedLight }}>POST</span> /api/graphic → SVG string</div>
            <div><span style={{ color: colors.mutedLight }}>POST</span> /api/edit-slide → slide patch JSON</div>
            <div style={{ marginTop: 8, color: colors.mutedLight }}>
              model: claude-sonnet-4-5 · runtime: node · streaming: false
            </div>
          </div>
        </Section>

        {/* Phase 4 */}
        <Section
          phase="Phase 4"
          title="Content doc pipeline — upload, parse, generate"
          description="The final phase added the full client upload workflow. Users fill in a structured Markdown content doc template and upload it. A frontend parser extracts slide headings, body, bullets, and notes into a typed ParsedContentDoc structure — notes are stripped before leaving the browser. A Vercel serverless function receives the parsed document and calls Claude claude-sonnet-4-5 to map content to the eight slide types, returning a SlideData[] array. The landing page was rebuilt around the upload UX with a template download link and parsed preview. React Router was removed in favour of state-based navigation."
        >
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {[
              { label: 'parseContentDoc()', detail: 'Frontend markdown → ParsedContentDoc (notes stripped)' },
              { label: '/api/generate-deck', detail: 'Serverless function: ParsedContentDoc → SlideData[] via Claude' },
              { label: 'LandingPage', detail: 'Upload UX, parsed preview, template download' },
              { label: 'SlideData model', detail: 'Typed JSON — all content as plain data, no JSX' },
              { label: 'renderSlide()', detail: 'Maps SlideData → React component at render time' },
              { label: 'SlideViewer', detail: 'Split panel: slide stage + AI chat sidebar' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'baseline', gap: 12,
                borderBottom: `1px solid ${colors.borderDark}`,
                paddingBottom: 12,
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: '#FFFFFF',
                  minWidth: 180, fontFamily: '"DM Mono", monospace',
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, color: colors.mutedDark }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Full stack */}
        <div style={{
          background: '#16161a',
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 12, padding: '24px 28px',
          marginBottom: 64,
        }}>
          <div style={{ fontSize: 11, color: colors.mutedLight, marginBottom: 16, letterSpacing: '0.06em' }}>
            FULL STACK
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px',
            fontSize: 13,
          }}>
            {[
              ['React 19 + TypeScript', 'Frontend framework'],
              ['Vite', 'Build tool'],
              ['Tailwind CSS v3', 'Utility styling'],
              ['Claude claude-sonnet-4-5', 'AI backbone'],
              ['Vercel Serverless Functions', 'Serverless API'],
              ['GitHub', 'Version control + CI'],
              ['DM Sans + DM Mono', 'Typography'],
              ['State-based routing', 'Client navigation'],
            ].map(([tech, role]) => (
              <div key={tech} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ color: '#FFFFFF', fontFamily: '"DM Mono", monospace', fontSize: 12 }}>{tech}</span>
                <span style={{ color: colors.mutedLight, fontSize: 12 }}>{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: colors.blue, border: 'none',
              borderRadius: 8, padding: '12px 24px',
              fontSize: 14, fontWeight: 600, color: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            Back to home →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center' as const, padding: '24px',
        borderTop: '1px solid #111',
        fontSize: 12, color: '#333',
      }}>
        Made by Tam Danier
      </div>
    </div>
  )
}
