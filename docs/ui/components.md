# Pickly Components Reference

All reusable UI components, their props, layout details, and usage patterns.

---

## 1. Core UI Primitives

### 1.1 Button

**File**: `src/components/ui/Button.tsx`
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

**Behavior:**
- Focus: `focus-visible:ring-1 focus-visible:ring-ring`
- Disabled: `opacity-50 pointer-events-none`
- SVG children: auto-sized to `size-4`

### 1.2 Section

**File**: `src/components/ui/Section.tsx`

Wraps landing content with consistent padding and a background variant.

| Prop | Options | Class applied |
|---|---|---|
| `background` | `white` | `bg-white` |
| `background` | `gray` | `bg-gray-50` |
| `background` | `blue` | `bg-blue-50` |

Inner container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### 1.3 FullScreenLoader

**File**: `src/components/ui/FullScreenLoader.tsx`

Blocking overlay for long operations — a spinner centered on a semi-opaque full-screen overlay.

### 1.4 SliderWithInput

**File**: `src/components/ui/slider-with-input.tsx`

Combined slider and inline editable numeric input. Auto-focuses input at max value, uses `inputmode="numeric"` for mobile keyboards. Desktop only (`hidden lg:block`).

### 1.5 NumberStepper

**File**: `src/components/ui/number-stepper.tsx`

Touch-friendly stepper with chevron arrows and inline editable input. Mobile/tablet only (`block lg:hidden`).

### 1.6 SettingCheckbox

**File**: `src/components/ui/setting-checkbox.tsx`

Card-style checkbox with title + description text. Primary border/fill when checked. Uses label wrapping a hidden input with visual checkbox indicator. Used for giveaway options.

---

## 2. Layout Components

### 2.1 AppHeader (Authenticated)

**File**: `src/components/ui/AppHeader.tsx`

Sticky header for authenticated app pages.

- **Container**: `bg-white shadow-sm sticky top-0 z-50`, height `h-16`
- **Left**: Ghost button "Back" (`ArrowLeft` icon + text hidden on mobile) → separator → logo (blue `w-8 h-8 bg-blue-600 rounded-lg` + site name hidden on mobile)
- **Center**: Page title `text-lg font-medium text-gray-900`
- **Right**: Ghost button "Вийти" with `LogOut` icon, turns red on hover, shows spinner during logout

### 2.2 Landing Header

**File**: `src/components/landing/Header.tsx`

Sticky header for the public landing page.

- Slides in from top on mount (`motion.header`, `y: -20 → 0`, duration 0.6s)
- `bg-white shadow-sm sticky top-0 z-50`, height `h-16`
- **Logo**: `w-8 h-8 bg-blue-600 rounded-lg` with "SP" text + site name, scales 1.05 on hover
- **Nav links**: `text-gray-700 hover:text-blue-600 transition-colors`, hidden on mobile
- **Mobile**: Hamburger button (`Menu`/`X` icons), drawer slides in with `opacity: 0, height: 0 → auto`
- **Auth state**: spinner while loading; `UserProfile` if authenticated; `LoginButton` otherwise
- Scroll-triggered CTA button (IntersectionObserver on `#hero-cta`) with layout animations in desktop nav and AnimatePresence on mobile

### 2.3 WizardContainer

**File**: `src/components/giveaway/WizardContainer.tsx`

Consistent width container (`max-w-4xl mx-auto px-4`) for wizard layout and navigation alignment.

---

## 3. Landing Components

**Directory**: `src/components/landing/*`

| Component | Description |
|---|---|
| `Header` | Sticky nav with auth state, mobile drawer (see §2.2) |
| `HeroClient` | 2-column hero: text with checklist + mock card visual. Section + CTA pattern example |
| `HowItWorks` | 3 step cards with badges, gradient icons, connector dots, stats panel |
| `Benefits` | 4-column card grid. Card grids pattern example |
| `FuturePlans` | Email waitlist form section |
| `FAQ` | Accordion items with chevron icons; support CTA block (`bg-blue-50`) |
| `Footer` | 4-column grid: logo/description/socials, contacts, legal links; bottom bar with copyright |

**Card patterns used in landing:**
- **Trust/Benefits card**: `bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100`
- **HowItWorks step card**: same + relative positioning for floating step number badge
- **Step number badge**: `absolute -top-4 left-6`, `w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm`
- **Stats panel** (bottom of HowItWorks): `bg-white rounded-xl p-8 shadow-sm`, 3-column grid

