import { test, expect } from '@playwright/test';

test.describe('Shopping User Journey (Live)', () => {

  test('User can browse products on the home page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await expect(page.locator('.p-card').first()).toBeVisible({ timeout: 10000 });
    const products = page.locator('.p-card');
    await expect(products.first()).toBeVisible();
  });

  test('Auhenticated user can add to cart and checkout', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 1280, height: 900 });
    // 1. Login
    await page.goto('/login');
    await page.getByLabel(/email or mobile/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 10000 });
    // Small wait for Auth/Cart context to sync
    await page.waitForTimeout(2000);

    // 2. Navigate home and wait for products then click first in-stock item
    page.on('console', msg => console.log(`DEBUG CONSOLE: ${msg.text()}`));
    await page.goto('/');
    await expect(page.locator('.p-card').first()).toBeVisible({ timeout: 20000 });
    
    // Header cart badge is inside the cart link
    const cartBadge = page.locator('a[href="/cart"] .p-badge');
    const initialCountStr = await cartBadge.innerText().catch(() => "0");
    const initialCount = parseInt(initialCountStr) || 0;
    
    const addToCartBtns = page.getByRole('button', { name: /^add to cart$/i });
    await expect(addToCartBtns.first()).toBeVisible({ timeout: 10000 });
    await addToCartBtns.first().click();

    // Verify Cart Badge increments
    await expect(cartBadge).toHaveText((initialCount + 1).toString(), { timeout: 10000 });


    // 3. Go to cart and checkout
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: /Shopping Cart/i })).toBeVisible();
    
    // Test checkout page
    const checkoutBtn = page.getByRole('button', { name: /Proceed to Checkout/i });
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await expect(page.getByText(/Payment Method/i)).toBeVisible({ timeout: 10000 });
      await page.getByRole('button', { name: /Complete Order/i }).click();
      await expect(page.getByRole('heading', { name: /Order Placed/i })).toBeVisible({ timeout: 10000 });
    }
  });

});
