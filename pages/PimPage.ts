import { Page } from '@playwright/test';

export class PimPage {
  private readonly page: Page;
  private readonly pimLink;
  private readonly employeeNameInput;
  private readonly searchButton;

  constructor(page: Page) {
    this.page = page;
    this.pimLink = page.getByRole('link', { name: 'PIM', exact: true });
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' }).first();
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
  }

  async open(): Promise<void> {
    await this.pimLink.click();
    await this.page.waitForURL(/\/pim\/viewEmployeeList$/, { timeout: 15_000 });
  }

  async searchByEmployeeName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.page.getByRole('option', { name }).click();
    await this.searchButton.click();
  }

  employeeResultRow(name: string) {
    return this.page.getByRole('table').getByRole('row').filter({ hasText: name });
  }
}