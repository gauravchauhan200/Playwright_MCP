import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2 });

test('logs in and displays the dashboard', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded',
  });

  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/dashboard\/index$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});