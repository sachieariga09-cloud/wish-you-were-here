/** Current civil UTC offset in hours for an IANA zone (handles DST via Intl). */
export function getUtcOffsetHoursForTimezone(timeZone: string, date = new Date()): number {
  for (const timeZoneName of ['longOffset', 'shortOffset'] as const) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName,
      }).formatToParts(date);
      const raw = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
      const m = raw.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/i);
      if (m) {
        const sign = m[1] === '-' ? -1 : 1;
        const h = parseInt(m[2], 10);
        const min = m[3] ? parseInt(m[3], 10) : 0;
        return sign * (h + min / 60);
      }
    } catch {
      /* try next */
    }
  }
  return 0;
}
