import "../../../packages/tokens/src/css/tokens.css";
import "./style.css";
import { PlaygroundApp } from "./playgroundApp";

const root = document.querySelector("#app");

if (!(root instanceof HTMLElement)) {
  throw new Error("Playground root container not found");
}

const app = new PlaygroundApp(root);
app.mount();
