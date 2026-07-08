import type { TemplateVariables } from "./variables.js";

export function renderTemplate(
  template: string,
  vars: TemplateVariables
): string {

  let output = template;

  for (const [key, value] of Object.entries(vars)) {
    output = output.replaceAll(
      `{{${key}}}`,
      value
    );
  }

  return output;
}