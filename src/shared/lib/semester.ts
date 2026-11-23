/**
 * Semester vocabulary for DMC.
 *
 * The API stores a period as `Term` (1 | 2) on sessions, subject offerings,
 * enrollments and student profiles; the school year has exactly two semesters.
 * Keep the labels here so QA management, the profile page and the student
 * evaluation surfaces all read the same way.
 */
export const SEMESTERS: { value: number; label: string }[] = [
  { value: 1, label: "1st Semester" },
  { value: 2, label: "2nd Semester" },
];

/**
 * Human label for a stored `Term` value. `null`/`undefined` renders an em dash;
 * unexpected values fall back to "Semester N" rather than silently mislabelling.
 */
export function semesterLabel(term: number | null | undefined): string {
  if (term == null) return "—";
  return SEMESTERS.find((s) => s.value === term)?.label ?? `Semester ${term}`;
}
