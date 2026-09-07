export interface MotionTokens {
  durations: Record<string, string>;
  easings: Record<string, string>;
}

export const motion: MotionTokens = {
  durations: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms"
  },
  easings: {
    standard: "ease",
    decelerate: "ease-out"
  }
};
