import { variantClass } from "./variants.js";
import { renderIcon } from "./icons.js";
import type { ButtonProps } from "./types.js";

export class Button {
  render(props: ButtonProps): string {
    const variant = props.variant ?? "primary";

    const label = props.loading ? "Loading..." : props.label;

    return `
<button
  class="${variantClass(variant)}"
  ${props.disabled ? "disabled" : ""}
  style="
    --hds-color-primary:var(--hds-colors-primary);
  "
>
  ${renderIcon(props.iconLeft)}
  <span>${label}</span>
  ${renderIcon(props.iconRight)}
</button>
`;
  }
}