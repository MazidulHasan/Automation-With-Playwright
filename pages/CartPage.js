export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems      = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async getItemNames() {
    return await this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async removeItem(productName) {
    await this.cartItems
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
