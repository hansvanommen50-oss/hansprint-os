import type {
  RenderOptions
} from "./types.js";

export function renderTemplate(
  options: RenderOptions
): string {

  let output = options.template;

  for (const [key, value] of Object.entries(options.variables)) {
    output = output.replaceAll(
      `{{${key}}}`,
      value
    );
  }

  return output;
}