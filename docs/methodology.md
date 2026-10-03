# Methodology and data labels

## Data inputs

The 11 Bhopal zones in `client/src/data/zones.json` are illustrative prototype inputs. The PM2.5 and PM10 concentrations, wind speeds, populations, vulnerability values, facility counts, and zone boundaries are not live measurements or verified local statistics. All zone coordinates are approximate and are provided only to place the illustrative zones on a map. Each zone uses `dataSource: "illustrative"` to preserve this label in the data.

Keep three outputs distinct in the product: **input data** (illustrative readings and zone attributes), the deterministic **Environmental Risk Score** computed by this prototype, and any **AI-generated explanation** of numbers already computed. AI must not create or revise readings, AQI values, scores, or other numeric results.

## PM2.5-only AQI

The AQI conversion linearly interpolates PM2.5 concentration within these simplified continuous bands:

| PM2.5 (µg/m³) | AQI | Category |
| --- | --- | --- |
| 0–30 | 0–50 | Good |
| 30–60 | 50–100 | Satisfactory |
| 60–90 | 100–200 | Moderate |
| 90–120 | 200–300 | Poor |
| 120–250 | 300–400 | Very Poor |
| 250–380 | 400–500 | Severe |

Values above the final concentration breakpoint return AQI 500. This is a simplified PM2.5-only calculation; verify breakpoints against CPCB documentation before treating it as a standards implementation. It does not calculate an official AQI from all required pollutants.

## Scenario-adjusted concentration

For traffic and industry settings, the engine uses multipliers `low = 0.8`, `normal = 1.0`, and `high = 1.3`. With traffic and industry shares `t` and `i`, the emission factor is:

```text
emissionFactor = t × trafficMultiplier + i × industryMultiplier
```

The effective wind speed is the scenario wind speed, or the zone's `baseWind` when scenario wind is `null`, clamped to 0.2–15 km/h. The dispersion factor and scenario PM2.5 are:

```text
dispersionFactor = (1 + baseWind / 5) / (1 + effectiveWind / 5)
effectivePM25 = basePM25 × emissionFactor × dispersionFactor
```

The baseline scenario uses `windSpeed: null`, `traffic: "normal"`, and `industry: "normal"`.

## Environmental Risk Score

The deterministic score uses three normalized components:

```text
hazard = min(effectivePM25 / 120, 1)
exposure = min(population / 50000, 1)
vulnerability = zone vulnerability input
score = round(100 × (0.60 × hazard + 0.15 × exposure + 0.25 × vulnerability))
```

The exported weights are 0.60 for hazard, 0.15 for exposure, and 0.25 for vulnerability. The score is bounded from 0 to 100. Risk levels are **LOW** below 30, **MODERATE** from 30, **HIGH** from 50, and **CRITICAL** from 75.

The PM2.5 hazard cap, population cap, weights, and level thresholds are prototype choices. The vulnerability input is an illustrative 0–1 index intended to represent the assumed share or presence of schools, hospitals, and elderly residents; it is not calculated from verified facility or demographic data.

## Community group impact

`groupImpact(assessment)` applies fixed sensitivity multipliers to the engine-computed zone score, rounds to a whole number, clamps the result to 0–100, and assigns the same prototype risk level thresholds. These are transparent heuristics for demo comparison, not epidemiological estimates or a measure of actual harm.

| Group | Heuristic multiplier |
| --- | ---: |
| Schools | 1.10 |
| Healthcare | 1.15 |
| Elderly | 1.20 |
| Outdoor workers | 1.10 |
| Industrial workers | 1.15 |

## Personal day planner heuristics

The day planner uses the selected zone's existing prototype score and browser-classified activity fields to calculate a heuristic **activity exposure score**. This is a planning aid, not a measurement, forecast, health impact estimate, or validated model. The activity factors are applied in `client/src/utils/riskEngine.js`; `activityEngine.js` classifies calendar titles in the browser and re-exports the score helper.

```text
activity exposure = round(clamp(
  zone Environmental Risk Score
  × setting factor
  × exertion factor
  × duration factor
  × applicable profile factors,
  0, 100
))
```

The resulting value uses the prototype LOW / MODERATE / HIGH / CRITICAL thresholds described above. The factors are demonstration heuristics and are not measured exposure coefficients.

| Input | Value |
| --- | --- |
| Setting: indoor / outdoor / commute | 0.75 / 1.25 / 1.10 |
| Exertion: low / medium / high | 0.80 / 1.00 / 1.25 |
| Duration factor | duration minutes ÷ 30, clamped to 0.50–2.00 |
| Purifier available | 0.65 for indoor activities; otherwise 1.00 |
| Windows open | 1.20 for indoor activities; otherwise 1.00 |
| Sensitive group profile | 1.15 |

The browser classifies titles using a small keyword list for indoor, outdoor, commute, and exertion categories. An unrecognized title is flagged locally and uses indoor / low defaults. Duration comes from the event's start and end time; if unavailable for a locally classified item, it defaults to 30 minutes. These simple rules may misclassify unusual event names.

Habits in `client/src/data/habits.json` are curated general-precaution text with `reviewed: false`. Their `minLevel` controls the lowest prototype activity level at which a habit is eligible. Profile and activity tags narrow the eligible habits. These texts are not official guidance and have not been reviewed; verify them against authoritative guidance before relying on them.

## Personal calendar privacy and plan generation

Sample calendar events and imported `.ics` content are parsed in the browser. The parser reads only each event's summary, start time, and end time; it ignores UID, attendees, location, description, and other properties. It does not expand recurrence rules. Calendar titles are used locally for classification and display, but are omitted from `POST /api/plan-day`. That request contains a locally generated event ID, classified setting and exertion, duration, start time, computed activity exposure score and level, profile booleans, and language. The server rejects extra event fields, including titles.

The server selects candidate habit IDs from the local habit library using the profile, activity tags, and computed level, then asks Gemini to select only among those candidates. It validates every returned event and habit ID. Without a key or if the provider fails, a deterministic template chooses matching habits. If the local planning service is unreachable, the client shows its deterministic offline template. Neither path changes or invents an exposure score.

## Limitations

This is a transparent heuristic, not a validated scientific model. Its outputs are prototype scores based on illustrative inputs, not official measurements, health guidance, a prediction, or a forecast. AQI is calculated from PM2.5 alone and should not be presented as comprehensive or official. Results should be interpreted as a demo of deterministic scenario logic, not as evidence of actual neighborhood risk.
