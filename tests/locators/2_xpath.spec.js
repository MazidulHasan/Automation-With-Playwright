import { test, expect } from '@playwright/test';

test('XPath examples', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // XPath by attribute — same result as CSS #user-name
  const username = page.locator('xpath=//input[@id="user-name"]');
  await username.fill('standard_user');

  await page.locator('xpath=//input[@id="password"]').fill('secret_sauce');
  await page.locator('xpath=//input[@type="submit"]').click();

  // Find a specific product by its name text using XPath
  const productTitle = page.locator('xpath=//*[contains(@class,"inventory_item_name") and text()="Sauce Labs Backpack"]');
  await expect(productTitle).toBeVisible();
});