import { test, expect } from '@playwright/test';

test.describe('Admin Management Deep Flows (Live)', () => {

  test.beforeEach(async ({ page }) => {
    // Live login
    await page.goto('/login');
    await page.getByLabel(/email or mobile/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('admin');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Admin can view, add, edit, and delete Categories', async ({ page }) => {
    await page.goto('/admin/categories');
    
    // 2. Add Category
    const timestamp = Date.now();
    const categoryName = `Playwright Test Category ${timestamp}`;
    const addInput = page.getByLabel(/New Category Title/i);
    await addInput.fill(categoryName);
    const addButton = page.getByRole('button', { name: 'Add' });
    await expect(addButton).toBeEnabled();
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/category/all') && resp.status() === 200),
      addButton.click()
    ]);

    // Verify it added
    await expect(page.getByText(categoryName, { exact: true })).toBeVisible({ timeout: 10000 });

    // 3. Edit Category
    await page.locator('tr').filter({ hasText: categoryName }).locator('button').first().click();
    const editDialogInput = page.getByRole('dialog').getByLabel(/Category Title/i);
    await expect(editDialogInput).toBeVisible();
    const updatedName = `Playwright Updated Category ${timestamp}`;
    await editDialogInput.fill(updatedName);
    await page.getByRole('dialog').getByRole('button', { name: /Save/i }).click();

    await expect(page.getByText(updatedName, { exact: true })).toBeVisible();

    // 4. Delete Category
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr').filter({ hasText: updatedName }).locator('button').nth(1).click();
    await expect(page.getByText(updatedName, { exact: true })).not.toBeVisible();
  });

  test('Admin can add a new Product', async ({ page }) => {
    await page.goto('/admin/products');

    await page.getByRole('button', { name: /Add/i }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fill form
    await page.getByLabel(/^Title$/i).fill('Playwright Test Product');
    await page.getByLabel(/Description/i).fill('Latest model smartphone');
    await page.getByLabel(/Price/i).fill('699');
    
    // Save
    await dialog.getByRole('button', { name: /Save/i }).click();
    
    // Dialog closes
    await expect(dialog).not.toBeVisible();
  });

});
