# Pickly — Navigation & UI Improvements Spec

> **Status: Implemented.** All sections below have been implemented. See `docs/ui/components.md` §1.1 for the Button link-mode API and `docs/ui/design-system.md` §13 for accessibility details.

Task specification for improving navigation performance, Button component capabilities, micro-interactions, and accessibility in the Pickly application.

**Stack context:** Next.js 15, React 19, TypeScript, Tailwind v4, Framer Motion, App Router.
**Existing Button:** `src/components/ui/Button.tsx` — built with `cva` + `@radix-ui/react-slot`, variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `hero`.

---

## 1. Prefetching — Instant Navigation

### Goal

All page-to-page transitions must use Next.js `<Link>` prefetching so navigation feels instant. Currently some transitions use `router.push()` inside `onClick` handlers, bypassing prefetch entirely.

### What to do

1. **Audit every navigation point.** Find all places where `router.push()` or `window.location.href` is used for internal navigation. Replace with `<Link>` wherever possible so Next.js prefetches the target route automatically.

2. **Add a link mode to the `Button` component.** The Button must support rendering as a Next.js `<Link>` under the hood, so it gets native prefetch, hover-prefetch, and client-side transition behavior. The API should feel like:

```tsx
// Internal link — renders as <Link>, gets prefetch
<Button href="/app/instagram/posts" variant="hero" size="lg">
  Почати розіграш
</Button>

// External link — renders as <a target="_blank">
<Button href="https://t.me/pickly_support" external>
  Telegram
</Button>

// Regular button (no href) — renders as <button>
<Button onClick={handleClick}>
  Зберегти
</Button>
```

Implementation requirements:
- When `href` is provided and `external` is falsy → render Next.js `<Link>` wrapping the button styles. This gives automatic prefetch, client-side transitions, and all Next.js link optimizations.
- When `href` is provided and `external` is truthy → render `<a>` with `target="_blank" rel="noopener noreferrer"`.
- When no `href` → render `<button>` as today.
- The existing `asChild` prop via Radix `Slot` must continue to work.
- All existing variants and sizes must work identically in all three modes.

3. **Add an `onNavigate` callback prop.** This callback fires in parallel with the navigation — it does NOT block the transition. Use case: firing a GA4 event when the user clicks a link-mode button.

```tsx
<Button
  href="/checkout"
  onNavigate={() => trackEvent('cta_click', { label: 'hero' })}
  variant="hero"
>
  Оформити
</Button>
```

For internal links: the callback runs, but navigation proceeds immediately (fire-and-forget). The page does not unload, so the analytics request completes in the background.

For external links in a new tab (`external` + default `target="_blank"`): same — fire callback, open the new tab immediately.

For external links in the same tab: this is the only case where we need to wait. Show `FullScreenLoader`, await the callback with a 2-second timeout (configurable via `onNavigateTimeout` prop, default `2000`), then navigate via `window.location.href`. If the callback resolves or the timeout fires — whichever comes first — proceed with navigation.

```tsx
// Same-tab external with guaranteed event delivery
<Button
  href="https://example.com/partner"
  external
  target="_self"
  onNavigate={() => trackEvent('outbound_click', { url: '...' })}
  onNavigateTimeout={1500}
>
  Перейти
</Button>
```

---

## 2. Streaming & loading.tsx — Instant Feedback

### Goal

Every route in the app must have a `loading.tsx` so the user sees a skeleton immediately during navigation, not a blank screen.

### What to do

1. **Audit all routes for `loading.tsx` coverage.** Check every route under `src/app/` and add a `loading.tsx` wherever one is missing.

2. **Match skeleton designs to actual page layouts.** Each skeleton should mirror the real page structure (header, content areas, sidebars) so the transition feels smooth.

3. **Giveaway wizard internal step transitions — skip for now.** The wizard steps (Step1 → Step2 → Step3 → Step4) manage their own state via `WizardContext` and don't use route-level navigation. Optimizing these transitions is a separate task.

