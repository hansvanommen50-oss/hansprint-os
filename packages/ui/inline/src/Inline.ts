import "./Inline.css";
import type { InlineProps } from "./types";

export class Inline {
  constructor(private props: InlineProps = {}) {}

  render(): HTMLElement {
    const element = document.createElement("div");
    element.className = "hds-inline";

    if (this.props.gap) {
      element.style.gap = this.props.gap;
    }

    return element;
  }
}
