export function createVariables(
  component: string
) {

  const kebab = component
    .replace(/[A-Z]/g, m => "-" + m.toLowerCase())
    .replace(/^-/, "");

  return {

    Component: component,

    kebab,

    package: `@hansprint/ui-${kebab}`

  };
}