import "./Badge.css";
import type { BadgeProps } from "./types";

export class Badge {
  constructor(private props: BadgeProps = {}) {}

  render(): HTMLElement {
    const element = document.createElement("span");
    element.className = "hds-badge";
    element.textContent = this.props.label ?? "";
    return element;
  }
}