---

## 4. Auth Components

**Directory**: `src/components/auth/*`

| Component | Description |
|---|---|
| `LoginButton` | Instagram OAuth login trigger |
| `RedirectBackLoginButton` | Login button that preserves redirect URL |
| `UserProfile` | Displays authenticated user info in header |

---

## 5. Instagram Components

**Directory**: `src/components/instagram/*`

### 5.1 ProfileHeader

**File**: `src/components/instagram/ProfileHeader.tsx`

Instagram-style profile header (no border, no card):
- `border-b border-gray-200 pb-8`
- Avatar: `w-32 h-32 rounded-full` image
- Username: `text-2xl font-light text-gray-900`
- Stats: `font-semibold text-gray-900` count + `text-gray-500` label
- Bio: `text-gray-700 max-w-md`
- Refresh button: outline, small, `RefreshCw` icon (spins when loading)

### 5.2 PostsGrid / PostCard

**File**: `src/components/instagram/PostCard.tsx`

- Aspect-square, `overflow-hidden bg-gray-100`
- Image fills with `object-cover`, scales `group-hover:scale-105` (duration 300ms)
- Media type badges: `bg-black/50 rounded-full p-1` top-right (Play icon for video, dots for carousel)
- Hover overlay: `bg-black/0 → bg-black/70`, shows likes + comments count with Heart + MessageCircle icons

### 5.3 ExportProgressModal

**File**: `src/components/instagram/ExportProgressModal.tsx`

Blocking overlay during comment export:
- Backdrop: `fixed inset-0 bg-black/50`
- Card: `bg-white rounded-lg shadow-lg max-w-md p-6`
- Progress bar: custom `w-full h-2 bg-gray-200 rounded-full` with `bg-blue-500` fill
- Status indicator: pulsing `h-2 w-2 animate-pulse rounded-full bg-blue-500` dot
- Error state: `text-red-600` message + retry button

### 5.4 Other Instagram Components

| Component | Description |
|---|---|
| `InstagramHeader` | Legacy Instagram header (similar to AppHeader) |
| `PostDetails` | Post detail view with image and stats |
| `ExportCommentsList` | Virtualized comment list (`react-window`) with infinite scroll |
| `ExportsDropdown` | Dropdown to select between export records |

---

## 6. Giveaway Wizard Components

**Directory**: `src/components/giveaway/*`

The wizard uses clean, borderless layout with semantic HTML headings and spacing instead of Card components.

### 6.1 WizardShell / GiveawayWizardClient

Top-level wizard wrapper. `WizardShell` provides layout structure, `GiveawayWizardClient` manages step routing.

### 6.2 WizardBottomNav

**File**: `src/components/giveaway/WizardBottomNav.tsx`

Fixed bottom navigation bar:
- `fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50`
- Slides in from bottom on mount (`y: 100 → 0`, delay 0.2s)
- **Left**: `WizardDots` progress indicator
- **Center** (optional): comment counter `text-sm text-muted-foreground` (displays counter using synchronized `exportRecord`)
- **Right**: Download button (outline, icon only on mobile) + Back (outline, icon+text responsive) + Next (primary fill)
- Next shows `Loader2` spinner while loading
- Responsive: shows icons on mobile/tablet, full text on desktop (lg+)

### 6.3 WizardDots

**File**: `src/components/giveaway/WizardDots.tsx`

Dot-based step progress indicator:

| State | Appearance |
|---|---|
| Active step | `w-8 h-2 bg-primary rounded-full` (pill shape) |
| Past step | `w-2 h-2 bg-primary/60 rounded-full` |
| Future step | `w-2 h-2 bg-muted-foreground/20 rounded-full` |

Active dot animates to `scale: 1`; others to `scale: 0.8`.

### 6.4 Wizard Steps

| Step | File | Description |
|---|---|---|
| Step 1 | `Step1ExportSetup.tsx` | "Оберіть джерело даних" — `Select` dropdown (new export or existing). Clean borderless layout example |
| Step 2 | `Step2ParticipantReview.tsx` | "Перегляд учасників" — loading state with `Progress` bar → data `Table` with infinite scroll |
| Step 3 | `Step3GiveawaySettings.tsx` | "Налаштування розіграшу" — `SliderWithInput` on desktop (lg+), `NumberStepper` on mobile/tablet |
| Step 4 | `Step4Winners.tsx` | "Переможці розіграшу!" — roulette spinner (2.5s) → `ConfettiCanvas` + `WinnerCardGlass` grid |

