import "./Text.css";
import type { TextProps } from "./types";

export class Text {
  constructor(private props: TextProps = {}) {}

  render(): HTMLElement {
    const el = document.createElement("p");
    el.className = "hds-text";

    if (this.props.muted) {
      el.classList.add("hds-text--muted");
    }

    if (this.props.content) {
      el.textContent = this.props.content;
    }

    return el;
  }
}
