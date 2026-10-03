import { Type } from '@google/genai';

export const planDayResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    dayPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          eventId: { type: Type.STRING },
          tipIds: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['eventId', 'tipIds'],
        propertyOrdering: ['eventId', 'tipIds'],
      },
    },
    caveat: { type: Type.STRING },
  },
  required: ['summary', 'dayPlan', 'caveat'],
  propertyOrdering: ['summary', 'dayPlan', 'caveat'],
};
