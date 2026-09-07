import "./Hero.css";
import type { HeroProps } from "./types";

export class Hero {
  constructor(private props: HeroProps = {}) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "hds-hero";

    if (this.props.compact) {
      el.classList.add("hds-hero--compact");
    }

    if (this.props.title) {
      const heading = document.createElement("h1");
      heading.textContent = this.props.title;
      el.appendChild(heading);
    }

    if (this.props.subtitle) {
      const text = document.createElement("p");
      text.textContent = this.props.subtitle;
      el.appendChild(text);
    }

    return el;
  }
}
