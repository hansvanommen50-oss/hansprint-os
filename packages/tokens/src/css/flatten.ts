export type FlatTokens = Record<string, string | number>;

export function flattenTokens(
  input: Record<string, unknown>,
  prefix = ""
): FlatTokens {
  const result: FlatTokens = {};

  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      Object.assign(
        result,
        flattenTokens(value as Record<string, unknown>, path)
      );
    } else if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      result[path] = value;
    }
  }

  return result;
}