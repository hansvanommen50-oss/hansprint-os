export interface TemplateVariables {
  [key: string]: string;
}

export interface RenderOptions {
  template: string;
  variables: TemplateVariables;
}