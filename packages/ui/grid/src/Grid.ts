import "./Grid.css";
import type { GridProps } from "./types";

export class Grid {
  constructor(private props: GridProps = {}) {}

  render(): HTMLElement {
    const el = document.createElement("div");
    el.className = "hds-grid";

    if (this.props.columns) {
      el.style.gridTemplateColumns = `repeat(${this.props.columns}, minmax(0, 1fr))`;
    }

    if (this.props.gap) {
      el.style.gap = this.props.gap;
    }

    return el;
  }
}
