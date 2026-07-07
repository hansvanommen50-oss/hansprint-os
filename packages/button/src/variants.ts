import type { ButtonVariant } from "./types";

export function variantClass(variant: ButtonVariant = "primary"): string {
  return `hds-button hds-button--${variant}`;
}