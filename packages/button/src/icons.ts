export function renderIcon(name?: string): string {
  if (!name) return "";

  return `<span class="hds-button__icon" aria-hidden="true">${name}</span>`;
}