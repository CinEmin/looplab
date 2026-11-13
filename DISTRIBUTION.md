# LoopLab distribution

Status: PUBLIC on 12 November 2026 (Europe/Istanbul): https://cinemin.itch.io/looplab . Project 5343254. Email verified, ZIP and cover uploaded, browser-play enabled. No payments or donations, no spending. Public badge verified. Embedded Chromium QA: Odd scored 10, Number Dash keyboard Enter scored 4, Memory Flash scored 12. Optional analytics declined during QA. Canonical share fallback was visible when iframe clipboard access was unavailable. Console inspection showed extension metadata errors, not game errors. Physical mobile remains untested.

Three gameplay screenshots and casual/high-score/minigames tags are live. Mode switching clears old share-result text. Controlled itch-channel visit, start and completion ingestion was verified on 2026-11-11 at 22:29–22:30 UTC. All QA identities are excluded from the saved activity insight (see OPERATIONS.md). Next: physical touch/mobile validation and genuine acquisition review after an observation window. Responsive layout v6 has 320/390/430px Chromium coverage. Owner/QA plays are not acquisition.

## First channel

itch.io HTML5 listing. Official guides checked 12 November 2026:
- https://itch.io/docs/creators/html5
- https://itch.io/docs/creators/getting-started

Use a free account and HTML project. Owner must complete account authentication and any binding terms if needed. Upload index.html, analytics.js and analytics-config.js at ZIP root. Do not enable payments or donations. Verify iframe behavior before publishing there; shared URLs must use the canonical public game address, not an ephemeral asset-host URL. Do not mark mobile friendly before actual mobile QA.

Build: `python scripts/build-itch.py` produces `build/looplab-itch.zip`. Canonical sharing and iframe viewport QA verified; actual itch-hosted scoring, canonical share fallback and telemetry were verified.

## Historical listing text (superseded by Memory Journey)

Title: LoopLab — Three One-Minute Challenges

Short description: Spot the odd color, race through numbers, and remember the glowing tiles. Three quick browser games, no download.

Description:
Take a one-minute game break with LoopLab.

- Spot the Odd: find the square with a different shade.
- Number Dash: tap the numbers in order.
- Memory Flash: remember the glowing squares and find them again.

Play a daily challenge or a random practice run. Scores stay on your device. Send a challenge link to a friend and compare scores on the same puzzle.

Free to play. No account required. No paid advantages. Optional usage analytics is off until you allow it, and can be stopped from the game page.

The pilot is still being tested. Which game makes you want another round?

## Experiment

First validate listing availability and browser play, then observe genuine opt-in starts, completions and return visits. Do not count staff QA or the owner's test as acquisition. Record traffic attribution before comparing channels. No spending decision from event totals alone. Review after 100 genuine consenting browsers or 14 days; an empty sample triggers a distribution review, not fabricated conversion claims.

## Memory Journey update

New distribution bundles must include index.html, analytics-config.js, analytics.js, journey.js, journey-ui.js, journey.css. Default play is now 15 untimed levels; quick challenges remain accessible via the 60-second games switch or existing challenge URLs. Do not describe the new main mode as a one-minute game. No purchase or payment feature added.


## Distribution audit — 14 November 2026 (Europe/Istanbul)

The public listing is already titled **LoopLab — Memory Journey & Quick Games**, with the 15-level description and standalone phone link. Searching itch.io for `LoopLab` in a signed-out browser showed this project in the results (first at observation time); this establishes indexing, not visits or stable ranking. The short description describes 15 untimed levels. The earlier one-minute listing text above is historical and must not replace the current listing.

The browser session was signed out; no listing, payment setting or devlog was changed. Current tags observed: Casual, High Score, minigames. No customer or revenue data was inferred. Official references: https://itch.io/docs/creators/getting-indexed and https://itch.io/docs/creators/html5 . Browser HTML games support donations; paid access requires downloadable classification. Payment onboarding remains a separate gate.

The Windows packaging failure was reproduced and fixed: binary asset reads avoid locale decoding, deterministic ZIP metadata supports hash comparison, and atomic replacement preserves the last archive when an input is missing. Three Python regression tests and 39 Node tests pass. This is a build-tool change, not a new game deployment.
