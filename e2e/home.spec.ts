import { test, expect } from '@playwright/test';

test('has title and login form', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ระบบจัดทำแผนพัฒนารายบุคคล/);

  // Expect the login heading to be visible
  const heading = page.getByRole('heading', { name: 'เข้าสู่ระบบ' });
  await expect(heading).toBeVisible();

});
