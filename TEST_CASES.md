# Raven Metal Shop Test Cases

## How to read a case

`P0` is release-blocking, `P1` is high priority, and `P2` is lower risk.
Each case has a manual procedure. The **Automation** column identifies the
recommended automated layer; it is not a claim that automation already exists.

**Payment boundary:** Every case stops when the payment page is displayed.
Do not enter card data, click a final payment button, or place an order. For
payment-error behavior, use a site-owner-approved mock or fixture only. The
live URL currently returns Apache `406 Not Acceptable` from the test
environment, so live observations must be recorded as **Blocked** until access
is restored.

## Manual cases

| ID | Priority | Area | Preconditions | Steps | Expected result | Automation |
|---|---|---|---|---|---|---|
| MAN-001 | P1 | Navigation | Shop is reachable | Open home, category, product, cart, and checkout links | Each page loads; active navigation and back navigation are correct | E2E |
| MAN-002 | P1 | Search | Catalog contains known CD and vinyl | Search exact title, partial title, Hebrew text, no-result text, and special characters | Relevant results, useful empty state, no script execution or broken layout | E2E/API |
| MAN-003 | P1 | Product details | In-stock CD and vinyl exist | Open each product and compare title, format, artist, price, stock, image, and shipping text with source data | Details are accurate and add-to-cart control reflects availability | API + E2E |
| MAN-004 | P1 | Cart | In-stock CD exists | Add item, refresh, change quantity to 1, maximum, and maximum + 1 | Cart persists; invalid quantity is rejected; total and stock message are correct | E2E |
| MAN-005 | P1 | Cart | Cart has two items | Remove each item, then open cart directly | Removed item is gone; empty-cart state is actionable; no stale total remains | E2E |
| MAN-006 | P0 | Totals | Shipping/tax rules are documented | Buy CD, vinyl, discounted item, and mixed cart; vary destination | Subtotal, discount, shipping, tax, currency, and grand total match rules exactly | Unit/API/E2E |
| MAN-007 | P0 | Stock race | Product/event has stock of 1; two sessions available | Add/buy from two sessions concurrently and submit | At most one succeeds; loser gets a clear message; inventory is not negative | API/E2E |
| MAN-008 | P1 | Checkout validation | Cart has a shippable item | Submit blank, malformed, overlong, Hebrew, and boundary address/contact fields | Inline errors identify fields; valid data is accepted; no data is lost unexpectedly | Component/E2E |
| MAN-009 | P1 | Guest checkout | Cart has a physical item | Complete checkout as guest with valid data | Guest can pay if supported; confirmation includes order ID and delivery details | E2E |
| MAN-010 | P1 | Account checkout | Registered test user exists | Sign in, checkout, sign out, and inspect order history | Correct user sees only their order; sensitive data is not exposed | E2E/API |
| MAN-011 | P0 | Payment boundary | Valid cart and checkout data | Complete checkout fields and open the payment page; stop | Correct total, order summary, and payment-page handoff are displayed; no payment is submitted | E2E |
| MAN-012 | P0 | Payment error fixture | Approved mock/fixture exists | Trigger a mocked decline or provider error before submission; stop | Actionable error is shown; no real payment or order is created; cart remains usable | E2E/API mock |
| MAN-013 | P0 | Payment interruption | Approved mock/fixture exists | Interrupt the mocked redirect or simulate timeout; stop | Recoverable state is clear; retry control does not submit a real payment | E2E/API mock |
| MAN-014 | P0 | Duplicate submit protection | Valid checkout is ready | Inspect disabled state and, only with an approved mock, repeat the boundary request | UI/API prevents duplicate boundary requests; no real payment is submitted | API mock |
| MAN-015 | P1 | Concert ticket | Future event with ticket stock exists | Select quantity 1, maximum, maximum + 1; complete purchase | Event/date/venue/ticket quantity and limit are clear; ticket stock decrements correctly | E2E/API |
| MAN-016 | P1 | Sold-out event | Sold-out event exists | Open event and attempt direct add/checkout | Event says sold out and cannot be purchased through stale URL or old cart | E2E/API |
| MAN-017 | P1 | Mixed cart | CD and ticket are available | Add physical item and ticket; complete checkout | Delivery rules, fees, confirmation, and fulfillment states are correct for both | E2E/API |
| MAN-018 | P1 | Confirmation fixture | Approved order fixture or test endpoint exists | Inspect fixture-backed confirmation, email, and order history | Same order ID, items, quantities, totals, customer details, and status appear; otherwise mark Blocked | API/email fixture |
| MAN-019 | P1 | Security | Test account and checkout available | Try another order URL, alter price/product IDs, inject HTML-like values, and use expired session | Authorization holds; server recalculates price; input is encoded/rejected; session expires safely | API/security |
| MAN-020 | P1 | Accessibility | Checkout available | Complete with keyboard only; inspect focus, labels, errors, contrast, zoom 200% | All controls reachable and named; focus visible; errors announced; no critical overlap | axe + manual |
| MAN-021 | P1 | Responsive | Mobile devices available | Run search, cart, and checkout in portrait/landscape at small width | No horizontal scrolling or clipped Pay button; text and totals remain readable | Visual/E2E |
| MAN-022 | P1 | Recovery | Order/payment flow started | Refresh, use browser back, lose network, restore network | User sees recoverable state; no duplicate order; cart/order status is truthful | E2E |
| MAN-023 | P2 | Content/localization | Hebrew and accented data exist | Switch language if offered; inspect RTL text, dates, currency, and long titles | Direction, truncation, encoding, and formatting are correct | Visual/component |
| MAN-024 | P1 | Refund/cancel | Approved non-payment order fixture exists | Request cancellation/refund within and outside allowed window | Policy is enforced; order/ticket/inventory states update consistently; otherwise mark Blocked | API fixture + manual |

