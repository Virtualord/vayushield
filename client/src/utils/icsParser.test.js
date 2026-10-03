import { describe, expect, it } from 'vitest';
import { parseIcsCalendar } from './icsParser.js';

describe('local ICS parser', () => {
  it('parses event title and ISO times, decodes escaped text, and ignores unrelated properties', () => {
    const ics = [
      'BEGIN:VCALENDAR', 'BEGIN:VEVENT', 'UID:private-uid@example.test',
      'SUMMARY:School\\, morning', 'DTSTART:20261003T071500Z', 'DTEND:20261003T074500Z',
      'LOCATION:Private address', 'DESCRIPTION:Private notes', 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    expect(parseIcsCalendar(ics)).toEqual([{
      id: 'ics-1', title: 'School, morning', startTime: '2026-10-03T07:15:00.000Z', endTime: '2026-10-03T07:45:00.000Z',
    }]);
  });

  it('supports TZID local times, all-day dates, and folded summary lines', () => {
    const ics = [
      'BEGIN:VCALENDAR', 'BEGIN:VEVENT', 'SUMMARY:Long calendar', ' title',
      'DTSTART;TZID=Asia/Kolkata:20261003T090000', 'DTEND;TZID=Asia/Kolkata:20261003T100000', 'END:VEVENT',
      'BEGIN:VEVENT', 'SUMMARY:Day event', 'DTSTART;VALUE=DATE:20261004', 'DTEND;VALUE=DATE:20261005', 'END:VEVENT', 'END:VCALENDAR',
    ].join('\n');
    const events = parseIcsCalendar(ics);
    expect(events[0].title).toBe('Long calendartitle');
    expect(events[0].startTime).toBe('2026-10-03T03:30:00.000Z');
    expect(events[1].title).toBe('Day event');
  });

  it('rejects missing or invalid event times', () => {
    expect(() => parseIcsCalendar('BEGIN:VCALENDAR\nEND:VCALENDAR')).toThrow('No calendar events');
    expect(() => parseIcsCalendar('BEGIN:VEVENT\nSUMMARY:Bad\nEND:VEVENT')).toThrow('needs a start time');
    expect(() => parseIcsCalendar('BEGIN:VEVENT\nDTSTART:bad\nEND:VEVENT')).toThrow('unsupported date or time');
  });
});
