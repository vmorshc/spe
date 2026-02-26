# Instagram Giveaway Wizard

**Route**
`/app/instagram/export/[postId]`

**Purpose**
A 4-step wizard for conducting transparent, fair Instagram comment-based giveaways with cryptographically secure random winner selection.

**Layout**
Uses the authenticated app layout (`/app/app/layout.tsx`) for auth guard, but renders without AppHeader for a clean, distraction-free wizard experience.

**Flow**: Step 1 → Step 2 → Step 3 → Step 4 (Select export → Preview data → Configure settings → View winners)

## Step Breakdown

### Step 1: Export Setup
- **UI**: Dropdown with "Download now" (new export) or existing archived exports
- **Data**: Populated via `listExportsByMediaAction(postId)`
- **Action**: 
  - New export: calls `startExportAction(postId, { firstPerAuthor: false })`
  - Existing: validates exportId and proceeds
- **Next**: Transitions to Step 2 with exportId

### Step 2: Preview & Loading
- **Loading State**: 
  - New export: Linear progress bar with `appended/total` counters
  - Existing export: Spinner while fetching first page
  - Polls `getExportAction` and `resumeExportAction` until status is `done`
- **Table State**:
  - TanStack Table with infinite scroll
  - Fetches via `fetchExportCommentsAction(exportId, offset, limit)`
  - Download button visible (routes to `/api/exports/${exportId}/csv`)
- **Next**: Button to proceed to Step 3 (enabled once export status is `done`)

### Step 3: Giveaway Settings
- **UI**:
  - Context: "Using list from {date} ({count} participants)"
  - Slider: Range 1-10
  - Input: Always visible, gets focus/highlight when slider hits 10
- **Validation**: Winner count must be ≥ 1 and ≤ total participants
- **CTA**: "Start Giveaway" button with gradient accent
- **Action**: Calls `pickWinnersAction(exportId, winnerCount)`

### Step 4: Winners Results
- **Animation**: 2.5-second roulette spinner
- **Results Display**:
  - Festive background with confetti (canvas animation)
  - Liquid glass winner cards with staggered entrance
  - Glare effect reacts to mouse movement
  - Tier styling: 1st (gold), 2nd (silver), 3rd (bronze), 4+ (neutral)
- **Winner Details Overlay** (`WinnerDetailsOverlay`):
  - Triggered by clicking any winner card
  - Modal with spring animation; backdrop click dismisses
  - White (`bg-white/95`) card with amber border and subtle glare
  - Content: avatar, username, full comment text, timestamp, like count (small inline icon)
  - Close (✕) button hidden by default, revealed on hover (`group-hover:opacity-100`)
  - No trophy icon, no comment ID, no separate comment background box
- **Navigation**: Full `WizardBottomNav` is hidden on Step 4; replaced by a minimal ghost "Назад" button in a `fixed bottom-0` row with transparent background and muted gray text

## State Management

### Export Record Tracking
The wizard maintains a synchronized `exportRecord` in WizardContext that provides real-time access to export metadata throughout the flow:

- **Automatic Loading**: When `exportId` is set (Step 1), the context automatically fetches the full export record via `getExportAction(exportId)`
- **Live Updates**: Step 2 updates the context when export status changes to `done`, ensuring downstream steps have fresh data
- **Data Available**: All steps can access `exportRecord` from context, including:
  - `counters.appended`: Number of comments successfully exported
  - `status`: Current export status (`pending`, `running`, `done`, `failed`)
  - `createdAt`: Export timestamp
  - `list.length`: Total participants count
  - Full export metadata (see `docs/data-models.md`)
- **Comment Counter**: WizardBottomNav displays "Коментарів n" (formatted with Ukrainian locale) when `exportRecord.counters.appended > 0`
- **Step 4 exception**: `WizardBottomNav` returns `null` when `currentStep === maxSteps`; navigation is handled by a dedicated ghost button inside `Step4Winners`

This pattern eliminates redundant API calls and ensures the UI always displays consistent, up-to-date export information.

## Technical Implementation

### Directory Structure
- **Route**: `src/app/app/instagram/export/[postId]/page.tsx` - Main page component
- **Layout**: Inherits from `src/app/app/layout.tsx` - Uses auth guard, no AppHeader rendered
- **Components**: `src/components/giveaway/*` - All wizard UI components
- **Context**: `src/lib/contexts/WizardContext.tsx` - Wizard state management
- **Hooks**: `src/lib/hooks/useMediaQuery.ts` - Responsive utilities

### Server Components
- `page.tsx`: Fetches post details and existing exports
- Server-side rendering for initial data
- Auth guard in layout prevents unauthorized access

### Client Components
- `GiveawayWizardClient.tsx`: State machine orchestrator with WizardProvider
- `WizardShell.tsx`: Layout wrapper with prompt and step rendering
- `WizardDots.tsx`: Step progress indicator
- `WizardBottomNav.tsx`: Fixed bottom navigation with Back/Next/Download + comment counter
- Step components: `Step1ExportSetup`, `Step2PreviewAndLoad`, `Step3GiveawaySettings`, `Step4Winners`
- Winner UI: `WinnerCardGlass`, `WinnerDetailsOverlay`, `ConfettiCanvas`
- Context: `WizardProvider` manages step navigation, export state (including exportRecord), and winners

### Server Actions Used
- `getPostDetailsAction(postId)`: Fetch post metadata
- `listExportsByMediaAction(postId)`: Get existing exports
- `startExportAction(postId, options)`: Create new export
- `getExportAction(exportId)`: Check export status
- `resumeExportAction(exportId)`: Process export pages
- `fetchExportCommentsAction(exportId, offset, limit)`: Paginate comments
- `pickWinnersAction(exportId, count)`: Select random winners (Fisher-Yates)

## Fairness & Transparency

### Random Selection Algorithm
- **Method**: Fisher-Yates shuffle
- **Randomness**: `crypto.getRandomValues` (cryptographically secure)
- **Verification**: All participants stored in Redis, algorithm auditable

### Security
- Ownership validation: Users can only access their own exports
- Export status check: Winners can only be picked from completed exports
- Input validation: Winner count bounds checked

## UI/UX Features

### Animations
- Framer Motion for step transitions (slide in/out)
- Staggered winner card entrance
- Roulette spinner during selection
- Confetti celebration on results

### Responsive Design
- Winner detail overlay: centered modal (`max-w-lg`, `max-h-[90vh]`) on all screen sizes
- Adaptive button text in `WizardBottomNav` (steps 1–3):
  - Download button: Text visible only on desktop (lg+)
  - Back/Next buttons: Text visible on tablet+ (sm+)
- Comment counter: Visible on all screen sizes (mobile, tablet, desktop)
- Step 4: fixed ghost "Назад" button replaces the nav bar entirely

### Styling
- shadcn/ui components with Tailwind v4 CSS variables
- Liquid glass cards with backdrop-blur and gradients
- Pointer-driven glare effects
- Tier-based color schemes (gold/silver/bronze)

## Entry Points

Users access the wizard from:
- **Posts grid**: Clicking any post in the grid navigates directly to the wizard
- **PostCard** link routes to `/app/instagram/export/${postId}`

## Future Enhancements

- URL sync for selected winner (`?winnerId=xyz`)
- Share results via link
- Re-run giveaway with same export
- Winner history tracking
- Multi-post aggregation
