// Stupid simple plurize-ation
export function pluralize(
  subject: string,
  count: number,
  plural = `${subject}s`
): string {
  return count === 1 ? subject : plural;
}
