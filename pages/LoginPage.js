require('dotenv').config();

export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async login(username, password) {
    await this.page.goto(process.env.BASE_URL);
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.waitForURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  }
}
