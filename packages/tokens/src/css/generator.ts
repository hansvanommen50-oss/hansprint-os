import { flattenTokens } from "./flatten";
import { formatCssVariables } from "./format";
import { defaultTheme } from "../defaultTheme";

export function generateCssVariables(): string {
  return formatCssVariables(
    flattenTokens(defaultTheme)
  );
}