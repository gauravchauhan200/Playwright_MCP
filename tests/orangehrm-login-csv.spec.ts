import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type LoginData = {
  Username: string;
  Password: string;
  Expected: string;
};

const loginData = parse(readFileSync(join(__dirname, '../test_data/loginData.csv')), {
  columns: true,
  skip_empty_lines: true,
  trim: true,
}) as LoginData[];

test.describe('CSV-driven login validation', () => {
  test.describe.configure({ retries: 2 });

  for (const data of loginData) {
    test(`${data.Username} expects ${data.Expected}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      try {
        await loginPage.open();
        await loginPage.submitCredentials(data.Username, data.Password);

        if (data.Expected === 'Dashboard') {
          await page.waitForURL(/\/dashboard\/index$/, { timeout: 15_000 });
          await expect(loginPage.dashboardHeading).toBeVisible();
        } else if (data.Expected === 'Invalid credentials') {
          await expect(loginPage.invalidCredentialsMessage).toBeVisible();
        } else {
          throw new Error(`Unsupported expected result: ${data.Expected}`);
        }

        console.log(`[PASS] ${data.Username}: expected ${data.Expected}`);
      } catch (error) {
        console.error(`[FAIL] ${data.Username}: expected ${data.Expected}`);
        throw error;
      }
    });
  }
});