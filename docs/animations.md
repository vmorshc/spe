# Micro-Interactions & Animation System

### Goal

Establish a consistent, lightweight animation system for interactive elements (buttons, cards, links) across the app. This section defines the foundation — actual per-component animation implementation will be planned separately.

### 5.1 Animation Principles

- **Duration:** 120–300ms for micro-interactions. Under 120ms is imperceptible; over 300ms feels sluggish.
- **Properties:** Only animate `transform` and `opacity` — these are GPU-accelerated and don't trigger layout recalculation. Never animate `width`, `height`, `margin`, `padding`, `top`, `left`.
- **Easing:** Use the curves defined below. Never use `linear` for UI interactions.

### 5.2 Easing Curves Reference

Define these as CSS custom properties or Tailwind theme extensions for consistent reuse:

| Name | Value | Use case |
|------|-------|----------|
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Buttons, cards, hover lift — slight overshoot/bounce |
| `--ease-smooth` | `cubic-bezier(0.16, 1, 0.3, 1)` | Modals, page transitions, large movements |
| `--ease-fast` | `cubic-bezier(0.4, 0, 0.2, 1)` | Spinners, toggles, quick state changes |

Tool for exploring curves: [easing.dev](https://easing.dev)

### 5.3 Animation Patterns (Reference)

**Buttons — hover lift + active press:**
```css
.btn-interactive {
  transition: transform 200ms var(--ease-spring),
              box-shadow 200ms var(--ease-spring);
}
.btn-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.btn-interactive:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
  transition-duration: 80ms;
  transition-timing-function: var(--ease-fast);
}
```

**Cards — hover float:**
```css
.card-interactive {
  transition: transform 200ms var(--ease-spring),
              box-shadow 200ms var(--ease-spring);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

**Links — animated underline:**
```css
.link-animated {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 200ms ease-out, color 150ms ease-out;
}
.link-animated:hover {
  background-size: 100% 1px;
}
```

### 5.4 Reduced Motion

All animations respect `prefers-reduced-motion`. Three layers are implemented:

1. **Framer Motion**: `MotionProvider` (`src/components/ui/MotionProvider.tsx`) wraps the app with `<MotionConfig reducedMotion="user">`. All Framer Motion components automatically respect the OS setting.
2. **Tailwind CSS**: All `animate-pulse` → `motion-safe:animate-pulse`, `animate-spin` → `motion-safe:animate-spin`. Interactive transforms include `motion-reduce:` overrides (e.g., `motion-reduce:active:scale-100`).
3. **Canvas**: `ConfettiCanvas` checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and skips animation entirely.

### 5.5 What to do next

1. **Add easing curves to the design system.** Define the three curves as CSS custom properties in `globals.css` and/or as Tailwind theme values so they're available everywhere.

2. **Audit existing interactive components.** List all components that would benefit from micro-interactions:
   - `Button` (all variants) — hover lift, active press
   - Post cards in the grid (`PostCard`) — hover float
   - Landing page cards (Benefits, HowItWorks) — hover float
   - Navigation links — animated underline
   - `SettingCheckbox` — scale tap feedback
   - Winner cards (`WinnerCardGlass`) — already has spring animation, review for consistency

---

