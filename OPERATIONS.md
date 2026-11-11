# LoopLab operations

Public repository: https://github.com/CinEmin/looplab
Target: three playable free games; validate return visits before monetization.
Budget: zero. Do not add a payment card or enable paid usage without owner approval.

## Current state

Production: https://looplab-pilot.racing-thyme-8277.chatgpt.site/

Sites project: appgprj_6af4d520ffcc81919825298020c23fa4, public version 1, source commit 8854434b5297dd5d33accdeafe72d73f9d37bac2. GitHub is the maintained source; Sites hosts the deployed static files. Future releases must synchronize index.html, analytics.js and analytics-config.js into the Site's dist directory and deploy a saved Site version. A GitHub push alone does not update this production site.

GitHub Pages main/root was attempted four times; GitHub returned internal startup errors before any build jobs ran. Use the working Sites URL, not the unverified GitHub Pages URL.

The original standalone game is imported. Missing service-worker registration was removed: this release does not promise offline/PWA support. Tests cover saved-state corruption, zero seed, elapsed time, all modes, and consent gating. Run npm test.

PostHog EU project 345836 is active. The owner completed authentication; Free (capped usage, no card) was selected. analytics-config.js contains only the public ingestion token. No paid subscription, payment card, replay, heatmaps or autocapture enabled.

Live QA on 2026-11-11: each game scored and completed a 60-second run (odd 10, numbers 36, memory 12). Replay and mode switching also worked. PostHog received 1 visit, 4 starts, 3 completions and 1 mode-switch abandon. These are controlled QA, not real customer adoption. The test browser ID ee4c5811-e63f-47bc-b9d8-65ee5b204e82 is excluded from the saved activity insight: https://eu.posthog.com/project/345836/insights/LZ30Mwge . Other analyses must apply the same exclusion. Its query returned zero non-test activity at launch. Consent revoke restored the off state; automated tests verify no sending before consent or after revoke. Captured browser errors were extension metadata errors, not app source errors.

## Activation and validation

1. Keep the no-card free plan; never enable paid overages without financing approval.
2. Keep the EU ingestion host for this EU project; never publish private credentials.
3. Run npm test, deploy, test all games on production and mobile-sized layout.
4. Test a clean visit: no PostHog requests before consent; decline preserves play. Allow must emit a visit and game_start; finishing emits game_complete. Revoke must stop future requests. Verify received events in PostHog, not just HTTP success.
5. Use ?qa=1 for gameplay tests to suppress collection; use a separate controlled opt-in verification session and exclude its random ID from product analysis.
6. Validate published source and no console errors. Only then mark launch and analytics complete.

## Measurement definitions

Data is pseudonymous and opt-in, not a census of all visitors. No session replay, automatic DOM capture, names, email, full URLs or score uploads. Random browser ID rotates after 90 days; network processing still exposes IP to the provider. Global Privacy Control and Do Not Track suppress uploads. Client caps at 100 events per page load. No past activity is uploaded on consent.

Events: visit (shared_entry); game_start (mode, run_type, replay); game_complete (mode, run_type); game_abandon (mode, currently mode-switch only); share_success (mode, share/copy confirmation, not proof of an invitation received); theme_interest (choice, never revenue).

Dashboard: unique consenting browser IDs; visit→start conversion; started→completed runs by mode; repeat-run share; share/copy rate; theme-interest response. D1/D7 retention must compare first-seen UTC calendar-date cohorts to visits on the corresponding calendar day. Use event timestamps for those cohorts, not days_since_first_visit (elapsed 24-hour periods).

Before optimization: inspect counts and data quality. Do not treat tiny samples as proof. First goal is 100 genuine consenting visitors and completed D1/D7 observation windows. Report numerator and denominator and distinguish staff/test traffic. No invented revenue or guaranteed income.

## Known follow-up

Verify background-tab timer fairness and inputs near expiry in a real browser. Confirm links after switching modes. Test keyboard/mobile usability, consent UI, storage unavailable, repeated consent clicks, and network failure. Monitor deployment service before repeated retries; do not change billing to resolve startup errors.
