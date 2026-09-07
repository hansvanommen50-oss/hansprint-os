export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
}

export function normalizeNavigation(items: NavigationItem[]): NavigationItem[] {
  return items;
}
