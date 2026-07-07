import type { FlatTokens } from "./flatten";

function formatValue(
  key: string,
  value: string | number
): string {

  if (
    typeof value === "number" &&
    (
      key.startsWith("spacing.") ||
      key.startsWith("radius.") ||
      key.startsWith("breakpoints.")
    )
  ) {
    return `${value}px`;
  }

  return String(value);
}

export function formatCssVariables(
  tokens: FlatTokens
): string {

  const lines = Object.entries(tokens).map(
    ([key, value]) => {

      const cssName = key.replace(/\./g, "-");

      return `  --hds-${cssName}: ${formatValue(key, value)};`;
    }
  );

  return [
    ":root {",
    ...lines,
    "}"
  ].join("\n");
}