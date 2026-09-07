import type { TemplateVariables } from "./types.js";

function toCamel(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function toKebab(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function createVariables(
  component: string
): TemplateVariables {

  const kebab = toKebab(component);

  return {
    Component: component,
    camel: toCamel(component),
    kebab,
    package: `@hansprint/ui-${kebab}`,
    year: new Date().getFullYear().toString()
  };

}