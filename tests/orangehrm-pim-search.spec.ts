import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';

test.describe.configure({ retries: 2 });

test('searches for an employee in PIM', async ({ page }) => {
  test.setTimeout(60_000);

  const loginPage = new LoginPage(page);
  const pimPage = new PimPage(page);

  await loginPage.open();
  await loginPage.login('Admin', 'admin123');
  await pimPage.open();

  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();

  await pimPage.searchByEmployeeName('Amelia');

  await expect(pimPage.employeeResultRow('Amelia Brown')).toBeVisible();
});