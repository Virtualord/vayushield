import { Type } from '@google/genai';

export const explainResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
    communityActions: { type: Type.ARRAY, items: { type: Type.STRING } },
    advisoryMessage: { type: Type.STRING },
    caveat: { type: Type.STRING },
  },
  required: ['summary', 'riskFactors', 'communityActions', 'advisoryMessage', 'caveat'],
  propertyOrdering: ['summary', 'riskFactors', 'communityActions', 'advisoryMessage', 'caveat'],
};

const expectedFields = Object.keys(explainResponseSchema.properties);

export function isValidExplainResult(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (Object.keys(value).length !== expectedFields.length) return false;
  if (!expectedFields.every((field) => Object.hasOwn(value, field))) return false;
  if (!expectedFields.every((field) => typeof value[field] === 'string' || Array.isArray(value[field]))) {
    return false;
  }
  return (
    typeof value.summary === 'string' &&
    Array.isArray(value.riskFactors) && value.riskFactors.every((item) => typeof item === 'string') &&
    Array.isArray(value.communityActions) && value.communityActions.every((item) => typeof item === 'string') &&
    typeof value.advisoryMessage === 'string' &&
    typeof value.caveat === 'string'
  );
}
