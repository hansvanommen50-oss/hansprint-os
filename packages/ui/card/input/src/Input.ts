import "./Input.css";
import type { InputProps } from "./types";

export class Input {
  constructor(private props: InputProps = {}) {}

  render(): HTMLInputElement {
    const input = document.createElement("input");

    input.className = "hds-input";

    input.type = this.props.type ?? "text";
    input.placeholder = this.props.placeholder ?? "";
    input.value = this.props.value ?? "";
    input.disabled = this.props.disabled ?? false;

    return input;
  }
}