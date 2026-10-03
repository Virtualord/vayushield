# Project progress

## Completed

- M3: interactive Bhopal risk map with shared selection, risk legend, tile-error fallback, and Mode B placeholder labels.
- M4: server-only Gemini structured explanation client, guarded prompt builder, deterministic English/Hindi fallback, validated `POST /api/analyze`, and in-memory per-IP rate limit.
- M5: responsive AI copilot panel connected to the analyze endpoint, English/Hindi and authority/resident preferences, source badge, copy advisory action, and visible medical disclaimer.
- Gemini does not calculate or modify scores. The client sends only the current engine assessment, scenario, language, and audience to the server; credentials remain server-side.
- M6: interactive what-if controls and presets, instant engine recomputation, baseline rings and scenario fills on the map, ranked score comparisons, a risk-level Changes table, and scenario-specific AI explanations.
- M7: documented heuristic community-group score impacts, selected-zone community impact view, validated/rate-limited `POST /api/plan`, deterministic offline plan fallback, and action plan UI with source and advisory copy.
- M8: curated bilingual unreviewed habit library and sample day, browser-only activity classification, deterministic exposure scoring, title-free validated/rate-limited `POST /api/plan-day`, profile-based habit matching with offline templates, Personal Planner UI, and local `.ics` paste/upload.

## M4 commits

- `721d559` feat(server): add gemini client with structured output schema
- `7677690` feat(server): add prompt builder with guardrail instructions
- `08c2995` feat(server): add deterministic offline fallback
- `1ff217f` feat(server): add analyze endpoint with validation and rate limit
- `a9a7a0f` test(server): cover prompt, validation and fallback paths

## M5 commits

- `634cc9a` feat(ui): add AI copilot panel with explain-risk flow
- `6090521` feat(ui): add language and audience toggles
- `feat(ui): add source badge, copy advisory and disclaimer` (this milestone's final commit; see `git log` for its hash)

## M6 commits

- `e3884a3` feat(sim): add scenario controls and presets
- `614fac0` feat(sim): add before/after comparison on map and list
- `feat(sim): pass active scenario to ai explanations` (see `git log` for its hash)

## M7 commits

- `98d9ff2` feat(engine): add community group impact scoring with tests
- `56ba0b7` feat(ui): add community impact view
- `0974185` feat(server): add action plan endpoint with schema and fallback
- `feat(ui): add action plan panel with advisory copy` (see `git log` for its hash)

## M8 commits

- `1c02b73` feat(data): add curated habit library and sample calendar
- `4596de0` feat(engine): add activity classification and exposure scoring with tests
- `ab55b4f` feat(server): add plan-day endpoint with habit validation and fallback
- `db9627c` feat(ui): add personal planner panel with profile toggles
- `a703137` feat(ui): add ics import for calendar events
- `docs: document planner heuristics and privacy approach` (this final commit; see `git log` for its hash)

## Next milestone

- Await the next approved product milestone.

## Known issues and decisions

- Gemini is controlled by server-only `GEMINI_API_KEY`; `GEMINI_MODEL` selects the model, defaulting to `gemini-2.5-flash`.
- When the key is missing, the provider times out, returns an error, or gives an invalid shape, the endpoint returns a deterministic offline template.
- Rate limiting uses process memory and resets on server restart; it is suitable for this single-process prototype.
- Endpoint handler behavior is tested without opening a local network listener because the test sandbox denies socket binding.
- Baseline is zone-specific wind with normal traffic and industry; scenario inputs remain illustrative and are not forecasts.
- Community sensitivity multipliers are documented heuristics, not health impact estimates. Action plans consume only the three current ranked engine assessments and the active scenario; offline mode includes scenario context deterministically.
- Planner activity factors and keyword classification are heuristics, not forecasts or measured exposure. `.ics` recurrence rules are not expanded; event titles remain local and are excluded from plan-day requests. Habit library entries remain unreviewed pending owner verification.

## M8: Demo Mode

- Added a visible Demo Mode banner on failed health checks and when AI features use cached or offline guidance; dashboard controls remain available.
- Added a manually invoked cache generator for the three scenario presets, both languages, both audiences, and both explanation/plan modes. It writes `server/data/demoCache.json` and never logs credentials. It was not run because no `.env` key is available.
- Endpoints check validated preset-keyed demo cache entries before their deterministic offline templates when live Gemini is unavailable.
- Added a no-key/no-network server-flow test covering all 12 preset/language/audience combinations.
- Checks: `npm run lint`, `npm test` (88 tests), and `npm run build` pass. Firefox headless crashed during the visual readiness check, so browser console and 390px layout checks remain unverified.
- Commits: `7ad0d45` demo banner; `a7e11ea` cache generator; `3057ba5` cached response fallback; final no-network test commit (see `git log`).
- Next milestone: await the next approved product milestone.
