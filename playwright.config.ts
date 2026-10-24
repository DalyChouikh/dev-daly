import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3100",
    ...devices["Desktop Chrome"],
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
  },
  webServer: {
    command: "bun run start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    env: {
      ADMIN_PASSWORD: "portfolio-browser-test-password",
      GITHUB_TOKEN: "browser-tests-disable-real-github-access",
      GITHUB_REPO_OWNER: "test-owner",
      GITHUB_REPO_NAME: "test-repo",
    },
  },
});
