import { describe, expect, it } from 'vitest';
import { buildExplanationPrompt, PROMPT_RULES } from './prompt.js';

const promptInput = {
  assessment: {
    zone: { id: 'demo', name: 'Demo zone', population: 1200 },
    score: 45,
    level: 'MODERATE',
    effectivePM25: 31,
    aqi: 52,
    category: 'Satisfactory',
    hazard: 0.2,
    exposure: 0.02,
    vulnerability: 0.4,
  },
  scenario: { windSpeed: null, traffic: 'normal', industry: 'normal' },
  language: 'hi',
  audience: 'resident',
};

describe('explanation prompt builder', () => {
  it('includes the requested language, audience, supplied values, and guardrail rules', () => {
    const prompt = buildExplanationPrompt(promptInput);

    expect(prompt).toContain('Hindi (hi)');
    expect(prompt).toContain('Audience: resident');
    expect(prompt).toContain('"score": 45');
    expect(prompt).toContain('"windSpeed": null');
    for (const rule of PROMPT_RULES) expect(prompt).toContain(rule);
  });

  it('uses English and authority labels when requested', () => {
    const prompt = buildExplanationPrompt({ ...promptInput, language: 'en', audience: 'authority' });
    expect(prompt).toContain('English (en)');
    expect(prompt).toContain('Audience: authority');
  });
});
