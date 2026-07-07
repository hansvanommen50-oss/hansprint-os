import { Button } from "@hansprint/core";
const button = new Button();

document.querySelector("#app")!.innerHTML = `
<h1>Hansprint OS</h1>

${button.render({
  label: "Offerte aanvragen"
})}

<br><br>

${button.render({
  label: "Meer informatie",
  variant: "secondary"
})}

<br><br>

${button.render({
  label: "Opslaan",
  loading: true
})}

<br><br>

${button.render({
  label: "Verwijderen",
  disabled: true
})}
`;