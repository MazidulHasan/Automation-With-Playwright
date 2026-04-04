import { test, expect } from '@playwright/test';

test('multiple elements', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

    // Textbox (input fields with labels)
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();


  // How many products are there?
  const items = page.locator('.inventory_item');
  console.log('Total items:', await items.count()); // 6

  // Get the first item's name
  const firstName = items.first().locator('.inventory_item_name');
  await expect(firstName).toHaveText('Sauce Labs Backpack');

  // Get by index (0-based)
  const thirdItem = items.nth(2);
  console.log('Third item:', await thirdItem.locator('.inventory_item_name').textContent());

  // Last item
  const lastItem = items.last();
  await lastItem.locator('button').click(); // Add last item to cart
});