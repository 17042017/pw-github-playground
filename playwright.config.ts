import { defineConfig, devices } from '@playwright/test';
import { config as appConfig } from './utils/config';

/**
 * Central Playwright configuration.
 *
 * Reporting stack:
 *  - list           : console output during the run
 *  - html           : interactive Playwright HTML report  -> reports/html
 *  - allure-playwright: rich Allure results               -> reports/allure-results
 *
 * Diagnostics on failure: trace, screenshot and video are all retained on
 * failure so they can be replayed in the Trace Viewer and attached to Allure.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests within a file in parallel. */
  fullyParallel: true,
  /* Fail the build on CI if test.only is committed. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only (also drives trace: 'on-first-retry' style debugging). */
  retries: process.env.CI ? 2 : 0,
  /* Limit workers on CI for stability. */
  workers: process.env.CI ? 1 : undefined,
  /* Global assertion / action timeouts. */
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          framework: 'Playwright + TypeScript',
          ui_base_url: appConfig.uiBaseUrl,
          node: process.version,
        },
      },
    ],
  ],

  /* Shared settings for all projects. */
  use: {
    baseURL: appConfig.uiBaseUrl,
    /* Diagnostics — see README "Debugging with traces". */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  /* Where Playwright writes per-test artifacts (traces, videos, screenshots). */
  outputDir: 'reports/test-results',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /*
     * Cross-browser coverage is defined but disabled by default to keep local
     * runs fast (chromium-only). Uncomment to run on Firefox / WebKit, e.g. in CI:
     *   npx playwright test --project=firefox
     */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
