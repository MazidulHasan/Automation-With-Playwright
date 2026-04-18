/**
 * Multi-tab & Popup handling in Playwright
 * =========================================
 * Demonstrates three distinct techniques:
 *
 *  1. context.newPage()          — manually open a second tab and work on both
 *  2. waitForEvent('popup')      — catch a tab that the app opens by itself
 *                                  (links with target="_blank" / window.open)
 *  3. page.on('dialog', …)       — handle JS alert / confirm / prompt dialogs
 *
 * Test site: https://the-internet.herokuapp.com  (purpose-built for UI demos)
 */

import { test, expect } from '@playwright/test';
import { HEROKU } from '../utils/testData.js';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Multi-tab with context.newPage()
// Open a second tab manually and control both tabs independently.
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Multi-tab — context.newPage()', () => {

  test('two tabs can be navigated independently', async ({ context }) => {
    // Both pages share the same browser context (cookies, storage, etc.)
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();

    await tab1.goto(HEROKU.base);
    await tab2.goto(HEROKU.jsAlerts);

    // Each tab has its own URL
    await expect(tab1).toHaveURL(HEROKU.base + '/');
    await expect(tab2).toHaveURL(HEROKU.jsAlerts);

    // Interact with tab1 — heading on the home page
    await expect(tab1.getByRole('heading', { name: 'Welcome to the-internet' })).toBeVisible();

    // Interact with tab2 — buttons on the JS-alerts page
    await expect(tab2.getByRole('button', { name: 'Click for JS Alert' })).toBeVisible();
    
    await tab1.close();
    await tab2.close();
  });

  test('data entered in one tab does not affect the other', async ({ context }) => {
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();

    // Navigate both tabs to the same page
    await tab1.goto(HEROKU.multipleWindows);
    await tab2.goto(HEROKU.multipleWindows);

    // They are independent page objects — clicking in tab2 does not affect tab1
    await expect(tab1.getByRole('link', { name: 'Click Here' })).toBeVisible();
    await expect(tab2.getByRole('link', { name: 'Click Here' })).toBeVisible();

    await tab1.close();
    await tab2.close();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Catching a popup opened by the application
// When a link or button uses target="_blank" (or window.open), the browser
// opens a new tab automatically. Use waitForEvent('popup') to grab it.
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Multi-tab — waitForEvent("popup")', () => {

  test('new tab opened by a target=_blank link is captured and asserted', async ({ page }) => {
    await page.goto(HEROKU.multipleWindows);

    // Start listening BEFORE the click that triggers the new tab
    const [newTab] = await Promise.all([
      page.waitForEvent('popup'),                          // waits for the popup
      page.getByRole('link', { name: 'Click Here' }).click(), // triggers it
    ]);

    // Wait for the new tab to finish loading
    await newTab.waitForLoadState();

    // Assert the new tab landed on the expected URL
    await expect(newTab).toHaveURL(HEROKU.newWindowTarget);
    await expect(newTab.getByRole('heading', { name: 'New Window' })).toBeVisible();

    // The original tab is unchanged
    await expect(page).toHaveURL(HEROKU.multipleWindows);

    await newTab.close();
  });

  test('interactions in the new tab do not disturb the original tab', async ({ page }) => {
    await page.goto(HEROKU.multipleWindows);

    const [newTab] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);

    await newTab.waitForLoadState();

    // Work in the new tab
    const heading = await newTab.getByRole('heading').textContent();
    expect(heading).toBe('New Window');

    // Switch focus back to the original tab and verify its content
    await page.bringToFront();
    await expect(page.getByRole('heading', { name: 'Opening a new window' })).toBeVisible();

    await newTab.close();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — JS Dialog (alert / confirm / prompt) handling
// Register a handler with page.on('dialog', …) BEFORE the action that
// triggers the dialog, then call dialog.accept() or dialog.dismiss().
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Popup — JS Dialog handling', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(HEROKU.jsAlerts);
  });

  // ── alert ──────────────────────────────────────────────────────────────────
  test('alert dialog is accepted and result message is shown', async ({ page }) => {
    // Register listener before triggering the dialog
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Alert' }).click();

    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  // ── confirm — accept ───────────────────────────────────────────────────────
  test('confirm dialog accepted shows success message', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('I am a JS Confirm');
      await dialog.accept();                                 // click OK
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

  // ── confirm — dismiss ──────────────────────────────────────────────────────
  test('confirm dialog dismissed shows cancel message', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();                                // click Cancel
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });

  // ── prompt ─────────────────────────────────────────────────────────────────
  test('prompt dialog accepts typed text and reflects it in the result', async ({ page }) => {
    const inputText = 'Playwright rocks!';

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('I am a JS prompt');
      await dialog.accept(inputText);                        // type + click OK
    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();

    await expect(page.locator('#result')).toHaveText(`You entered: ${inputText}`);
  });

  test('prompt dialog dismissed shows null result', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();                                // click Cancel
    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();

    await expect(page.locator('#result')).toHaveText('You entered: null');
  });

});
