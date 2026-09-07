import "./Section.css";
import type { SectionProps } from "./types";

export class Section {
  constructor(private props: SectionProps = {}) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "hds-section";

    if (this.props.tight) {
      el.classList.add("hds-section--tight");
    }

    if (this.props.title) {
      const heading = document.createElement("h2");
      heading.textContent = this.props.title;
      el.appendChild(heading);
    }

    if (this.props.children) {
      this.props.children.forEach((child) => el.appendChild(child));
    }

    return el;
  }
}
