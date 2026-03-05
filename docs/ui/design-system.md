# Pickly Design System

Comprehensive reference for the visual language, patterns, and UI conventions used in Pickly — a Ukrainian-language Instagram giveaway platform.

---

## 1. Design Philosophy

- **Clean and minimal** — white backgrounds, light borders, no visual clutter.
- **Trust-first** — the interface communicates transparency and safety through neutral colors and clear typography.
- **Progressive motion** — animations are subtle, fast, and purposeful (entrance fades, hover lifts, modal springs).
- **Mobile-first responsive** — layouts collapse gracefully; navigation adapts text/icon depending on screen size.

---

## 2. Tooling & Integration

- Styling is **Tailwind CSS v4** with design tokens in `src/app/globals.css` and Geist fonts wired in `src/app/layout.tsx`.
- **shadcn/ui** configured in `components.json` (root) with `cssVariables: true` for Tailwind v4 compatibility.
- CSS variables defined in `globals.css`: `--primary`, `--secondary`, `--accent`, `--muted`, `--border`, `--ring`, etc.
- Components live in `src/components/ui/` — import from `@/components/ui/{component}` (lowercase paths to avoid conflicts with legacy PascalCase components).
- Utility function `cn()` in `src/lib/utils.ts` for merging Tailwind classes with `clsx` + `tailwind-merge`.
- **Framer Motion** for animations — keep subtle and fast: fade/slide in, small scale on hover/tap.

---

## 3. Color System

Colors are defined as CSS custom properties in `src/app/globals.css` using the OKLCH color space. All semantic tokens map through `@theme inline` into Tailwind utilities.

### 3.1 Semantic CSS Variables (Light Mode)

| Token | OKLCH Value | Approx. HEX | Usage |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `#ffffff` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `#171717` | Primary text |
| `--primary` | `oklch(0.485 0.207 264)` | `#3b5bdb` ≈ blue-700 | CTAs, active elements, icons |
| `--primary-foreground` | `oklch(0.985 0 0)` | `#fafafa` | Text on primary backgrounds |
| `--secondary` | `oklch(0.97 0 0)` | `#f5f5f5` | Secondary button backgrounds |
| `--secondary-foreground` | `oklch(0.205 0 0)` | `#1a1a1a` | Text on secondary backgrounds |
| `--muted` | `oklch(0.97 0 0)` | `#f5f5f5` | Subtle fills, muted areas |
| `--muted-foreground` | `oklch(0.556 0 0)` | `#737373` | Placeholder text, captions |
| `--accent` | `oklch(0.97 0 0)` | `#f5f5f5` | Hover states on ghost elements |
| `--card` | `oklch(1 0 0)` | `#ffffff` | Card backgrounds |
| `--border` | `oklch(0.922 0 0)` | `#ebebeb` | Borders, dividers |
| `--input` | `oklch(0.922 0 0)` | `#ebebeb` | Input borders |
| `--ring` | `oklch(0.485 0.207 264)` | `#3b5bdb` | Focus ring |
| `--destructive` | `oklch(0.577 0.245 27)` | `#ef4444` | Errors, delete actions |
| `--radius` | `0.5rem` | `8px` | Base border radius |

### 3.2 Tailwind Gray Palette

| Class | Visual Role |
|---|---|
| `text-gray-900` | Headings, primary text |
| `text-gray-700` | Body text, nav links |
| `text-gray-600` | Descriptions, paragraph text |
| `text-gray-500` | Metadata, secondary labels |
| `text-gray-400` | Footer text, timestamps |
| `bg-gray-50` | Alternate section backgrounds |
| `border-gray-100` | Subtle card borders |
| `border-gray-200` | Stronger borders, dividers |

### 3.3 Blue Accent Palette

| Class | Visual Role |
|---|---|
| `bg-blue-600` | Logo mark, step numbers, primary CTA |
| `text-blue-600` | Emphasized text, hover states, highlighted keyword |
| `bg-blue-100` | Icon background chips (speed) |
| `bg-blue-50` | Section highlights, info boxes |
| `bg-blue-500` | Progress bar fill |
| `hover:bg-blue-700` | Button hover (inline links) |

### 3.4 Status / Icon Color Chips

Small `w-12 h-12 rounded-lg` icon containers:

| Color | Usage |
|---|---|
| `bg-green-100 text-green-600` | RNG / security / success |
| `bg-blue-100 text-blue-600` | Official API / speed |
| `bg-purple-100 text-purple-600` | Privacy / transparency |
| `bg-orange-100 text-orange-600` | Certificates / planned features |
| `bg-yellow-100 text-yellow-600` | Localization |

### 3.5 Winner Card Tier Colors

`WinnerCardGlass` applies tier-specific glass gradients based on rank:

