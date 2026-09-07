import type { ButtonVariant } from "./types.js";

export function variantClass(variant: ButtonVariant = "primary"): string {
  return `hds-button hds-button--${variant}`;
}