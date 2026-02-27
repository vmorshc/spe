**UI Foundations**
- Styling is Tailwind CSS v4 with design tokens in `src/app/globals.css` and Geist fonts wired in `src/app/layout.tsx`.
- Primary palette is blue/gray with rounded corners (`rounded-lg`), light borders (`border-gray-200`), and soft shadows (`shadow-sm`).
- Most layouts use max-width containers (`max-w-4xl`, `max-w-7xl`) and generous vertical padding.

**shadcn/ui Integration**
- Configuration in `components.json` (root) with `cssVariables: true` for Tailwind v4 compatibility.
- CSS variables defined in `globals.css`: `--primary`, `--secondary`, `--accent`, `--muted`, `--border`, `--ring`, etc.
- Components in `src/components/ui/`: button, card, input, label, select, slider, slider-with-input, progress, table, dialog, drawer, scroll-area, separator.
- Utility function `cn()` in `src/lib/utils.ts` for merging Tailwind classes with `clsx` + `tailwind-merge`.
- Use shadcn components by importing from `@/components/ui/{component}` (lowercase paths to avoid conflicts with legacy PascalCase components).

**Animation & Motion**
- Framer Motion is used for section entrances, buttons, drawers, and modals.
- Keep animations subtle and fast: fade/slide in, small scale on hover/tap.

**Core UI Primitives**
- `src/components/ui/Button.tsx` reusable button with variants and sizes.
- `src/components/ui/Section.tsx` section wrapper with background variants and consistent spacing.
- `src/components/ui/AppHeader.tsx` authenticated app header with back and logout.
- `src/components/ui/FullScreenLoader.tsx` blocking overlay for long operations.
- `src/components/ui/slider-with-input.tsx` slider with inline editable numeric value display (desktop only, `hidden lg:block`).
- `src/components/ui/number-stepper.tsx` touch-friendly stepper with chevron arrows and inline editable input (mobile/tablet only, `block lg:hidden`).
- `src/components/ui/setting-checkbox.tsx` card-style checkbox with title + description text, primary border/fill when checked. Used for giveaway options.
- `src/components/instagram/InstagramHeader.tsx` legacy Instagram header (similar to AppHeader).
- `src/components/giveaway/WizardContainer.tsx` consistent width container (`max-w-4xl mx-auto px-4`) for wizard layout and navigation alignment.

**Feature Components**
- Landing sections in `src/components/landing/*` (Header, Hero, HowItWorks, Benefits, FuturePlans, FAQ, Footer). Header includes a scroll-triggered CTA button (IntersectionObserver on `#hero-cta`) with layout animations in desktop nav and AnimatePresence on mobile.
- Auth components in `src/components/auth/*` (LoginButton, RedirectBackLoginButton, UserProfile).
- Instagram flow in `src/components/instagram/*` (PostsGrid, PostCard, ProfileHeader, PostDetails, ExportCommentsList, ExportsDropdown, ExportProgressModal).
- Giveaway wizard in `src/components/giveaway/*` (GiveawayWizardClient, WizardShell, WizardContainer, WizardBottomNav, WizardDots, Step1-4, WinnerCardGlass, WinnerDetailsOverlay, ConfettiCanvas).
  - Wizard uses clean, borderless layout with consistent width management via `WizardContainer`.
  - Steps use semantic HTML headings and spacing instead of Card components for a modern, minimal look.
- System flags UI in `src/components/system/FeatureFlagsClient.tsx`.

**Data + State Patterns**
- Auth state is global via `AuthProvider` and `useAuth` in `src/lib/contexts/AuthContext.tsx`.
- Wizard state managed by `WizardProvider` and `useWizard` in `src/lib/contexts/WizardContext.tsx`:
  - Always runs in 4-step giveaway mode (`maxSteps = 4`)
  - Automatically loads and syncs `exportRecord` when `exportId` changes
  - Provides real-time access to export metadata (counters, status, participants)
  - Eliminates redundant API calls across wizard steps
- Server Actions live in `src/lib/actions/*` and are called from client components.
- Loading and error states are explicit, often with skeletons or fallback cards.
- Comment lists use virtualization (`react-window`) and infinite scroll to keep UI fast.

**How To Build "Native" Components**
- Prefer Tailwind utility classes over custom CSS. Use `rounded-lg`, `border`, `shadow-sm`, `bg-white`, `text-gray-*`, and `text-blue-*` for consistency.
- Use `Button` for CTAs and keep variants consistent (`primary`, `secondary`, `outline`, `ghost`).
- Wrap full-width sections with `Section` so spacing aligns with the landing page.
- For authenticated pages, use `AppHeader` and keep content centered in `max-w-4xl`.
- For multi-step wizards, use `WizardContainer` to ensure consistent width between content and fixed navigation.
- Prefer semantic HTML structure (h2 for titles, p for descriptions, space-y for vertical rhythm) over Card components for cleaner layouts.
- Add motion with Framer Motion where it improves clarity (entrance, hover, drawers) but avoid heavy or slow animations.
- For forms, follow the FuturePlans pattern: clear labels, inline validation, disabled states, and a short success/error message.
- Use `next/image` for media and keep aspect ratios consistent (`aspect-square` for grids).
- For long lists, prefer virtualization or incremental loading (Intersection Observer).

**Usage Examples (Where To Look)**
- Section + CTA pattern: `src/components/landing/HeroClient.tsx`.
- Card grids: `src/components/landing/Benefits.tsx`.
- Mobile bottom sheet: `src/app/app/instagram/posts/[postId]/components/ActionDrawer.tsx`.
- Export status modal: `src/components/instagram/ExportProgressModal.tsx`.
- Multi-step wizard: `src/components/giveaway/*` with context-based state management and consistent width containers.
- Clean borderless layout: `src/components/giveaway/Step1ExportSetup.tsx` - semantic headings instead of Cards.
- Consistent width management: `src/components/giveaway/WizardContainer.tsx` - reusable container for aligned layouts.
- Liquid glass cards with mouse effects: `src/components/giveaway/WinnerCardGlass.tsx`.
- Responsive dialog/drawer: `src/components/giveaway/WinnerDetailsOverlay.tsx`.
- Responsive navigation with adaptive button text: `src/components/giveaway/WizardBottomNav.tsx` - shows icons on mobile/tablet, full text on desktop (lg+).
- Real-time data display from context: `src/components/giveaway/WizardBottomNav.tsx` - displays comment counter using synchronized exportRecord.
- Slider with editable value: `src/components/ui/slider-with-input.tsx` - combined slider and inline numeric input with auto-focus at max value, mobile numeric keyboard support.
- Number input pattern: `src/components/giveaway/Step3GiveawaySettings.tsx` - uses SliderWithInput on desktop (lg+), NumberStepper on mobile/tablet.
- Card-style checkbox: `src/components/ui/setting-checkbox.tsx` - label wrapping hidden input with visual checkbox indicator, title, and muted description.
