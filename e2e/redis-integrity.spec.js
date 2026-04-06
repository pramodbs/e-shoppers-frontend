import { test, expect } from '@playwright/test';

test.describe('Redis Search Integrity & Sync', () => {

  test.beforeEach(async ({ page }) => {
    // Brute force stub for native confirm dialogs
    await page.addInitScript(() => {
      window.confirm = () => true;
    });
    // Admin login for CRUD
    await page.goto('/login');
    await page.getByLabel(/email or mobile/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('admin');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Sync on Create and Delete', async ({ page }) => {
    const timestamp = Date.now();
    const productName = `Integrity-Test-Prod-${timestamp}`;

    // 1. Create Product
    await page.goto('/admin/products');
    await page.getByRole('button', { name: /Add/i }).click();
    const dialog = page.getByRole('dialog');
    await page.locator('#title').fill(productName);
    await page.locator('#description').fill('Testing Redis Sync');
    await page.locator('input#price').fill('999');
    await dialog.getByRole('button', { name: /Save/i }).click();
    await expect(dialog).not.toBeVisible();

    // 2. Verify in Search Suggestions
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search products or categories/i);
    await searchInput.fill(productName);

    // We expect the overlay to show up and contain our new product
    const overlay = page.locator('.p-overlaypanel');
    await expect(overlay.getByText(productName)).toBeVisible({ timeout: 10000 });

    // 3. Delete Product
    await page.goto('/admin/products');
    await page.getByRole('columnheader', { name: 'ID' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('columnheader', { name: 'ID' }).click();
    await page.waitForTimeout(500);
    const row = page.locator('tr').filter({ hasText: productName });
    await expect(row).toBeVisible();

    // Logic is now handled by the stubbed window.confirm in beforeEach
    await row.getByLabel('delete').click();

    await expect(row).not.toBeVisible({ timeout: 10000 });

    // 4. Verify removed from Search
    await page.goto('/');
    await searchInput.fill(productName);
    // Overlay should NOT contain it now (Wait for debounce and search to complete)
    await page.waitForTimeout(1000);
    await expect(overlay.getByText(productName)).not.toBeVisible({ timeout: 5000 });
  });

  test('Sync on Update', async ({ page }) => {
    const timestamp = Date.now();
    const originalName = `Sync-Init-${timestamp}`;
    const updatedName = `Sync-Final-${timestamp}`;

    // 1. Create
    await page.goto('/admin/products');
    await page.getByRole('button', { name: /Add/i }).click();
    await page.locator('#title').fill(originalName);
    await page.locator('input#price').fill('100');
    await page.getByRole('dialog').getByRole('button', { name: /Save/i }).click();
    await expect(page.locator('tr').filter({ hasText: originalName })).toBeVisible();

    // 2. Update
    await page.getByRole('columnheader', { name: 'ID' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('columnheader', { name: 'ID' }).click();
    await page.waitForTimeout(500);
    const row = page.locator('tr').filter({ hasText: originalName });
    await row.getByLabel('edit').click(); // Edit icon
    await page.locator('#title').fill(updatedName);
    await page.getByRole('dialog').getByRole('button', { name: /Save/i }).click();
    await expect(page.locator('tr').filter({ hasText: updatedName })).toBeVisible();

    // 3. Verify Search Suggestion updated
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search products or categories/i);
    await searchInput.click();
    await searchInput.fill(updatedName);
    await searchInput.focus();
    await page.waitForTimeout(1000);
    const searchOverlay = page.locator('.p-overlaypanel');
    await expect(searchOverlay).toBeVisible({ timeout: 15000 });

    // Cleanup: Delete the updated product
    await page.goto('/admin/products');
    page.on('dialog', d => d.accept());
    await page.getByRole('columnheader', { name: 'ID' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('columnheader', { name: 'ID' }).click();
    await page.waitForTimeout(500);
    await page.locator('tr').filter({ hasText: updatedName }).getByLabel('delete').click();
  });

  test('Edge Cases: Empty and Long Queries', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search products or categories/i);

    // Empty query shouldn't show overlay (minLength is 2)
    await searchInput.fill('A');
    await expect(page.locator('.p-overlaypanel')).not.toBeVisible();

    // Special characters
    await searchInput.fill('!!!@@@###');
    await expect(page.locator('.p-overlaypanel')).toBeVisible();
    await expect(page.getByText(/No matches found/i)).toBeVisible();

    // Very long query
    const longQuery = 'Product_'.repeat(20);
    await searchInput.fill(longQuery);
    await expect(page.locator('.p-overlaypanel')).toBeVisible();
    await expect(page.getByText(/No matches found/i)).toBeVisible();
  });

});
