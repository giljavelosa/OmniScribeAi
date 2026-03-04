import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "./tests/integration/api-error-envelope.test.ts",
      "./tests/unit/middleware-security.test.ts",
      "./tests/unit/billing-entitlements.test.ts",
      "./tests/unit/billing-route-enforcement.test.ts",
      "./tests/unit/visit-finalization-guards.test.ts",
      "./tests/unit/style-learning-lib.test.ts",
      "./tests/unit/style-learning-routes.test.ts",
    ],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

