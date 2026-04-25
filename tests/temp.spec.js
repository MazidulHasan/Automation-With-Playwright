import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";

test.beforeAll(async () => {
  // Set up shared resources, e.g., connecting to a DB, preparing the test ground
  console.log("Setup once before all tests in this file");
});

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs("standard_user", "secret_sauce");
  console.log("beforeEach");
});

test.describe("Inventory tests", () => {
  test("shows 6 products", async ({ page }) => {
    console.log("test 1");
    // No login needed here — beforeEach handled it
    const inv = new InventoryPage(page);
    await expect(inv.inventoryItems).toHaveCount(6);
  });

  test("shows 6 products 2", async ({ page }) => {
    console.log("test 2");
    // No login needed here — beforeEach handled it
    const inv = new InventoryPage(page);
    await expect(inv.inventoryItems).toHaveCount(6);
  });
});

test.afterEach(async ({ page }, testInfo) => {
  console.log("afterEach");
  // If test failed, take a screenshot for evidence
});

test.afterAll("Teardown", async () => {
  console.log("Done with all tests");
});
