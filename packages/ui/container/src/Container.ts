import "./Container.css";
import type { ContainerProps } from "./types";

export class Container {
  constructor(private props: ContainerProps = {}) {}

  render(): HTMLElement {
    const el = document.createElement("div");

    el.className = "hds-container";

    if (this.props.fluid) {
      el.classList.add("hds-container--fluid");
    }

    if (this.props.maxWidth) {
      el.style.maxWidth = this.props.maxWidth;
    }

    return el;
  }
}