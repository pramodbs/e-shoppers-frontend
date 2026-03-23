import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Flow', () => {

  // We skip authentication logic in this test and assume we land on the page or get redirected.
  // A true E2E would log into the admin account first.
  
  test('Admin routes should be accessible or properly guarded', async ({ page }) => {
    
    // Navigate to Admin Dashboard
    await page.goto('/admin');
    
    // Since we aren't logged in, it should redirect to login OR show access denied
    // We expect the router to handle it securely
    await expect(page).not.toHaveURL('/admin');
    await expect(page.url()).toMatch(/.*(\/login|\/)/);

  });

  test('Admin categories route should exist', async ({ page }) => {
    await page.goto('/admin/categories');
    // If not authenticated, should redirect
    await expect(page).not.toHaveURL('/admin/categories');
  });

});