---

## 3. Minimize Client Components

### Goal

Push `'use client'` as low as possible in the component tree so more of the app benefits from server rendering.

### What to do

1. **Analyze the component tree.** For each page, identify which components are marked `'use client'` and whether they truly need client-side interactivity (event handlers, hooks, browser APIs).

2. **Prepare a migration plan.** List components that could be converted to Server Components or split into a Server Component wrapper + a small Client Component leaf. Common candidates:
   - Layout components that only pass props down
   - Components that use `'use client'` only because a parent does
   - Static content sections on the landing page

3. **Do NOT execute the migration yet.** Present the plan for review first. This is a structural change that needs careful testing.

---

## 4. View Transitions API

### Goal

Enable the experimental View Transitions API in Next.js for smooth cross-fade transitions between pages.

### What to do

1. **Enable the experimental flag:**

```js
// next.config.js
module.exports = {
  experimental: {
    viewTransition: true,
  },
};
```

2. **Add `<ViewTransition>` wrapper to shared layouts** where cross-page animation is desired:

```tsx
import { unstable_ViewTransition as ViewTransition } from 'react';

// In a layout component
<ViewTransition>
  {children}
</ViewTransition>
```

3. **Default behavior is cross-fade** — no custom CSS needed for the initial implementation. Further customization (shared element transitions, per-route animations) can be added later.

4. **Progressive enhancement.** This API is supported in Chrome, Edge, and Safari 18+. Firefox users see no animation — pages still work normally. This is acceptable.

5. **Use Context7 MCP or the latest Next.js docs** to find the most up-to-date API shape, since this feature is experimental and may have changed since the research document was written.

---

## 6. GA4 Tracking + Navigation (Button Integration)

This is handled by the `onNavigate` callback described in Section 1. Here's a summary of the behavior by scenario:

| Scenario | Button config | Behavior |
|----------|--------------|----------|
| Internal link, non-critical event | `href="/page"` + `onNavigate={track}` | Fire-and-forget. Navigate immediately via `<Link>`. Callback runs in background. |
| Internal link, no tracking | `href="/page"` | Standard Next.js `<Link>` navigation. |
| External link, new tab | `href="https://..." external` + `onNavigate={track}` | Fire callback, open new tab immediately. Current page stays alive, callback completes. |
| External link, same tab | `href="https://..." external target="_self"` + `onNavigate={track}` | Show `FullScreenLoader`. Await callback with timeout (default 2s). Navigate after resolve or timeout. |
| Regular button | `onClick={handler}` | No navigation. Standard button behavior. |

### Implementation notes

- The `FullScreenLoader` component already exists at `src/components/ui/FullScreenLoader.tsx`. Reuse it for the same-tab external link waiting state.
- The timeout logic follows the `Promise.race` pattern from the research document:

```tsx
async function waitForCallback(
  callback: () => void | Promise<void>,
  timeoutMs: number
): Promise<void> {
  return Promise.race([
    Promise.resolve(callback()).catch(() => {}),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
```

- If `window.gtag` is undefined (GA4 not loaded), the `onNavigate` callback still runs — it's the caller's responsibility to handle that gracefully (the existing `trackEvent` wrapper already does).
- `pointer-events: none` on child SVGs inside buttons is already set in the current Button styles (`[&_svg]:pointer-events-none`). This prevents click events from hitting icons instead of the button — important for GA4 tracking in GTM.

---

## 7. Accessibility: prefers-reduced-motion

### Goal

All animations in the app must respect the user's `prefers-reduced-motion` system setting.

### What to do

Use Tailwind `motion-safe:` / `motion-reduce:` variants for all animations and transitions. Every interactive element that has hover/active animations must include the corresponding `motion-reduce:` override:

```html
<button class="transition hover:-translate-y-1
  motion-reduce:transition-none
  motion-reduce:hover:transform-none">
  Save
</button>
```

