export class LoginPage {
  constructor(page) {
    this.page = page;

    // All locators are defined ONCE here
    this.usernameInput  = page.getByPlaceholder('User name');
    this.passwordInput  = page.getByPlaceholder('Password');
    this.loginButton    = page.getByRole('button', { name: 'Login' });
    this.errorMessage   = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async loginAs(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}