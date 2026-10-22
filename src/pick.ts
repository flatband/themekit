/**
 * Decide which theme a page load should start on, or null to leave whatever
 * next-themes restored from storage alone.
 *
 * In order: an explicit ?theme= override, then — only with reroll "daily" —
 * the theme already picked today, or a fresh random pick on a new day.
 *
 * Pure and testable: the caller supplies today's date and does the actual
 * storage reads and writes.
 */
export function pickInitialTheme(
  themes: readonly string[],
  {
    asked,
    stored,
    storedDay,
    day,
    reroll,
  }: {
    asked: string | null;
    stored: string | null;
    storedDay: string | null;
    day: string;
    reroll?: "daily";
  },
): string | null {
  if (asked !== null && themes.includes(asked)) return asked;
  if (reroll !== "daily") return null;
  if (storedDay === day && stored !== null && themes.includes(stored)) return null;
  return themes[Math.floor(Math.random() * themes.length)];
}

/** Day-stamp, YYYY-MM-DD in UTC, for the "picked today" check. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
