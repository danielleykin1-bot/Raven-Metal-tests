# Raven Metal Selenium Test Cases

These cases document the executable Selenium suite in
`selenium-tests/site.test.js`. The tests use a fresh headless Chrome session
for each case and default to `https://ravenmetal.co.il`. Set `SHOP_URL` to an
approved QA environment when appropriate.

## Automated cases

| ID | Priority | Tag | Preconditions | Steps | Expected result | Status |
|---|---|---|---|---|---|---|
| SEL-001 | P1 | smoke | Site is reachable | Open the homepage and inspect the title and the catalog, cart, account, and event-announcement links. | The Raven Metal page title is present and every link points to its expected public route. | Automated |
| SEL-002 | P1 | smoke | Fresh browser session; site is reachable | Open the homepage and accept the Hebrew cookie-consent notice. | Notice becomes visible, the control is interactable after its entrance animation, and it closes after acceptance. | Automated |
| SEL-003 | P1 | smoke | Catalog contains a product | Open the homepage, accept cookie consent, and open the first product detail link. | Browser reaches a `product_info.php?products_id=...` route and the page displays a shekel price. No cart action is taken. | Automated |
| SEL-004 | P1 | regression | Homepage announcement is available | Open the homepage and follow `לחצו כאן`. | Browser reaches `article_info.php?articles_id=44`; page shows one of the announced event names and no not-found message. | Automated |
| SEL-005 | P1 | regression | Public account and registration routes are available | Open the homepage, follow `החשבון שלי`, then follow the registration link. | Login route loads and its registration link opens `create_account.php`. No credentials are entered. | Automated |
| SEL-006 | P1 | regression | Registration page is reachable | Open `create_account.php` and inspect the email, password, and named input/select fields. | Email field is present, two password fields are present, and the form exposes customer fields. Form is not submitted. | Automated |
| SEL-007 | P1 | regression | Browser session has an empty cart | Open `shopping_cart.php` directly and inspect the visible text. | Cart shows the empty/zero-item state and does not show a payment control or payment step. | Automated |
| SEL-008 | P1 | regression | Public information routes are available | Open `/privacy.php`, `/conditions.php`, and `/accessibility.php` in turn. | Each page has the Raven Metal title and does not show a not-found message. | Automated |

## Manual and fixture-dependent cases

The following related automation candidates are **not implemented** by these
public-path Selenium tests:

| Scenario | Why not covered here | Required safe setup |
|---|---|---|
| Search, add-to-cart, quantity changes, removal, and total calculations | Mutates the live visitor cart or needs deterministic product and price fixtures | Isolated QA catalog/cart and cleanup |
| Checkout/payment handoff, decline, timeout, 3DS, and duplicate protection | Risks placing an order or contacting a payment provider | Payment sandbox, approved mocks, and explicit no-charge safeguards |
| Stock limits, sold-out products, and concurrent ticket purchase | Mutates shared inventory and requires concurrency fixtures | Resettable QA inventory/event stock |
| Login, logout, registration validation, and account creation | Submitting forms creates or accesses customer accounts | Disposable test accounts and approved email fixture |
| Confirmation, order history, email, cancellation, and refunds | Requires order, fulfillment, and payment-service integrations | Site-owner-provided non-production order fixtures |
| Accessibility conformance and broad browser/device support | Requires assistive-technology and viewport/browser matrix checks beyond this suite | Manual keyboard/screen-reader checks and approved browser matrix |

Never use real customer information, production credentials, or payment-card
data. Follow `MANUAL_TESTS.md` and `TEST_PLAN.md` for additional constraints.

## Running

```bash
npm run test:selenium
npm run test:selenium:smoke
npm run test:selenium:regression
```

See `SELENIUM_TEST_PLAN.md` for environment setup, configuration, execution
criteria, and traceability.
