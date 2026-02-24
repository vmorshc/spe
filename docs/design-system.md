# Pickly Design System

A comprehensive reference for the visual language, components, and UI patterns used in Pickly — a Ukrainian-language Instagram giveaway platform.

---

## 1. Design Philosophy

- **Clean and minimal** — white backgrounds, light borders, no visual clutter.
- **Trust-first** — the interface communicates transparency and safety through neutral colors and clear typography.
- **Progressive motion** — animations are subtle, fast, and purposeful (entrance fades, hover lifts, modal springs).
- **Mobile-first responsive** — layouts collapse gracefully; navigation adapts text/icon depending on screen size.

---

## 2. Color System

Colors are defined as CSS custom properties in `src/app/globals.css` using the OKLCH color space. All semantic tokens map through `@theme inline` into Tailwind utilities.

### 2.1 Semantic CSS Variables (Light Mode)

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

### 2.2 Tailwind Gray Palette (used directly in landing/app components)

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

### 2.3 Blue Accent Palette

| Class | Visual Role |
|---|---|
| `bg-blue-600` | Logo mark, step numbers, primary CTA |
| `text-blue-600` | Emphasized text, hover states, highlighted keyword |
| `bg-blue-100` | Icon background chips (speed) |
| `bg-blue-50` | Section highlights, info boxes |
| `bg-blue-500` | Progress bar fill |
| `hover:bg-blue-700` | Button hover (inline links) |

### 2.4 Status / Icon Color Chips

These appear as small `w-12 h-12 rounded-lg` icon containers:

| Color | Usage |
|---|---|
| `bg-green-100 text-green-600` | RNG / security / success |
| `bg-blue-100 text-blue-600` | Official API / speed |
| `bg-purple-100 text-purple-600` | Privacy / transparency |
| `bg-orange-100 text-orange-600` | Certificates / planned features |
| `bg-yellow-100 text-yellow-600` | Localization |

### 2.5 Winner Card Tier Colors

`WinnerCardGlass` applies tier-specific glass gradients based on rank:

| Rank | Gradient | Border | Glare |
|---|---|---|---|
| 1st | `from-amber-500/20 via-yellow-500/10 to-amber-600/20` | `border-amber-400/50` | Amber |
| 2nd | `from-slate-400/20 via-gray-300/10 to-slate-500/20` | `border-slate-400/50` | Gray-blue |
| 3rd | `from-orange-700/20 via-amber-700/10 to-orange-800/20` | `border-orange-600/50` | Orange |
| Other | `from-blue-500/10 via-purple-500/5 to-blue-600/10` | `border-border` | Light blue |

### 2.6 Gradient Accents

- **Hero visual gradient**: `from-blue-50 to-indigo-100` — soft pill-shaped background
- **Winner pill gradient**: `from-blue-500 to-purple-600` — result badge in hero mock
- **HowItWorks step icons**: `from-pink-500 to-purple-600`, `from-blue-500 to-indigo-600`, `from-green-500 to-emerald-600`
- **Avatar placeholder**: `from-pink-500 to-purple-600` — user initials circles
- **Winners title**: `from-purple-600 to-pink-600` text gradient via `bg-clip-text text-transparent`
- **Trophy avatar (vertical)**: `from-amber-400 to-amber-600`

### 2.7 Dark Mode

Dark mode tokens are defined but the app does not expose a toggle — dark mode applies when the `.dark` class is present on a parent. Key dark values:

| Token | Value |
|---|---|
| `--background` | `oklch(0.145 0 0)` — nearly black |
| `--foreground` | `oklch(0.985 0 0)` — near white |
| `--primary` | `oklch(0.922 0 0)` — light gray (inverted) |
| `--card` | `oklch(0.205 0 0)` — dark card |
| `--border` | `oklch(1 0 0 / 10%)` — subtle white border |

---

## 3. Typography

### 3.1 Fonts

- **Primary**: Geist Sans (variable) loaded via `next/font/local` in `src/app/layout.tsx`
- **Monospace**: Geist Mono (variable)
- **System fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Body line-height**: `1.6`
- **Antialiasing**: `-webkit-font-smoothing: antialiased`

### 3.2 Type Scale

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

### 3.3 Text Highlighting

- Emphasis keyword in H1: wrapped in `<span className="text-blue-600">` (e.g., the word "чесно")
- Winner step title: `bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`

---

## 4. Spacing & Layout

### 4.1 Page Containers

