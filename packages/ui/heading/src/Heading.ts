import "./Heading.css";
import type { HeadingProps } from "./types";

export class Heading {
  constructor(private props: HeadingProps = {}) {}

  render(): HTMLElement {
    const level = this.props.level ?? 2;
    const el = document.createElement(`h${level}`);
    el.className = "hds-heading";

    if (level === 2) {
      el.classList.add("hds-heading--h2");
    } else if (level === 3) {
      el.classList.add("hds-heading--h3");
    }

    if (this.props.text) {
      el.textContent = this.props.text;
    }

    return el;
  }
}
