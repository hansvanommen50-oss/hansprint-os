import { loadTemplate } from "./loader.js";
import { renderTemplate } from "./renderer.js";
import type { TemplateVariables } from "./types.js";

export function renderTemplateFile(
  file: string,
  variables: TemplateVariables
): string {

  return renderTemplate({

    template: loadTemplate(file),

    variables

  });

}