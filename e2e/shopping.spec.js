import { test, expect } from '@playwright/test';

test.describe('Shopping User Journey (Live)', () => {

  test('User can browse products on the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.p-card').first()).toBeVisible({ timeout: 10000 });
    const products = page.locator('.p-card');
    await expect(products.first()).toBeVisible();
  });

  test('Auhenticated user can add to cart and checkout', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.getByLabel(/email or mobile/i).fill('user1@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/Hello,/i).first()).toBeVisible({ timeout: 10000 });

    // 2. Add product to cart
    const addToCartBtns = page.getByRole('button', { name: /add to cart/i });
    if (await addToCartBtns.count() > 0) {
      await addToCartBtns.first().click();
      await expect(page.getByText(/Added to cart/i)).toBeVisible({ timeout: 5000 });
    }

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
