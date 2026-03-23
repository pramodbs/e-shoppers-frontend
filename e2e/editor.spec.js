import { test, expect } from '@playwright/test';

test.describe('Editor Marketing Campaign Flow (Live)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email or mobile/i).fill('editor@example.com');
    await page.getByLabel(/password/i).fill('editor');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Editor can create a new Ad campaign', async ({ page }) => {
    await page.goto('/admin/ads');
    await expect(page.getByRole('heading', { name: 'Ads', exact: true })).toBeVisible({ timeout: 10000 });

    // Add ad
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    
    // Dialog opens
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const timestamp = Date.now();
    const adTitle = `Playwright Test Ad Campaign ${timestamp}`;
    await dialog.getByLabel(/Title/i).fill(adTitle);
    await dialog.getByLabel(/Content/i).fill('50% Off Everything');
    await dialog.getByLabel(/Image URL/i).fill('https://via.placeholder.com/800x400');
    await dialog.getByLabel(/Category ID/i).fill('1');
    
    await dialog.getByRole('button', { name: /Save/i }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('Editor can manage Offers', async ({ page }) => {
    await page.goto('/admin/offers');
    await expect(page.getByRole('heading', { name: 'Offers', exact: true })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Add', exact: true }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const timestamp = Date.now();
    const offerName = `Playwright Special Offer ${timestamp}`;
    await dialog.getByLabel(/Name/i).fill(offerName);
    await dialog.getByLabel(/Description/i).fill('Buy 1 Get 1 Free');
    await dialog.getByLabel(/Category ID/i).fill('1');
    await dialog.getByLabel(/Discount %/i).fill('25');
    await dialog.getByLabel(/Min Spend/i).fill('100');
    
    await dialog.getByRole('button', { name: /Save/i }).click();
    await expect(dialog).not.toBeVisible();
  });
});
