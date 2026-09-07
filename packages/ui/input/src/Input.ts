import type { InputProps } from "./types";

if (typeof window !== "undefined" && typeof document !== "undefined") {
  await import("./Input.css");
}

export class Input {
  constructor(private props: InputProps = {}) {}

  render(): HTMLInputElement {
    const input = document.createElement("input");

    input.className = "hds-input";

    input.type = this.props.type ?? "text";
    input.placeholder = this.props.placeholder ?? "";
    input.value = this.props.value ?? "";
    input.disabled = this.props.disabled ?? false;

    if (this.props.label) {
      input.setAttribute("aria-label", this.props.label);
    }

    return input;
  }
}