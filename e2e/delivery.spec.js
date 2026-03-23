import { test, expect } from '@playwright/test';

test.describe('Delivery Person Fulfillment Flow (Live)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email or mobile/i).fill('delivery@example.com');
    await page.getByLabel(/password/i).fill('delivery');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 10000 }); // Wait for authentication to complete
  });

  test('Delivery person can view assigned orders', async ({ page }) => {
    // Note: since test runs against a fresh DB, the orders table might be empty at first.
    // We just verify the UI renders without crashing and shows the data table.
    // Verify Delivery route
    await page.goto('/delivery');
    await expect(page.getByRole('heading', { name: /My Delivery Orders/i })).toBeVisible({ timeout: 10000 });
    
    // Check table headers
    await expect(page.getByRole('columnheader', { name: /Order ID/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Customer/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Status/i })).toBeVisible();
  });
});
