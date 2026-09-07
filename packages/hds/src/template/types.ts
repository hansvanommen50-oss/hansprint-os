export interface TemplateVariables {
  Component: string;
  camel: string;
  kebab: string;
  package: string;
  year: string;
}

export interface RenderOptions<T extends object = TemplateVariables> {
  template: string;
  variables: T;
}