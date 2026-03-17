import { colors } from '../design-system'

interface HowItWasMadeProps {
  onBack?: () => void
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

export function HowItWasMade({ onBack, onViewDemo }: HowItWasMadeProps) {
  return (
    <div style={{
      minHeight: '100vh', background: colors.ink,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: '#FFFFFF',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center',
        padding: '20px 40px',
        borderBottom: `1px solid ${colors.borderDark}`,
      }}>
        <button
          onClick={onBack}
          style={{
            fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#FFFFFF',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', padding: 0,
          }}
        >
          SIGNAL
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={onViewDemo}
          style={{
            fontSize: 13, color: colors.mutedDark, background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', marginRight: 24,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={e => (e.currentTarget.style.color = colors.mutedDark)}
        >
          View demo deck
        </button>
        <button
          onClick={onBack}
          style={{
            fontSize: 13, color: colors.mutedDark, background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={e => (e.currentTarget.style.color = colors.mutedDark)}
        >
          ← Back
        </button>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: colors.blue, marginBottom: 16,
          }}>
            Build log
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.1, marginBottom: 20 }}>
            How SIGNAL was built
          </h1>
          <p style={{ fontSize: 18, color: colors.mutedDark, lineHeight: 1.6, maxWidth: 580 }}>
            A four-phase build from design system to AI-powered presentation tool — built live as a demo prototype using Claude, React, and Vercel.
          </p>
        </div>

        {/* Phase 1 */}
        <Section
          phase="Phase 1"
          title="Design system foundation"
          description="Before writing any components, the entire visual language was defined as code. Color tokens, type scale, spacing, slide modes (dark/light), and a core SlideShell component — all in TypeScript, all as constants. Tailwind was configured with custom tokens and the 16:9 aspect ratio class. The goal: make every decision explicit, not arbitrary."
        >
          {/* Architecture diagram */}
          <div style={{
            background: '#16161a',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 12, padding: 24,
          }}>
            <div style={{ fontSize: 11, color: colors.mutedLight, marginBottom: 16, letterSpacing: '0.06em' }}>
              DESIGN SYSTEM ARCHITECTURE
            </div>
            <svg viewBox="0 0 620 180" style={{ width: '100%', height: 'auto' }}>
              {/* tokens.ts */}
              <rect x="20" y="20" width="120" height="48" rx="6" fill={colors.inkSoft} stroke={colors.borderDark} strokeWidth="1"/>
              <text x="80" y="40" textAnchor="middle" fontSize="10" fill={colors.blue} fontFamily="DM Mono, monospace" fontWeight="600">tokens.ts</text>
              <text x="80" y="56" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">colors · spacing</text>

              {/* theme.ts */}
              <rect x="20" y="88" width="120" height="48" rx="6" fill={colors.inkSoft} stroke={colors.borderDark} strokeWidth="1"/>
              <text x="80" y="108" textAnchor="middle" fontSize="10" fill={colors.blue} fontFamily="DM Mono, monospace" fontWeight="600">theme.ts</text>
              <text x="80" y="124" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">SlideMode · classes</text>

              {/* arrows to index */}
              <line x1="140" y1="44" x2="190" y2="80" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>
              <line x1="140" y1="112" x2="190" y2="90" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>

              {/* index.ts */}
              <rect x="190" y="62" width="120" height="48" rx="6" fill={colors.inkSoft} stroke={colors.blue} strokeWidth="1"/>
              <text x="250" y="82" textAnchor="middle" fontSize="10" fill={colors.blue} fontFamily="DM Mono, monospace" fontWeight="600">index.ts</text>
              <text x="250" y="98" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">barrel export</text>

              {/* arrow to SlideShell */}
              <line x1="310" y1="86" x2="370" y2="86" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>

              {/* SlideShell */}
              <rect x="370" y="62" width="130" height="48" rx="6" fill={colors.inkSoft} stroke={colors.borderDark} strokeWidth="1"/>
              <text x="435" y="82" textAnchor="middle" fontSize="10" fill="#FFFFFF" fontFamily="DM Mono, monospace" fontWeight="600">SlideShell.tsx</text>
              <text x="435" y="98" textAnchor="middle" fontSize="9" fill={colors.mutedDark} fontFamily="DM Mono, monospace">aspect-slide · mode</text>

              {/* arrow to slides */}
              <line x1="500" y1="86" x2="550" y2="86" stroke={colors.borderDark} strokeWidth="1" markerEnd="url(#arr)"/>

              {/* slides */}
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
              model: claude-sonnet-4-5 · runtime: edge · streaming: false
            </div>
          </div>
        </Section>

        {/* Phase 4 */}
        <Section
          phase="Phase 4"
          title="Content doc pipeline — upload, parse, generate"
          description="The final phase added the full client upload workflow. Users fill in a structured Markdown content doc template and upload it. A frontend parser extracts slide headings, body, bullets, and notes into a typed ParsedContentDoc structure — notes are stripped before leaving the browser. A Vercel Edge Function receives the parsed document and calls Claude claude-sonnet-4-5 to map content to the eight slide types, returning a SlideData[] array. The landing page was rebuilt around the upload UX with a template download link and parsed preview. React Router was removed in favour of state-based navigation."
        >
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {[
              { label: 'parseContentDoc()', detail: 'Frontend markdown → ParsedContentDoc (notes stripped)' },
              { label: '/api/generate-deck', detail: 'Edge function: ParsedContentDoc → SlideData[] via Claude' },
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

        {/* Stack */}
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
              ['Vercel Edge Functions', 'Serverless API'],
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
            onClick={onViewDemo}
            style={{
              background: colors.blue, border: 'none',
              borderRadius: 8, padding: '12px 24px',
              fontSize: 14, fontWeight: 600, color: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            View the demo deck →
          </button>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: 8, padding: '12px 24px',
              fontSize: 14, color: colors.mutedDark,
              cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
