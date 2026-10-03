import dotenv from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { rankZones } from '../client/src/utils/riskEngine.js';
import zones from '../client/src/data/zones.json' with { type: 'json' };
import presets from '../client/src/data/scenarioPresets.json' with { type: 'json' };
import { buildExplanationPrompt } from '../server/src/services/prompt.js';
import { buildPlanPrompt } from '../server/src/services/planPrompt.js';
import { generateActionPlan, generateExplanation } from '../server/src/services/gemini.js';
import { demoCacheKey } from '../server/src/services/demoCacheKey.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(currentDirectory, '../server/data/demoCache.json');

export async function buildCacheEntries({ generateExplain, generatePlan }) {
  const entries = {};
  for (const preset of presets) {
    const rankedZones = rankZones(zones, preset.scenario);
    const topThree = rankedZones.slice(0, 3);
    for (const language of ['en', 'hi']) {
      for (const audience of ['authority', 'resident']) {
        const explain = await generateExplain(buildExplanationPrompt({
          assessment: rankedZones[0], scenario: preset.scenario, language, audience,
        }));
        entries[demoCacheKey(preset.id, language, audience, 'explain')] = {
          presetId: preset.id, language, audience, mode: 'explain', result: explain,
        };

        const plan = await generatePlan(buildPlanPrompt({
          rankedZones: topThree, scenario: preset.scenario, language, audience,
        }), topThree);
        entries[demoCacheKey(preset.id, language, audience, 'plan')] = {
          presetId: preset.id, language, audience, mode: 'plan', result: plan,
        };
      }
    }
  }
  return entries;
}

export async function generateDemoCache() {
  dotenv.config({ path: path.resolve(currentDirectory, '../.env') });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY must be set in the root .env file.');

  const entries = await buildCacheEntries({
    generateExplain: generateExplanation,
    generatePlan: (prompt, topZones) => generateActionPlan(prompt, topZones),
  });

  if (JSON.stringify(entries).includes(apiKey)) throw new Error('Generated cache content included credential material. Output was not written.');
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({ version: 1, entries }, null, 2)}\n`);
  return Object.keys(entries).length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  generateDemoCache()
    .then((entryCount) => process.stdout.write(`Wrote ${entryCount} demo cache entries to server/data/demoCache.json.\n`))
    .catch(() => {
      process.stderr.write('Demo cache generation failed. Check that GEMINI_API_KEY is set and Gemini is reachable.\n');
      process.exitCode = 1;
    });
}
