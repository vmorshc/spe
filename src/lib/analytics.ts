type GiveawayEvent =
  // Phase 1: Discovery & Authentication
  | 'landing_page_view'
  | 'landing_cta_click'
  | 'login_start'
  | 'login_callback'
  | 'profile_selected'
  // Phase 2: Post Selection
  | 'posts_grid_view'
  | 'post_selected'
  // Phase 3: Giveaway Wizard
  | 'wizard_started'
  | 'wizard_step1_completed'
  | 'export_started'
  | 'export_completed'
  | 'export_failed'
  | 'wizard_step2_completed'
  | 'wizard_step3_completed'
  | 'giveaway_completed'
  // Phase 4: Results Engagement
  | 'winner_card_clicked'
  | 'wizard_exited'
  // Misc
  | 'comments_csv_downloaded';

export function trackEvent(
  name: GiveawayEvent,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
