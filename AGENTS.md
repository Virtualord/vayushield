# AGENTS.md: VayuShield

## What this project is
VayuShield is an AI-assisted environmental risk intelligence prototype for Bhopal.
Flow: environmental inputs -> deterministic risk engine -> risk map -> Gemini explanation -> community action plan.
It is a hackathon prototype built by one person in a short time window. Keep everything small, demoable and honest.

## Hard rules (never break these)
1. **Scores are computed only in `client/src/utils/riskEngine.js`** as pure functions. Gemini never produces, changes or invents scores, AQI values or any other number. It only explains numbers it is given.
2. **No secrets in the repo or the client bundle.** `GEMINI_API_KEY` is read on the server only, from environment variables. `.env` is gitignored. `.env.example` is committed with empty values.
3. **Demo Mode must work with no internet and no API key.** Every Gemini feature needs a deterministic fallback so the full demo still runs.
4. **Honest data labelling.** All zone data is illustrative unless a real source is named in `docs/methodology.md`. Never present synthetic readings as live. Show an "Illustrative data" label in the UI. The UI and docs must keep three things visibly separate: **input data**, the **prototype risk score**, and **AI-generated explanation**. Call the output an "Environmental Risk Score". Never call it a prediction or forecast, and never claim scientific validation or official status.
5. **No medical diagnosis.** AI advice is general precautions only, with a visible disclaimer.
6. **Scope discipline.** Do not add authentication, a database, custom ML, Redux or other state libraries, or any dependency outside the allowed list without asking first.

## Allowed stack
- Client: React (JavaScript), Vite, Tailwind CSS, react-leaflet + leaflet, Vitest
- Server: Node.js (ES modules), Express, cors, dotenv, `@google/genai`
- Tooling: ESLint, Prettier, concurrently
- Anything else: ask first.

## Structure
    client/src/{components,data,services,utils}
    server/{routes,services,data}
    docs/   README.md   AGENTS.md

## Commands
- `npm run dev`: client and server together
- `npm test`: all tests
- `npm run lint`
- `npm run build`

## Workflow
- Work on **one milestone at a time**. Before editing, inspect the repository and reuse existing utilities and components instead of duplicating logic.
- When the milestone is done, stop and report exactly: files created or changed, commands run, test results, build status, commit hashes, open questions, and the next recommended milestone. Then wait.
- Before every commit run lint, tests and build. Every commit must leave the project building with passing tests.
- Write tests in the same commit as the feature they cover.
- In the last commit of every milestone, also update `docs/PROGRESS.md`: what is done, commit hashes, the next milestone, known issues and decisions made. A fresh session with no memory of earlier sessions must be able to continue from that file and `git log` alone.
- Keep your own output short: no long explanations, no repeating the prompt, no reprinting whole files. Report in the format above and stop.
- If a task seems to need something outside the milestone, say so instead of building it.

## Commit rules
- Conventional Commits: `type(scope): imperative summary`, at most 72 characters.
  Types: feat, fix, test, docs, style, refactor, chore, build, perf.
- One logical change per commit. No "WIP", "misc" or "update" commits.
- Add a short body (the why) when the change is not obvious.
- Never commit `.env`, `node_modules`, build output or editor files.
- Never force-push, amend, or rewrite history that has already been pushed.
- Never run destructive commands (`git reset --hard`, `git clean -fd`, discarding changes you did not make) without my explicit permission.
- Before every commit, inspect `git diff --staged` for secrets, `.env` files, build output and generated junk.
- Only create the commits listed in the milestone prompt, in the order given.

## Code style
- Small components, props over global state, `useState`/`useMemo`/`useReducer` only.
- No comments that restate the code. Comment only the reason for a non-obvious decision.
- Risk level is always shown as **text + icon + color**, never color alone.
- Mobile-first, responsive layouts.

## Definition of done (per milestone)
- Acceptance criteria in the prompt are met and checked by running the app or tests.
- Lint, tests and build pass.
- The listed commits exist, with the right messages.
- A short summary of the work and open questions is given.