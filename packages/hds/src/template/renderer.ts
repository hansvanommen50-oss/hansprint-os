import type { RenderOptions } from "./types.js";

export function renderTemplate<T extends object>(
  options: RenderOptions<T>
): string {

  let output = options.template;

  for (const [key, value] of Object.entries(options.variables)) {

    output = output.replaceAll(
      `{{${key}}}`,
      String(value)
    );

  }

  return output;

}