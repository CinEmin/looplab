# LoopLab operations

Public repository: https://github.com/CinEmin/looplab
Target: three playable free games; validate return visits before monetization.
Budget: zero. Do not add a payment card or enable paid usage without owner approval.

## Current state

Production: https://looplab-pilot.racing-thyme-8277.chatgpt.site/

Sites project: appgprj_6af4d520ffcc81919825298020c23fa4, public version 6, source commit bf1f8b27a955ebaba4f786d3e2100bee6c5261bf. GitHub is the maintained source; Sites hosts the deployed static files. Future releases must synchronize index.html, analytics.js and analytics-config.js into the Site's dist directory and deploy a saved Site version. A GitHub push alone does not update this production site.

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

Verify background-tab timer fairness and inputs near expiry in a real browser. Confirm links after switching modes. Continue accessibility and physical mobile usability checks, consent UI and repeated consent clicks. Simulated storage/network failure coverage is recorded below. Monitor deployment service before repeated retries; do not change billing to resolve startup errors.

## Follow-up release — 12 November 2026 (Europe/Istanbul)

Added input-time deadline enforcement: delayed timer callbacks cannot allow late scoring. Three regression cases first failed with +10/+4/+6 points and passed after the guard. Full suite: 13 passed. Updated the theme-response wording to reflect consent-based upload and made the share label accurate for practice runs and native sharing.

itch.io is now public at https://cinemin.itch.io/looplab (project 5343254). Listing copy and current distribution status are in DISTRIBUTION.md. Embedded sharing was verified; physical mobile touch-device validation is still required before marking the listing mobile friendly. No external outreach or fee has occurred.


## Sharing and distribution preparation — 12 November 2026

Release pilot-01.3: canonical public challenge URLs work from embedded hosts; copy feedback is visible before a run ends. Analytics adds only the allowlisted channel site/itch, with unchanged opt-in protections. Full suite: 15 passed. Chromium iframe widths 320/390 had no horizontal document overflow; Number Dash, Memory Flash and Odd scored correctly with mouse/keyboard. This is viewport QA, not physical Android/iOS touch testing. Shared-link clipboard output verified before start.

Build the itch.io upload using `python scripts/build-itch.py`; ZIP contains only the three runtime files, with channel=itch. No payments/donations. Listing is public with cover, three gameplay screenshots and tags.


## Distribution validation and resilience — 12 November 2026

Sites v4 and the itch ZIP contain the share-result reset fix. The runtime analytics release label remains pilot-01.3; the Sites version is a separate hosting version.

Controlled itch test: visit at 22:29:24.468 UTC, game_start at 22:29:24.727, game_complete at 22:30:24.761 on 2026-11-11. All carried channel=itch. Consent was revoked after completion. Raw SQL can return a cached earlier sample; use a fresh bounded time window when validating newly ingested events.

Exclude these QA IDs from every product analysis (the saved insight already does):
- ee4c5811-e63f-47bc-b9d8-65ee5b204e82 (original site QA)
- 73094e3a-520a-480c-aadb-099a1fe18d3a (itch consent/revocation QA)
- 8d0e5548-1dd1-41cc-98a0-e244faecceb7 (itch complete lifecycle QA)

Automated suite: 20 passing tests. Four additional failure scenarios each exercise all three games: denied storage access, storage quota exceeded, malformed JSON and rejected analytics network requests. Each checks scoring, timer completion and replay. Network failure uses the real analytics module and a rejected fetch promise; no unhandled rejection occurs. This validates gameplay after assets have loaded, not offline first-load or service-worker support. Physical mobile and browser-level network emulation remain unverified.

## Keyboard and dialog QA — 12 November 2026

Number Dash completed a nine-number sequence with Enter (36 points). Native Tab continued into the next board. The information dialog opened with Enter, closed with Escape and returned focus to its opener. Its missing accessible name was reproduced in the browser accessibility tree, then fixed with aria-labelledby pointing at the existing heading. Both Sites v5 and the updated itch ZIP were verified live: dialog role now has the name “What is LoopLab?”. Twenty automated tests pass. This is targeted Chromium QA, not a full WCAG audit or physical screen-reader certification. Spot the Odd and Memory Flash remain visually dependent games.

## Mobile browser layout — 12 November 2026

Sites v6 adds a compact mobile header, less stage whitespace, wider boards, safe-area padding and 44px minimum height for primary/secondary/utility controls. On viewports up to 650px, starting a run scrolls immediately to the game panel. Desktop scroll position is unchanged. Game rules, daily seeds and analytics behavior are unchanged. Tiles use touch-action:manipulation and disable text selection; zoom remains available.

22 Node tests pass. The new mobile-scroll test failed before the implementation, then passed; shared seed zero still survives. Chromium iframe checks at 320/390/430px: no horizontal overflow, share button 44px high, Number Dash scored 4 and Memory Flash 12 at every width. On the deployed Site, Odd scored 10 at every width. This is responsive mouse/keyboard QA, not touch emulation or real Android/iOS testing. At dense Odd levels the board still has seven columns; not every tile is 44px on a narrow phone. Short/landscape screens can require scrolling. No native app, offline/PWA claim or mobile-device certification.