## Automated cases

These are the first automation candidates. They should be tagged `smoke`,
`regression`, or `payment-sandbox` in the chosen framework.

| ID | Tag | Automated scenario and assertions |
|---|---|---|
| AUTO-001 | smoke | Search a seeded product, open details, add to cart, and assert product name, quantity, and price. |
| AUTO-002 | smoke | Complete checkout fields, reach the payment page, and assert expected total, order summary, and payment handoff without submitting. |
| AUTO-003 | regression | Trigger an approved mocked decline before submission and assert an error, no real order/payment, and a reusable cart. |
| AUTO-004 | regression | Add two products, edit quantities, remove one, and assert the total after each operation. |
| AUTO-005 | regression | Attempt quantity above stock and assert server and UI rejection. |
| AUTO-006 | regression | Attempt two concurrent ticket purchases for one remaining ticket and assert one success and one controlled conflict. |
| AUTO-007 | payment-mock | Run mocked 3DS and cancelled 3DS handoffs without entering payment data; assert correct pre-payment states. |
| AUTO-008 | regression | With an approved mock only, repeat the payment-boundary request and assert idempotency; never assert a real charge. |
| AUTO-009 | regression | Open a sold-out product/event from a direct URL and assert add/purchase is unavailable. |
| AUTO-010 | regression | Compare approved confirmation/order-history/email fixtures for order ID, lines, totals, and status; skip when fixtures are unavailable. |
| AUTO-011 | accessibility | Run axe on home, product, cart, checkout, and error states; fail on serious or critical violations. |
| AUTO-012 | compatibility | Run the smoke journey in the supported desktop and mobile browser projects. |
| AUTO-013 | security | Attempt unauthorized order lookup and client-side price manipulation; assert server denial/recalculation. |
| AUTO-014 | recovery | Simulate network failure before payment submission, retry the handoff, and assert no duplicate request or real charge. |

## Suggested automation skeleton

The following is illustrative Playwright pseudocode. Adapt selectors and API
routes to the real application; stable `data-testid` values are preferable to
CSS classes or visible copy that frequently changes.

```ts
test('checkout reaches payment without submitting', async ({ page }) => {
  await page.goto(process.env.SHOP_URL!);
  await page.getByTestId('search').fill('known-cd');
  await page.getByTestId('product-card').first().click();
  await page.getByRole('button', { name: /add to cart/i }).click();
  await page.getByRole('link', { name: /cart/i }).click();
  await page.getByRole('button', { name: /checkout/i }).click();
  await page.getByTestId('email').fill('qa@example.test');
  // Fill only documented non-payment checkout fields, then stop.
  await expect(page.getByTestId('payment-page')).toBeVisible();
  await expect(page.getByTestId('grand-total')).toBeVisible();
});
```

The test must create or reserve its own product data and must not send payment,
email, or order-submission requests. The selectors are illustrative and must
be adapted to the real site after access is restored.