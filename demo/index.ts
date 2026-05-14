// demo/index.ts
// Central export for all demo/mock data.
// Replace with live data by changing one import path: @/demo → @/lib

export { mockAnalyticsReport, mockMarketingReport, mockCompetitorReport, mockReports } from './data/reports'
export { mockPitches, mockBatch } from './data/pitches'

// ─── Usage ───────────────────────────────────────────────────────────────────
//
// In any file currently importing from @/lib:
//   import { getLatestReports } from '@/lib/reports'
//
// Swap to demo data (for visual dev):
//   import { mockReports } from '@/demo'
//
// When ready for production, change the import back.
// No other code changes needed.
