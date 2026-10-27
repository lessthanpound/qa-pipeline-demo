import { test, expect } from '../../pages/fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in', { tag: '@smoke' }, async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login('standard_user');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Testnope');
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login('locked_out_user');
    await expect(loginPage.error).toContainText('Sorry, this user has been locked out');
  });

  test('wrong password shows an error', async ({ loginPage }) => {
    await loginPage.login('standard_user', 'wrong_password');
    await expect(loginPage.error).toContainText('Username and password do not match');
  });

  test('empty username shows an error', async ({ loginPage }) => {
    await loginPage.login('');
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('inventory page is protected when logged out', async ({ loginPage, inventoryPage }) => {
    await inventoryPage.goto();
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });

  test('user can log out', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login('standard_user');
    await inventoryPage.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
