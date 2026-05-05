# Extract and Reuse Navigation Bar Across All Screens

## Context

The CEO dashboard HTML design provides a sophisticated dark-mode navigation bar with:
- Glassmorphism fixed header (backdrop-blur)
- YVON logo + venture-specific navigation pills (Command, Analytics, Competitor, Marketing, Creative Studio, Technical)
- Monthly view selector dropdown
- Notifications bell icon
- Marcus profile (avatar + name/title)
- Anomalies strip marquee below the nav bar

Multiple screens were deleted and need this navigation. The goal is to extract the navbar into a reusable component used consistently across all future screens with the cohesive glassmorphism dark theme.

## Approach

### Phase 1: Create Reusable NavBar Component
**File:** `components/NavBar.tsx` (update existing)

The component will:
- Accept props for venture name, profile data, and navigation links
- Render as fixed-top with backdrop blur styling matching the CEO dashboard HTML
- Dynamically render nav pills based on configured routes
- Include mode switcher dropdown with month selection
- Include notification bell with count badge
- Display venture-specific profile (Marcus + avatar)

### Phase 2: Update app/page.tsx to Use NavBar
Update main page layout to use `NavBar` component, removing any conflicting header/sidebar.

### Phase 3: Create Venture Configuration
Add configuration for:
- Navigation items per venture (Novizio vs Hourbour menu structure)
- Profile data per venture (avatar URL, name, title)
- Route mapping for nav pills

### Phase 4: Update layout.tsx Wrapper
Ensure `app/layout.tsx` properly wraps screens with NavBar.

## Critical Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `components/NavBar.tsx` | Rewrite | Reusable navigation bar from CEO dashboard design |
| `components/VentureConfig.ts` | Create | Route map, nav items, profile data by venture |
| `app/page.tsx` | Update | Integrate NavBar, verify header renders correctly |
| `app/layout.tsx` | Read-only check | Ensure layout wraps screens with NavBar |

## Verification Plan

1. **Build:** `npm run build` - TypeScript compiles without errors
2. **Lint:** `npm run lint` - No style violations
3. **Dev server:** `npm run dev` - Inspect CEO page in browser, verify navbar renders
4. **Visual consistency:** Check NavBar on multiple routes (CEO, Analytics, Competitor pages)

## Expected Outcome

- Single reusable `NavBar` component used across all screens
- Consistent branding matching the CEO dashboard design  
- Dynamic nav items based on active venture context
- Cohesive dark/glassmorphism UX throughout the app

---

**Ready for user confirmation to proceed.**
