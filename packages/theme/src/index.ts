import { TokenRegistry } from "./tokenRegistry";

export type ThemeMode = "light" | "dark" | string;

type Primitive = string | number | boolean | null | undefined;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Primitive
    ? T[K]
    : T[K] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : DeepPartial<T[K]>;
};

export type TokenTheme = ReturnType<typeof TokenRegistry.get>;

export type Theme = TokenTheme & {
  mode?: ThemeMode;
};

export type ThemeOverrides = DeepPartial<TokenTheme> & {
  mode?: ThemeMode;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const result: Record<string, unknown> = { ...(target as Record<string, unknown>) };

  for (const key of Object.keys(source as Record<string, unknown>)) {
    const sourceValue = (source as Record<string, unknown>)[key];
    const targetValue = result[key];

    if (isObject(targetValue) && isObject(sourceValue)) {
      result[key] = deepMerge(
        targetValue,
        sourceValue as DeepPartial<typeof targetValue>
      );
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }

  return result as T;
}

export const theme: Theme = createTheme();

export function createTheme(overrides: ThemeOverrides = {}): Theme {
  const { mode, ...tokenOverrides } = overrides;
  const mergedTokens = deepMerge(
    TokenRegistry.get(),
    tokenOverrides as DeepPartial<TokenTheme>
  );

  if (mode !== undefined) {
    return {
      ...mergedTokens,
      mode
    };
  }

  return mergedTokens;
}

export * from "./runtime";
export * from "./bridge";
export * from "./tokenRegistry";
