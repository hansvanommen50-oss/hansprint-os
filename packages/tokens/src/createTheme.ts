import { theme as baseTheme } from "./theme";
import { deepMerge } from "./deepMerge";
import type { DeepPartial } from "./types";

export type Theme = typeof baseTheme;

export function createTheme(
  overrides: DeepPartial<Theme> = {}
): Theme {
  return deepMerge(
    baseTheme as Record<string, unknown>,
    overrides as Record<string, unknown>
  ) as Theme;
}