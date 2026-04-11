export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addToCart(productName) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async removeFromCart(productName) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async getCartCount() {
    return await this.cartBadge.textContent();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getAllProductNames() {
    return await this.inventoryItems
      .locator('.inventory_item_name')
      .allTextContents();
  }
}