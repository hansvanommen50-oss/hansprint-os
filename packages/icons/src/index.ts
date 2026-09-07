export interface IconDefinition {
  name: string;
  svg: string;
}

export const icons: Record<string, IconDefinition> = {
  chevronRight: {
    name: "chevronRight",
    svg: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 18l6-6-6-6\"/></svg>"
  }
};

export function getIcon(name: string): IconDefinition | undefined {
  return icons[name];
}
