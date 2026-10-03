import demoPresets from '../../../client/src/data/scenarioPresets.json' with { type: 'json' };

const assessmentFields = [
  'zone', 'effectivePM25', 'aqi', 'category', 'score', 'level',
  'hazard', 'exposure', 'vulnerability',
];
const zoneFields = [
  'id', 'name', 'type', 'lat', 'lng', 'population', 'basePM25', 'basePM10',
  'baseWind', 'vulnerability', 'emissionMix', 'facilities', 'dataSource',
];
const scenarioFields = ['windSpeed', 'traffic', 'industry'];
const levels = new Set(['CRITICAL', 'HIGH', 'MODERATE', 'LOW']);
const scenarioLevels = new Set(['low', 'normal', 'high']);
const communityGroups = new Set(['Schools', 'Healthcare', 'Elderly', 'Outdoor workers', 'Industrial workers']);

function hasExactFields(value, fields) {
  return (
    value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field))
  );
}

function isFiniteNumber(value, minimum = -Infinity, maximum = Infinity) {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

function isValidZone(zone) {
  if (!hasExactFields(zone, zoneFields)) return false;
  const strings = ['id', 'name', 'type'];
  const numericFields = ['lat', 'lng', 'population', 'basePM25', 'basePM10', 'baseWind'];
  return (
    strings.every((field) => typeof zone[field] === 'string' && zone[field].length > 0) &&
    numericFields.every((field) => Number.isFinite(zone[field])) &&
    isFiniteNumber(zone.population, 0) &&
    isFiniteNumber(zone.basePM25, 0) && isFiniteNumber(zone.basePM10, 0) &&
    isFiniteNumber(zone.baseWind, 0) &&
    isFiniteNumber(zone.vulnerability, 0, 1) &&
    zone.dataSource === 'illustrative' &&
    hasExactFields(zone.emissionMix, ['traffic', 'industry']) &&
    isFiniteNumber(zone.emissionMix.traffic, 0, 1) &&
    isFiniteNumber(zone.emissionMix.industry, 0, 1) &&
    Math.abs(zone.emissionMix.traffic + zone.emissionMix.industry - 1) < 1e-9 &&
    hasExactFields(zone.facilities, ['schools', 'hospitals']) &&
    Number.isInteger(zone.facilities.schools) && zone.facilities.schools >= 0 &&
    Number.isInteger(zone.facilities.hospitals) && zone.facilities.hospitals >= 0
  );
}

function isValidAssessment(assessment) {
  if (!hasExactFields(assessment, assessmentFields) || !isValidZone(assessment.zone)) return false;
  return (
    isFiniteNumber(assessment.effectivePM25, 0) &&
    isFiniteNumber(assessment.aqi, 0, 500) &&
    typeof assessment.category === 'string' && assessment.category.length > 0 &&
    isFiniteNumber(assessment.score, 0, 100) && levels.has(assessment.level) &&
    isFiniteNumber(assessment.hazard, 0, 1) &&
    isFiniteNumber(assessment.exposure, 0, 1) &&
    isFiniteNumber(assessment.vulnerability, 0, 1)
  );
}

function hasMatchingPreset(scenario, presetId) {
  const match = demoPresets.find(({ scenario: candidate }) =>
    candidate.windSpeed === scenario.windSpeed && candidate.traffic === scenario.traffic && candidate.industry === scenario.industry,
  );
  return presetId === (match?.id ?? 'custom');
}

export function isValidAnalyzeBody(body) {
  if (!hasExactFields(body, ['assessment', 'scenario', 'language', 'audience', 'presetId'])) return false;
  if (!isValidAssessment(body.assessment)) return false;
  if (!hasExactFields(body.scenario, scenarioFields)) return false;
  return (
    (body.scenario.windSpeed === null || isFiniteNumber(body.scenario.windSpeed, 0)) &&
    scenarioLevels.has(body.scenario.traffic) &&
    scenarioLevels.has(body.scenario.industry) &&
    typeof body.presetId === 'string' && hasMatchingPreset(body.scenario, body.presetId) &&
    ['en', 'hi'].includes(body.language) &&
    ['authority', 'resident'].includes(body.audience)
  );
}

export function isValidPlanBody(body) {
  if (!hasExactFields(body, ['rankedZones', 'scenario', 'language', 'audience', 'presetId'])) return false;
  if (!Array.isArray(body.rankedZones) || body.rankedZones.length !== 3 || !body.rankedZones.every(isValidAssessment)) return false;
  if (body.rankedZones[0].score < body.rankedZones[1].score || body.rankedZones[1].score < body.rankedZones[2].score) return false;
  if (!hasExactFields(body.scenario, scenarioFields)) return false;
  return (
    (body.scenario.windSpeed === null || isFiniteNumber(body.scenario.windSpeed, 0)) &&
    scenarioLevels.has(body.scenario.traffic) && scenarioLevels.has(body.scenario.industry) &&
    typeof body.presetId === 'string' && hasMatchingPreset(body.scenario, body.presetId) &&
    ['en', 'hi'].includes(body.language) && ['authority', 'resident'].includes(body.audience)
  );
}

export function isValidPlanResult(result, rankedZones) {
  if (!hasExactFields(result, ['priorityActions', 'monitoringPlan', 'advisoryMessage', 'caveat'])) return false;
  const zoneIds = new Set(rankedZones.map(({ zone }) => zone.id));
  return (
    Array.isArray(result.priorityActions) && result.priorityActions.length > 0 &&
    result.priorityActions.every((item) => hasExactFields(item, ['group', 'zoneId', 'action']) &&
      communityGroups.has(item.group) && zoneIds.has(item.zoneId) && typeof item.action === 'string' && item.action.trim().length > 0) &&
    Array.isArray(result.monitoringPlan) && result.monitoringPlan.length > 0 &&
    result.monitoringPlan.every((item) => typeof item === 'string' && item.trim().length > 0) &&
    typeof result.advisoryMessage === 'string' && result.advisoryMessage.trim().length > 0 &&
    typeof result.caveat === 'string' && result.caveat.trim().length > 0
  );
}
