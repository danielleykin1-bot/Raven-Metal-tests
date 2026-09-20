import { expect, test } from '@playwright/test';

test.describe('Raven Metal public-site smoke', () => {
  test('@smoke homepage exposes the shop entry points', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/מטאל זה אנחנו/i);
    await expect(page.getByRole('link', { name: 'קטלוג' })).toHaveAttribute(
      'href',
      /index\.php/,
    );
    await expect(page.getByRole('link', { name: 'תכולת הסל' })).toHaveAttribute(
      'href',
      /shopping_cart\.php/,
    );
    await expect(page.getByRole('link', { name: 'החשבון שלי' })).toHaveAttribute(
      'href',
      /account\.php/,
    );
    await expect(page.getByRole('link', { name: 'לחצו כאן' })).toHaveAttribute(
      'href',
      /article_info\.php\?articles_id=44/,
    );
  });

  test('@smoke cookie consent can be accepted in an isolated context', async ({
    page,
  }) => {
    await page.goto('/');

    const consent = page.getByRole('button', { name: 'אישור' });
    await expect(consent).toBeVisible();
    await consent.click();
    await expect(consent).toBeHidden();
  });

  test('@smoke catalog lists products and opens a product detail page', async ({
    page,
  }) => {
    await page.goto('/');

    const product = page
      .getByRole('link', { name: /Tomorrow's Rain|CLOUDS OF WAR|NAIL WITHIN/i })
      .first();
    await expect(product).toBeVisible();
    await product.click();

    await expect(page).toHaveURL(/product_info\.php\?products_id=\d+/);
    await expect(page.locator('body')).toContainText(/₪|ש"ח/);
  });
});

test.describe('Raven Metal public navigation regression', () => {
  test('@regression article link reaches the event information page', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'לחצו כאן' }).click();

    await expect(page).toHaveURL(/article_info\.php\?articles_id=44/);
    await expect(page.locator('body')).not.toContainText(/404|not found/i);
    await expect(page.locator('body')).toContainText(/SEPTICFLESH|PARADISE LOST|BLIND GUARDIAN/i);
  });

  test('@regression account link reaches login and exposes registration', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'החשבון שלי' }).click();

    await expect(page).toHaveURL(/login\.php/);
    await expect(page.locator('a[href*="create_account.php"]')).toHaveCount(1);
  });

  test('@regression registration page has required customer fields', async ({
    page,
  }) => {
    await page.goto('/create_account.php');

    await expect(page).toHaveURL(/create_account\.php/);
    await expect(page.locator('input[type="email"], input[name*="email" i]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
    expect(await page.locator('input[name], select[name]').count()).toBeGreaterThan(0);
  });

  test('@regression empty cart is truthful and does not expose checkout', async ({
    page,
  }) => {
    await page.goto('/shopping_cart.php');

    await expect(page).toHaveURL(/shopping_cart\.php/);
    await expect(page.locator('body')).toContainText(/0 פריטים|ריק|empty/i);
    await expect(page.locator('body')).not.toContainText(/payment|תשלום/i);
  });

  test('@regression policy and accessibility pages are reachable', async ({ page }) => {
    for (const path of ['/privacy.php', '/conditions.php', '/accessibility.php']) {
      await page.goto(path);
      await expect(page).toHaveTitle(/מטאל זה אנחנו/i);
      await expect(page.locator('body')).not.toContainText(/404|not found/i);
    }
  });
});
