import type { ThemeOverrides } from "./index";
import { createTheme } from "./index";

export function createThemeFromTokens(
  overrides: ThemeOverrides = {}
): ReturnType<typeof createTheme> {
  return createTheme(overrides);
}

export default createThemeFromTokens;
