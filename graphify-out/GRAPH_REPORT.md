# Graph Report — YVON (2026-05-28)
> **1011 nodes · 1715 edges · 18 named communities** (97 singleton/config clusters excluded)
> Rebuild: `npm run graphify:build` | Query: `npm run graphify:query -- "question"`

---

## God Nodes (highest impact — most connections)

| Rank | Node | Edges | Note |
|------|------|-------|------|
| 1 | `select()` | 106 | — |
| 2 | `db.ts` | 92 | — |
| 3 | `.update()` | 34 | — |
| 4 | `_content.tsx` | 26 | — |
| 5 | `page.tsx` | 23 | — |
| 6 | `apify.ts` | 21 | — |
| 7 | `MonitoringService` | 21 | — |
| 8 | `.parse()` | 21 | — |

> `POST()` / `GET()` have 90–100 edges but are generic handler names — actual call sites may be fewer.

---

## Named Communities

| # | Community | Nodes | Key Functions |
|---|-----------|-------|---------------|
| 0 | **Activity & Stream Layer** | 142 | route.ts, GET(), route.ts, route.ts |
| 1 | **Database Operations** | 125 | route.ts, getVentureHandles(), findBestMatch(), verifyVenture() |
| 2 | **AI Creative Generation** | 106 | POST(), route.ts, route.ts, route.ts |
| 3 | **Monitoring & Error Tracking** | 56 | error-tracker.ts, ErrorTracker, .constructor(), .initTrackingDir() |
| 4 | **Memory & Session Ops** | 53 | loadReports(), saveReports(), claude-client.ts, streamMessage() |
| 5 | **Activity & Stream Layer** | 49 | route.ts, agentSystem(), scoreVirality(), clamp() |
| 8 | **Client Storage / UI State** | 37 | middleware.ts, getRateLimitConfig(), verifyToken(), middleware() |
| 9 | **Delete Operations** | 33 | prefetchVentureGithubSnapshot(), test(), agent-tools.ts, safeResolve() |
| 10 | **Delete Operations** | 27 | _content.tsx, getSunday(), addDays(), sameDay() |
| 11 | **Delete Operations** | 25 | _followups.tsx, Avatar(), daysRelative(), markDone() |
| 12 | **Skills System** | 24 | clothing.ts, seedDefaults(), rowToItem(), getClothingItems() |
| 13 | **Social Media Scrapers** | 23 | scrapeForPlatform(), apify.ts, getToken(), isApifyConfigured() |
| 14 | **Agent Routing Engine** | 13 | collaboration-manager.ts, calculateRoutingConfidence(), recommendCollaboration(), HandoffManager |
| 15 | **Agent Dispatch** | 9 | gatekeeper.ts, classifyIntent(), validateContext(), gatekeep() |
| 17 | **Delete Operations** | 8 | _idea-bank.tsx, showSavedToast(), fetchTrending(), fetchAngles() |
| 18 | **Memory Optimization** | 7 | memory-manager.ts, enforceSectionCaps(), compressOldEntries(), archiveOldEntries() |
| 20 | **Delete Operations** | 6 | _resume-vault.tsx, load(), handleUpload(), analyzeResume() |
| 22 | **Session Migration** | 5 | session-schema.ts, validateSessionContent(), parseSessionContent(), migrateSessionContent() |

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