/**
 * Data-Driven Testing — JSON source
 * ===================================
 * Demonstrates:
 *  • Read a JSON file at module-evaluation time (synchronous, ESM-safe)
 *  • Generate one test() per data row using a for…of loop
 *  • Conditional assertions based on row flags (expectSuccess)
 *  • test.describe.configure({ mode: 'parallel' }) — run data-driven suite in parallel
 *
 * Data file: utils/data/loginScenarios.json
 * Test site:  https://www.saucedemo.com  (via playwright.config.js baseURL)
 *
 * Benefits of JSON over inline arrays:
 *   — Non-developers can edit test data without touching spec code
 *   — Large datasets stay out of the spec file
 *   — CI pipelines can substitute different data files per environment
 */

import { test, expect }   from '@playwright/test';
import { readFileSync }    from 'fs';
import { LoginPage }       from '../../pages/LoginPage.js';

// ── Load test data at module-evaluation time (synchronous) ───────────────────
// new URL(..., import.meta.url) resolves the path relative to THIS file,
// so it works regardless of where `npx playwright test` is invoked from.
const scenarios = JSON.parse(
  readFileSync(new URL('../../utils/data/loginScenarios.json', import.meta.url))
);

// ── Run all generated tests in parallel (they are independent) ────────────────
test.describe.configure({ mode: 'parallel' });

test.describe('Data-driven login tests — JSON', () => {

  // One test is created per entry in the JSON array.
  // If you add a row to the JSON file, a new test appears automatically.
  for (const scenario of scenarios) {
    test(`[${scenario.id}] ${scenario.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginAs(scenario.username, scenario.password);

      if (scenario.expectSuccess) {
        // Happy path — should land on the inventory page
        await expect(page).toHaveURL(/inventory/, { timeout: 10_000 });
      } else {
        // Unhappy path — error message must contain the expected substring
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain(scenario.errorContains);
      }
    });
  }

});

// ── Bonus: log the data being used (visible in the --reporter=list output) ────
test.describe('JSON data integrity checks', () => {

  test('every scenario has required fields', () => {
    for (const row of scenarios) {
      expect(row, `Row ${row.id} missing "description"`).toHaveProperty('description');
      expect(row, `Row ${row.id} missing "username"`).toHaveProperty('username');
      expect(row, `Row ${row.id} missing "password"`).toHaveProperty('password');
      expect(row, `Row ${row.id} missing "expectSuccess"`).toHaveProperty('expectSuccess');
    }
  });

  test('failed scenarios include an errorContains value', () => {
    const failScenarios = scenarios.filter((s) => !s.expectSuccess);
    for (const row of failScenarios) {
      expect(
        row.errorContains,
        `Row ${row.id} has expectSuccess=false but no errorContains`
      ).toBeTruthy();
    }
  });

  test('scenario IDs are unique', () => {
    const ids = scenarios.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

});
