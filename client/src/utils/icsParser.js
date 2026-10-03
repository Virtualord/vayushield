function unfoldLines(icsText) {
  return icsText.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
}

function parseProperty(line) {
  const separator = line.indexOf(':');
  if (separator < 0) return null;
  const [name, ...parameters] = line.slice(0, separator).split(';');
  const params = Object.fromEntries(parameters.map((parameter) => {
    const [key, value = ''] = parameter.split('=');
    return [key.toUpperCase(), value.replace(/^"|"$/g, '')];
  }));
  return { name: name.toUpperCase(), params, value: line.slice(separator + 1) };
}

function localPartsToIso(year, month, day, hour, minute, second, timeZone) {
  if (!timeZone) return new Date(year, month - 1, day, hour, minute, second).toISOString();
  const desired = Date.UTC(year, month - 1, day, hour, minute, second);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  let guess = desired;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(guess)).map(({ type, value }) => [type, value]));
    const rendered = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
    guess += desired - rendered;
  }
  return new Date(guess).toISOString();
}

function parseIcsDate(value, params) {
  if (/^\d{8}$/.test(value)) {
    return localPartsToIso(Number(value.slice(0, 4)), Number(value.slice(4, 6)), Number(value.slice(6, 8)), 0, 0, 0, params.TZID);
  }
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/i);
  if (!match) throw new Error('Calendar event has an unsupported date or time.');
  const [, year, month, day, hour, minute, second = '00', utc] = match;
  if (utc) return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))).toISOString();
  return localPartsToIso(Number(year), Number(month), Number(day), Number(hour), Number(minute), Number(second), params.TZID);
}

function decodeText(value) {
  return value.replace(/\\[nN]/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

export function parseIcsCalendar(icsText) {
  if (typeof icsText !== 'string' || !icsText.trim()) throw new Error('Paste or choose a non-empty .ics calendar file.');
  const events = [];
  let current = null;
  for (const line of unfoldLines(icsText)) {
    if (line === 'BEGIN:VEVENT') {
      if (current) throw new Error('The calendar contains nested events.');
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (!current) continue;
      if (!current.startTime) throw new Error('Each event needs a start time.');
      const startTime = current.startTime;
      const endTime = current.endTime ?? new Date(Date.parse(startTime) + 30 * 60_000).toISOString();
      if (Date.parse(endTime) <= Date.parse(startTime)) throw new Error('Each event end time must follow its start time.');
      events.push({ id: `ics-${events.length + 1}`, title: current.title || 'Calendar event', startTime, endTime });
      current = null;
      if (events.length > 50) throw new Error('Import up to 50 calendar events at a time.');
      continue;
    }
    if (!current) continue;
    const property = parseProperty(line);
    if (!property) continue;
    if (property.name === 'SUMMARY') current.title = decodeText(property.value);
    if (property.name === 'DTSTART') current.startTime = parseIcsDate(property.value, property.params);
    if (property.name === 'DTEND') current.endTime = parseIcsDate(property.value, property.params);
  }
  if (current) throw new Error('The calendar has an unfinished event.');
  if (!events.length) throw new Error('No calendar events were found.');
  return events.sort((left, right) => Date.parse(left.startTime) - Date.parse(right.startTime));
}
