import { test, expect } from '@playwright/test';

const failures = new WeakMap();
const editor = page => page.locator('cedar-embeddable-editor');
const software = page => editor(page).getByRole('textbox', { name: 'Software', exact: true });
const metadata = page => editor(page).evaluate(el => el.currentMetadata);

test.beforeEach(async ({ page, baseURL }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Every demo supplies its own template and package assets. No deployed CEDAR service is needed.
  await page.route('**/*', route => new URL(route.request().url()).origin === baseURL
    ? route.continue() : route.abort('blockedbyclient'));
  failures.set(page, errors);
  await page.goto('/');
  await expect(software(page)).toBeVisible();
});

test.afterEach(async ({ page }) => {
  expect(failures.get(page), 'uncaught errors in the framework host').toEqual([]);
});

test('the production framework passes object inputs and renders its configured editor', async ({ page }) => {
  await expect(editor(page)).toHaveCount(1);
  await expect(editor(page).getByRole('heading', { name: 'eDNA ECT Demonstration', exact: true })).toBeVisible();
  await expect(editor(page).getByRole('button', { name: 'Download', exact: true })).toBeVisible();
  const inputs = await editor(page).evaluate(el => ({
    attributes: [el.getAttribute('config'), el.getAttribute('templateObject')],
    registered: Boolean(customElements.get('cedar-embeddable-editor')),
  }));
  expect(inputs.registered).toBe(true);
  expect(inputs.attributes).toEqual([null, null]);
  expect((await metadata(page))['schema:isBasedOn']).toBeTruthy();
});

test('editing reaches the host as a typed event and matching serialized data', async ({ page }) => {
  await page.evaluate(() => {
    window.hostChanges = [];
    document.body.addEventListener('change', event => {
      if (event.detail?.operation) window.hostChanges.push(event.detail);
    });
  });
  await software(page).fill('Framework browser integration');
  await expect.poll(() => page.evaluate(() => window.hostChanges.length)).toBe(1);
  const detail = await page.evaluate(() => window.hostChanges[0]);
  expect(detail).toMatchObject({ operation: 'valueChanged', value: 'Framework browser integration',
    path: expect.arrayContaining(['Software']), dataQualityReport: { isValid: expect.any(Boolean) } });
  expect((await metadata(page)).Software['@value']).toBe('Framework browser integration');
  expect(await editor(page).evaluate(el => el.currentMetadataYaml)).toContain('Framework browser integration');
  await software(page).fill('');
  await expect.poll(() => page.evaluate(() => window.hostChanges.length)).toBe(2);
  expect((await metadata(page)).Software['@value']).toBeNull();
});

test('a fresh framework mount discards edits and registers a single working editor', async ({ page }) => {
  await software(page).fill('Previous mount');
  expect((await metadata(page)).Software['@value']).toBe('Previous mount');
  await page.goto('about:blank');
  await page.goto('/');
  await expect(software(page)).toBeVisible();
  await expect(editor(page)).toHaveCount(1);
  await expect(software(page)).toHaveValue('');
  await software(page).fill('Fresh mount');
  await expect.poll(async () => (await metadata(page)).Software['@value']).toBe('Fresh mount');
  await expect(editor(page).getByRole('button', { name: 'Download', exact: true })).toHaveCount(1);
});
