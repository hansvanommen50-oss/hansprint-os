import "./Stack.css";
import type { StackProps } from "./types";

export class Stack {
  constructor(private props: StackProps = {}) {}

  render(): HTMLElement {
    const el = document.createElement("div");

    el.className = "hds-stack";

    if (this.props.gap) {
      el.style.gap = this.props.gap;
    }

    return el;
  }
}