import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
import { builds, selected } from './demo-builds.mjs';

const reports = resolve(process.env.CEDAR_DEMO_BROWSER_REPORT_DIR ?? 'reports');
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: Number(process.env.CEDAR_TEST_WORKERS ?? (process.env.CI ? 2 : 4)),
  timeout: 30_000,
  expect: { timeout: 15_000 },
  outputDir: resolve(reports, 'artifacts'),
  reporter: [['line'], ['json', { outputFile: resolve(reports, 'results.json') }]],
  use: { viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: selected.flatMap(framework => ['chromium', 'firefox', 'webkit'].map(browserName => ({
    name: `${framework}-${browserName}`,
    metadata: { framework },
    use: { browserName, baseURL: `http://127.0.0.1:${builds[framework].port}` },
  }))),
  webServer: selected.map(framework => ({
    command: `node serve.mjs ${framework}`, url: `http://127.0.0.1:${builds[framework].port}`,
    reuseExistingServer: false,
  })),
});
