# Project progress

## Completed

- M3: interactive Bhopal risk map with shared selection, risk legend, tile-error fallback, and Mode B placeholder labels.
- M4: server-only Gemini structured explanation client, guarded prompt builder, deterministic English/Hindi fallback, validated `POST /api/analyze`, and in-memory per-IP rate limit.
- M5: responsive AI copilot panel connected to the analyze endpoint, English/Hindi and authority/resident preferences, source badge, copy advisory action, and visible medical disclaimer.
- Gemini does not calculate or modify scores. The client sends only the current engine assessment, scenario, language, and audience to the server; credentials remain server-side.
- M6: interactive what-if controls and presets, instant engine recomputation, baseline rings and scenario fills on the map, ranked score comparisons, a risk-level Changes table, and scenario-specific AI explanations.

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

## Next milestone

- Await the next approved product milestone.

## Known issues and decisions

- Gemini is controlled by server-only `GEMINI_API_KEY`; `GEMINI_MODEL` selects the model, defaulting to `gemini-2.5-flash`.
- When the key is missing, the provider times out, returns an error, or gives an invalid shape, the endpoint returns a deterministic offline template.
- Rate limiting uses process memory and resets on server restart; it is suitable for this single-process prototype.
- Endpoint handler behavior is tested without opening a local network listener because the test sandbox denies socket binding.
- Baseline is zone-specific wind with normal traffic and industry; scenario inputs remain illustrative and are not forecasts.
