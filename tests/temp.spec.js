import { test, expect } from '@playwright/test';

test('assertion examples on SauceDemo', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

  // 1. Page URL
  await expect(page).toHaveURL(/inventory/);

  // 2. Heading is visible
  await expect(page.locator('[data-test="title"]')).toBeEnabled();

  // 3. Count — 6 products must be shown
  await expect(page.locator('.inventory_item')).toHaveCount(6);

  // 4. Text content of a specific item price
  const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
  await expect(backpack.locator('.inventory_item_price')).toHaveText('$29.99');

  // 5. Cart badge is hidden before adding anything
  await expect(page.locator('.shopping_cart_badge')).toBeHidden();

  // 6. Add to cart and check badge appears
  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('.shopping_cart_badge')).toBeVisible();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // 7. Soft assertions — does NOT stop the test on failure
  await expect.soft(page.getByText('Wrong Product')).toBeVisible();
  // test continues even if above fails
  // at the end, Playwright reports ALL soft failures
});