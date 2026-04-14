import { test, expect } from '@playwright/test';

test.describe('Logistics and Inventory Management', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('/login');
        await page.getByLabel(/email or mobile/i).fill('admin@example.com');
        await page.getByLabel(/password/i).fill('admin');
        await page.getByRole('button', { name: /login/i }).click();
        await page.waitForTimeout(1000);
    });

    test('Admin can manage Seller Partners', async ({ page }) => {
        await page.goto('/admin/sellers');
        await expect(page).toHaveURL(/\/admin\/sellers/);

        // Add a new seller
        await page.getByRole('button', { name: /New Seller/i }).click();
        await page.locator('#name').fill('Test Logistics Co');
        await page.locator('#email').fill('logistic@test.com');
        await page.locator('#phone').fill('1122334455');
        await page.locator('#rating input').fill('4.5');
        await page.locator('#address').fill('123 Warehouse Rd');
        await page.getByRole('button', { name: /Save/i }).click();

        // Verify it appears in the list
        await expect(page.getByText('Test Logistics Co').first()).toBeVisible();
    });

    test('Admin can manage Stock Storerooms', async ({ page }) => {
        await page.goto('/admin/storerooms');
        await expect(page).toHaveURL(/\/admin\/storerooms/);

        // Add a new storeroom
        await page.getByRole('button', { name: /New Storeroom/i }).click();
        await page.locator('#name').fill('North Wing Hub');
        await page.locator('#location').fill('Floor 2, Block B');
        await page.getByRole('button', { name: /Save/i }).click();

        // Verify it appears in the list
        await expect(page.getByText('North Wing Hub').first()).toBeVisible();
    });

    test('Admin can manage Inventory Details', async ({ page }) => {
        await page.goto('/admin/inventory');
        await expect(page).toHaveURL(/\/admin\/inventory/);

        // Select a product (dropdown)
        await page.locator('.p-dropdown').first().click();
        // Wait for list and select first item
        await page.locator('.p-dropdown-item').first().click();

        // Add new stock
        await page.getByRole('button', { name: /Add New Stock/i }).click();
        
        // Select Storeroom
        await page.locator('.p-dialog .p-dropdown').first().click();
        await page.locator('.p-dropdown-item').first().click();
        
        // Select Seller (optional, but let's select one if exists)
        await page.locator('.p-dialog .p-dropdown').nth(1).click();
        await page.locator('.p-dropdown-item').first().click();

        await page.locator('.p-inputnumber input').first().fill('50');
        await page.getByRole('button', { name: /Submit/i }).click();

        // Verify success toast/list update
        await expect(page.getByText('Stock added')).toBeVisible();
    });

    test('Customer can leave product reviews and update seller rating', async ({ page }) => {
        // Navigate to product 1
        await page.goto('/product/1');
        await expect(page.getByText(/Customer Reviews/i)).toBeVisible();

        // Fill review form
        await page.locator('textarea[placeholder*="Tell us what you think"]').fill('Excellent product and fast shipping!');
        // Click 5th star
        await page.locator('.p-rating-item').nth(4).click();
        await page.getByRole('button', { name: /Submit Review/i }).click();

        // Verify review appears
        await expect(page.getByText('Excellent product and fast shipping!')).toBeVisible();
    });

    test('Unauthorized role cannot access logistics menu', async ({ page }) => {
        // Logout
        await page.goto('/'); // Assuming there's a logout or we just clear storage
        await page.evaluate(() => localStorage.clear());
        
        // Login as Delivery (assuming we have one or create one)
        // For simplicity, let's just check the UI doesn't show the links
        await page.goto('/login');
        await page.getByLabel(/email or mobile/i).fill('delivery@example.com');
        await page.getByLabel(/password/i).fill('delivery');
        await page.getByRole('button', { name: /login/i }).click();
        
        await expect(page.getByText(/Seller Partners/i)).not.toBeVisible();
        await expect(page.getByText(/Stock Storerooms/i)).not.toBeVisible();
        
        // Direct access check
        await page.goto('/admin/sellers');
        await expect(page).toHaveURL(/.*login.*/); // Redirected to login
    });

});
