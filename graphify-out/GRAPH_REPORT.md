# Graph Report - C:\Users\Novy\Desktop\Projects\Official YVON  (2026-05-13)

## Corpus Check
- 177 files · ~119,401 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 618 nodes · 997 edges · 72 communities detected
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 236 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 130 edges
2. `GET()` - 119 edges
3. `now()` - 21 edges
4. `MonitoringService` - 21 edges
5. `PATCH()` - 19 edges
6. `RoutingFeedbackService` - 17 edges
7. `ErrorTracker` - 16 edges
8. `SkillsManager` - 14 edges
9. `SessionManager` - 13 edges
10. `DELETE()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getDailyLogs()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts
- `GET()` --calls--> `setAnalyticsReport()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts
- `GET()` --calls--> `getTrendingItems()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts
- `GET()` --calls--> `createBrief()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts
- `GET()` --calls--> `getCompetitorContent()`  [INFERRED]
  C:\Users\Novy\Desktop\Projects\Official YVON\app\api\war-room-plans\route.ts → C:\Users\Novy\Desktop\Projects\Official YVON\lib\db.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (45): getBrandDNA(), saveBrandDNA(), getCommunitySignals(), upsertCommunitySignal(), getAllAgentSettings(), getVentureSocials(), createAnomalyAlert(), createAttributionEntry() (+37 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (8): getCompetitorHistory(), getInsights(), runSkillLifecycleTransitions(), ErrorTracker, MonitoringService, entry(), now(), RoutingFeedbackService

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (45): appendDailyLog(), createBrief(), createContentSuggestion(), createDecision(), createDeliverable(), createSop(), createTask(), createVenture() (+37 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (26): logActivity(), bustProviderCache(), appendLearnedActivation(), createContentCalendarEntry(), deleteAgentMemory(), deleteContentCalendarEntry(), deleteVenture(), deleteVentureSocial() (+18 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (28): getAgent(), callFast(), callSynthesis(), getActiveProviderInfo(), loadConfig(), oaiCall(), oaiMessages(), getArchiveRecommendations() (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (8): addDays(), derivedSlug(), fmtShortDate(), handleDelete(), handleNameChange(), handleSave(), handleToggle(), loadRepo()

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): getWarRoomPlans(), MerchandizeLayout(), deleteVenture(), fetchVenture(), clearAll(), get(), getActiveTab(), getScrollPos() (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (19): runInstagramScraper(), runLinkedInScraper(), runWebScraper(), scrapeInstagramPosts(), scrapeLinkedInPosts(), scrapeTikTokPosts(), startRun(), waitForRun() (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.3
Nodes (1): SkillsManager

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (9): callStudio(), handleBriefNext(), handleCaptionsNext(), handleGenerateAll(), handleGenerateAsset(), handleMoodNext(), handleRefine(), handleScriptNext() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (4): canActAutonomously(), ConflictResolver, getAutonomyLevel(), HandoffManager

### Community 11 - "Community 11"
Cohesion: 0.27
Nodes (11): flagSIP(), calculateSipDueDate(), generateSipReport(), getAgentDepartment(), getOverdueSips(), getPendingSips(), getSipPriority(), resolveSip() (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.27
Nodes (8): getRow(), load(), remove(), saveAnthropic(), saveCustom(), test(), toggle(), detectProviderFromUrl()

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (6): classifyIntent(), containsInjection(), gatekeep(), generateReasoning(), generateReformulation(), validateContext()

### Community 14 - "Community 14"
Cohesion: 0.52
Nodes (6): archiveOldEntries(), batchOptimizeMemoryFiles(), compressOldEntries(), enforceSectionCaps(), getSectionStats(), optimizeMemoryFile()

### Community 15 - "Community 15"
Cohesion: 0.7
Nodes (4): migrateSessionContent(), parseSessionContent(), validateAndMigrate(), validateSessionContent()

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (1): DOT()

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (1): enrichScoreCards()

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 0.67
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
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (0): 

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (0): 

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (0): 

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (0): 

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (0): 

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (0): 

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (0): 

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (0): 

### Community 71 - "Community 71"
Cohesion: 1.0
Nodes (1): Wait for server to be ready by polling the port.

## Knowledge Gaps
- **1 isolated node(s):** `Wait for server to be ready by polling the port.`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 25`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `page.tsx`, `Home()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `Shimmer.tsx`, `Shimmer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `VentureGate.tsx`, `VentureGate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `layout.tsx`, `ScreensLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `layout.tsx`, `AnalyticsLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `page.tsx`, `LineChart()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `layout.tsx`, `AnalyticsContentLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `layout.tsx`, `AnalyticsPortfolioLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `layout.tsx`, `AnalyticsSocialMediaLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `layout.tsx`, `CEOCommandDashboardLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `layout.tsx`, `CompetitorLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `layout.tsx`, `CompetitorAlertsLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `page.tsx`, `CompetitorAlertsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `layout.tsx`, `CompetitorContentGapsLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `layout.tsx`, `CompetitorContentIntelLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (2 nodes): `layout.tsx`, `CompetitorKeywordsLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (2 nodes): `layout.tsx`, `CreativeStudioLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `layout.tsx`, `MarketingLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (2 nodes): `page.tsx`, `AuditIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (2 nodes): `_growth-sprint.tsx`, `ViralBar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (2 nodes): `layout.tsx`, `SettingsLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (2 nodes): `layout.tsx`, `WarRoomLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (2 nodes): `elevenlabs.ts`, `generateVoiceover()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `AuthGuard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `loading.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `_subnav.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `loading.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `loading.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `_subnav.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `loading.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `_community.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `loading.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `loading.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `agent-skills.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `growth-loops.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `supabase-client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `supabase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (1 nodes): `Wait for server to be ready by polling the port.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POST()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 11`, `Community 13`, `Community 18`?**
  _High betweenness centrality (0.256) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 11`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `now()` connect `Community 1` to `Community 0`, `Community 2`, `Community 4`, `Community 7`, `Community 11`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 57 inferred relationships involving `POST()` (e.g. with `appendDailyLog()` and `.error()`) actually correct?**
  _`POST()` has 57 INFERRED edges - model-reasoned connections that need verification._
- **Are the 59 inferred relationships involving `GET()` (e.g. with `getStrategyLog()` and `callFast()`) actually correct?**
  _`GET()` has 59 INFERRED edges - model-reasoned connections that need verification._
- **Are the 19 inferred relationships involving `now()` (e.g. with `POST()` and `GET()`) actually correct?**
  _`now()` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `PATCH()` (e.g. with `.update()` and `.error()`) actually correct?**
  _`PATCH()` has 10 INFERRED edges - model-reasoned connections that need verification._