| Rank | Gradient | Border | Glare |
|---|---|---|---|
| 1st | `from-amber-500/20 via-yellow-500/10 to-amber-600/20` | `border-amber-400/50` | Amber |
| 2nd | `from-slate-400/20 via-gray-300/10 to-slate-500/20` | `border-slate-400/50` | Gray-blue |
| 3rd | `from-orange-700/20 via-amber-700/10 to-orange-800/20` | `border-orange-600/50` | Orange |
| Other | `from-blue-500/10 via-purple-500/5 to-blue-600/10` | `border-border` | Light blue |

### 3.6 Gradient Accents

- **Hero visual gradient**: `from-blue-50 to-indigo-100` — soft pill-shaped background
- **Winner pill gradient**: `from-blue-500 to-purple-600` — result badge in hero mock
- **HowItWorks step icons**: `from-pink-500 to-purple-600`, `from-blue-500 to-indigo-600`, `from-green-500 to-emerald-600`
- **Avatar placeholder**: `from-pink-500 to-purple-600` — user initials circles
- **Winners title**: `from-purple-600 to-pink-600` text gradient via `bg-clip-text text-transparent`
- **Trophy avatar (vertical)**: `from-amber-400 to-amber-600`

### 3.7 Dark Mode

Dark mode tokens are defined but the app does not expose a toggle — dark mode applies when the `.dark` class is present on a parent. Key dark values:

| Token | Value |
|---|---|
| `--background` | `oklch(0.145 0 0)` — nearly black |
| `--foreground` | `oklch(0.985 0 0)` — near white |
| `--primary` | `oklch(0.922 0 0)` — light gray (inverted) |
| `--card` | `oklch(0.205 0 0)` — dark card |
| `--border` | `oklch(1 0 0 / 10%)` — subtle white border |

---

## 4. Typography

### 4.1 Fonts

- **Primary**: Geist Sans (variable) loaded via `next/font/local` in `src/app/layout.tsx`
- **Monospace**: Geist Mono (variable)
- **System fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Body line-height**: `1.6`
- **Antialiasing**: `-webkit-font-smoothing: antialiased`

### 4.2 Type Scale

| Element | Tailwind Classes | Usage |
|---|---|---|
| Hero H1 | `text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900` | Landing page main headline |
| Section H2 | `text-3xl md:text-4xl font-bold text-gray-900` | Section headings |
| Card H3 | `text-xl font-semibold text-gray-900` | Feature card titles |
| Card H3 sm | `text-lg font-semibold text-gray-900` | Smaller benefit cards |
| Wizard H2 | `text-2xl font-semibold` | Wizard step headings |
| Winner H2 | `text-3xl font-bold` + gradient | Step 4 main heading |
| Body large | `text-lg md:text-xl text-gray-600` | Section descriptions |
| Body default | `text-gray-600 leading-relaxed` | Card descriptions |
| Body small | `text-sm text-gray-600` | Meta info, captions |
| Muted | `text-muted-foreground` | Wizard sub-headings, timestamps |
| Mono | `text-xs font-mono` | Comment ID display |

### 4.3 Text Highlighting

- Emphasis keyword in H1: wrapped in `<span className="text-blue-600">` (e.g., the word "чесно")
- Winner step title: `bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`

---

## 5. Spacing & Layout

### 5.1 Page Containers

| Container | Tailwind Classes | Usage |
|---|---|---|
| Max-width global | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Header, footer, sections |
| Wizard | `max-w-4xl mx-auto px-4` (via `WizardContainer`) | Wizard steps and bottom nav |
| FAQ | `max-w-3xl mx-auto` | Accordion items |
| Modal | `max-w-lg w-full` | Winner details overlay |
| Export modal | `max-w-md mx-4` | Export progress dialog |

### 5.2 Section Padding

All landing sections use the `Section` component:
- Vertical: `py-16 lg:py-24`
- Hero: `pt-8 lg:pt-16` (reduced top)

### 5.3 Grid Layouts

