export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: string;
  iconRight?: string;
}