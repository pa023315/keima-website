import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx serve out -l 4173",
    url: "http://127.0.0.1:4173/zh-TW/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "desktop-webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
