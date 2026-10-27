import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  fullyParallel: true,
  forbidOnly: isCI,              // fail CI if someone leaves a test.only in
  retries: isCI ? 2 : 0,         // public demo sites can be flaky
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [['html', { open: 'never' }], ['github']]
    : [['list'], ['html', { open: 'never' }]], // `npm run report` opens the HTML report

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        testIdAttribute: 'data-test', // saucedemo uses data-test="..." on its elements
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
