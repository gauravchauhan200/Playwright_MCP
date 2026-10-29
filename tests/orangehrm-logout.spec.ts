import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2 });

test('logs out and returns to the login page', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded',
  });

  const username = page.getByRole('textbox', { name: 'Username' });
  await expect(username).toBeVisible({ timeout: 15_000 });
  await username.fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL(/\/dashboard\/index$/, { timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15_000 });
  await page.getByRole('banner').getByRole('listitem').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await page.waitForURL(/\/auth\/login$/, { timeout: 15_000 });
  await expect(username).toBeVisible({ timeout: 15_000 });
});