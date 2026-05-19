# Graph Report — YVON (2026-05-19)
> **756 nodes · 1199 edges · 16 named communities** (71 singleton/config clusters excluded)
> Rebuild: `npm run graphify:build` | Query: `npm run graphify:query -- "question"`

---

## God Nodes (highest impact — most connections)

| Rank | Node | Edges | Note |
|------|------|-------|------|
| 1 | `db.ts` | 89 | — |
| 2 | `.update()` | 31 | — |
| 3 | `_content.tsx` | 25 | — |
| 4 | `MonitoringService` | 21 | — |
| 5 | `.parse()` | 19 | — |
| 6 | `.warn()` | 18 | — |
| 7 | `db-phase1.ts` | 17 | — |
| 8 | `RoutingFeedbackService` | 17 | — |

> `POST()` / `GET()` have 90–100 edges but are generic handler names — actual call sites may be fewer.

---

## Named Communities

| # | Community | Nodes | Key Functions |
|---|-----------|-------|---------------|
| 0 | **API Threshold Layer** | 90 | route.ts, GET(), route.ts, route.ts |
| 1 | **AI Creative Generation** | 86 | route.ts, POST(), route.ts, route.ts |
| 2 | **Database Operations** | 81 | route.ts, getVentureHandles(), findBestMatch(), verifyVenture() |
| 3 | **Memory & Session Ops** | 74 | route.ts, getServiceClient(), maskKey(), DELETE() |
| 4 | **Monitoring & Error Tracking** | 57 | error-tracker.ts, ErrorTracker, .constructor(), .initTrackingDir() |
| 5 | **Activity & Stream Layer** | 54 | route.ts, readMemory(), agentSystem(), scoreVirality() |
| 6 | **Delete Operations** | 26 | _content.tsx, getSunday(), addDays(), sameDay() |
| 7 | **Client Storage / UI State** | 25 | VentureSwitcher.tsx, handleClick(), selectVenture(), MerchandizeLayout() |
| 11 | **Skills System** | 15 | skills-manager.ts, SkillsManager, .constructor(), .getSkillsPath() |
| 12 | **Delete Operations** | 13 | EmptyState(), handleAdd(), handleToggle(), set() |
| 13 | **Agent Routing Engine** | 13 | collaboration-manager.ts, calculateRoutingConfidence(), recommendCollaboration(), HandoffManager |
| 14 | **SIP Protocol** | 12 | sip-manager.ts, shouldTriggerSip(), calculateSipDueDate(), getSipPriority() |
| 15 | **Social Media Scrapers** | 11 | scrapeForPlatform(), apify.ts, startRun(), waitForRun() |
| 16 | **Agent Dispatch** | 9 | gatekeeper.ts, classifyIntent(), validateContext(), gatekeep() |
| 18 | **Memory Optimization** | 7 | memory-manager.ts, enforceSectionCaps(), compressOldEntries(), archiveOldEntries() |
| 21 | **Session Migration** | 5 | session-schema.ts, validateSessionContent(), parseSessionContent(), migrateSessionContent() |

---

## Architecture Flow

```
User request
  → /api/* route handler  [API Threshold Layer]
  → verifyVenture()       [God Node]
  → Gatekeeper            → Agent Dispatch → Agent Routing Engine
  → Database Operations   → Supabase Client Layer
  → Monitoring & Error Tracking  (all paths report here)
```

**AI Creative pipeline:**
`AI Creative Generation` ← `Social Media Scrapers` → `Revenue & Analytics Events` → `Brand DNA`

**Memory pipeline:**
`Memory & Session Ops` → `Memory Optimization` → `Client Storage / UI State`

---

## Codegraph (Import Dependency Map)

See `graphify-out/CODEGRAPH_REPORT.md` for file-level import analysis.
Rebuild: `npm run codegraph:build`