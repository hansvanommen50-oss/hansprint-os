export function entries<T extends object>(
  object: T
) {
  return Object.entries(object) as [
    keyof T,
    T[keyof T]
  ][];
}

export function keys<T extends object>(
  object: T
) {
  return Object.keys(object) as (keyof T)[];
}