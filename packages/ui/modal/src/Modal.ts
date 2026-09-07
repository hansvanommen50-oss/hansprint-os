import "./Modal.css";
import type { ModalProps } from "./types";

export class Modal {
  constructor(private props: ModalProps = {}) {}

  render(): HTMLElement {
    const element = document.createElement("div");
    element.className = "hds-modal";
    element.textContent = this.props.title ?? "";
    return element;
  }
}
