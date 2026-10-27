import { test, expect } from '../../pages/fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user');
  });

  test('user can complete a purchase', { tag: '@smoke' }, async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('Test', 'User', '12345');
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutPage.subtotal).toContainText('$29.99');

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('first name is required', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo('', 'User', '12345');

    await expect(checkoutPage.error).toContainText('First Name is required');
  });
});
