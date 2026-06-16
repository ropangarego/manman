import { defineConfig } from '@playwright/test';

const localBaseUrl = 'http://127.0.0.1:4173';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || localBaseUrl;
const previewCommand =
  process.platform === 'win32'
    ? 'npm.cmd run build && npm.cmd run preview -- --host 127.0.0.1 --port 4173'
    : 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: previewCommand,
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
