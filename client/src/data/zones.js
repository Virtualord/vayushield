import zones from './zones.json';

export function validateZone(zone) {
  if (!zone || typeof zone !== 'object') return false;

  const numericFields = [
    'lat',
    'lng',
    'population',
    'basePM25',
    'basePM10',
    'baseWind',
    'vulnerability',
  ];
  const validNumbers = numericFields.every(
    (field) => Number.isFinite(zone[field]),
  );
  const validMix =
    zone.emissionMix &&
    Number.isFinite(zone.emissionMix.traffic) &&
    Number.isFinite(zone.emissionMix.industry) &&
    Math.abs(zone.emissionMix.traffic + zone.emissionMix.industry - 1) < 1e-9;
  const validFacilities =
    zone.facilities &&
    Number.isInteger(zone.facilities.schools) &&
    zone.facilities.schools >= 0 &&
    Number.isInteger(zone.facilities.hospitals) &&
    zone.facilities.hospitals >= 0;

  return (
    typeof zone.id === 'string' &&
    zone.id.length > 0 &&
    typeof zone.name === 'string' &&
    zone.name.length > 0 &&
    typeof zone.type === 'string' &&
    validNumbers &&
    zone.population >= 0 &&
    zone.basePM25 >= 0 &&
    zone.basePM10 >= 0 &&
    zone.baseWind >= 0 &&
    zone.vulnerability >= 0 &&
    zone.vulnerability <= 1 &&
    validMix &&
    zone.emissionMix.traffic >= 0 &&
    zone.emissionMix.traffic <= 1 &&
    zone.emissionMix.industry >= 0 &&
    zone.emissionMix.industry <= 1 &&
    validFacilities &&
    zone.dataSource === 'illustrative'
  );
}

export { zones };
