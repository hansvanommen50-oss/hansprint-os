import { tokens } from "../../core/src/tokens";
import { variantClass } from "./variants";
import { renderIcon } from "./icons";
export class Button {
    render(props) {
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
//# sourceMappingURL=button.js.map