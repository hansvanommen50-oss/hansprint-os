export function compact<T>(
  values: Array<T | null | undefined>
): T[] {
  return values.filter(
    (value): value is T =>
      value !== null &&
      value !== undefined
  );
}

export function unique<T>(
  values: T[]
): T[] {
  return [...new Set(values)];
}