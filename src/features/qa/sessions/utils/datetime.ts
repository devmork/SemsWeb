/**
 * `datetime-local` inputs hold a *local wall-clock* string with no offset, while
 * `EvaluationSession.OpensAtUtc` / `ClosesAtUtc` are UTC instants. Without an
 * explicit conversion the browser's local time is stored verbatim and read as
 * UTC — an eight-hour error on a UTC+8 machine.
 */

/** Local `datetime-local` value -> UTC ISO string. Empty/invalid -> null. */
export function localInputToUtcIso(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  // `new Date("YYYY-MM-DDTHH:mm")` is parsed in the browser's local zone.
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/** UTC ISO string -> local `datetime-local` value. Empty/invalid -> "". */
export function utcIsoToLocalInput(value: string | null): string {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  // Shift by the zone offset so toISOString() renders the local wall clock.
  const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
