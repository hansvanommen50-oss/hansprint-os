export function capitalize(
  value: string
): string {
  if (!value.length) {
    return value;
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export function kebabCase(
  value: string
): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function camelCase(
  value: string
): string {
  const kebab = kebabCase(value);

  return kebab.replace(
    /-([a-z])/g,
    (_, c: string) => c.toUpperCase()
  );
}

export function pascalCase(
  value: string
): string {
  const camel = camelCase(value);

  return (
    camel.charAt(0).toUpperCase() +
    camel.slice(1)
  );
}