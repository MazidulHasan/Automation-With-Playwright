import { test, expect } from '@playwright/test';

test('multiple elements', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

    // Textbox (input fields with labels)
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

const items = page.locator('.inventory_item');
  // Filter by text content
  const backpackItem = items.filter({ hasText: 'Sauce Labs Backpack' });
  await expect(backpackItem).toHaveCount(1);

  // Click "Add to cart" ONLY inside the backpack item
  await backpackItem.locator('button').click();

  // Filter by a child locator (has)
  const boltTshirt = items.filter({
    has: page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bolt T-Shirt' })
  });
  await boltTshirt.locator('button').click();

  // Verify cart now has 2 items
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('2');
});



test('chaining locators', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

    // Textbox (input fields with labels)
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();


  
  // Step 1: Find the container
  const inventoryList = page.locator('.inventory_list');

  // Step 2: Find elements inside that container
  const allPrices = inventoryList.locator('.inventory_item_price');
  console.log('Price count:', await allPrices.count());

  // Step 3: Get all text values
  const prices = await allPrices.allTextContents();
  console.log('All prices:', prices);
  // Output: ['$29.99', '$15.99', '$49.99', ...]
});