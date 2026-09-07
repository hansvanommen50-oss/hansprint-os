import type { CardProps } from "./types";

if (typeof window !== "undefined" && typeof document !== "undefined") {
  await import("./Card.css");
}

export class Card {
  constructor(private props: CardProps = {}) {}

  render(): HTMLElement {
    const el = document.createElement("article");

    el.className = "hds-card";

    if (this.props.elevated) {
      el.classList.add("hds-card--elevated");
    }

    el.innerHTML = `
      ${this.props.title ? `<h3>${this.props.title}</h3>` : ""}
      ${this.props.content ? `<p>${this.props.content}</p>` : ""}
    `;

    return el;
  }
}