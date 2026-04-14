import { test, expect } from '@playwright/test';

test.describe('Redis Search Functionality', () => {
  
  test.beforeAll(async ({ request }) => {
    // 1. Login to get token for reindex
    const loginRes = await request.post('/api/user/login', {
      data: {
        identifier: 'admin@example.com',
        password: 'admin'
      }
    });
    const { token } = await loginRes.json();

    // 2. Trigger reindex
    await request.post('/api/search/reindex', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // 3. Small delay for Redis to catch up
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test.beforeEach(async ({ page }) => {
    // Ensure desktop viewport so search bar is visible
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Real-time search suggestions show products and categories', async ({ page }) => {
    await page.goto('/');
    
    // Find search input
    const searchInput = page.getByPlaceholder(/search products or categories/i);
    await expect(searchInput).toBeVisible();

    // Type query and wait for debounce
    await searchInput.fill('Airdopes');
    await page.waitForTimeout(1000);
    
    // Wait for overlay
    const overlay = page.locator('.p-overlaypanel');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    // Verify product suggestion
    await expect(overlay.getByText(/Boat Airdopes/i).first()).toBeVisible({ timeout: 8000 });

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
    await page.waitForTimeout(1000);
    
    const overlay = page.locator('.p-overlaypanel');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    // Verify category suggestion
    await expect(overlay.getByText(/Electronics/i).first()).toBeVisible({ timeout: 8000 });

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
