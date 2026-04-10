import { test, expect } from '@playwright/test';

test('assertion examples on SauceDemo', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'password_user' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

  // 1. Page URL
  await expect(page).toHaveURL(/inventory2/,{ timeout: 20000 });
    // 2. Heading is visible
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-0-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Bike Light');
})

test('assertion examples on 2', async ({ page }) => {

})

test('assertion examples on 3', async ({ page }) => {
    
})

test('assertion examples on 4', async ({ page }) => {
    
})

test('assertion examples on 5', async ({ page }) => {
    
})