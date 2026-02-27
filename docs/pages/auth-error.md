**Route**
`/auth/error`

**Purpose**
Show OAuth failure reasons and allow the user to retry.

**SEO**
- Title: `Автентифікація | Pickly` (inherited from `src/app/auth/layout.tsx`)
- Not indexed (`robots: noindex, nofollow`), blocked by robots.txt

**Layout (Desktop)**
```text
[Full-screen light background]
  [Centered card: error icon, title, message]
  [Primary + secondary buttons]
```

**Layout (Mobile)**
```text
[Same centered card, full width with padding]
```

**Main Content**
- Error message mapped from OAuth error code.
- Optional dev-only error details.

**Actions**
- Retry login (back to `/`).
- Return to home.

**States**
- Loading fallback while query params resolve.
