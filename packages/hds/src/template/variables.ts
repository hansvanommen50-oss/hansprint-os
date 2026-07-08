export interface TemplateVariables {
  Component: string;
  Pascal: string;
  camel: string;
  kebab: string;
}

export function createVariables(name: string): TemplateVariables {
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);

  return {
    Component: pascal,
    Pascal: pascal,
    camel: pascal.charAt(0).toLowerCase() + pascal.slice(1),
    kebab: pascal
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
  };
}