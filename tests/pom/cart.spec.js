import { test, expect } from '@playwright/test';

// Page objects
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage }      from '../../pages/CartPage.js';

// Utils & helpers
import { PRODUCTS, URLS }     from '../../utils/testData.js';
import { loginAsStandardUser } from '../../helpers/loginHelper.js';

test.describe('Cart scenarios', () => {

  test.beforeEach(async ({ page }) => {
    // Login is a shared precondition for every cart test
    await loginAsStandardUser(page);
  });

  test('added items appear in the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(URLS.cart);

    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.backpack);
    expect(names).toContain(PRODUCTS.bikeLight);
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test('removing an item from the cart updates the list', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.boltShirt);
    await inventoryPage.goToCart();

    await cartPage.removeItem(PRODUCTS.backpack);

    const names = await cartPage.getItemNames();
    expect(names).not.toContain(PRODUCTS.backpack);
    expect(names).toContain(PRODUCTS.boltShirt);
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('cart badge count matches items added', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.boltShirt);
    await inventoryPage.addToCart(PRODUCTS.bikeLight);

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('proceeding to checkout navigates to checkout step one', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addToCart(PRODUCTS.fleeceJacket);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(URLS.checkout);
  });

  test('continue shopping returns to inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addToCart(PRODUCTS.onesie);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(URLS.inventory);
  });
});
