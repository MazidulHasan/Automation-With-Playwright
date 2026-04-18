import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import {InventoryPage} from '../pages/InventoryPage.js';

test.beforeAll(async () => {
  // Set up shared resources, e.g., connecting to a DB, preparing the test ground
    console.log('Setup once before all tests in this file');
  });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs('standard_user', 'secret_sauce');
    console.log('beforeEach');
  });

test.describe('Inventory tests', () => {

  test('shows 6 products', async ({ page }) => {
    console.log('test 1');
    // No login needed here — beforeEach handled it
    const inv = new InventoryPage(page);
    await expect(inv.inventoryItems).toHaveCount(6);
  });

  test('shows 6 products 2', async ({ page }) => {
    console.log('test 2');
    // No login needed here — beforeEach handled it
    const inv = new InventoryPage(page);
    await expect(inv.inventoryItems).toHaveCount(6);
  });

});

test.afterEach(async ({ page }, testInfo) => {
    console.log('afterEach');
    // If test failed, take a screenshot for evidence
  });

test.afterAll('Teardown', async () => {
    console.log('Done with all tests');
  });


  ┌────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │              File              │                                              Key concepts                                               │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ iframeHandling.spec.js         │ frameLocator(), chained frames, nested <frame> by name/index                                            │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ fileTransfer.spec.js           │ setInputFiles(), setInputFiles([]) to clear, waitForEvent('download'), saveAs(), round-trip             │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ userActions.spec.js            │ dragTo(), low-level mouse, keyboard.press/type/down/up, locator.hover(), mouse.move(), all dialog types │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ advancedFixtures.spec.js       │ Imports test from helpers/fixtures.js, demonstrates all 4 patterns with isolation proof                 │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ dataDriven/jsonDriven.spec.js  │ readFileSync + JSON.parse at module level → for...of generates tests                                    │
  ├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ dataDriven/excelDriven.spec.js │ Seeds xlsx if missing → readExcel() at module level → same for...of pattern                             │
  └────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────┘