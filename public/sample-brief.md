# Netflix × Launch
## SIGNAL Pitch Deck Content Document

**Prepared for [Internal Review] | March 2026**

> DRAFT — For internal review only.

---

## Pitch Summary

Netflix has 260M+ subscribers globally but recommendation quality hasn't kept pace with
data volume. Viewing history drives personalization while mood, time of day, and social
context are ignored. We're pitching a Viewer Intelligence Platform — a 10-week sprint
to close the gap between Netflix's data advantage and subscriber satisfaction.

---

## Document Information

| | |
|---|---|
| **Prepared for** | Internal review |
| **Client stakeholder** | Chief Product Officer, VP of Personalization Engineering |
| **Status** | DRAFT |
| **Deck format** | 13 slides |
| **Engagement type** | Opportunity Pitch |

---

## Slide Content

---

### SLIDE 1 | COVER

**HEADING**
The intelligence layer Netflix hasn't built yet.

**SUBHEADING**
A 10-week sprint to move from behavioral prediction to contextual understanding.

**BODY**
Launch × Netflix | March 2026

> **NOTES**
> Open with: "Before I start — does everyone know why we're here today?"

---

### SLIDE 2 | THE CHALLENGE

**HEADING**
Recommendation accuracy is high. Satisfaction is flat.

**SUBHEADING**
260M subscribers. Billions of signals. Still recommending based on last Tuesday's watch history.

**BODY**
- Viewing history drives 94% of personalization signals — mood, time, and social context are ignored
- "Content discovery to play" conversion has been flat for 3 consecutive quarters
- Decision fatigue on the home screen is the #1 cited reason for churn in the 6–18 month cohort

> **NOTES**
> Problem slide. Ask "Does this sound familiar?" before advancing.
> Let the room sit with the problem.

> **GRAPHIC PROMPT — Siloed signals diagram**
> "Four disconnected boxes labeled: Viewing History, Search Behavior, Account Data, Social Signals.
> Arrows pointing inward to a central box labeled 'Current recommendation engine'.
> No connections between the four source boxes — the disconnection is the point.
> Dark background. Blue nodes. SIGNAL brand style."
> → Paste into SIGNAL AI graphic co-pilot on the diagram slide.

---

### SLIDE 3 | POLL — OPENER

**POLL TYPE:** multiple-choice

**QUESTION**
How would you describe your team's current approach to content personalization?

**OPTIONS**
- We personalize based on viewing history only
- We're testing behavioral signals but haven't scaled
- We have a roadmap but haven't started
- Personalization isn't a current priority

> **NOTES**
> Poll 1 — Opener. Run after slide 2. Give the room 30 seconds.
> Acknowledge results: "Interesting — so most of you are still in viewing history only..."
> Reference this result when you get to the solution slide.

---

### SLIDE 4 | THE SCALE OF THE OPPORTUNITY

**HEADING**
The signals exist. The infrastructure to connect them doesn't.

**SUBHEADING**
260M subscribers. Four signal sources. Zero unified context layer.

**BODY**
- 260M+: Global subscriber base generating behavioral data daily
- 94%: Percentage of recommendations driven by viewing history alone
- 3 quarters: Length of stagnation in content discovery conversion rate
- $1.6B: Estimated annual revenue impact of 1% improvement in retention

> **NOTES**
> Stats slide. Enable "Slide Build" — reveal one stat at a time.
> Lead with the $1.6B number last — it reframes everything before it.

---

### SLIDE 5 | THE FULL-BLEED STATEMENT

**STATEMENT**
The subscriber who streams at midnight and searches on their lunch break is one person. Time to treat them that way.

**ACCENT WORD**
one person

> **NOTES**
> Pause for 5 full seconds after this slide. Don't advance early.

---

### SLIDE 6 | OUR APPROACH

**HEADING**
Three layers. One intelligence platform.

**SUBHEADING**
We build from signals to decisions — not the other way around.

**BODY**
LEFT: What we build
- Signal unification layer — connects viewing, search, account, and social data
- Context inference engine — maps signals to mood, intent, and moment
- Recommendation reranker — applies context at serve time without replacing the existing stack

RIGHT: Why this works
- Additive, not rip-and-replace — works on top of Netflix's existing recommendation infrastructure
- Phase 1 scoped to a single subscriber cohort — proof before scale
- Explainable outputs — every recommendation surfaces its context reasoning

> **NOTES**
> Two-pane. Enable "Slide Build" — reveal left first, explain it, then right.

> **GRAPHIC PROMPT — Three-layer stack diagram**
> "Three-layer horizontal stack diagram. Top layer: 'Recommendation Reranker'.
> Middle layer: 'Context Inference Engine'. Bottom layer: 'Signal Unification Layer'.
> Arrows showing data flow upward. Blue primary nodes, gold accent for top layer.
> Clean, executive. SIGNAL brand style. No decorative elements."

---

### SLIDE 7 | CASE STUDY — THE CHALLENGE

