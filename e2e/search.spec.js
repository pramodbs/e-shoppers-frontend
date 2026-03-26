import { test, expect } from '@playwright/test';

test.describe('Redis Search Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Ensure desktop viewport so search bar is visible
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Real-time search suggestions show products and categories', async ({ page }) => {
    await page.goto('/');
    
    // Find search input
    const searchInput = page.getByPlaceholder(/search products or categories/i);
    await expect(searchInput).toBeVisible();

    // Type query
    await searchInput.fill('Airdopes');
    
    // Wait for overlay
    const overlay = page.locator('.p-overlaypanel');
    await expect(overlay).toBeVisible();

    // Verify product suggestion
    await expect(overlay.getByText(/Boat Airdopes/i).first()).toBeVisible();

    // Verify "View All Results" link
    const viewAll = overlay.getByText(/View All Results/i);
    await expect(viewAll).toBeVisible();

    // Click "View All Results"
    await viewAll.click();

    // Verify navigation to search page
    await expect(page).toHaveURL(/\/search\?q=Airdopes/);
    await expect(page.locator('h1')).toContainText(/Results for "Airdopes"/i);
  });

  test('Can search for categories specifically', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search products or categories/i);
    await searchInput.fill('Elect');
    
    const overlay = page.locator('.p-overlaypanel');
    await expect(overlay).toBeVisible();

    // Verify category suggestion
    await expect(overlay.getByText(/Electronics/i).first()).toBeVisible();

    // Click category suggestion
    const catSuggestion = overlay.getByText(/Electronics/i).first();
    const catName = await catSuggestion.innerText();
    await catSuggestion.click();

    // Verify search page navigation
    await expect(page).toHaveURL(`/search?q=${encodeURIComponent(catName)}`);
    await expect(page.locator('h1')).toContainText(new RegExp(`Results for "${catName}"`, 'i'));
  });

  test('Pressing Enter triggers full search', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search products or categories/i);
    await searchInput.fill('Fashion');
    await searchInput.press('Enter');

    // Verify direct navigation to search page
    await expect(page).toHaveURL(/\/search\?q=Fashion/);
    await expect(page.getByText(/Matching Products/i)).toBeVisible();
  });

});