| Grid | Breakpoints | Usage |
|---|---|---|
| 2-col (hero) | `grid-cols-1 lg:grid-cols-2 gap-12` | Hero content + visual |
| 2-col (trust) | `grid-cols-1 md:grid-cols-2 gap-8` | Trust reason cards |
| 3-col (steps) | `grid-cols-1 md:grid-cols-3 gap-8` | HowItWorks steps |
| 4-col (benefits) | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6` | Benefits cards |
| 4-col (footer) | `grid-cols-1 md:grid-cols-4 gap-8` | Footer columns |
| 2-col (winners) | `grid-cols-1 lg:grid-cols-2 gap-4` | Winner cards grid |
| Posts grid | `aspect-square`, 3-col Instagram-style | Post thumbnail grid |

### 5.4 Component Spacing

- Card inner padding: `p-6` or `p-8`
- Icon containers: `w-12 h-12 rounded-lg`, `w-8 h-8 rounded-lg` (step numbers)
- Section title margin: `mb-16` (from title to card grid)
- Card margin: `mb-4` (FAQ items)

---

## 6. Border Radius

| Variable | Value | Usage |
|---|---|---|
| `--radius` | `0.5rem` (8px) | Base radius |
| `rounded-md` | 6px | Buttons (sm/md) |
| `rounded-lg` | 8px | Logo box, icon chips, inputs |
| `rounded-xl` | 12px | Cards, steps, FAQ items, stats panel |
| `rounded-2xl` | 16px | Winner glass cards, overlay modal |
| `rounded-full` | 50% | Avatar circles, step dots, loader spinner |

---

## 7. Shadows

| Class | Usage |
|---|---|
| `shadow-sm` | Default card/header |
| `shadow-md` | Card on hover (via `hover:shadow-md transition-shadow`) |
| `shadow-lg` | Hero visual, winner glass cards, bottom nav |
| `shadow-xl` | User avatar in vertical winner card |
| `shadow-2xl` | WinnerDetailsOverlay modal |

---

## 8. Motion & Animation

All animations use **Framer Motion**. Patterns:

| Pattern | Props | Usage |
|---|---|---|
| Entrance fade-slide (up) | `initial: {opacity:0, y:20}`, `animate: {opacity:1, y:0}`, `duration: 0.8` | Section headings, cards (whileInView) |
| Entrance slide-left | `initial: {opacity:0, x:-50}` | Hero text block |
| Entrance slide-right | `initial: {opacity:0, x:50}` | Hero visual |
| Staggered cards | `delay: index * 0.1` or `0.2` | Card grids |
| Header entrance | `y: -20 → 0`, `duration: 0.6` | Landing header |
| Bottom nav entrance | `y: 100 → 0`, `delay: 0.2` | Wizard bottom bar |
| Modal spring | `scale: 0.9 → 1`, `y: 20 → 0`, `stiffness: 300, damping: 30` | Winner overlay |
| Winner card spring | `y: 30 → 0`, `stiffness: 100` + stagger by delay | Winner cards list |
| Roulette spinner | `rotate: 360`, `repeat: Infinity, ease: 'linear', duration: 1` | Step 4 loading |
| Logo hover | `whileHover: {scale: 1.05}` | Logo in header |
| Winner card hover | `whileHover: {scale: 1.01, y: -2}` | Clickable winner cards |
| FAQ drawer | `height: 0 → auto`, `opacity: 0 → 1`, `duration: 0.3` | Accordion expand |
| Mobile menu | `height: 0 → auto`, `opacity: 0 → 1` | Header mobile nav |
| Wizard step transition | `x: 20 → 0` in / `x: -20` out, `duration: 0.3` | Step changes |
| WizardDots | `scale: 0.8 → 1` for active dot | Progress indicator |

---

## 9. Haptic Feedback

The app uses **web-haptics** (`web-haptics/react`) to provide native-feeling vibration feedback on mobile devices. Haptics are integrated via a shared hook and fire alongside existing event handlers — they are no-ops on unsupported devices.

### 9.1 Hook

**File**: `src/lib/hooks/useHaptic.ts`

```tsx
import { useHaptic } from '@/lib/hooks/useHaptic';

