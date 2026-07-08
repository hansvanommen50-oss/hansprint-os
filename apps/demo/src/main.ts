import "../../../packages/tokens/src/css/tokens.css";
import { Button } from "@hansprint/ui-button";
import { Input } from "@hansprint/ui-input";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App container not found");
}

app.innerHTML = "<h1>Hansprint OS</h1>";

const buttons = [
  new Button({ label: "Primary" }),
  new Button({ label: "Secondary", variant: "secondary" }),
  new Button({ label: "Outline", variant: "outline" }),
  new Button({ label: "Loading", loading: true }),
  new Button({ label: "Disabled", disabled: true })
];

buttons.forEach(button => {
  app.appendChild(button.render());
});
const card = new Card({
  title: "Hansprint OS",
  content: "Card component werkt.",
  elevated: true
});

app.appendChild(card.render());
const input = new Input({
  placeholder: "Uw e-mailadres"
});

app.appendChild(input.render());