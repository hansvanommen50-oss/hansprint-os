/**
 * Hansprint OS
 * Base interface for every UI component.
 */

export interface HDSComponent<Props = unknown> {
  name: string;
  version: string;
  render(props: Props): string;
}