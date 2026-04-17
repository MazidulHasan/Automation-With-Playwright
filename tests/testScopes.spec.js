import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import {InventoryPage} from '../pages/InventoryPage.js';



test.describe('Inventory tests', () => {

  test.beforeAll(async () => {
  // Set up shared resources, e.g., connecting to a DB, preparing the test ground
    console.log('Setup once before all tests in this file');
  });

  // Runs before EVERY test — login once per test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('standard_user', 'secret_sauce');
    console.log('beforeEach');
  });

  test('shows 6 products @smoke', async ({ page }) => {
    console.log('test 1');
    // No login needed here — beforeEach handled it
    const inv = new InventoryPage(page);
    await expect(inv.inventoryItems).toHaveCount(6);
  });

  test('cart badge starts hidden @smoke @critical', async ({ page }) => {
    console.log('test 2');
    const inv = new InventoryPage(page);
    await expect(inv.cartBadge).toBeHidden();
  });

  test('cart badge starts hidden @regression', async ({ page }) => {
    console.log('test 3');
    const inv = new InventoryPage(page);
    await expect(inv.cartBadge).toBeHidden();
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log('afterEach');
    // If test failed, take a screenshot for evidence
  });

  test.afterAll('Teardown', async () => {
    console.log('Done with all tests');
  });
  
});


// npx playwright test tests/testScopes.spec.js --headed --project=chromium --grep "@regression"