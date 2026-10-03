import { Type } from '@google/genai';

const actionSchema = {
  type: Type.OBJECT,
  properties: {
    group: { type: Type.STRING, enum: ['Schools', 'Healthcare', 'Elderly', 'Outdoor workers', 'Industrial workers'] },
    zoneId: { type: Type.STRING },
    action: { type: Type.STRING },
  },
  required: ['group', 'zoneId', 'action'],
  propertyOrdering: ['group', 'zoneId', 'action'],
};

export const planResponseSchema = {
  type: Type.OBJECT,
  properties: {
    priorityActions: { type: Type.ARRAY, items: actionSchema },
    monitoringPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
    advisoryMessage: { type: Type.STRING },
    caveat: { type: Type.STRING },
  },
  required: ['priorityActions', 'monitoringPlan', 'advisoryMessage', 'caveat'],
  propertyOrdering: ['priorityActions', 'monitoringPlan', 'advisoryMessage', 'caveat'],
};
