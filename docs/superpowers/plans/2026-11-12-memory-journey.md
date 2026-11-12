# Memory Journey implementation plan

Goal: ship 15 untimed levels with saved progression and forgiving retries, retaining quick games.
Architecture: pure journey engine (journey.js), separate DOM adapter (journey-ui.js), existing quick games unchanged. Vanilla JS, no dependencies or spending.
User authorized independent implementation of the proposed progression mode; no additional design approval needed.

- [x] Engine tests first: three chapters (pattern, sequence, reverse), 15 levels; 3 mistakes per attempt, unlimited retries on same level; input ignored during reveal; duplicate pattern taps ignored; ordered input strict; saved completion unlocks only next level; invalid saves sanitized, failed storage still playable.
- [x] Implement engine: create({storage,random}), start(level), recall(), tap(index), hint(), snapshot(). Each level has 2 rounds. 3 stars without mistakes/hints, 2 with <=2 mistakes and no hints, otherwise 1. A cleared level never loses its best stars.
- [x] UI: journey is default except existing game query links; map with locked levels and three badges earned at levels5/10/15; manual Ready begins reveal, untimed recall; hint/retry/next/map controls, optional quick games, pause safely on navigation/tab hiding. Label storage failure honestly. Mobile grid max4 columns, >=44px controls, reduced-motion safe.
- [x] Analytics: explicit consent retained. Allowlist chapter events + numeric level1–15, no board payload. Separate journey run type from quick modes.
- [x] Verify: all existing tests; new engine and analytics tests; browser completion, retry, reload, mode switching, narrow/short viewport where available; build ZIP with new assets. Publish exact checked source to GitHub and Sites; update itch ZIP if accessible.

Review focus: repeated clicks after completion, old reveal callbacks after navigation, malformed/blocked storage, locked level bypass, input while a hidden-tab reveal has elapsed.

Validation note: native browser verification performed for pattern levels; ordered/reverse chapter rules covered by engine tests. Physical mobile testing remains pending.
