/**
 * Custom fixture definitions for this project.
 *
 * Import `test` and `expect` from THIS file (not @playwright/test) in any spec
 * that needs these fixtures.  Playwright merges built-in fixtures with ours.
 *
 * Patterns demonstrated:
 *  1. Test-scoped fixture  — new instance per test (default scope)
 *  2. Fixture dependency   — one fixture consuming another
 *  3. Worker-scoped fixture — one instance shared across all tests in a worker
 *  4. Auto-use fixture     — applies to every test without being listed in params
 */

import { test as base, expect } from '@playwright/test';
import { LoginPage }     from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage }      from '../pages/CartPage.js';
import { USERS }         from '../utils/testData.js';

export const test = base.extend({

  // ── 1. Test-scoped fixture (default scope) ─────────────────────────────────
  // Playwright creates a fresh instance before each test and destroys it after.
  // Code before `await use(...)` = setup.  Code after = teardown.
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
    // Hand the already-logged-in `page` to the test body
    await use(page);
    // Teardown: nothing extra needed — Playwright closes the page automatically
  },

  // ── 2a. Fixture dependency: inventoryPage → loggedInPage ──────────────────
  // Playwright resolves the dependency chain automatically.
  // `loggedInPage` is set up first, then handed to this fixture.
  inventoryPage: async ({ loggedInPage }, use) => {
    await use(new InventoryPage(loggedInPage));
  },

  // ── 2b. Fixture dependency: cartPage → loggedInPage ───────────────────────
  cartPage: async ({ loggedInPage }, use) => {
    await use(new CartPage(loggedInPage));
  },

  // ── 3. Worker-scoped fixture ───────────────────────────────────────────────
  // Created ONCE per Playwright worker process and shared by all tests that
  // run in that worker.  Ideal for: auth tokens, DB connections, expensive setup.
  // Note: worker fixtures CANNOT use `page`, `context`, or `browser`
  //       (those are test-scoped).  Use `{}` or other worker fixtures.
  workerMetadata: [async ({}, use) => {
    const metadata = {
      workerId:    process.env.TEST_WORKER_INDEX ?? '0',
      startedAt:   new Date().toISOString(),
      environment: process.env.NODE_ENV ?? 'test',
    };
    console.log(`\n[worker-fixture] Worker ${metadata.workerId} started at ${metadata.startedAt}`);
    await use(metadata);
    // Worker teardown — runs once after all tests on this worker finish
    console.log(`[worker-fixture] Worker ${metadata.workerId} shutting down`);
  }, { scope: 'worker' }],

  // ── 4. Auto-use fixture ────────────────────────────────────────────────────
  // `auto: true` means it runs for EVERY test in files that import this `test`,
  // without the test needing to list it in its parameter list.
  // Perfect for: console error collection, page-timing logs, automatic screenshots.
  autoConsoleCapture: [async ({ page }, use, testInfo) => {
    const messages = [];
    page.on('console', (msg) =>
      messages.push({ type: msg.type(), text: msg.text() })
    );

    await use(); // run the actual test

    // Attach the collected console output to the HTML report
    if (messages.length > 0) {
      await testInfo.attach('browser-console', {
        body: JSON.stringify(messages, null, 2),
        contentType: 'application/json',
      });
    }
  }, { auto: true }],

});

// Re-export expect so callers only need one import line
export { expect };
