export class AdminPage {
    constructor(page) {
      this.page = page;
    }
  
    async navigateToAdmin() {
      await this.page.getByRole('link', {name: 'Admin'}).waitFor({state: 'visible' });  
      await this.page.getByRole('link', { name: 'Admin' }).click();
    }
  
    async addUser(data) {
      await this.page.getByRole('button', { name: 'Add' }).click();
      await this.page.locator('input[placeholder="Employee Name"]').fill('Linda Anderson');
      await this.page.getByRole('button', { name: 'Add' }).click();
      await this.page.waitForSelector('input[placeholder="Employee Name"]');

      //await this.page.getByRole('option', { name: 'Linda Anderson' }).click();
      await this.page.locator('input[placeholder="Username"]').fill(data.username);
      await this.page.locator('input[type="password"]').nth(0).fill(data.password);
      await this.page.locator('input[type="password"]').nth(1).fill(data.password);
      await this.page.getByRole('button', { name: 'Save' }).click();
    }
  
    async searchUser(username) {
      //await this.page.getByPlaceholder('Search').fill(username);
      //await this.page.getByRole('button', { name: 'Search' }).click();
      await this.page.locator('button:has-text("Search")').click();
      await this.page.waitForSelector('.oxd-table-body'); // Wait for results container

    }
  
    async editUser(newStatus) {
      await this.page.locator('tr : has-text("${username}") i.bi-pencil-fill').click();
      await this.page.getByText('Status').click();
      await this.page.getByText('newStatus', { exact: true }).click();
      
      

      await this.page.locator(`.oxd-select-dropdown >> text=${newStatus}`).click();
      
      await this.page.getByRole('button', { name: 'Save' }).click();
    }
  
    async deleteUser() {
      await this.page.locator('input[type="checkbox"]').first().check({ force: true});
      await this.page.getByRole('button', { name: 'Delete' }).click();
      await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    }
  }
  