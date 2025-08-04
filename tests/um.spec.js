const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { AdminPage } = require('../pages/AdminPage');
require('dotenv').config();

const username = 'test.user';
const password = 'Test@1234';

test.describe('User Management Flow', () => {

  test('Login to OrangeHRM', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
  });

  test('Add a New User', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
    await admin.navigateToAdmin();
    

    await admin.addUser({ username, password });
  });

  test('Search the Newly Created User', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
    await admin.navigateToAdmin();
    await admin.searchUser(username);
  });

  test('Edit User Details', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
    await admin.navigateToAdmin();
    await admin.searchUser(username);
    await admin.editUser('Disabled');
  });

  test('Validate Updated Details', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
    await admin.navigateToAdmin();
    await admin.searchUser(username);
    //const status = await page.locator('div.oxd-table-cell').nth(4).textContent();
    //expect(status).toContain('Disabled');
    //const userRow = page.locator(`.oxd-table-row:has-text("${username}")`);
    //const status = await userRow.locator('.oxd-table-cell').nth(4).textContent();
    //expect(status).toContain('Disabled');
    //const userRow = page.locator(`.oxd-table-row:has-text("${username}")`);
    //await expect(userRow).toBeVisible(); // Ensures the row exists before accessing cells

    //const status = await userRow.locator('.oxd-table-cell').nth(4).textContent();
    //expect(status).toContain('Disabled');

    await admin.searchUser(username);

// Wait for table to contain any row
    await expect(page.locator('.oxd-table-row')).toHaveCountGreaterThan(0);

// Check for specific user row
    const userRow = page.locator(`.oxd-table-row:has-text("${username}")`);
    await expect(userRow).toBeVisible();

    const status = await userRow.locator('.oxd-table-cell').nth(4).textContent();
    expect(status).toContain('Disabled');


 
  });

  test('Delete the User', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
    await admin.navigateToAdmin();
    await admin.searchUser(username);
    await admin.deleteUser();
  });

  test('Search Deleted User', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
    await admin.navigateToAdmin();
    await admin.searchUser(username);
  });

  test('Confirm Deletion', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminPage(page);
    await login.login(process.env.User_Name, process.env.Pass_Word);
    await admin.navigateToAdmin();
    await admin.searchUser(username);
    const rows = await page.locator('.oxd-table-body .oxd-table-row').count();
    expect(rows).toBe(0);
  });
});
