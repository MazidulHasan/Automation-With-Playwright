import { test, expect } from '@playwright/test';

test('Verify product list count', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // By ID
  const usernameField = page.locator('#user-name');
  await usernameField.fill('standard_user');

  // By attribute
  const passwordField = page.locator('[data-test="password"]');
  await passwordField.fill('secret_sauce');

  // By class + tag combo
  const loginBtn = page.locator('input.btn_action');
  await loginBtn.click();

  // Descendant: all product names inside the inventory list
  const productNames = page.locator('.inventory_list .inventory_item_name');
  console.log('Product count:', await productNames.count());

  await expect(page).toHaveURL(/inventory/);
});