# Raven Metal Selenium Test Plan

## Purpose

This plan describes the Selenium WebDriver suite in
`selenium-tests/site.test.js`. The suite protects safe, public customer
journeys on Raven Metal: core navigation, cookie consent, product details,
account/registration entry points, an empty cart, and policy pages.

The site is a live store. Tests must not make a purchase, submit account
credentials, register an account, change inventory, or send customer data.
Checkout, payment, order creation, inventory races, and authenticated behavior
require an approved non-production environment and dedicated fixtures; they
are intentionally outside the executable Selenium suite.

## Test environment

| Setting | Default / requirement |
|---|---|
| Base URL | `https://ravenmetal.co.il` |
| Override | Set `SHOP_URL` to an approved QA deployment |
| Runtime | Node.js 20 or newer |
| Browser | Chrome or Chromium, headless |
| Driver | Selenium Manager resolves ChromeDriver |
| Browser path | Set `CHROME_BIN` when the executable is not auto-discovered |
| Timeout | 15 seconds; override with `SELENIUM_TIMEOUT_MS` |
| Dependencies | Install with `npm install` |

Tests each create and quit an isolated WebDriver session. Cookie acceptance
changes only that browser session's consent state. The product test opens a
detail page and does not add the product to the cart.

## Execution

```bash
npm install
npm run test:selenium
npm run test:selenium:smoke
npm run test:selenium:regression
```

To point tests at a QA environment:

```powershell
$env:SHOP_URL = "https://<approved-qa-host>"
npm run test:selenium
```

The Node.js test runner reports each case as pass, fail, or skipped. A test
failure should include its case ID, target URL/environment, browser version,
assertion and error output. Do not include session IDs, personal data, or
credentials in shared logs.

## Coverage and traceability

| Selenium case | Test case in code | Related case / requirement | Coverage |
|---|---|---|---|
| SEL-001 | `@smoke homepage displays the shop entry points` | AUTO-015 navigation baseline; MAN-001 | Homepage title and catalog, cart, account, and event links |
| SEL-002 | `@smoke cookie notice can be accepted` | AUTO-015; MAN-025 | Consent is visible and can be dismissed |
| SEL-003 | `@smoke catalog product opens a detail page` | AUTO-001 (navigation portion); MAN-003 | Product detail route and displayed shekel price; does not add to cart |
| SEL-004 | `@regression event announcement opens its article` | AUTO-016 (public-link portion); MAN-026 | Article route, expected event names, and absence of a not-found message |
| SEL-005 | `@regression account and registration links reach their public pages` | AUTO-016; MAN-027/MAN-028 | Homepage account link reaches login, then registration |
| SEL-006 | `@regression registration form exposes customer fields without submitting` | AUTO-017 (form-presence portion); MAN-029 | Registration page exposes email, password, and named customer fields |
| SEL-007 | `@regression empty cart shows no items and no payment controls` | MAN-005 | Empty-cart state and no payment UI |
| SEL-008 | `@regression privacy, terms, and accessibility pages load` | MAN-020/MAN-023 | Policy and accessibility destinations load without a not-found response |

These tests do **not** complete all scenarios in the associated AUTO or MAN
cases. Form validation, registration/login submissions, cart mutation,
checkout, payment, inventory, accessibility conformance, browser compatibility,
security, and recovery require separate approved tests or human review.
See `SELENIUM_TEST_CASES.md` for steps and expected results.

## Entry and exit criteria

**Entry:** the chosen host is approved for browser testing; Node.js 20+, npm,
Chrome/Chromium, and installed project dependencies are available; the test
environment is reachable.

**Exit:** the Selenium smoke and regression commands pass, or every failure is
reported with evidence and a disposition. A skipped or blocked case is not a
pass. A failure caused by an unavailable site or unsupported environment must
be distinguished from an application defect.

## Maintenance

- Keep assertions on customer-visible behavior and public URLs.
- Prefer explicit waits for page state over fixed delays.
- Update the case catalog whenever a Selenium test is added, removed, or
  changes behavior.
- Do not add selectors or setup that submit registration/login, add products,
  create orders, or reach a payment submission control on the live site.
- Keep fixture-dependent flows in an approved QA environment and document
  their safeguards before automating them.
