# LoopLab operations

Public repository: https://github.com/CinEmin/looplab
Target: three playable free games; validate return visits before monetization.
Budget: zero. Do not add a payment card or enable paid usage without owner approval.

## Current state

GitHub Pages is configured from main/root. The first deployment failed at startup with a GitHub internal error before any build jobs ran. A deployment is not successful until the production URL loads and all three games are exercised there.

The original standalone game is imported. Missing service-worker registration was removed: this release does not promise offline/PWA support. Tests cover saved-state corruption, zero seed, elapsed time, all modes, and consent gating. Run npm test.

PostHog adapter is implemented but DISABLED: analytics-config.js has an empty public project token. No real-user event delivery has been verified. EU region is selected on signup. Account registration/terms must be completed by the owner; use the free plan without a card. Never publish a personal API key.

## Activation and validation

1. Complete owner account creation; confirm no card and free tier. Obtain the public project ingestion token and match its region.
2. Set analytics-config.js token. Keep the EU ingestion host for an EU project.
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
