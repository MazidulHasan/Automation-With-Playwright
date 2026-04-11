import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import {InventoryPage} from '../../pages/InventoryPage.js';

test.describe('Login scenarios', () => {

  test('successful login redirects to inventory', async ({ page }) => {
    const loginPage     = new LoginPage(page); // creating an object
    const inventoryPage = new InventoryPage(page); // creating an object

    await loginPage.goto();
    await loginPage.loginAs('standard_user', 'secret_sauce');

    // Assertions stay in the test, not in the page object
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('wrong password shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginAs('standard_user', 'wrong_password');

    // Error message check
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('locked out user sees error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginAs('locked_out_user', 'secret_sauce');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('add product to cart via page objects', async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.loginAs('standard_user', 'secret_sauce');

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bolt T-Shirt');

    await expect(inventoryPage.cartBadge).toHaveText('2');
  });
});