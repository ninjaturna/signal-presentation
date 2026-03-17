import { useEffect, useRef } from 'react'

export function SystemDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const t = setTimeout(() => { svg.classList.add('sig-animate') }, 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        /* ── Base: everything starts hidden ─────────────────────── */
        .sig-diagram .sig-node      { opacity: 0; transform: translateY(8px); }
        .sig-diagram .sig-arrow     { opacity: 0; }
        .sig-diagram .sig-sublabel  { opacity: 0; }
        .sig-diagram .sig-divider   { opacity: 0; }
        .sig-diagram .sig-divlabel  { opacity: 0; }
        .sig-diagram .sig-box-l     { opacity: 0; transform: translateY(10px); }
        .sig-diagram .sig-box-r     { opacity: 0; transform: translateY(10px); }
        .sig-diagram .sig-mock      { opacity: 0; }
        .sig-diagram .sig-chip      { opacity: 0; transform: scale(0.7); transform-box: fill-box; transform-origin: center; }
        .sig-diagram .sig-pickline  { opacity: 0; }
        .sig-diagram .sig-seq       { opacity: 0; transform: translateY(6px); }
        .sig-diagram .sig-footer    { opacity: 0; }

        /* ── Animate ─────────────────────────────────────────────── */
        .sig-diagram.sig-animate .sig-node {
          animation: sigFadeUp 0.45s ease forwards;
        }
        .sig-diagram.sig-animate .sig-node:nth-child(1) { animation-delay: 0.1s;  }
        .sig-diagram.sig-animate .sig-node:nth-child(2) { animation-delay: 0.35s; }
        .sig-diagram.sig-animate .sig-node:nth-child(3) { animation-delay: 0.6s;  }
        .sig-diagram.sig-animate .sig-node:nth-child(4) { animation-delay: 0.85s; }

        .sig-diagram.sig-animate .sig-arrow {
          animation: sigFade 0.35s ease forwards;
        }
        .sig-diagram.sig-animate .sig-arrow:nth-child(1) { animation-delay: 0.22s; }
        .sig-diagram.sig-animate .sig-arrow:nth-child(2) { animation-delay: 0.47s; }
        .sig-diagram.sig-animate .sig-arrow:nth-child(3) { animation-delay: 0.72s; }

        .sig-diagram.sig-animate .sig-sublabel {
          animation: sigFade 0.3s ease forwards;
        }
        .sig-diagram.sig-animate .sig-sublabel:nth-child(1) { animation-delay: 0.55s; }
        .sig-diagram.sig-animate .sig-sublabel:nth-child(2) { animation-delay: 0.8s;  }
        .sig-diagram.sig-animate .sig-sublabel:nth-child(3) { animation-delay: 1.05s; }
        .sig-diagram.sig-animate .sig-sublabel:nth-child(4) { animation-delay: 1.1s;  }

        .sig-diagram.sig-animate .sig-divider {
          animation: sigFade 0.6s ease forwards;
          animation-delay: 1.3s;
        }
        .sig-diagram.sig-animate .sig-divlabel {
          animation: sigFade 0.3s ease forwards;
          animation-delay: 1.5s;
        }
        .sig-diagram.sig-animate .sig-box-l {
          animation: sigFadeUp 0.4s ease forwards;
          animation-delay: 1.6s;
        }
        .sig-diagram.sig-animate .sig-box-r {
          animation: sigFadeUp 0.4s ease forwards;
          animation-delay: 1.8s;
        }
        .sig-diagram.sig-animate .sig-mock {
          animation: sigFade 0.35s ease forwards;
          animation-delay: 2.0s;
        }

        .sig-diagram.sig-animate .sig-chip {
          animation: sigPop 0.28s ease forwards;
        }
        .sig-diagram.sig-animate .sig-chip:nth-child(1)  { animation-delay: 2.1s;  }
        .sig-diagram.sig-animate .sig-chip:nth-child(2)  { animation-delay: 2.2s;  }
        .sig-diagram.sig-animate .sig-chip:nth-child(3)  { animation-delay: 2.3s;  }
        .sig-diagram.sig-animate .sig-chip:nth-child(4)  { animation-delay: 2.4s;  }
        .sig-diagram.sig-animate .sig-chip:nth-child(5)  { animation-delay: 2.5s;  }
        .sig-diagram.sig-animate .sig-chip:nth-child(6)  { animation-delay: 2.6s;  }
        .sig-diagram.sig-animate .sig-chip:nth-child(7)  { animation-delay: 2.7s;  }
        .sig-diagram.sig-animate .sig-chip:nth-child(8)  { animation-delay: 2.8s;  }

        .sig-diagram.sig-animate .sig-pickline {
          animation: sigFade 0.3s ease forwards;
          animation-delay: 2.9s;
        }

        .sig-diagram.sig-animate .sig-seq {
          animation: sigFadeUp 0.35s ease forwards;
        }
        .sig-diagram.sig-animate .sig-seq:nth-child(1) { animation-delay: 3.0s;  }
        .sig-diagram.sig-animate .sig-seq:nth-child(2) { animation-delay: 3.15s; }
        .sig-diagram.sig-animate .sig-seq:nth-child(3) { animation-delay: 3.3s;  }

        .sig-diagram.sig-animate .sig-footer {
          animation: sigFade 0.4s ease forwards;
          animation-delay: 3.6s;
        }

        /* ── Keyframes ───────────────────────────────────────────── */
        @keyframes sigFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes sigFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sigPop {
          0%   { opacity: 0; transform: scale(0.7); }
          70%  { transform: scale(1.06);            }
          100% { opacity: 1; transform: scale(1);   }
        }

        /* ── Respect reduced motion ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .sig-diagram .sig-node,
          .sig-diagram .sig-arrow,
          .sig-diagram .sig-sublabel,
          .sig-diagram .sig-divider,
          .sig-diagram .sig-divlabel,
          .sig-diagram .sig-box-l,
          .sig-diagram .sig-box-r,
          .sig-diagram .sig-mock,
          .sig-diagram .sig-chip,
          .sig-diagram .sig-pickline,
          .sig-diagram .sig-seq,
          .sig-diagram .sig-footer {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <svg
        ref={svgRef}
        className="sig-diagram"
        width="100%"
        viewBox="0 0 680 335"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>

        {/* Title — always visible */}
        <text x="340" y="13" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>how signal builds a deck</text>

        {/* ── Pipeline nodes (wrapped so nth-child counts 1–4) ─── */}
        <g>
          <g className="sig-node">
            <rect x="74" y="20" width="118" height="44" rx="8" strokeWidth="0.5" style={{ fill: 'rgb(12, 68, 124)', stroke: 'rgb(133, 183, 235)' }}/>
            <text x="133" y="42" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(181, 212, 244)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Your content</text>
          </g>
          <g className="sig-node">
            <rect x="212" y="20" width="118" height="44" rx="8" strokeWidth="0.5" style={{ fill: 'rgb(60, 52, 137)', stroke: 'rgb(175, 169, 236)' }}/>
            <text x="271" y="42" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(206, 203, 246)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Design system</text>
          </g>
          <g className="sig-node">
            <rect x="350" y="20" width="118" height="44" rx="8" strokeWidth="0.5" style={{ fill: 'rgb(99, 56, 6)', stroke: 'rgb(239, 159, 39)' }}/>
            <text x="409" y="42" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(250, 199, 117)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Claude AI</text>
          </g>
          <g className="sig-node">
            <rect x="488" y="20" width="118" height="44" rx="8" strokeWidth="0.5" style={{ fill: 'rgb(8, 80, 65)', stroke: 'rgb(93, 202, 165)' }}/>
            <text x="547" y="42" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(159, 225, 203)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Your deck</text>
          </g>
        </g>

        {/* ── Connector arrows (wrapped so nth-child counts 1–3) ─ */}
        <g>
          <line className="sig-arrow" x1="193" y1="42" x2="210" y2="42" markerEnd="url(#ar)" style={{ stroke: 'rgb(156, 154, 146)', strokeWidth: 1.5 }}/>
          <line className="sig-arrow" x1="331" y1="42" x2="348" y2="42" markerEnd="url(#ar)" style={{ stroke: 'rgb(156, 154, 146)', strokeWidth: 1.5 }}/>
          <line className="sig-arrow" x1="469" y1="42" x2="486" y2="42" markerEnd="url(#ar)" style={{ stroke: 'rgb(156, 154, 146)', strokeWidth: 1.5 }}/>
        </g>

        {/* ── Sublabels (wrapped so nth-child counts 1–4) ────────── */}
        <g>
          <text className="sig-sublabel" x="133" y="76" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>upload .md</text>
          <text className="sig-sublabel" x="271" y="76" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>tokens + types</text>
          <text className="sig-sublabel" x="409" y="76" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>reads + assembles</text>
          <text className="sig-sublabel" x="547" y="76" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>never the same</text>
        </g>

        {/* Divider */}
        <line className="sig-divider" x1="30" y1="102" x2="650" y2="102" style={{ stroke: 'rgb(156, 154, 146)', strokeWidth: 0.5, strokeDasharray: '4px, 3px' }}/>

        {/* "what makes it different" + "vs" */}
        <text className="sig-divlabel" x="340" y="96" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>what makes it different</text>
        <text className="sig-divlabel" x="341" y="216" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>vs</text>

        {/* ── Template box (left) ────────────────────────────────── */}
        <g className="sig-box-l">
          <rect x="30" y="108" width="285" height="212" rx="8" strokeWidth="0.5" style={{ fill: 'rgb(68, 68, 65)', stroke: 'rgb(180, 178, 169)' }}/>
          <text x="172" y="127" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(250, 249, 245)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Template</text>
        </g>

        {/* ── Stacked slide mock illustration ───────────────────── */}
        <g className="sig-mock">
          <g opacity="0.18">
            <rect x="132" y="132" width="72" height="42" rx="2" fill="rgb(38, 38, 36)" stroke="rgba(222, 220, 209, 0.15)" strokeWidth="0.5"/>
            <rect x="132" y="132" width="72" height="10" rx="0" fill="rgba(222, 220, 209, 0.3)"/>
            <rect x="132" y="144" width="30" height="22" rx="1" fill="rgba(222, 220, 209, 0.15)"/>
            <rect x="166" y="146" width="26" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
            <rect x="166" y="151" width="20" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
          </g>
          <g opacity="0.42">
            <rect x="136" y="136" width="72" height="42" rx="2" fill="rgb(38, 38, 36)" stroke="rgba(222, 220, 209, 0.15)" strokeWidth="0.5"/>
            <rect x="136" y="136" width="72" height="10" rx="0" fill="rgba(222, 220, 209, 0.3)"/>
            <rect x="136" y="148" width="30" height="22" rx="1" fill="rgba(222, 220, 209, 0.15)"/>
            <rect x="170" y="150" width="26" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
            <rect x="170" y="155" width="20" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
          </g>
          <rect x="140" y="140" width="72" height="42" rx="2" fill="rgb(48, 48, 46)" stroke="rgba(222, 220, 209, 0.3)" strokeWidth="0.5"/>
          <rect x="140" y="140" width="72" height="10" rx="0" fill="rgba(222, 220, 209, 0.3)"/>
          <rect x="140" y="152" width="30" height="22" rx="1" fill="rgba(222, 220, 209, 0.15)"/>
          <rect x="174" y="154" width="26" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
          <rect x="174" y="159" width="20" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
          <rect x="174" y="164" width="24" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
          <rect x="174" y="169" width="16" height="2" rx="1" fill="rgba(222, 220, 209, 0.3)"/>
          <rect x="140" y="178" width="72" height="4" rx="0" fill="rgba(222, 220, 209, 0.15)"/>
          <text x="172" y="200" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>↻ same shape. every time.</text>
        </g>

        {/* ── Design system box (right) ──────────────────────────── */}
        <g className="sig-box-r">
          <rect x="365" y="108" width="285" height="212" rx="8" strokeWidth="0.5" style={{ fill: 'rgb(38, 38, 36)', stroke: 'rgba(222, 220, 209, 0.3)' }}/>
          <text x="507" y="127" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(250, 249, 245)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Design system</text>
        </g>

        {/* ── Component chips (wrapped so nth-child counts 1–8) ─── */}
        <g>
          <g className="sig-chip">
            <rect x="374" y="138" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(12, 68, 124)', stroke: 'rgb(133, 183, 235)' }}/>
            <text x="406" y="147" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(133, 183, 235)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Cover</text>
          </g>
          <g className="sig-chip">
            <rect x="442" y="138" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(68, 68, 65)', stroke: 'rgb(180, 178, 169)' }}/>
            <text x="474" y="147" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(180, 178, 169)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Narrative</text>
          </g>
          <g className="sig-chip">
            <rect x="510" y="138" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(99, 56, 6)', stroke: 'rgb(239, 159, 39)' }}/>
            <text x="542" y="147" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(239, 159, 39)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Stat grid</text>
          </g>
          <g className="sig-chip">
            <rect x="578" y="138" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(8, 80, 65)', stroke: 'rgb(93, 202, 165)' }}/>
            <text x="610" y="147" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(93, 202, 165)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Two-pane</text>
          </g>
          <g className="sig-chip">
            <rect x="374" y="161" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(60, 52, 137)', stroke: 'rgb(175, 169, 236)' }}/>
            <text x="406" y="170" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(175, 169, 236)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Sec break</text>
          </g>
          <g className="sig-chip">
            <rect x="442" y="161" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(113, 43, 19)', stroke: 'rgb(240, 153, 123)' }}/>
            <text x="474" y="170" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(240, 153, 123)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Full bleed</text>
          </g>
          <g className="sig-chip">
            <rect x="510" y="161" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(39, 80, 10)', stroke: 'rgb(151, 196, 89)' }}/>
            <text x="542" y="170" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(151, 196, 89)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Diagram</text>
          </g>
          <g className="sig-chip">
            <rect x="578" y="161" width="64" height="18" rx="4" strokeWidth="0.5" style={{ fill: 'rgb(8, 80, 65)', stroke: 'rgb(93, 202, 165)' }}/>
            <text x="610" y="170" textAnchor="middle" dominantBaseline="central" style={{ fill: 'rgb(93, 202, 165)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>Closing</text>
          </g>
        </g>

        {/* "claude picks" label */}
        <text className="sig-pickline" x="507" y="193" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>↑ claude picks the right combination</text>

        {/* ── Assembly sequences (wrapped so nth-child counts 1–3) */}
        <g>
          <g className="sig-seq">
            <rect x="410" y="202" width="10" height="28" rx="1" fill="rgb(55, 138, 221)"/>
            <rect x="422" y="202" width="10" height="28" rx="1" fill="rgb(136, 135, 128)"/>
            <rect x="434" y="202" width="10" height="28" rx="1" fill="rgb(186, 117, 23)"/>
            <rect x="446" y="202" width="10" height="28" rx="1" fill="rgb(136, 135, 128)"/>
            <rect x="458" y="202" width="10" height="28" rx="1" fill="rgb(29, 158, 117)"/>
          </g>
          <g className="sig-seq">
            <rect x="478" y="202" width="10" height="28" rx="1" fill="rgb(55, 138, 221)"/>
            <rect x="490" y="202" width="10" height="28" rx="1" fill="rgb(127, 119, 221)"/>
            <rect x="502" y="202" width="10" height="28" rx="1" fill="rgb(136, 135, 128)"/>
            <rect x="514" y="202" width="10" height="28" rx="1" fill="rgb(136, 135, 128)"/>
            <rect x="526" y="202" width="10" height="28" rx="1" fill="rgb(29, 158, 117)"/>
          </g>
          <g className="sig-seq">
            <rect x="546" y="202" width="10" height="28" rx="1" fill="rgb(55, 138, 221)"/>
            <rect x="558" y="202" width="10" height="28" rx="1" fill="rgb(186, 117, 23)"/>
            <rect x="570" y="202" width="10" height="28" rx="1" fill="rgb(216, 90, 48)"/>
            <rect x="582" y="202" width="10" height="28" rx="1" fill="rgb(99, 153, 34)"/>
            <rect x="594" y="202" width="10" height="28" rx="1" fill="rgb(29, 158, 117)"/>
          </g>
        </g>

        {/* ── Footer text ────────────────────────────────────────── */}
        <g className="sig-footer">
          <text x="473" y="248" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>↑</text>
          <text x="541" y="248" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>↑</text>
          <text x="172" y="280" textAnchor="middle" style={{ fill: 'rgb(250, 249, 245)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>one fixed layout.</text>
          <text x="172" y="296" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>content fills predefined slots.</text>
          <text x="172" y="312" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>every deck is the same shape.</text>
          <text x="507" y="280" textAnchor="middle" style={{ fill: 'rgb(250, 249, 245)', fontSize: 14, fontWeight: 500, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>tokens + rules. never a mold.</text>
          <text x="507" y="296" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>claude chooses which components fit</text>
          <text x="507" y="312" textAnchor="middle" style={{ fill: 'rgb(194, 192, 182)', fontSize: 12, fontFamily: '-apple-system, "system-ui", "Segoe UI", sans-serif' }}>based on what your content needs.</text>
        </g>
      </svg>
    </>
  )
}
