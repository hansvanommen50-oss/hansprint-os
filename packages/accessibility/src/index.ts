export interface AccessibilityHelpers {
  label?: string;
  description?: string;
}

export function createA11yProps(props: AccessibilityHelpers) {
  const attributes: Record<string, string> = {};

  if (props.label) {
    attributes["aria-label"] = props.label;
  }

  if (props.description) {
    attributes["aria-description"] = props.description;
  }

  return attributes;
}
