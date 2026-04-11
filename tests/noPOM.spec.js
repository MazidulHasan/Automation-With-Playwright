import { test, expect } from '@playwright/test';



test.describe('Login scenarios', () => {

  test('successful login redirects to inventory', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Assertions stay in the test, not in the page object
    await expect(page).toHaveURL(/inventory/);
  });

  test('wrong password shows error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce2');
    await page.getByRole('button', { name: 'Login' }).click();

    // Assertions stay in the test, not in the page object
    await expect(page).toHaveURL('/https://www.saucedemo.com/');
  });

  test('locked out user sees error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');
    await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();


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