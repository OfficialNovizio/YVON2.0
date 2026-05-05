# Graph Report - C:\Users\Novy\Desktop\Projects\Official YVON  (2026-05-04)

## Corpus Check
- 124 files · ~70,391 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 451 nodes · 762 edges · 47 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 189 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 105 edges
2. `GET()` - 102 edges
3. `MonitoringService` - 21 edges
4. `now()` - 17 edges
5. `RoutingFeedbackService` - 17 edges
6. `ErrorTracker` - 16 edges
7. `PATCH()` - 15 edges
8. `SkillsManager` - 14 edges
9. `SessionManager` - 13 edges
10. `verifyVenture()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getDailyLogs()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts
- `GET()` --calls--> `getVentureConfig()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\venture-context.ts
- `GET()` --calls--> `getTrendingItems()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts
- `GET()` --calls--> `getBrandDNA()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\brand-dna.ts
- `GET()` --calls--> `getCompetitorContent()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (27): getBrandDNA(), saveBrandDNA(), getCommunitySignals(), upsertCommunitySignal(), setAgentMemory(), setSocialStats(), upsertCompetitorContent(), generateWithKrea() (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (24): getArchiveRecommendations(), createBrief(), deleteAgentMemory(), deleteContentCalendarEntry(), getStrategyLog(), acknowledgeAnomaly(), createAnomalyAlert(), createAttributionEntry() (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (30): logActivity(), appendDailyLog(), createContentCalendarEntry(), createContentSuggestion(), createDecision(), createDeliverable(), createSop(), createTask() (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (6): getInsights(), runSkillLifecycleTransitions(), ErrorTracker, MonitoringService, entry(), now()

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (16): streamMessage(), generateVariants(), appendLearnedActivation(), markBriefRead(), resolveDecision(), skipEntry(), updateSop(), updateStrategyLogResult() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (19): runInstagramScraper(), runLinkedInScraper(), runWebScraper(), scrapeInstagramPosts(), scrapeLinkedInPosts(), scrapeTikTokPosts(), startRun(), waitForRun() (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (1): RoutingFeedbackService

### Community 7 - "Community 7"
Cohesion: 0.3
Nodes (1): SkillsManager

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (11): getWarRoomPlans(), clearAll(), get(), getActiveTab(), getScrollPos(), isBrowser(), set(), setActiveTab() (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (8): getAgent(), prefetchAgentMemory(), buildExecutionPlan(), createHandoffSummary(), executeSequential(), getSpecialistBriefing(), getSpecialistWithRetry(), readAgentMemoryFile()

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (4): canActAutonomously(), ConflictResolver, getAutonomyLevel(), HandoffManager

### Community 11 - "Community 11"
Cohesion: 0.3
Nodes (10): calculateSipDueDate(), generateSipReport(), getAgentDepartment(), getOverdueSips(), getPendingSips(), getSipPriority(), resolveSip(), scheduleSip() (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (6): classifyIntent(), containsInjection(), gatekeep(), generateReasoning(), generateReformulation(), validateContext()

### Community 13 - "Community 13"
Cohesion: 0.52
Nodes (6): archiveOldEntries(), batchOptimizeMemoryFiles(), compressOldEntries(), enforceSectionCaps(), getSectionStats(), optimizeMemoryFile()

### Community 14 - "Community 14"
Cohesion: 0.7
Nodes (4): migrateSessionContent(), parseSessionContent(), validateAndMigrate(), validateSessionContent()

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (1): enrichScoreCards()

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Wait for server to be ready by polling the port.

## Knowledge Gaps
- **1 isolated node(s):** `Wait for server to be ready by polling the port.`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 19`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `page.tsx`, `Home()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `layout.tsx`, `AnalyticsLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `page.tsx`, `LineChart()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `layout.tsx`, `AnalyticsContentLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `layout.tsx`, `AnalyticsPortfolioLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `layout.tsx`, `CEOCommandDashboardLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `layout.tsx`, `CompetitorLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `layout.tsx`, `CompetitorContentGapsLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `page.tsx`, `DOT()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `layout.tsx`, `CompetitorContentIntelLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `layout.tsx`, `CreativeStudioLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `page.tsx`, `handleCopy()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `layout.tsx`, `WarRoomLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `elevenlabs.ts`, `generateVoiceover()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `NavBar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `agent-skills.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `growth-loops.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `supabase-client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `supabase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `Wait for server to be ready by polling the port.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POST()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 11`, `Community 12`, `Community 15`?**
  _High betweenness centrality (0.329) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 11`?**
  _High betweenness centrality (0.278) - this node is a cross-community bridge._
- **Why does `now()` connect `Community 3` to `Community 0`, `Community 1`, `Community 5`, `Community 6`, `Community 11`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 49 inferred relationships involving `POST()` (e.g. with `appendDailyLog()` and `getCommunitySignals()`) actually correct?**
  _`POST()` has 49 INFERRED edges - model-reasoned connections that need verification._
- **Are the 51 inferred relationships involving `GET()` (e.g. with `getStrategyLog()` and `runSkillLifecycleTransitions()`) actually correct?**
  _`GET()` has 51 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `now()` (e.g. with `POST()` and `GET()`) actually correct?**
  _`now()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Wait for server to be ready by polling the port.` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._