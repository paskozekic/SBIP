import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    pool: "forks",
    env: {
      DATABASE_URL: "postgresql://spib:spib_dev_promijeni_me@127.0.0.1:65432/spib_test_only",
    },
  },
});
