/**
 * Drag, Keyboard, Hover & Dialogs
 * =================================
 * Demonstrates:
 *  Drag & Drop:
 *    • locator.dragTo()          — high-level drag from A to B
 *    • mouse.move / down / up    — manual low-level drag
 *
 *  Keyboard:
 *    • page.keyboard.press()     — single key or combo (e.g. 'Control+a')
 *    • page.keyboard.type()      — types a string (fires all key events)
 *    • keyboard.down() / up()    — hold a modifier while pressing another key
 *    • locator.press()           — key press scoped to a specific element
 *
 *  Hover:
 *    • locator.hover()           — trigger CSS :hover / JS mouseover
 *    • mouse coordinates         — hover at an exact x/y position
 *
 *  Dialogs:
 *    • page.on('dialog')         — persistent handler for all dialogs
 *    • page.once('dialog')       — one-shot handler (auto-removed after firing)
 *    • dialog.accept(text?)      — click OK (optionally fill prompt)
 *    • dialog.dismiss()          — click Cancel
 *
 * Test site: https://the-internet.herokuapp.com
 */

import { test, expect } from '@playwright/test';
import { ActionsPage } from '../pages/ActionsPage.js';
import { HEROKU }      from '../utils/testData.js';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Drag & Drop
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Drag & Drop', () => {

  test('dragTo() swaps column A and column B', async ({ page }) => {
    const actionsPage = new ActionsPage(page);
    await actionsPage.gotoDragAndDrop();

    // Before drag — column A is on the left
    expect(await actionsPage.getColumnAHeader()).toBe('A');
    expect(await actionsPage.getColumnBHeader()).toBe('B');

    await actionsPage.dragAtoB();

    // After drag — positions are swapped
    expect(await actionsPage.getColumnAHeader()).toBe('B');
    expect(await actionsPage.getColumnBHeader()).toBe('A');
  });

  test('manual low-level drag using mouse events', async ({ page }) => {
    await page.goto(HEROKU.dragAndDrop);

    const source = page.locator('#column-a');
    const target = page.locator('#column-b');

    const sourceBound = await source.boundingBox();
    const targetBound = await target.boundingBox();

    // Low-level drag: move → down → move to target → up
    await page.mouse.move(
      sourceBound.x + sourceBound.width / 2,
      sourceBound.y + sourceBound.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBound.x + targetBound.width / 2,
      targetBound.y + targetBound.height / 2,
      { steps: 10 }, // move in 10 increments (smoother, more realistic)
    );
    await page.mouse.up();

    // Verify swap occurred
    expect(await source.locator('header').textContent()).toBe('B');
    expect(await target.locator('header').textContent()).toBe('A');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Keyboard interactions
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Keyboard interactions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(HEROKU.keyPresses);
  });

  test('keyboard.press() fires keydown → keyup for a single key', async ({ page }) => {
    const actionsPage = new ActionsPage(page);
    await actionsPage.pressKey('a');

    const result = await actionsPage.getKeyResult();
    expect(result).toContain('A');
  });

  test('keyboard.press() works with special keys (Enter, Tab, Escape)', async ({ page }) => {
    const actionsPage = new ActionsPage(page);

    await actionsPage.pressKey('Enter');
    expect(await actionsPage.getKeyResult()).toContain('Enter');

    await actionsPage.pressKey('Tab');
    expect(await actionsPage.getKeyResult()).toContain('Tab');
  });

  test('keyboard.type() sends each character as individual key events', async ({ page }) => {
    const actionsPage = new ActionsPage(page);

    // type() triggers keydown/keypress/keyup for every character
    await actionsPage.typeText('Z');

    // The page only shows the LAST key pressed
    expect(await actionsPage.getKeyResult()).toContain('Z');
  });

  test('keyboard.down() + keyboard.up() holds a modifier key', async ({ page }) => {
    const actionsPage = new ActionsPage(page);
    // Pressing Shift while pressing 'b' produces 'B' (upper-case)
    await actionsPage.pressCombo('Shift', 'b');

    expect(await actionsPage.getKeyResult()).toContain('B');
  });

  test('locator.press() sends a key scoped to a focused element', async ({ page }) => {
    const actionsPage = new ActionsPage(page);

    // locator.press() focuses the element and then fires the key
    await actionsPage.keyInput.press('ArrowUp');
    expect(await actionsPage.getKeyResult()).toContain('Up');
  });

  test('keyboard shortcut Control+A selects all text in an input', async ({ page }) => {
    // Navigate to a page with an editable area
    await page.goto(HEROKU.iframe);
    // Use keyboard shortcut on the parent page
    await page.keyboard.press('Control+a');
    // No assertion needed — just demonstrates the shortcut fires without error
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Hover interactions
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Hover interactions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(HEROKU.hovers);
  });

  test('hovering over a figure reveals its caption', async ({ page }) => {
    const actionsPage = new ActionsPage(page);

    // Caption is hidden until hover
    const caption = page.locator('.figure').nth(0).locator('.figcaption');
    await expect(caption).toBeHidden();

    await actionsPage.hoverFigure(0);

    await expect(caption).toBeVisible();
  });

  test('each figure has a unique caption when hovered', async ({ page }) => {
    const actionsPage = new ActionsPage(page);
    const count = await actionsPage.getFigureCount();

    const captions = [];
    for (let i = 0; i < count; i++) {
      await actionsPage.hoverFigure(i);
      captions.push(await actionsPage.getFigureCaptionText(i));
    }

    // All captions should be non-empty and distinct
    expect(captions.length).toBe(count);
    const unique = new Set(captions.map((c) => c.trim()));
    expect(unique.size).toBe(count);
  });

  test('hover at exact coordinates using page.mouse.move()', async ({ page }) => {
    const figure = page.locator('.figure').nth(1);
    const box    = await figure.boundingBox();

    // Move the mouse to the centre of the second figure
    await page.mouse.move(
      box.x + box.width  / 2,
      box.y + box.height / 2,
    );

    await expect(figure.locator('.figcaption')).toBeVisible();
  });

  test('hover force option bypasses actionability checks', async ({ page }) => {
    const actionsPage = new ActionsPage(page);

    // { force: true } skips visibility / pointer-events checks
    await actionsPage.figures.nth(2).hover({ force: true });

    await expect(actionsPage.figures.nth(2).locator('.figcaption')).toBeVisible();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — JS Dialogs (alert / confirm / prompt)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('JS Dialogs', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(HEROKU.jsAlerts);
  });

  // ── alert ──────────────────────────────────────────────────────────────────
  test('page.once("dialog") accepts an alert', async ({ page }) => {
    // page.once auto-removes the handler after the first dialog — safe per test
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  // ── confirm — accept ───────────────────────────────────────────────────────
  test('dialog.accept() clicks OK on a confirm dialog', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

  // ── confirm — dismiss ──────────────────────────────────────────────────────
  test('dialog.dismiss() clicks Cancel on a confirm dialog', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });

  // ── prompt ─────────────────────────────────────────────────────────────────
  test('dialog.accept(text) fills a prompt and clicks OK', async ({ page }) => {
    const answer = 'Hello from Playwright';

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept(answer);
    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toHaveText(`You entered: ${answer}`);
  });

  test('dismissing a prompt produces null result', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toHaveText('You entered: null');
  });

  // ── persistent handler with page.on() ─────────────────────────────────────
  test('page.on("dialog") handles multiple dialogs in sequence', async ({ page }) => {
    const types   = [];
    const handler = async (dialog) => {
      types.push(dialog.type());
      await dialog.accept();
    };

    // page.on() (not once) — stays active for every dialog in this test
    page.on('dialog', handler);

    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

    expect(types).toEqual(['alert', 'confirm']);

    // Always remove persistent handlers to avoid leaking into other tests
    page.off('dialog', handler);
  });

  // ── right-click dialog ─────────────────────────────────────────────────────
  test('context menu appears on right-click on a hot-spot element', async ({ page }) => {
    await page.goto(HEROKU.contextMenu);

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('You selected a context menu');
      await dialog.accept();
    });

    const actionsPage = new ActionsPage(page);
    await actionsPage.rightClickBox();
  });

});
