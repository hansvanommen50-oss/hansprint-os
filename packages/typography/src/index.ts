export interface TypographyTokens {
  fontFamily: string;
  fontSize: Record<string, number>;
  fontWeight: Record<string, number>;
}

export const typography: TypographyTokens = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700
  }
};
