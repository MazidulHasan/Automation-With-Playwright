import { test, expect } from '@playwright/test';
import { USERS, ERROR_MESSAGES, URLS } from '../utils/testData.js';

test.describe('Login - Basic Test Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ─── Page Load ────────────────────────────────────────────────────────────────

  test('TC001 - Login page displays all required elements', async ({ page }) => {
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await expect(page.locator('.login_logo')).toContainText('Swag Labs');
  });

  // ─── Successful Login ─────────────────────────────────────────────────────────

  test('TC002 - Standard user can log in successfully', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERS.standard.username);
    await page.locator('[data-test="password"]').fill(USERS.standard.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(URLS.inventory);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC003 - Problem user can log in and reaches inventory', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERS.problem.username);
    await page.locator('[data-test="password"]').fill(USERS.problem.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(URLS.inventory);
  });

  test('TC004 - Performance glitch user can eventually log in', async ({ page }) => {
    test.setTimeout(60000);
    await page.locator('[data-test="username"]').fill(USERS.performance.username);
    await page.locator('[data-test="password"]').fill(USERS.performance.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(URLS.inventory, { timeout: 15000 });
  });

  // ─── Failed Login ─────────────────────────────────────────────────────────────

  test('TC005 - Locked out user sees locked-out error message', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERS.locked.username);
    await page.locator('[data-test="password"]').fill(USERS.locked.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(ERROR_MESSAGES.lockedOut);
  });

  test('TC006 - Invalid username shows credentials error', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill(USERS.standard.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(ERROR_MESSAGES.wrongPassword);
  });

  test('TC007 - Invalid password shows credentials error', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERS.standard.username);
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(ERROR_MESSAGES.wrongPassword);
  });

  test('TC008 - Both fields invalid shows credentials error', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('bad_user');
    await page.locator('[data-test="password"]').fill('bad_pass');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(ERROR_MESSAGES.wrongPassword);
  });

  // ─── Empty Field Validation ───────────────────────────────────────────────────

  test('TC009 - Empty username shows username required error', async ({ page }) => {
    await page.locator('[data-test="password"]').fill(USERS.standard.password);
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText(ERROR_MESSAGES.emptyUsername);
  });

  test('TC010 - Empty password shows password required error', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERS.standard.username);
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText(ERROR_MESSAGES.emptyPassword);
  });

  test('TC011 - Both fields empty shows username required error first', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText(ERROR_MESSAGES.emptyUsername);
  });

  // ─── Error Dismissal ──────────────────────────────────────────────────────────

  test('TC012 - Error message can be dismissed with close button', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    await page.locator('[data-test="error"] button').click();

    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

  // ─── Post-Login ───────────────────────────────────────────────────────────────

  test('TC013 - Logged-in user can log out and return to login page', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERS.standard.username);
    await page.locator('[data-test="password"]').fill(USERS.standard.password);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(URLS.inventory);

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('TC014 - Logged-out user cannot access inventory directly', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL('/');
  });

});
