import "./Flex.css";
import type { FlexProps } from "./types";

export class Flex {
  constructor(private props: FlexProps = {}) {}

  render(): HTMLElement {
    const element = document.createElement("div");
    element.className = "hds-flex";

    if (this.props.direction === "column") {
      element.classList.add("hds-flex--column");
    } else {
      element.classList.add("hds-flex--row");
    }

    if (this.props.center) {
      element.classList.add("hds-flex--center");
    }

    return element;
  }
}
