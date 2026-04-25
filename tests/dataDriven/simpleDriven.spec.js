import { test, expect }        from '@playwright/test';
import { existsSync }           from 'fs';
import { join, dirname }        from 'path';
import { fileURLToPath }        from 'url';
import { LoginPage }            from '../../pages/LoginPage.js';
import { InventoryPage }        from '../../pages/InventoryPage.js';
import { seedWorkbook, readExcel } from '../../utils/excelHelper.js';

















const __dirname  = dirname(fileURLToPath(import.meta.url));
const EXCEL_PATH = join(__dirname, '../../utils/data/simpleData.xlsx');

const loginScenarios     = readExcel(EXCEL_PATH, 'Login');
const inventoryScenarios = readExcel(EXCEL_PATH, 'Inventory');

// ── Login tests ───────────────────────────────────────────────────────────────

test.describe('Login — Excel driven', () => {
  
  for (const row of loginScenarios) {
    console.log(loginScenarios);
    
    test(row.description, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAs(String(row.username), String(row.password));

      if (row.expectSuccess) {
        await expect(page).toHaveURL(/inventory/);
      } else {
        const error = await loginPage.getErrorMessage();
        expect(error).toContain(row.errorContains); 
      }
    });
  }

});
























// ── Inventory tests ───────────────────────────────────────────────────────────

// test.describe('Inventory — Excel driven', () => {

//   test.beforeEach(async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.goto();
//     await loginPage.loginAs('standard_user', 'secret_sauce');
//     await expect(page).toHaveURL(/inventory/);
//   });

//   for (const row of inventoryScenarios) {
//     test(row.description, async ({ page }) => {
//       const inventoryPage = new InventoryPage(page);
//       const products = String(row.products).split(',').map(p => p.trim());

//       for (const product of products) {
//         await inventoryPage.addToCart(product);
//       }

//       const count = await inventoryPage.getCartCount();
//       expect(count).toBe(String(row.expectedCount));
//     });
//   }

// });
