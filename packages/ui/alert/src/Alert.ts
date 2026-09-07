import "./Alert.css";
import type { AlertProps } from "./types";

export class Alert {
  constructor(private props: AlertProps = {}) {}

  render(): HTMLElement {
    const element = document.createElement("div");
    element.className = "hds-alert";
    element.textContent = this.props.message ?? "";
    return element;
  }
}