**HEADING**
A global entertainment brand with 1.9B annual touchpoints — and no unified profile.

**SUBHEADING**
Parks, streaming, and retail generated billions of signals. None of them talked.

**BODY**
Three separate data teams. Three separate recommendation engines. One guest buying
tickets, watching content, and shopping merchandise — invisible as a single person.
The cost: flat NPS, rising acquisition costs, declining repeat visit rates.

> **NOTES**
> Case study 1 of 3. Just the problem. Do NOT preview the solution.

---

### SLIDE 8 | CASE STUDY — WHAT WE DID

**HEADING**
We built the layer that connected all three.

**SUBHEADING**
The breakthrough was treating the guest as a unified entity, not three separate customers.

**BODY**
- Designed a unified identity graph linking park, streaming, and retail touchpoints
- Built a context inference engine that mapped behavioral patterns to intent signals
- Deployed a recommendation API that served personalized content across all three surfaces

> **NOTES**
> Case study 2 of 3. Don't oversell — the outcome slide does the work.

> **GRAPHIC PROMPT — Identity graph diagram**
> "Three input nodes labeled: Park Visits, Streaming History, Retail Purchases.
> Arrows pointing to a central hub labeled 'Unified Guest Identity'.
> Output arrow from hub pointing right to 'Personalized Experience Layer'.
> Blue input nodes, gold central hub. Dark background. SIGNAL brand style."

---

### SLIDE 9 | CASE STUDY — THE OUTCOME

**HEADING**
+23% repeat visit rate. Content discovery conversion up 18%.

**SUBHEADING**
A guest who felt recognized across every surface — not just remembered in one.

**BODY**
- 23%: Increase in repeat visits within 90 days of deployment
- 18%: Lift in content discovery-to-play conversion in the streaming surface
- 4.1→4.6: NPS improvement across the unified cohort within one quarter

> **NOTES**
> Pause after the first stat. Ask: "Does a result like this matter to you?"

---

### SLIDE 10 | POLL — DIAGNOSTIC

**POLL TYPE:** multiple-choice

**QUESTION**
What's your biggest barrier to building a better recommendation engine?

**OPTIONS**
- Data is siloed across systems
- We lack the ML infrastructure to connect signals at scale
- There's no executive mandate or budget approval
- We don't know where to start

> **NOTES**
> Poll 2 — Diagnostic. Run before the roadmap slide.
> Use results to decide which phase to emphasize in the close.
> "Given that most of you said data is siloed — that's exactly what Phase 1 solves."

---

### SLIDE 11 | THE ROADMAP

**HEADING**
Three phases. 18 months. Measurable outcomes at every gate.

**SUBHEADING**
From signal audit to enterprise-wide context layer — phased to manage risk.

**BODY**
- Phase 1: Signal Audit + Proof of Concept — 10 weeks — Unified identity graph for one cohort, measurable lift on discovery conversion
- Phase 2: Context Engine Build — 6 months — Full context inference layer, reranker deployed across all subscriber surfaces
- Phase 3: Scale + Optimization — 6 months — Enterprise rollout, A/B testing framework, ongoing optimization loop

> **NOTES**
> Enable "Slide Build" — reveal one phase at a time.

> **GRAPHIC PROMPT — Phase-gated roadmap**
> "Horizontal 3-phase roadmap. Phase boxes: 'Signal Audit + POC', 'Context Engine Build', 'Scale + Optimize'.
> Gate diamonds between phases labeled 'POC Sign-off', 'Architecture Review'.
> Blue for phases, gold for gates. Timeline labels: '10 weeks', '6 months', '6 months'.
> Left-to-right flow. SIGNAL brand style."

---

### SLIDE 12 | INVESTMENT SUMMARY

**HEADING**
One committed partnership. Three phases of measurable return.

**SUBHEADING**
Scoped for low risk at entry. Structured for scale at exit.

**BODY**
- Phase 1: Under $300,000 — Signal audit, identity graph, and POC deployment
- Phase 2: $600,000–$800,000 — Context engine build and full reranker deployment
- Phase 3: TBD based on Phase 2 scope — Scale, optimization, and ongoing partnership

> **NOTES**
> Lead with value, land on the number.
> "The Phase 1 investment is under $300K. That's how we derisk this together."

---

### SLIDE 13 | CLOSING — THE ASK

**HEADING**
Let's build the intelligence layer Netflix's subscribers deserve.

**SUBHEADING**
Start with a 2-week discovery sprint. No commitment beyond that.

**CTA BUTTON TEXT**
Schedule a working session

**LINK URL**
https://cal.com/launch/netflix

**CONTACT LINE**
launch.co · hello@launch.co

> **NOTES**
> If poll 2 showed hesitation — lower-commitment ask: "First call's free."
> Always end with a specific next step. Never end with "questions?"

---

*This is a sample content doc demonstrating the SIGNAL v2 template format.*
*Upload this file on the homepage to generate a full deck automatically.*
*Polls at slides 3 and 10 generate interactive SlidePoll components.*
