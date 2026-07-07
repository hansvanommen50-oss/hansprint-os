import type { FlatTokens } from "./flatten";

export function formatCssVariables(tokens: FlatTokens): string {
  const lines = Object.entries(tokens).map(([key, value]) => {
    const cssName = key.replace(/\./g, "-");
    return `  --hds-${cssName}: ${value};`;
  });

  return [
    ":root {",
    ...lines,
    "}"
  ].join("\n");
}