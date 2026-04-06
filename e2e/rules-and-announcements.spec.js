import { test, expect } from '@playwright/test';

test.describe('Rules and Announcements Management', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('/login');
        await page.getByLabel(/email or mobile/i).fill('admin@example.com');
        await page.getByLabel(/password/i).fill('admin');
        await page.getByRole('button', { name: /login/i }).click();
        await page.waitForTimeout(1000);
    });

    test('Admin can manage Engagement Rules', async ({ page }) => {
        await page.goto('/admin/rules');
        await expect(page).toHaveURL(/\/admin\/rules/);

        // Add a new Rule
        await page.getByRole('button', { name: /Add Rule/i }).click();
        
        await page.locator('#ruleName').fill('Test Rule E2E');
        await page.locator('#ruleTrigger').fill('CART_ADD');
        await page.locator('#ruleCatId').fill('1');
        await page.locator('#ruleMinSpend input').fill('500');
        await page.locator('#ruleAction').fill('SEND_AD');
        await page.locator('#ruleRef').fill('123');

        await page.getByRole('button', { name: /Save/i }).click();

        // Verify it appears in the list
        await expect(page.getByText('Test Rule E2E')).toBeVisible({ timeout: 10000 });
    });

    test('Admin can manage Announcements (Notifications)', async ({ page }) => {
        await page.goto('/admin/announcements');
        await expect(page).toHaveURL(/\/admin\/announcements/);

        // Add a new Announcement
        await page.getByRole('button', { name: /Add Announcement/i }).click();
        
        await page.locator('#annTitle').fill('System Update E2E');
        await page.locator('#annMsg').fill('We are performing an E2E test on the system notifications.');

        await page.getByRole('button', { name: /Save/i }).click();

        // Verify it appears in the list
        await expect(page.getByText('System Update E2E')).toBeVisible({ timeout: 10000 });
    });

});
