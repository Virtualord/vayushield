# Project progress

## Completed

- M3: interactive Bhopal risk map with shared selection, risk legend, tile-error fallback, and Mode B placeholder labels.
- M4: server-only Gemini structured explanation client, guarded prompt builder, deterministic English/Hindi fallback, validated `POST /api/analyze`, and in-memory per-IP rate limit.
- Gemini does not calculate or modify scores. The endpoint accepts the client engine's computed assessment, validates its shape, and asks Gemini only for explanation text.

## M4 commits

- `721d559` feat(server): add gemini client with structured output schema
- `7677690` feat(server): add prompt builder with guardrail instructions
- `08c2995` feat(server): add deterministic offline fallback
- `1ff217f` feat(server): add analyze endpoint with validation and rate limit
- `test(server): cover prompt, validation and fallback paths` (this milestone's final commit; see `git log` for its hash)

## Next milestone

- M5: connect the explanation endpoint to the client while keeping the deterministic fallback available.

## Known issues and decisions

- Gemini is controlled by server-only `GEMINI_API_KEY`; `GEMINI_MODEL` selects the model, defaulting to `gemini-2.5-flash`.
- When the key is missing, the provider times out, returns an error, or gives an invalid shape, the endpoint returns a deterministic offline template.
- Rate limiting uses process memory and resets on server restart; it is suitable for this single-process prototype.
- Endpoint handler behavior is tested without opening a local network listener because the test sandbox denies socket binding.
