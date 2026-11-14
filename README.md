# LoopLab

15 untimed Memory Journey levels, plus three 60-second browser games: Spot the Odd, Number Dash, Memory Flash.

[Play Memory Journey in your browser](https://looplab-pilot.racing-thyme-8277.chatgpt.site/) · [Play on itch.io](https://cinemin.itch.io/looplab)

No account needed. Scores stay on your device. Optional analytics requires explicit consent and can be stopped at any time.

## Try one level

Open the game, choose level 1 and study the pattern. Recall it at your own pace; hints and retries are free. Progress is saved locally when browser storage is available. Completing a level unlocks the next; there are 15 levels in this pilot. Analytics is optional, and declining it does not block play.

## Want to make your own memory activity?

[RecallKit](https://github.com/CinEmin/recallkit) is a separate free, offline authoring prototype for independent creators. Pick a grid and recall rule, choose the tiles, then export a standalone playable HTML file. It is not a LoopLab level importer and does not transfer LoopLab progress.

[Download RecallKit](https://github.com/CinEmin/recallkit/releases/tag/v0.1.0-prototype), extract the ZIP and open `index.html`. Try making two levels, saving JSON and opening your exported HTML. Optional [public playtest feedback](https://github.com/CinEmin/recallkit/issues/new?template=playtest.yml) helps evaluate this workflow; do not include personal or private information. No payment, account in the editor, or promised future features.

## Development

Run checks: `node --test tests/*.test.cjs` (Node.js 18+; no dependencies).

See [OPERATIONS.md](OPERATIONS.md) for publishing, measurement and zero-budget constraints.

## Build the itch.io package

Run `python scripts/build-itch.py` (Python 3.10+) to create `build/looplab-itch.zip`. The six runtime assets retain their exact source bytes; the analytics config adds the itch channel. Fixed ZIP metadata makes builds repeatable with the same inputs and compression runtime. A failed build preserves the previous archive.

Packaging regression checks: `python -m unittest discover -s tests -p test_build_itch.py -v`.
