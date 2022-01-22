// Stupid simple plurize-ation
export function pluralize(
  subject: string,
  count: number,
  plural = `${subject}s`
): string {
  return count === 1 ? subject : plural;
}

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
