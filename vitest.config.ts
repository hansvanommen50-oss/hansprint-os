import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["packages/**/test/**/*.test.ts", "apps/**/test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "lcov"],
      include: [
        "packages/theme/src/index.ts",
        "packages/theme/src/tokenRegistry.ts",
        "packages/theme/src/bridge.ts",
        "packages/theme/src/runtime.ts",
        "packages/hds/src/AppShell.ts"
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  }
});