| Container | Tailwind Classes | Usage |
|---|---|---|
| Max-width global | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Header, footer, sections |
| Wizard | `max-w-4xl mx-auto px-4` (via `WizardContainer`) | Wizard steps and bottom nav |
| FAQ | `max-w-3xl mx-auto` | Accordion items |
| Modal | `max-w-lg w-full` | Winner details overlay |
| Export modal | `max-w-md mx-4` | Export progress dialog |

### 4.2 Section Padding

All landing sections use the `Section` component:
- Vertical: `py-16 lg:py-24`
- Hero: `pt-8 lg:pt-16` (reduced top)

### 4.3 Grid Layouts

| Grid | Breakpoints | Usage |
|---|---|---|
| 2-col (hero) | `grid-cols-1 lg:grid-cols-2 gap-12` | Hero content + visual |
| 2-col (trust) | `grid-cols-1 md:grid-cols-2 gap-8` | Trust reason cards |
| 3-col (steps) | `grid-cols-1 md:grid-cols-3 gap-8` | HowItWorks steps |
| 4-col (benefits) | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6` | Benefits cards |
| 4-col (footer) | `grid-cols-1 md:grid-cols-4 gap-8` | Footer columns |
| 2-col (winners) | `grid-cols-1 lg:grid-cols-2 gap-4` | Winner cards grid |
| Posts grid | `aspect-square`, 3-col Instagram-style | Post thumbnail grid |

### 4.4 Component Spacing

- Card inner padding: `p-6` or `p-8`
- Icon containers: `w-12 h-12 rounded-lg`, `w-8 h-8 rounded-lg` (step numbers)
- Section title margin: `mb-16` (from title to card grid)
- Card margin: `mb-4` (FAQ items)

---

## 5. Border Radius

| Variable | Value | Usage |
|---|---|---|
| `--radius` | `0.5rem` (8px) | Base radius |
| `rounded-md` | 6px | Buttons (sm/md) |
| `rounded-lg` | 8px | Logo box, icon chips, inputs |
| `rounded-xl` | 12px | Cards, steps, FAQ items, stats panel |
| `rounded-2xl` | 16px | Winner glass cards, overlay modal |
| `rounded-full` | 50% | Avatar circles, step dots, loader spinner |

---

## 6. Shadows

| Class | Usage |
|---|---|
| `shadow-sm` | Default card/header |
| `shadow-md` | Card on hover (via `hover:shadow-md transition-shadow`) |
| `shadow-lg` | Hero visual, winner glass cards, bottom nav |
| `shadow-xl` | User avatar in vertical winner card |
| `shadow-2xl` | WinnerDetailsOverlay modal |

---

## 7. Components

### 7.1 Button

File: `src/components/ui/Button.tsx`
Built with `cva` (class-variance-authority) and `@radix-ui/react-slot`.

**Variants:**

| Variant | Appearance |
|---|---|
| `default` | `bg-primary text-primary-foreground` (blue fill, white text) |
| `destructive` | `bg-destructive text-white` (red) |
| `outline` | White background, `border-input`, hover fills accent |
| `secondary` | Light gray fill, dark text |
| `ghost` | Transparent, fills accent on hover |
| `link` | Text with underline on hover |

**Sizes:**

| Size | Height | Padding |
|---|---|---|
| `sm` | `h-8` | `px-3` |
| `default` | `h-9` | `px-4 py-2` |
| `lg` | `h-10` | `px-8` |
| `icon` | `h-9 w-9` | — |

**Focus**: `focus-visible:ring-1 focus-visible:ring-ring`
**Disabled**: `opacity-50 pointer-events-none`
**SVG children**: auto-sized to `size-4`

### 7.2 Section

File: `src/components/ui/Section.tsx`

Wraps landing content with consistent padding and a background variant.

| Prop | Options | Class applied |
|---|---|---|
| `background` | `white` | `bg-white` |
| `background` | `gray` | `bg-gray-50` |
| `background` | `blue` | `bg-blue-50` |

Inner container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### 7.3 AppHeader (authenticated)

File: `src/components/ui/AppHeader.tsx`

- **Container**: `bg-white shadow-sm sticky top-0 z-50`, height `h-16`
- **Left**: Ghost button "Back" (`ArrowLeft` icon + text hidden on mobile) → separator → logo (blue `w-8 h-8 bg-blue-600 rounded-lg` + site name hidden on mobile)
- **Center**: Page title `text-lg font-medium text-gray-900`
- **Right**: Ghost button "Вийти" with `LogOut` icon, turns red on hover, shows spinner during logout

### 7.4 Landing Header

File: `src/components/landing/Header.tsx`

- Slides in from top on mount (`motion.header`, `y: -20 → 0`, duration 0.6s)
- `bg-white shadow-sm sticky top-0 z-50`, height `h-16`
- **Logo**: `w-8 h-8 bg-blue-600 rounded-lg` with "SP" text + site name, scales 1.05 on hover
- **Nav links**: `text-gray-700 hover:text-blue-600 transition-colors`, hidden on mobile
- **Mobile**: Hamburger button (`Menu`/`X` icons), drawer slides in with `opacity: 0, height: 0 → auto`
- **Auth state**: spinner while loading; `UserProfile` if authenticated; `LoginButton` otherwise

### 7.5 Cards

No generic `<Card>` from shadcn is used in the wizard steps — they use semantic headings and spacing instead. Cards appear in landing sections:

- **Trust/Benefits card**: `bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100`
- **HowItWorks step card**: same + relative positioning for floating step number badge
- **Step number badge**: `absolute -top-4 left-6`, `w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm`
- **Stats panel** (bottom of HowItWorks): `bg-white rounded-xl p-8 shadow-sm`, 3-column grid

### 7.6 WinnerCardGlass

File: `src/components/giveaway/WinnerCardGlass.tsx`

A "liquid glass" card with mouse-tracked radial glare effect.

- `rounded-2xl backdrop-blur-xl bg-gradient-to-br` + tier gradient
- Border and shadow tinted by rank color
- `backgroundImage` inline style: `radial-gradient(circle at X% Y%, glare-color, transparent 60%)` — follows cursor
- On hover: subtle scale `1.01` + lift `-2px` (only when clickable)
- White overlay `group-hover:opacity-100` on hover for glass sheen
- **Horizontal layout** (list): rank + Trophy icon + username + truncated comment
- **Vertical layout** (detail): trophy icon top center → large avatar circle (128px) → centered username → comment box with scroll → stats grid (likes + comment ID)

### 7.7 WinnerDetailsOverlay

File: `src/components/giveaway/WinnerDetailsOverlay.tsx`

Full-screen overlay modal for winner detail.

- Backdrop: `fixed inset-0 bg-black/50 backdrop-blur-sm`
- Card: `rounded-2xl bg-white/95 border border-amber-400/50 shadow-2xl shadow-amber-500/20`
- Mouse-tracked glare: amber radial gradient inline style
- Spring animation: `scale: 0.9 → 1`, `y: 20 → 0`, `stiffness: 300, damping: 30`
- Close button: top-right, `opacity-0 group-hover:opacity-100`
- Avatar: `w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600`, `ring-4 ring-white`
- Comment: `text-sm leading-relaxed whitespace-pre-wrap text-foreground/80 text-center`

### 7.8 WizardBottomNav

File: `src/components/giveaway/WizardBottomNav.tsx`

- Fixed bottom bar: `fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50`
- Slides in from bottom on mount (`y: 100 → 0`, delay 0.2s)
- Left: `WizardDots` progress indicator
- Center (optional): comment counter `text-sm text-muted-foreground`
- Right: Download button (outline, icon only on mobile) + Back (outline, icon+text responsive) + Next (primary fill)
- Next shows `Loader2` spinner while loading

### 7.9 WizardDots

File: `src/components/giveaway/WizardDots.tsx`

Dot-based step progress indicator:

| State | Appearance |
|---|---|
| Active step | `w-8 h-2 bg-primary rounded-full` (pill shape) |
| Past step | `w-2 h-2 bg-primary/60 rounded-full` |
| Future step | `w-2 h-2 bg-muted-foreground/20 rounded-full` |

Active dot animates to `scale: 1`; others to `scale: 0.8`.

### 7.10 ExportProgressModal

File: `src/components/instagram/ExportProgressModal.tsx`

Blocking overlay during comment export:

- Backdrop: `fixed inset-0 bg-black/50`
- Card: `bg-white rounded-lg shadow-lg max-w-md p-6`
- Progress bar: custom `w-full h-2 bg-gray-200 rounded-full` with `bg-blue-500` fill
- Status indicator: pulsing `h-2 w-2 animate-pulse rounded-full bg-blue-500` dot
- Error state: `text-red-600` message + retry button

### 7.11 PostCard

File: `src/components/instagram/PostCard.tsx`

- Aspect-square, `overflow-hidden bg-gray-100`
- Image fills with `object-cover`, scales `group-hover:scale-105` (duration 300ms)
- Media type badges: `bg-black/50 rounded-full p-1` top-right (Play icon for video, dots for carousel)
- Hover overlay: `bg-black/0 → bg-black/70`, shows likes + comments count with Heart + MessageCircle icons

### 7.12 ProfileHeader

File: `src/components/instagram/ProfileHeader.tsx`

Instagram-style profile header (no border, no card):

- `border-b border-gray-200 pb-8`
- Avatar: `w-32 h-32 rounded-full` image
- Username: `text-2xl font-light text-gray-900`
- Stats: `font-semibold text-gray-900` count + `text-gray-500` label
- Bio: `text-gray-700 max-w-md`
- Refresh button: outline, small, `RefreshCw` icon (spins when loading)

### 7.13 FullScreenLoader

File: `src/components/ui/FullScreenLoader.tsx`

Blocking overlay for long operations — a spinner centered on a semi-opaque full-screen overlay.

### 7.14 SliderWithInput

File: `src/components/ui/slider-with-input.tsx`

Slider with inline editable number input, auto-focuses input at max value, uses `inputmode="numeric"` for mobile keyboards.

---

## 8. Landing Page Structure

The landing page (`/`) is composed of stacked sections in this order:

1. **Header** — sticky, white, 64px tall
2. **Hero** (`bg-white`) — 2-column grid: text left, mock card right
   - H1 with blue emphasis word, checklist bullets (green checkmarks), CTA button
   - Right: gradient pill (`from-blue-50 to-indigo-100`) containing a white mock-up card with blue-to-purple winner badge
3. **HowItWorks** (`bg-gray-50`) — 3 step cards with step badges, gradient icons, connector dots between cards; stats panel below
4. **Trust** (`bg-white`) — 2×2 card grid with colored icon chips
5. **Benefits** (`bg-gray-50`) — 4-column card grid
6. **FuturePlans / Waitlist** — email waitlist form section
7. **FAQ** (`bg-white`) — accordion items, expandable with chevron icons; support CTA block (`bg-blue-50`)
8. **Footer** (`bg-gray-900 text-white`) — 4-column grid: logo/description/socials, contacts, legal links; bottom bar with copyright

---

## 9. App Pages Structure

### Posts List (`/app/instagram/posts`)

- `AppHeader` (sticky, white)
- `ProfileHeader` below header (avatar, stats, bio, refresh button)
- Tab row (Photos / Reels with "coming soon")
- `PostsGrid`: responsive grid of `PostCard` thumbnails (square, hover overlay)

### Post Details (`/app/instagram/posts/[postId]`)

- `AppHeader` with back button
- Post image preview
- Stats (likes, comments)
- Export actions via `ActionDrawer` (mobile bottom sheet)
- `ExportCommentsList` with virtualization

### Giveaway Wizard (`/app/instagram/posts/[postId]/giveaway`)

- `WizardShell` → `WizardContainer` → step content + `WizardBottomNav`
- **Step 1** — "Оберіть джерело даних": `Select` dropdown (new export or existing)
- **Step 2** — "Перегляд учасників": loading state with `Progress` bar → data `Table` with infinite scroll
- **Step 3** — "Налаштування розіграшу": `SliderWithInput` for winner count
- **Step 4** — "Переможці розіграшу!": roulette spinner (2.5s) → `ConfettiCanvas` + `WinnerCardGlass` grid; click opens `WinnerDetailsOverlay`

---

## 10. Motion & Animation

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

## 11. Icon Library

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

## 12. Scrollbar Styling

Custom scrollbar applied globally:

```css
::-webkit-scrollbar          { width: 8px; }
::-webkit-scrollbar-track    { background: #f1f1f1; }
::-webkit-scrollbar-thumb    { background: #c1c1c1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
```

---

## 13. Responsive Behavior Summary

| Breakpoint | Key Changes |
|---|---|
| Mobile (default) | Single column layouts; nav hidden; buttons show icon only; text shortened |
| `sm` (640px) | Button text appears; separator in AppHeader shows |
| `md` (768px) | Desktop nav visible; 2-3 column grids activate |
| `lg` (1024px) | 4-column grids; full button text in wizard nav; hero switches to 2-col |

---

## 14. Accessibility

- Focus ring: `focus-visible:ring-1 focus-visible:ring-ring` on all interactive elements
- Custom focus: `focus:ring-2` → `box-shadow: 0 0 0 2px rgba(59,130,246,0.5)` (blue)
- Buttons use `type="button"` explicitly
- `next/image` with `alt` attributes
- `sr-only` not explicitly used but semantic HTML headings (h1 → h2 → h3 → h4) are followed
- Smooth scroll: `html { scroll-behavior: smooth }`