### 6.5 WinnerCardGlass

**File**: `src/components/giveaway/WinnerCardGlass.tsx`

"Liquid glass" card with mouse-tracked radial glare effect:
- `rounded-2xl backdrop-blur-xl bg-gradient-to-br` + tier gradient (see design-system.md §3.5)
- Border and shadow tinted by rank color
- `backgroundImage` inline style: `radial-gradient(circle at X% Y%, glare-color, transparent 60%)` — follows cursor
- On hover: subtle scale `1.01` + lift `-2px` (only when clickable)
- White overlay `group-hover:opacity-100` on hover for glass sheen
- **Horizontal layout** (list): rank + Trophy icon + username + truncated comment
- **Vertical layout** (detail): trophy icon top center → large avatar circle (128px) → centered username → comment box with scroll → stats grid (likes + comment ID)

### 6.6 WinnerDetailsOverlay

**File**: `src/components/giveaway/WinnerDetailsOverlay.tsx`

Full-screen overlay modal for winner detail. Responsive dialog/drawer pattern:
- Backdrop: `fixed inset-0 bg-black/50 backdrop-blur-sm`
- Card: `rounded-2xl bg-white/95 border border-amber-400/50 shadow-2xl shadow-amber-500/20`
- Mouse-tracked glare: amber radial gradient inline style
- Spring animation: `scale: 0.9 → 1`, `y: 20 → 0`, `stiffness: 300, damping: 30`
- Close button: top-right, `opacity-0 group-hover:opacity-100`
- Avatar: `w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600`, `ring-4 ring-white`
- Comment: `text-sm leading-relaxed whitespace-pre-wrap text-foreground/80 text-center`

### 6.7 ConfettiCanvas

Celebration confetti animation triggered on winner reveal (Step 4).

---

## 7. System Components

| Component | File | Description |
|---|---|---|
| `FeatureFlagsClient` | `src/components/system/FeatureFlagsClient.tsx` | Admin UI for toggling feature flags |

---

## 8. Data & State Patterns

- **Auth state**: global via `AuthProvider` and `useAuth` in `src/lib/contexts/AuthContext.tsx`.
- **Wizard state**: managed by `WizardProvider` and `useWizard` in `src/lib/contexts/WizardContext.tsx`:
  - Always runs in 4-step giveaway mode (`maxSteps = 4`)
  - Automatically loads and syncs `exportRecord` when `exportId` changes
  - Provides real-time access to export metadata (counters, status, participants)
  - Eliminates redundant API calls across wizard steps
- **Server Actions**: live in `src/lib/actions/*`, called from client components.
- **Loading/error states**: explicit, often with skeletons or fallback cards.
- **Long lists**: virtualization (`react-window`) and infinite scroll.

---

## 9. Usage Examples (Where To Look)

| Pattern | Example File |
|---|---|
| Section + CTA | `src/components/landing/HeroClient.tsx` |
| Card grids | `src/components/landing/Benefits.tsx` |
| Mobile bottom sheet | `src/app/app/instagram/posts/[postId]/components/ActionDrawer.tsx` |
| Export status modal | `src/components/instagram/ExportProgressModal.tsx` |
| Multi-step wizard | `src/components/giveaway/*` with context-based state management |
| Clean borderless layout | `src/components/giveaway/Step1ExportSetup.tsx` |
| Consistent width management | `src/components/giveaway/WizardContainer.tsx` |
| Liquid glass cards | `src/components/giveaway/WinnerCardGlass.tsx` |
| Responsive dialog/drawer | `src/components/giveaway/WinnerDetailsOverlay.tsx` |
| Responsive nav with adaptive text | `src/components/giveaway/WizardBottomNav.tsx` |
| Real-time data from context | `src/components/giveaway/WizardBottomNav.tsx` |
| Slider with editable value | `src/components/ui/slider-with-input.tsx` |
| Number input (responsive) | `src/components/giveaway/Step3GiveawaySettings.tsx` |
| Card-style checkbox | `src/components/ui/setting-checkbox.tsx` |
