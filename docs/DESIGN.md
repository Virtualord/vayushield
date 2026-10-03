# VayuShield visual design system

Milestone 10b defines a visual-only, Apple-inspired glass treatment for the existing VayuShield dashboard. The interface is VayuShield's own design and does not use Apple marks, product imagery, or claims of Apple affiliation.

## Product and content rules

- Environmental Risk Scores remain deterministic and are supplied by the existing client risk engine. This design pass does not change the engine, activity scoring, data, server, or API contracts.
- Keep illustrative input data neutral and visibly labelled. Present prototype scores separately with a colored number, ring, or badge. Keep AI explanations in a distinct accent-tinted surface with a small sparkle icon and “Gemini” source label.
- Risk always has a text label, icon, and color. Do not use color alone. Do not use colored text for body copy over glass; use an icon or dot beside readable label-colored text.
- Preserve the “Illustrative data” badge, Demo Mode banner, OpenStreetMap tiles and attribution, offline fallbacks, medical disclaimer, and all existing interactions.
- UI copy uses sentence case, concise wording, and no emoji or exclamation mark. Hindi content uses a taller line height (about 1.5).
- Add no runtime or build dependencies. Fonts and visual assets must work offline; use the system font stack and hand-written inline SVG icons.

## Tokens

Use CSS custom properties for colors and surfaces, with `light`, `dark`, and `system` theme behavior. Follow `prefers-color-scheme` by default and persist an explicit user choice in `localStorage` inside `try/catch`.

| Token | Dark | Light |
| --- | --- | --- |
| Primary label | `rgba(255,255,255,.92)` | `#1C1C1E` |
| Secondary label | `rgba(235,235,245,.6)` | `rgba(60,60,67,.6)` |
| Accent | `#0A84FF` | `#007AFF` |
| Low | `#30D158` | `#34C759` |
| Moderate | `#FFD60A` | `#FFCC00` |
| High | `#FF9F0A` | `#FF9500` |
| Critical | `#FF453A` | `#FF3B30` |

Dark glass uses a white tint near 8% opacity; light glass uses a white tint near 62%, with a faint dark outline. Standard panels use a 24px radius, cards 20px, controls 12px, and pills full rounding. Typography uses the system stack `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, system-ui, "Segoe UI", Roboto, sans-serif`, with a 34/40 bold page title, 22/28 section titles, 17/22 headlines, 15/22 body, 12/16 footnotes, and tabular numerals for figures.

## Glass and accessibility rules

- Glass uses a translucent fill, 1px hairline border, inset top highlight, and soft layered shadow. Use `backdrop-filter: blur(24px) saturate(180%)`; toolbars and sheets may use 40px. On small screens, cap blur at 16px.
- Never nest blurred surfaces. Children of a glass panel use a subtle tinted fill without another backdrop filter. Keep about five or fewer blurred surfaces visible at a time. Do not blur map tiles.
- Add only a subtle ambient background gradient. Tone down OpenStreetMap tiles in dark theme with a CSS filter; retain their attribution. If tiles fail, the gradient remains visible behind the map.
- Provide solid opaque surfaces when `backdrop-filter` is unsupported, reduced transparency is requested, or increased contrast is requested. Glass text must retain at least 4.5:1 contrast against the worst map-tile background; increase panel fill opacity where needed.
- Keep visible 2px accent focus rings with 2px offset. Respect `prefers-reduced-motion`; remove nonessential animation and transitions in that mode.
- Motion uses `cubic-bezier(.32,.72,0,1)` for 200–350ms. Buttons may press to scale .97; loading skeletons may shimmer when motion is allowed.

## Layout

- Desktop at 1024px and wider: map fills the viewport. Place the scenario presets, language, audience, and theme controls in a floating toolbar. A scrollable left sidebar holds summary widgets, ranked zones, and the selected-zone card. A right inspector holds AI copilot, scenario changes, community impact, action plan, and personal planner as collapsible sections. Place the risk legend at bottom left.
- Tablet: retain the sidebar and map; present the inspector as a sheet.
- Mobile below 768px: full-screen map, compact summary pill, and a bottom sheet with a grabber and peek, half, and full states, controlled by tap or drag. Sheet sections switch among Zones, Simulate, AI, and Plan.
- Preserve clear input, score, and explanation layers in every viewport. Keep controls touch-friendly and layouts usable when tiles or network services fail.

## Reusable components

Build small primitives under `client/src/components/ui`: `GlassPanel`, `GlassCard`, `Button` (filled, tinted, plain), `SegmentedControl`, `Toggle`, `Slider`, `Badge`/`RiskBadge`, `ProgressRing`, `Sheet`, `Toast` (Demo Mode banner), `Skeleton`, and `SectionHeader`.

Use local inline SVG icons with 1.75px strokes and rounded caps for risk levels, sparkle, wind, traffic, industry, school, hospital, person, sun/moon, copy, and chevrons. Keep primitives presentational and reuse existing application state, utilities, and data.

## Restyled screens

Restyle summary widgets (including AQI ring, PM2.5, critical/high counts, and population exposed), ranked zones, selected-zone score and component bars, methodology disclosure, scenario simulator and changes, copilot, community impact, action plan, personal planner timeline, legend, and empty/loading/error states. No scoring behavior or API interaction changes are in scope.

## Review checklist

- Confirm both themes and the system default; theme persistence must tolerate unavailable storage.
- Check 390px, 768px, and 1280px layouts in both themes. Verify Hindi line height.
- Confirm OSM attribution, dark tile treatment, tile-failure background, and offline Demo Mode remain intact.
- Inspect contrast over both light and dark map tiles; verify risk text/icon/color, input/score/AI separation, keyboard focus, increased contrast, reduced transparency, and reduced motion.
- Run project lint, tests, and build before each milestone commit as required by `AGENTS.md`.
