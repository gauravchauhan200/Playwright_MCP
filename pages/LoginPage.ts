import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  readonly dashboardHeading: Locator;
  readonly invalidCredentialsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.invalidCredentialsMessage = page.getByRole('alert').getByText('Invalid credentials', { exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
      waitUntil: 'commit',
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.submitCredentials(username, password);
    await this.page.waitForURL(/\/dashboard\/index$/, { timeout: 15_000 });
  }

  async submitCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}