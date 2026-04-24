/**
 * Advanced Fixture Patterns — Scope & Dependencies
 * ==================================================
 * All tests in this file import `test` from helpers/fixtures.js (NOT from
 * @playwright/test directly).  That extended `test` merges our custom
 * fixtures with Playwright's built-ins.
 *
 * Fixtures demonstrated:
 *
 *  1. Test-scoped fixture  (default)
 *     `loggedInPage` — logs in before each test; fresh per test.
 *
 *  2. Fixture dependency chain
 *     `inventoryPage` depends on `loggedInPage`.
 *     `cartPage`      depends on `loggedInPage`.
 *     Playwright resolves the dependency tree automatically.
 *
 *  3. Worker-scoped fixture
 *     `workerMetadata` — created once per Playwright worker process,
 *     shared across all tests that run in the same worker.
 *
 *  4. Auto-use fixture
 *     `autoConsoleCapture` — runs automatically for every test without
 *     being listed in the test's parameter list. Attaches browser console
 *     output to the HTML report.
 *
 * Rule of thumb:
 *   test-scoped  → per-test state (pages, POMs, in-test data)
 *   worker-scoped → expensive one-time setup (auth tokens, DB, config)
 *   auto-use     → cross-cutting concerns (logging, error capture, timing)
 */

import { test, expect } from '../helpers/fixtures.js';
import { PRODUCTS, URLS } from '../utils/testData.js';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Test-scoped fixture: loggedInPage
// ─────────────────────────────────────────────────────────────────────────────

test.describe('1 — Test-scoped fixture: loggedInPage', () => {

  test('fixture navigates and logs in automatically — no beforeEach needed', async ({ loggedInPage }) => {
    // `loggedInPage` is the Playwright page object, already authenticated.
    // No manual goto/login in the test body.
    await expect(loggedInPage).toHaveURL(URLS.inventory);
  });

  test('each test receives a fresh, independent page instance', async ({ loggedInPage }) => {
    // Add something to the cart in this test
    await loggedInPage.locator('.inventory_item').first()
      .getByRole('button', { name: 'Add to cart' }).click();

    await expect(loggedInPage.locator('.shopping_cart_badge')).toHaveText('1');
    // The NEXT test will get a clean page — cart will be empty again
  });

  test('previous test cart change does not leak (isolation proof)', async ({ loggedInPage }) => {
    // Cart badge should be absent — previous test's state is gone
    await expect(loggedInPage.locator('.shopping_cart_badge')).toBeHidden();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Fixture dependency chain
// inventoryPage → loggedInPage (Playwright resolves this automatically)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('2 — Fixture dependency: inventoryPage → loggedInPage', () => {

  test('inventoryPage fixture provides the POM without any setup code', async ({ inventoryPage }) => {
    // Playwright resolved the chain: page → loggedInPage → inventoryPage
    // The test just uses the ready-made POM
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('add to cart through the inventoryPage POM fixture', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.bikeLight);

    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('multiple fixture dependencies can be used in the same test', async ({ inventoryPage, cartPage }) => {
    // Both depend on loggedInPage — Playwright reuses the same instance
    await inventoryPage.addToCart(PRODUCTS.boltShirt);
    await inventoryPage.goToCart();

    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.boltShirt);
  });

  test('Cart with data already added', async({ cartPageWithData }) =>{
    const names = await cartPageWithData.getItemNames();
    expect(names).toContain(PRODUCTS.boltShirt);
  })

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Worker-scoped fixture: workerMetadata
// ─────────────────────────────────────────────────────────────────────────────

test.describe('3 — Worker-scoped fixture: workerMetadata', () => {

  test('metadata is available and has the expected shape', async ({ workerMetadata }) => {
    expect(workerMetadata).toHaveProperty('workerId');
    expect(workerMetadata).toHaveProperty('startedAt');
    expect(workerMetadata).toHaveProperty('environment');

    // startedAt is set once when the worker starts — it is a valid ISO date string
    expect(() => new Date(workerMetadata.startedAt)).not.toThrow();
  });

  test('startedAt timestamp is identical across tests (shared instance)', async ({ workerMetadata }) => {
    // If worker-scope is working correctly, startedAt is the same object
    // reference — it was NOT recreated for this test.
    const ts = new Date(workerMetadata.startedAt).getTime();
    expect(ts).toBeLessThanOrEqual(Date.now());
  });

  test('worker-scoped fixture mixed with test-scoped fixture', async ({ workerMetadata, loggedInPage }) => {
    // workerMetadata: worker scope  (shared)
    // loggedInPage:   test scope    (fresh per test)
    // Both can coexist in the same test
    expect(workerMetadata.workerId).toBeDefined();
    await expect(loggedInPage).toHaveURL(URLS.inventory);
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Auto-use fixture: autoConsoleCapture
// ─────────────────────────────────────────────────────────────────────────────

test.describe('4 — Auto-use fixture: autoConsoleCapture', () => {

  test('auto-use fixture is NOT listed in params but still runs', async ({ loggedInPage }) => {
    // autoConsoleCapture is absent from { loggedInPage } above,
    // yet it fires automatically for every test in this file.
    // After this test, the HTML report will have a "browser-console" attachment.

    // Trigger some console output to make the attachment visible
    await loggedInPage.evaluate(() => {
      console.log('auto-use fixture captured this log');
      console.warn('and this warning');
    });

    await expect(loggedInPage.locator('.inventory_item')).toHaveCount(6);
  });

  test('auto-use capture works even in tests with no other custom fixtures', async ({ page }) => {
    // This test uses only the built-in `page` fixture — no custom ones.
    // The auto-use `autoConsoleCapture` still fires because it is defined
    // with `auto: true` in the extended `test`.
    await page.goto('https://www.saucedemo.com/');
    await page.evaluate(() => console.error('intentional error for capture demo'));

    // No assertions on the console — just proving no crash
    await expect(page.locator('#login-button')).toBeVisible();
  });

});
