# WORKFLOW-TREE.md — YVON Agent Execution Tree
> Canonical visual reference for the full agent workflow.
> Companion to docs/WORKFLOW.md (the rule source). This file is the map; WORKFLOW.md is the law.
> Marcus loads this at session start. All agents may load on-demand when clarifying process.
> Last updated: 2026-05-21

---

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                        YVON AGENT WORKFLOW — COMPLETE TREE                          ║
║                  Initial → Execution → Memory → Self-Improvement                    ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 0 — SESSION START (every new session)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USER OPENS SESSION
│
├─ READ (mandatory, in order)
│   ├─ [1] docs/WORKFLOW.md                    ← execution model — load once, cached
│   ├─ [2] docs/os/MARCUS_STATE.md             ← cross-session snapshot (read BEFORE session)
│   │         contains: last_venture, last agent per venture,
│   │                   in-flight work, waiting tasks
│   ├─ [3] docs/os/SESSION.md                  ← global rolling state (5-session log)
│   └─ [4] docs/memory/feedback.md             ← all design/routing/behaviour rules
│
├─ INTEGRITY CHECK
│   ├─ Does SESSION.md have "## Last Clean Exit"?
│   │   ├─ YES + < 24h → proceed normally
│   │   └─ NO or > 24h → FLAG: "Previous session ended abruptly. Run reflection first."
│   │
│   └─ Does MARCUS_STATE.md show in-flight work?
│       ├─ YES → acknowledge to Stark before accepting any new task
│       └─ NO  → proceed
│
└─ VENTURE DETECTION
    ├─ Read cookie: yvon_active_venture
    │   → one of: novizio | hourbour | yvon-dashboard
    │
    ├─ If ambiguous → ask ONE question: "Novizio, Hourbour, or YVON dashboard?"
    │
    └─ Load: docs/ventures/[active]/SESSION.md
        Then inject venture rules into agent context:
        [NOVIZIO-FEEDBACK] No discount/urgency language
        [NOVIZIO-BRAND]    Audience: women 28–42, luxury-contemporary
        [NOVIZIO-DESIGN]   Palette → docs/ventures/novizio/DESIGN.md


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — FORMING (Marcus internal, silent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USER MESSAGE ARRIVES
│
└─ Marcus runs FORMING (Stark never sees this)
    │
    ├─ Q1: What does the user actually need? (intent, not literal words)
    ├─ Q2: Is this a continuation of last task or a new task?
    │       └─ Continuation → skip ENGAGE, go directly to PERFORMING
    │
    ├─ Q3: Memory check
    │       ├─ feedback.md — has this pattern failed before?
    │       └─ agent MEMORY.md — is there a Never Again rule for this?
    │
    ├─ Q4: Design check — does this task touch any UI?
    │       └─ YES → Mia is on the team. No exceptions.
    │
    ├─ Q5: Route check — which agent(s) own this?
    │   │
    │   ├─ COMMAND layer
    │   │   ├─ Marcus   → strategy, CEO brief, OKRs, synthesis, War Room
    │   │   └─ Diana    → ops, workflow, milestones, process, sprint planning
    │   │
    │   ├─ BUILD layer
    │   │   ├─ Dev      → Next.js, architecture, tech decision, build error, Vercel
    │   │   ├─ Raj      → Supabase, DB, schema, migration, route.ts, backend API
    │   │   ├─ Mia      → React component, UI, Tailwind, layout, CSS, design system
    │   │   └─ Quinn    → testing, bug, QA, lint, code quality, Pulse check
    │   │
    │   ├─ GROW layer
    │   │   ├─ Lena     → copy, caption, brand voice, email, ad copy
    │   │   ├─ Rio      → paid ads, Meta, TikTok, ROAS, CPM, funnel
    │   │   ├─ Atlas    → visual system, mood board, art direction, image prompt
    │   │   ├─ Pixel    → image batch, production pipeline, prompt optimisation
    │   │   ├─ Kai      → analytics, metrics, GA4, competitor, KPI, insight
    │   │   └─ Nate     → growth, A/B, channel performance, funnel experiment
    │   │
    │   ├─ FINANCE layer
    │   │   └─ Felix    → budget, P&L, revenue, CAC, LTV, MRR, margin, runway
    │   │
    │   └─ PSYCHOLOGY (cross-department validator — always AFTER another agent produces)
    │       └─ Kahneman → bias check, framing, System 1 filter, debiasing
    │
    └─ Q6: Team size?
        ├─ Solo   → single component, unambiguous, one agent
        ├─ Pair   → two-agent dependency (e.g. Raj + Mia)
        └─ Squad  → multi-agent feature (e.g. Kai + Raj + Mia + Quinn)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — STORMING (Marcus internal, silent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOAD: skills/operating-system/triple-pass-protocol/SKILL.md
│
├─ TRIPLE-PASS (always on for strategic outputs)
│   ├─ PASS 1 — Generate: produce the full plan/recommendation
│   ├─ PASS 2 — Adversarial Critique
│   │   ├─ What is factually wrong or unverifiable?
│   │   ├─ What assumption is load-bearing but unstated?
│   │   ├─ What is weaker than it looks?
│   │   ├─ What would embarrass YVON if this shipped?
│   │   ├─ What is vague where it should be specific?
│   │   └─ What is the strongest argument AGAINST this?
│   └─ PASS 3 — Fix: fix what can be fixed, cut what cannot
│
├─ SELF-CONTRADICTION RULE (strategic decisions)
│   ├─ State the position
│   ├─ Argue genuinely against it
│   └─ Rebuild from what survives → if it can't survive → back to Pass 1
│
├─ COUNT CRITICAL UNKNOWNS
│   ├─ 0–1 → proceed, flag the one unknown in ENGAGE output
│   └─ 2+  → STOP → ask Stark before producing any plan
│
└─ LOAD: skills/operating-system/challenge-protocol/SKILL.md
    └─ Find and challenge the load-bearing assumption before approving any agent output


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — NORMING (ENGAGE+PLAN output to Stark)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────┐
│ 👑 MARCUS — ENGAGE + PLAN                               │
│ Intent / Venture / Team / Memory check                  │
│ Design check / One unknown (Anti-Overconfidence Rule)   │
│ Plan: Solo 3-line / Pair 5-line / Squad 7-field         │
│ Done condition (binary)                                 │
│ Awaiting your go-ahead →                               │
└─────────────────────────────────────────────────────────┘

SKIP THRESHOLD (ENGAGE skipped only when ALL 3 true):
  ✓ Single agent task
  ✓ Single file change, unambiguous scope
  ✓ Zero unknowns in user message


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — GATE (hard stop — no exceptions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Awaiting your go-ahead →"
│
├─ Stark approves → PERFORMING starts
└─ Stark has NOT replied → PERFORMING never starts


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — PERFORMING (agent execution)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AGENT SWITCH RULE (fires before any task)
├─ Same agent as last task? → MEMORY.md already in context, skip load
└─ Different agent?         → Load: agent-department/[Dept]/[agent]/MEMORY.md

EXECUTION PATHS:

[SOLO]
└─ Agent reads MEMORY.md + SESSION.md
   └─ Runs own Triple-Pass quality gate before delivering
   └─ Delivers output → BUILD CHECK

[PAIR — sequential]
├─ Agent A executes (e.g. Raj — DB/API) → runs Triple-Pass
└─ Agent B executes (e.g. Mia — UI) → loads DESIGN.md → runs Triple-Pass
    └─ Both deliver → BUILD CHECK

[SQUAD — parallel or sequential per plan]
├─ Each agent reads own MEMORY.md
├─ Each agent runs own Triple-Pass before delivering
├─ Marcus synthesises all outputs
└─ Marcus runs Triple-Pass on synthesis → BUILD CHECK

ON-DEMAND LOADS (only when task requires):
├─ docs/ventures/[active]/CONTEXT.md   → architectural decisions
├─ docs/ventures/[active]/DESIGN.md    → any UI task (Mia mandatory)
├─ docs/ventures/[active]/FEEDBACK.md  → any brand/content/tone task
└─ graphify-out/GRAPH_REPORT.md        → architecture questions


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EACH AGENT — TRIPLE-PASS QUALITY GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every agent runs 3 passes before delivering any output.
Stark sees only Pass 3. Never the process.

AGENT-SPECIFIC CRITIQUE QUESTIONS (Pass 2):

  Marcus   → Is the plan strategic or just operational? Does it survive adversarial scrutiny?
  Diana    → Is there a DRI? Is the deadline realistic? Can this run without Diana holding it together?
  Dev      → Does this violate an architecture lock? Is there a simpler approach? Security risk?
  Raj      → Is SERVICE_ROLE_KEY server-only? All inputs validated? Failure path handled?
  Mia      → Are all colors CSS variables? Responsive? ARIA labels? 'use client' correct?
  Quinn    → Have I tested the edge cases AND the happy path? Is every bug reproducible?
  Kai      → Is this signal or noise? Is the base rate established? Are competitors tier-matched?
  Lena     → Did I write 5 headlines? Is the venture confirmed? Is this publish-ready?
  Rio      → Is ROAS data backing this? 2+ creative variants tested? Kahneman gate run?
  Atlas    → Is this anchored to a campaign brief? Style tags contradiction-free? AI Slop Test pass?
  Pixel    → Has Atlas approved these prompts? QC criteria defined? Batch size approved?
  Nate     → Is PMF confirmed? Can this be read in ≤14 days? ICE score from real data?
  Felix    → Is runway flagged if < 6 months? Bear case included? DRI named for every action?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — BUILD CHECK + ERROR SOLVING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RUN: npx tsc --noEmit
│
├─ PASS ──────────────────────────────────────────── → ADJOURNING
│
└─ FAIL → stay in PERFORMING (never ADJOURN on broken code)
    │
    ├─ Check: is this a known error? (feedback.md / MEMORY.md Never Again)
    │   └─ YES → apply known fix → re-run tsc
    │   └─ NO  → diagnose root cause → fix → re-run tsc
    │
    └─ If unresolvable:
        ├─ Document in agent SESSION.md Open Items
        └─ Write blocking note to docs/os/SESSION.md Waiting section


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 7 — ADJOURNING + REFLECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIGGERS when: ≥3 tool calls in the session.
LOADS: skills/operating-system/reflection-protocol/SKILL.md

5 STEPS:
  Step 1 — Name the output (one sentence: what was delivered?)
  Step 2 — Find the gap (honest: what was weaker than it should have been?)
  Step 3 — Classify → venture-specific OR universal learning
  Step 4 — Write Never Again entry
  Step 5 — Contamination check (no venture rules in universal files, and vice versa)

3-QUESTION SELF-IMPROVEMENT CHECK (from SELF-IMPROVEMENT.md):
  Q1: Repeat error? → It's in feedback.md but still happened → Forming stage missed it → fix the trigger
  Q2: User correction? → Extract rule → save to feedback.md (append only, never overwrite)
  Q3: Discovery?      → Save to feedback.md → if cross-agent: also write to docs/os/CONTEXT.md


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 8 — MEMORY WRITES (mandatory every session)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANDATORY (3 files, every session end):
┌─────────────────────────────────────────────────────────────────┐
│ agent-department/[Dept]/[agent]/SESSION.md  ← active agent      │
│ docs/os/SESSION.md                          ← global log        │
│ docs/os/MARCUS_STATE.md                     ← overwrite snapshot │
└─────────────────────────────────────────────────────────────────┘

CONDITIONAL (only when triggered):
┌─────────────────────────────────────────────────────────────────┐
│ docs/ventures/[name]/SESSION.md       ← venture-specific task   │
│ docs/memory/feedback.md               ← user correction/discovery│
│ agent MEMORY.md → Never Again         ← agent-specific rule     │
│ docs/ventures/[name]/FEEDBACK.md      ← venture-scoped rule     │
│ docs/ventures/[name]/CONTEXT.md       ← architecture decision   │
│ docs/os/CONTEXT.md                    ← cross-venture decision  │
│ marcus/SKILLS.md Distillation Log     ← validated pattern       │
└─────────────────────────────────────────────────────────────────┘

MEMORY SYNC RULE — ONE LOCATION, NEVER BOTH:
  Rule affects one agent     → that agent's MEMORY.md
  Rule affects a venture     → docs/ventures/[name]/FEEDBACK.md
  Rule affects all agents    → docs/memory/feedback.md
  Architecture decision      → CONTEXT.md (not FEEDBACK — decision, not rule)
  Cross-venture shared design→ docs/memory/design.md

FEEDBACK.md WRITE RULE: append only. If rule exists, update wording in-place. Never duplicate.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE WRITE MAP — AT A GLANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Event                     → File written
  ─────────────────────────────────────────────────────────
  Every session end         → agent SESSION.md
                            → docs/os/SESSION.md
                            → docs/os/MARCUS_STATE.md
  User corrects approach    → docs/memory/feedback.md
  Agent-specific rule       → that agent's MEMORY.md
  Venture-scoped rule       → docs/ventures/[name]/FEEDBACK.md
  Architecture decision     → docs/ventures/[name]/CONTEXT.md
  Cross-agent broadcast     → docs/os/CONTEXT.md
  Pattern validated         → marcus/SKILLS.md Distillation Log
  Venture-specific task     → docs/ventures/[name]/SESSION.md
  ─────────────────────────────────────────────────────────
  NEVER written by agents   → docs/WORKFLOW.md (Stark only)
                            → CLAUDE.md (Stark only)
                            → Any skill source file (sync script only)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURATOR CHECK (session end)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Last curator run > 7 days? → suggest: npm run curator
Curator checks:
  → Rules > 60 days old   → flag for review
  → Rules > 90 days old   → archive
  → Rules referencing deleted files → remove
  → Duplicate rules        → consolidate
```
