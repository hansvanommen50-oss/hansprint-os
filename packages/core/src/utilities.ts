/**
 * Utility helpers.
 */

export function classNames(
  ...classes: Array<string | false | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}