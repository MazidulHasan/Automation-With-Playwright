// Common ARIA roles: button, link, textbox, checkbox, heading,
//                    combobox, listitem, img, navigation, main


import { test, expect } from '@playwright/test';

test('getByRole examples', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

    // Textbox (input fields with labels)
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // After login — headings
  await page.goto('https://www.saucedemo.com/inventory.html');
  const heading = page.getByText('Sauce Labs Backpack');
  await expect(heading).toBeVisible();

  // Links by their text
  await page.getByRole('link', { name: 'Sauce Labs Backpack' }).click();
});