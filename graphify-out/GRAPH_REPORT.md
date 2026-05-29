# Graph Report — YVON (2026-05-29)
> **1048 nodes · 1780 edges · 22 named communities** (99 singleton/config clusters excluded)
> Rebuild: `npm run graphify:build` | Query: `npm run graphify:query -- "question"`

---

## God Nodes (highest impact — most connections)

| Rank | Node | Edges | Note |
|------|------|-------|------|
| 1 | `select()` | 107 | — |
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
| 0 | **Activity & Stream Layer** | 217 | route.ts, GET(), route.ts, route.ts |
| 1 | **Database Operations** | 136 | route.ts, getVentureHandles(), findBestMatch(), verifyVenture() |
| 2 | **Monitoring & Error Tracking** | 57 | error-tracker.ts, ErrorTracker, .constructor(), .initTrackingDir() |
| 3 | **Activity & Stream Layer** | 56 | route.ts, scoreVirality(), clamp(), defScore() |
| 6 | **Delete Operations** | 33 | prefetchVentureGithubSnapshot(), test(), agent-tools.ts, safeResolve() |
| 7 | **Client Storage / UI State** | 32 | middleware.ts, getRateLimitConfig(), verifyToken(), middleware() |
| 8 | **Memory & Session Ops** | 32 | claude-client.ts, streamMessage(), session-manager.ts, validateSession() |
| 9 | **Delete Operations** | 27 | _content.tsx, getSunday(), addDays(), sameDay() |
| 10 | **Delete Operations** | 25 | _followups.tsx, Avatar(), daysRelative(), markDone() |
| 11 | **Social Media Scrapers** | 23 | scrapeForPlatform(), apify.ts, getToken(), isApifyConfigured() |
| 12 | **Competitor Intelligence** | 16 | competitor-pipeline.ts, fmtFollowers(), resolveHandles(), scrapeCompetitor() |
| 13 | **Delete Operations** | 16 | VentureSwitcher.tsx, onVentureChange(), handleClick(), selectVenture() |
| 14 | **Skills System** | 15 | skills-manager.ts, SkillsManager, .constructor(), .getSkillsPath() |
| 15 | **Revenue & Analytics Events** | 14 | route.ts, buildContext(), parseAgeBands(), getGeoFallback() |
| 17 | **Agent Routing Engine** | 13 | collaboration-manager.ts, calculateRoutingConfidence(), recommendCollaboration(), HandoffManager |
| 19 | **Agent Dispatch** | 9 | gatekeeper.ts, classifyIntent(), validateContext(), gatekeep() |
| 21 | **Delete Operations** | 8 | _idea-bank.tsx, showSavedToast(), fetchTrending(), fetchAngles() |
| 22 | **Delete Operations** | 7 | content-series.ts, rowToSeries(), getContentSeries(), createContentSeries() |
| 23 | **Memory Optimization** | 7 | memory-manager.ts, enforceSectionCaps(), compressOldEntries(), archiveOldEntries() |
| 25 | **Delete Operations** | 6 | _resume-vault.tsx, load(), handleUpload(), analyzeResume() |
| 27 | **Session Migration** | 5 | session-schema.ts, validateSessionContent(), parseSessionContent(), migrateSessionContent() |
| 33 | **Score Cards** | 4 | content-scorer.ts, calculateCompositeScore(), calculateRates(), enrichScoreCards() |

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