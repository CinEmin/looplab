# LoopLab

15 untimed Memory Journey levels, plus three 60-second browser games: Spot the Odd, Number Dash, Memory Flash.

Play: https://looplab-pilot.racing-thyme-8277.chatgpt.site/

No account needed. Scores stay on your device. Optional analytics requires explicit consent and can be stopped at any time.

Run checks: `node --test tests/*.test.cjs` (Node.js 18+; no dependencies).

See [OPERATIONS.md](OPERATIONS.md) for publishing, measurement and zero-budget constraints.

## Build the itch.io package

Run `python scripts/build-itch.py` (Python 3.10+) to create `build/looplab-itch.zip`. The six runtime assets retain their exact source bytes; the analytics config adds the itch channel. Fixed ZIP metadata makes builds repeatable with the same inputs and compression runtime. A failed build preserves the previous archive.

Packaging regression checks: `python -m unittest discover -s tests -p test_build_itch.py -v`.
