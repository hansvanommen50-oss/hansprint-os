import { tokens } from "../../core/src/tokens";
import { variantClass } from "./variants";
import { renderIcon } from "./icons";
import type { ButtonProps } from "./types";

export class Button {
  render(props: ButtonProps): string {
    const variant = props.variant ?? "primary";

    const label = props.loading ? "Loading..." : props.label;

    return `
<button
  class="${variantClass(variant)}"
  ${props.disabled ? "disabled" : ""}
  style="
    --hds-color-primary:${tokens.colors.primary};
  "
>
  ${renderIcon(props.iconLeft)}
  <span>${label}</span>
  ${renderIcon(props.iconRight)}
</button>
`;
  }
}