import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import {InventoryPage} from '../pages/InventoryPage.js';

test.use({
    trace: 'retain-on-failure',  // Override for this describe block
  });

test.describe('Inventory tests', () => {

  test.beforeAll(async () => {
  // Set up shared resources, e.g., connecting to a DB, preparing the test ground
    console.log('Setup once before all tests in this file');
  });

  // Runs before EVERY test — login once per test
  test.beforeEach(async ({ page }) => {
   await loginAsStandardUser(page);
  });

  test('shows 6 products', async ({ page }) => {
    console.log('test 1');
    // No login needed here — beforeEach handled it
    const inv = new InventoryPage(page);
    await expect(inv.inventoryItems).toHaveCount(6);
  });

   test('shows 16 products', async ({ page }) => {
    console.log('test 2');
    // No login needed here — beforeEach handled it
    const inv = new InventoryPage(page);
    await expect(inv.inventoryItems).toHaveCount(16);
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log('afterEach');
    // If test failed, take a screenshot for evidence
    if (testInfo.status === 'failed') {
      await page.screenshot({
        path: `screenshots/${testInfo.title}.png`,
        fullPage: true
      });
    }
    console.log("Error test block",testInfo.status);
    
  });

  test.afterAll('Teardown', async () => {
    console.log('Done with all tests');
  });
  
});

// npx playwright show-report --port 8080