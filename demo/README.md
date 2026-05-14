# /demo — Development Test Data

This folder contains **mock/demo data** for visual testing of the intelligence system.
All data here is fabricated for UI development purposes.

## How to Use

**During development** — mock API routes fetch from `@/demo/data/*` instead of live Supabase:

```ts
// Instead of:
import { mockReports } from '@/demo/data/reports'
// Use:
import { getLatestReports } from '@/lib/reports'
```

**Quick swap** — change your import path from `@/demo` to `@/lib`.

## What's Here

| File | Contents |
|------|----------|
| `data/reports.ts` | 3 mock department reports (analytics, marketing, competitor) |
| `data/pitches.ts` | 5 mock ranked content pitches with full Kahneman proposals |
| `index.ts` | Central export for easy swapping |

## When to Delete

When the system is fully integrated with live data and visual testing is complete:

```bash
rm -rf /demo
```

No production code imports from `/demo` directly — it's standalone reference data only.
