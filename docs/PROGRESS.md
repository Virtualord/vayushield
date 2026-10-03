# Project progress

## Completed

- Interactive Bhopal risk map with population-scaled risk markers, permanent level labels, shared selection with the ranked list and risk card, four-level legend, and a tile-error notice over a plain background.
- Mode B is enabled with `VITE_DEMO_MODE=B`; it presents three uniquely keyed zones labelled `PLACEHOLDER`.

## Commits

- `bd14e0f` feat(map): render zones as risk-colored markers
- `0591b3a` feat(map): sync selection between map, list and card
- `feat(map): add legend and offline tile fallback` (this milestone's final commit; see `git log` for its hash)

## Next milestone

- Add the next requested dashboard milestone.

## Known issues and decisions

- Map tiles require network access. When a tile reports an error, markers remain on the dark map background and the UI displays “Map tiles unavailable”.
- Mode B uses the first three illustrative input records with placeholder labels and distinct IDs; it does not introduce a second set of input values.
