import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { loginAsStandardUser, loginAsLockedUser } from '../../helpers/loginHelper.js';
import { PRODUCTS, ERROR_MESSAGES, URLS } from '../../utils/testData.js';

test.describe('Login scenarios', () => {

  test('successful login redirects to inventory', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventoryPage = new InventoryPage(page);

    await expect(page).toHaveURL(URLS.inventory);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('locked out user sees error', async ({ page }) => {
    const loginPage = await loginAsLockedUser(page);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.lockedOut);
  });

  test('add product to cart via page objects', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.boltShirt);

    await expect(inventoryPage.cartBadge).toHaveText('2');
  });
});
