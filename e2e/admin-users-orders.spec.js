import { test, expect } from '@playwright/test';

test.describe('Admin Users Management (Live)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email or mobile/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('admin');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Admin can view and create users', async ({ page }) => {
    // Verify Users route
    await page.goto('/admin/users');
    await expect(page.getByText(/User Management/i)).toBeVisible({ timeout: 10000 });

    const timestamp = Date.now();
    const email = `mark.playwright.${timestamp}@test.com`;

    await page.locator('input[name="firstName"]').fill('Mark');
    await page.locator('input[name="lastName"]').fill('Smith');
    await page.locator('input[name="emailId"]').fill(email);
    await page.locator('input[name="phoneNo"]').fill('9998887776');
    await page.locator('input[name="password"]').fill('Pass123!'); 
    
    await page.getByRole('button', { name: 'Create User' }).click();

    await expect(page.getByText('User registered successfully')).toBeVisible();
  });
});
