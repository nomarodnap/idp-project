import { test, expect } from '@playwright/test';

test('has title and login form', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ระบบจัดทำแผนพัฒนารายบุคคล/);

  // Expect the login heading to be visible
  const heading = page.getByRole('heading', { name: 'เข้าสู่ระบบ' });
  await expect(heading).toBeVisible();

});

test('renders DPIS error banner and Safari hydration-safe tel links without errors', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/login?error=FirstTimeDPISLoginRequired');

  await expect(page.getByText('คุณยังไม่เคยเข้าสู่ระบบด้วย DPIS')).toBeVisible();
  await expect(page.locator('meta[name="format-detection"]')).toHaveAttribute('content', /telephone=no/);
  await expect(page.getByRole('link', { name: '025620600' })).toHaveAttribute('href', 'tel:025620600');
  await expect(page.getByRole('link', { name: '025795591' })).toHaveAttribute('href', 'tel:025795591');
  expect(pageErrors).toEqual([]);
});