const { haptic, isSupported } = useHaptic();
haptic('light'); // fire a preset
```

The hook wraps `useWebHaptics` from `web-haptics/react`. Each component that calls `useHaptic()` gets its own lightweight instance with automatic lifecycle cleanup.

### 9.2 Preset Mapping

Presets are chosen to match iOS feedback conventions:

| Preset | Feel | When to use |
|---|---|---|
| `light` | Soft single tap | Small state changes: stepper +/-, slider step, back navigation, dismiss |
| `medium` | Moderate tap | Primary actions: next step, open drawer, CTA buttons, login |
| `heavy` | Strong tap | High-impact moments: pick winner, open detail modal |
| `selection` | Subtle tick | Toggle state: checkbox, accordion, menu toggle |
| `success` | Double-tap celebration | Positive outcome: winner reveal with confetti |
| `error` | Triple-tap alert | Failure: export error |
| `warning` | Warning buzz | Validation: invalid input |

### 9.3 Integration by Component

| Component | Interaction | Preset |
|---|---|---|
| `NumberStepper` | Tap +/- buttons | `light` |
| `SettingCheckbox` | Toggle on/off | `selection` |
| `SliderWithInput` | Each slider step | `light` |
| `WizardBottomNav` | Next / Back / Download | `medium` / `light` / `light` |
| `Step4Winners` | Winner reveal (confetti fires) | `success` |
| `WinnerCardGlass` | Tap to open winner detail | `medium` |
| `WinnerDetailsOverlay` | Modal open / close | `heavy` / `light` |
| `Step3GiveawaySettings` | Validation error | `warning` |
| `ExportProgressModal` | Export fails | `error` |
| `ActionDrawer` | FAB tap / Pick winner | `medium` / `heavy` |
| `FAQ` | Accordion toggle | `selection` |
| `Header` | Mobile hamburger toggle | `selection` |
| `LoginButton` | Login tap | `medium` |
| `HeroClient` | CTA tap | `medium` |

### 9.4 Guidelines

- **Call before logic**: fire `haptic()` at the start of the handler, before state changes or async work, so feedback is instant.
- **No-op on desktop**: `trigger()` is safe to call everywhere — it checks `navigator.vibrate` support internally.
- **No conditional guards needed**: you do not need to check `isSupported` before calling `haptic()`.
- **Avoid spamming**: for continuous interactions (like slider dragging), `light` is appropriate since it's the shortest vibration. Avoid `heavy` or `success` on rapid-fire events.
- **Match intensity to importance**: `light` for minor adjustments, `medium` for intentional actions, `heavy`/`success`/`error` for outcomes.

---

## 10. Icon Library

Icons come from **lucide-react** and **react-icons**. Standard size: `w-6 h-6` (cards), `w-5 h-5` (inline), `w-4 h-4` (buttons/nav).

Key icons used:

| Icon | Usage |
|---|---|
| `Instagram` | HowItWorks step 1 |
| `Link` | HowItWorks step 2 |
| `Trophy` | HowItWorks step 3, winner cards |
| `Shield` | Trust / security |
| `Globe` | API / localization |
| `FileText` | Transparency certificate |
| `Monitor` | Simplicity / no install |
| `DollarSign` | Pricing benefit |
| `CheckCircle` | Hero benefits list (green) |
| `Heart` | Like count in winner detail |
| `MessageCircle` | Comment count in posts / Telegram |
| `Play` | Video type badge on PostCard |
| `ArrowLeft` | AppHeader back button |
| `LogOut` | AppHeader logout |
| `Menu` / `X` | Mobile hamburger |
| `ChevronDown` / `ChevronUp` | FAQ accordion |
| `ChevronLeft` / `ChevronRight` | Wizard nav |
| `Download` | CSV download button |
| `Loader2` | Spinner on loading buttons |
| `RefreshCw` | Instagram data refresh |

---

## 11. Scrollbar Styling

Custom scrollbar applied globally:

```css
::-webkit-scrollbar          { width: 8px; }
::-webkit-scrollbar-track    { background: #f1f1f1; }
::-webkit-scrollbar-thumb    { background: #c1c1c1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
```

---

## 12. Responsive Behavior

| Breakpoint | Key Changes |
|---|---|
| Mobile (default) | Single column layouts; nav hidden; buttons show icon only; text shortened |
| `sm` (640px) | Button text appears; separator in AppHeader shows |
| `md` (768px) | Desktop nav visible; 2-3 column grids activate |
| `lg` (1024px) | 4-column grids; full button text in wizard nav; hero switches to 2-col |

---

## 13. Accessibility

- Focus ring: `focus-visible:ring-1 focus-visible:ring-ring` on all interactive elements
- Custom focus: `focus:ring-2` → `box-shadow: 0 0 0 2px rgba(59,130,246,0.5)` (blue)
- Buttons use `type="button"` explicitly
- `next/image` with `alt` attributes
- `sr-only` not explicitly used but semantic HTML headings (h1 → h2 → h3 → h4) are followed
- Smooth scroll: `html { scroll-behavior: smooth }`

---

## 14. How To Build "Native" Components

- Prefer Tailwind utility classes over custom CSS. Use `rounded-lg`, `border`, `shadow-sm`, `bg-white`, `text-gray-*`, and `text-blue-*` for consistency.
- Use `Button` for CTAs and keep variants consistent (`primary`, `secondary`, `outline`, `ghost`).
- Wrap full-width sections with `Section` so spacing aligns with the landing page.
- For authenticated pages, use `AppHeader` and keep content centered in `max-w-4xl`.
- For multi-step wizards, use `WizardContainer` to ensure consistent width between content and fixed navigation.
- Prefer semantic HTML structure (h2 for titles, p for descriptions, space-y for vertical rhythm) over Card components for cleaner layouts.
- Add motion with Framer Motion where it improves clarity (entrance, hover, drawers) but avoid heavy or slow animations.
- Add haptic feedback to interactive elements with `useHaptic()` — match preset intensity to the action's importance (see §9).
- For forms, follow the FuturePlans pattern: clear labels, inline validation, disabled states, and a short success/error message.
- Use `next/image` for media and keep aspect ratios consistent (`aspect-square` for grids).
- For long lists, prefer virtualization or incremental loading (Intersection Observer).
