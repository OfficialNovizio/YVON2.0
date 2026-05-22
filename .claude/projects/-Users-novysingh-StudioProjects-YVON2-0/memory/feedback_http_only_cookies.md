---
name: feedback-http-only-cookies
description: Hard rule — all YVON cookies must be HTTP-only and set server-side only. No cookies set from client components. Stark's explicit security requirement.
metadata:
  type: feedback
---

All cookies in YVON are HTTP-only and set server-side only — no exceptions.

**Why:** Client-readable cookies are XSS attack vectors. If any script can read `document.cookie`, a single XSS injection steals the session token and venture context. HTTP-only cookies are invisible to JavaScript entirely.

**How to apply:**
- All cookie writes go through API routes using `NextResponse.cookies.set()` with `httpOnly: true`, `secure: true`, `sameSite: 'lax'`
- `yvon_active_venture` cookie is HTTP-only — Mia's client components cannot read it via `document.cookie`
- Mia gets venture context as Server Component props (parent Server Component reads cookie via `cookies()` from `next/headers`, passes as prop to client component)
- Raj's `auth-middleware` skill (v1.1.0) documents the full pattern with code examples
- Dev's `api-security-checklist` has this as item 7 in the approval gate
- `VentureSwitcher` must call a server-side `/api/venture/set` route — never set the cookie client-side

**Required cookie flags for every cookie Raj sets:**
```
httpOnly: true
secure: true
sameSite: 'lax'
path: '/'
maxAge: explicit value (no indefinite sessions)
```
