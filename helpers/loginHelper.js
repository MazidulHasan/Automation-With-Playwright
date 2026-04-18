// High-level login helpers that combine the LoginPage POM with test data.
// Use these in specs so each test does not repeat the login boilerplate.

import { LoginPage } from '../pages/LoginPage.js';
import { USERS } from '../utils/testData.js';

/**
 * Navigate to the site and log in as the standard (happy-path) user.
 * Returns the LoginPage instance in case the caller needs it.
 */
export async function loginAsStandardUser(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(USERS.standard.username, USERS.standard.password);
  return loginPage;
}

/**
 * Navigate to the site and attempt to log in as the locked-out user.
 * Returns the LoginPage instance so the caller can assert the error message.
 */
export async function loginAsLockedUser(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(USERS.locked.username, USERS.locked.password);
  return loginPage;
}

/**
 * Navigate to the site and attempt to log in as the error user.
 * Returns the LoginPage instance so the caller can assert error behaviour.
 */
export async function loginAsErrorUser(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(USERS.error.username, USERS.error.password);
  return loginPage;
}

/**
 * Navigate to the site and log in with arbitrary credentials.
 * Useful when a test needs to verify a specific error scenario.
 */
export async function loginWith(page, username, password) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(username, password);
  return loginPage;
}
