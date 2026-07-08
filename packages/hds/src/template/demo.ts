import {
  createVariables,
  renderTemplate
} from "./index.js";

const vars = createVariables("Button");

const template = `export class {{Component}} {}`;

console.log(
  renderTemplate(template, vars)
);