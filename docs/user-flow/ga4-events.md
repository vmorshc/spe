# GA4 Event Tracking

Google Analytics 4 event tracking across the full user journey. All events are fired client-side via `trackEvent()` from `src/lib/analytics.ts`.

## Setup

GA4 is initialized in `src/app/layout.tsx` using `@next/third-parties/google` with measurement ID from `NEXT_PUBLIC_GA_MEASUREMENT_ID` env variable. The `trackEvent()` wrapper checks for `window.gtag` existence before firing, so events are silently skipped if GA4 is not configured.

**Key files**:

| File | Purpose |
|------|---------|
| `src/lib/analytics.ts` | Typed `trackEvent()` function with all event names |
| `src/types/gtag.d.ts` | TypeScript declaration for `window.gtag` |

## Events Reference

### Phase 1: Discovery & Authentication

| Event | Trigger | File | Parameters |
|-------|---------|------|------------|
| `landing_page_view` | Landing page mount | `LandingTracker.tsx` | `referrer`, `utm_source`, `utm_medium`, `utm_campaign` |
| `landing_cta_click` | Click "Почати розіграш" in hero | `HeroClient.tsx` | `cta_type`: `"start_giveaway"`, `cta_location`: `"hero"` |
| `login_start` | Click "Увійти через Instagram" | `LoginButton.tsx` | `auth_provider`: `"facebook"`, `entry_point` |
| `login_callback` | Profile selection page mount (after OAuth redirect) | `select-profile/page.tsx` | `status`: `"success"`, `accounts_count` |
| `profile_selected` | Click "Вибрати цей профіль" | `select-profile/page.tsx` | `profile_id`, `followers_count`, `media_count`, `profiles_available_count` |

### Phase 2: Post Selection

| Event | Trigger | File | Parameters |
|-------|---------|------|------------|
| `posts_grid_view` | Posts page mount | `PostsGridTracker.tsx` | `profile_username`, `followers_count`, `posts_loaded_count` |
| `post_selected` | Click on a post card | `PostCard.tsx` | `post_id`, `media_type`, `comments_count`, `like_count` |

### Phase 3: Giveaway Wizard

| Event | Trigger | File | Parameters |
|-------|---------|------|------------|
| `wizard_started` | Wizard mount | `WizardTracker.tsx` | `post_id`, `media_type`, `comments_count`, `existing_exports_count` |
| `wizard_step1_completed` | Click "Далі" on step 1 | `Step1ExportSetup.tsx` | `export_source`: `"new"` \| `"existing"`, `export_id`, `step_duration_sec` |
| `export_started` | First poll detects pending/running status | `Step2PreviewAndLoad.tsx` | `export_id`, `post_id`, `expected_comments_count` |
| `export_completed` | Poll detects `done` status | `Step2PreviewAndLoad.tsx` | `export_id`, `comments_loaded`, `comments_failed`, `duplicates_count`, `unique_users_count`, `export_duration_sec` |
| `export_failed` | Poll detects failure | `Step2PreviewAndLoad.tsx` | `export_id`, `error_message` |
| `wizard_step2_completed` | Click "Далі" on step 2 | `Step2PreviewAndLoad.tsx` | `export_id`, `total_comments`, `unique_users_count`, `step_duration_sec` |
| `wizard_step3_completed` | Click "Далі" on step 3 (runs giveaway) | `Step3GiveawaySettings.tsx` | `winner_count`, `unique_users_enabled`, `unique_winners_enabled`, `total_participants`, `step_duration_sec` |
| `giveaway_completed` | Winners revealed (after roulette animation) | `Step4Winners.tsx` | `winners_count`, `unique_users_enabled`, `unique_winners_enabled` |
| `comments_csv_downloaded` | Click download CSV button | `WizardBottomNav.tsx` | `export_id`, `comments_count` |

### Phase 4: Results & Exit

| Event | Trigger | File | Parameters |
|-------|---------|------|------------|
| `winner_card_clicked` | Click on a winner card | `Step4Winners.tsx` | `winner_position`, `winner_username` |
| `wizard_exited` | Wizard unmount (only if step < 4) | `WizardTracker.tsx` | `last_step_reached` (1-3), `time_spent_sec` |

## Funnels

These event sequences enable funnel analysis in GA4:

**Auth funnel** — measures conversion from landing to authenticated user:
```
landing_page_view -> login_start -> login_callback -> profile_selected
```

**Main funnel** — measures conversion from browsing to completed giveaway:
```
posts_grid_view -> post_selected -> wizard_started -> giveaway_completed
```

**Wizard micro-funnel** — identifies which step loses users:
```
wizard_started -> wizard_step1_completed -> wizard_step2_completed -> wizard_step3_completed -> giveaway_completed
```

**Drop-off analysis** — `wizard_exited` fires with `last_step_reached` when a user leaves the wizard before completing step 4. Combine with `time_spent_sec` to understand if users are confused (fast exit) or distracted (slow exit).

**Export health** — compare `export_started` vs `export_completed` vs `export_failed` to track export reliability.

## Implementation Notes

- **Server routes can't fire GA4 events directly.** The OAuth callback (`/auth/callback`) passes `login_status` and `accounts_count` as URL search params to the redirect. The client-side `select-profile` page reads these params and fires `login_callback`.
- **Wizard exit tracking** uses a ref to capture the latest `currentStep` so the cleanup function in `useEffect` reports the correct step on unmount. The event only fires if `currentStep < 4` (step 4 means the user completed the giveaway).
- **Duplicate prevention** — events like `export_completed`, `export_failed`, and `giveaway_completed` use `useRef` flags to ensure they fire exactly once, even if the component re-renders.
- **Step duration** — steps 1, 2, and 3 track `step_duration_sec` using `useRef(Date.now())` captured on mount. The wizard exit also tracks total `time_spent_sec`.

## Debugging

1. Open browser DevTools, Network tab, filter by `collect` or `google-analytics`
2. Walk through the user flow and verify each event fires
3. In GA4 dashboard: Admin > DebugView to see events in real time
4. Check `window.gtag` exists in console — if `undefined`, GA4 is not loaded (check `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var)
