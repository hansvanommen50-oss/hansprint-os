import "./Button.css";
import type { ButtonProps } from "./types";

export class Button {
  constructor(private props: ButtonProps) {}

  render(): HTMLButtonElement {
    const button = document.createElement("button");

    const variant = this.props.variant ?? "primary";
    const size = this.props.size ?? "md";

    button.className =
      `hds-button hds-button--${variant} hds-button--${size}`;

    button.disabled = this.props.disabled ?? false;

    button.textContent = this.props.loading
      ? "Laden..."
      : this.props.label;

    return button;
  }
}