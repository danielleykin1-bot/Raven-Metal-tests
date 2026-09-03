# Raven Metal Shop Test Plan

## 1. Purpose

This plan verifies that a customer can discover products, buy physical music
and concert tickets, pay safely, and receive an accurate order confirmation.
It also checks that staff-facing inventory and order records remain correct.

The plan is deliberately risk-based. A dated concert ticket or a successful
payment with a missing order is more urgent than a cosmetic alignment issue.

## 2. Assumptions and items to confirm

### Access note from 2026-09-03

The live URL `https://ravenmetal.co.il/` was requested from the test
environment, but the server returned Apache `406 Not Acceptable`. The `www`
host and HTTP variants returned the same response. Therefore the cases below
are a designed test pack, not a report of verified live behavior. Re-run the
discovery pass from an approved network or with site-owner access before
converting assumptions into observed results.

Before testing, record the answers in the test run:

| Item | Value to confirm |
|---|---|
| Test URL | `<TEST_URL>` |
| Production URL | `<PRODUCTION_URL>`; do not place real orders during QA |
| Payment environment | None available; stop at the payment page |
| Supported browsers | Chrome, Firefox, Edge, Safari and supported mobile versions |
| Currency, tax and shipping rules | `<BUSINESS_RULES>` |
| Ticket delivery and cancellation rules | `<TICKET_RULES>` |
| Stock reservation timing | `<RESERVATION_RULE>` |
| Email provider and mailbox | `<TEST_MAILBOX>`; unavailable until an approved test flow exists |
| Admin/order verification access | `<ADMIN_URL>` and least-privilege test account |
| Accessibility target | WCAG 2.1 AA, unless the product owner specifies another target |

When a rule is unknown, do not guess silently. Mark the case **Blocked**, ask
the product owner, and attach the answer to the test run.

## 3. Scope

### In scope

- Home page, navigation, search, category pages, filters, sorting, and pagination.
- Product details for CDs and vinyl: title, artist, format, price, image,
  availability, quantity, shipping information, and displayed condition.
- Concert event details: venue, date/time, ticket price, availability, and limits.
- Cart, quantity changes, removal, totals, shipping, tax, discounts, and mixed carts.
- Guest checkout and registered-user checkout, if both are offered.
- Address validation, order review, payment authorization, decline, timeout,
  cancellation, and 3DS redirect.
- Payment-page boundary, confirmation behavior only when a non-payment fixture
  or approved test endpoint exists, order history, ticket delivery, inventory
  rules, duplicate-submit protection, and refunds/cancellations where supported.
- Responsive layout, keyboard use, screen-reader basics, error messages,
  privacy/security controls, and supported browsers/devices.

### Out of scope unless requested

- Supplier systems, warehouse fulfillment beyond the order record, and real
  bank settlement.
- Load testing against production. Performance testing must use an approved
  environment and agreed traffic profile.
- Payment-provider certification; the provider's sandbox is used to verify the
  shop's integration and error handling.

## 4. Risk and priority

| Risk | Example failure | Priority |
|---|---|---|
| Payment/order mismatch | Card charged but no order, or two orders created | P0 |
| Ticket overselling | More tickets sold than available | P0 |
| Incorrect total | Shipping, tax, discount, or currency is wrong | P0 |
| Lost fulfillment data | Confirmation lacks address, ticket, or format details | P1 |
| Inventory inconsistency | Out-of-stock item can still be purchased | P1 |
| Broken customer journey | Checkout blocked by validation or old browser behavior | P1 |
| Accessibility/usability defect | Keyboard user cannot complete checkout | P1 |
| Cosmetic defect | Minor spacing or image presentation issue | P2 |

P0 cases block release. P1 cases require an explicit product-owner decision.

## 5. Test levels and approach

1. **Smoke:** Open the shop, find one in-stock CD, add it to a cart, and reach
   the payment step without submitting a real payment.
2. **Functional:** Execute all P0/P1 cases, including valid, invalid, boundary,
   empty, stale, and repeated-submit conditions.
3. **Integration:** Compare UI results with payment sandbox responses, email,
   inventory, and admin order records.
4. **Exploratory:** Use a time-boxed session around mixed carts, mobile checkout,
   dated events, interrupted payment, browser back/refresh, and unusual input.
5. **Regression:** Re-run all automated smoke cases and all affected manual
   P0/P1 cases after each release.
6. **Compatibility and accessibility:** Run the matrix below for the critical
   path, then expand for defects found.

## 6. Environment and data

Use isolated test data and reset it after each run where possible.

- Products: one in-stock CD, one in-stock vinyl, one out-of-stock item, one
  item with stock of 1, and one discounted item.
- Event: one future event with stock of 1, one sold-out event, and an event with
  a per-customer limit. Include an event with a timezone-sensitive start time.
- Customers: guest, new registered user, existing user, invalid email, and an
  address outside the delivery region.
- Payment boundary: no card entry or payment submission; use mocked provider
  responses or approved fixtures for decline, timeout, 3DS, and network-error
  handling only.
- Strings: ASCII, Hebrew, accented artist names, long titles, apostrophes,
  digits, empty input, leading/trailing spaces, and HTML-like characters.
- Boundary quantities: 0, 1, maximum allowed, maximum + 1, and stock + 1.

Never use real personal data, real card numbers, or production payment
credentials. Mask email, address, and order identifiers in evidence.

## 7. Compatibility matrix

At minimum, test the checkout journey on the officially supported versions of:

| Desktop | Mobile |
|---|---|
| Chrome | iOS Safari |
| Firefox | Android Chrome |
| Edge | One small-width device and one large-width device |
| Safari, if supported | Portrait and landscape |

Also test a slow network and a temporarily unavailable payment provider in a
non-production environment.

## 8. Entry and exit criteria

**Entry:** deploy is identified; test URL is reachable from an approved
network; test products/events exist; requirements and known limitations are
available; and no unresolved environment blocker exists. Payment tests may
not proceed beyond the payment page without an approved non-production flow.

**Exit:** all executable P0 cases pass; all P1 cases pass or have written
acceptance; automated pre-payment smoke tests pass; no open blocker/critical
defect remains; failed cases have reproducible evidence; and the owner accepts
the live-access and payment-flow limitations.

## 9. Defect reporting

Every defect should include: title, severity/priority, environment and build,
preconditions, exact steps, expected result, actual result, reproducibility,
order/product/event identifiers, screenshots or video, console/network logs,
and whether money or stock was affected. For payment defects, do not attach
card data or full personal information.

## 10. Automation strategy

Use Playwright or the team's existing browser framework. Keep E2E tests focused
on navigation through cart, checkout validation, totals, and reaching the
payment page. Do not enter card details or click a final payment/submit control.
Stub provider responses only in a controlled test harness; do not represent a
stubbed result as a real payment test. Do not automate only screenshots:
assert visible totals, validation messages, and payment-boundary state.

Recommended layers:

- Unit/component: price formatting, quantity rules, validation, and cart total calculations.
- API/integration: product availability, cart/checkout validation, stock rules,
  and payment-boundary request formation. Order creation, payment result
  mapping, and email delivery remain blocked without an approved test service.
- Browser E2E: search-to-cart, totals, empty cart, ticket purchase setup, and
  reaching payment without submission.
- Accessibility: automated axe scan plus manual keyboard and screen-reader checks.

Automation must use environment variables for URL and credentials, stable
data-test selectors, API setup/cleanup, isolated users, and a payment sandbox.
Avoid fixed sleeps; wait for a meaningful UI state or network response.

## 11. Reporting

For each run, record build, environment, tester, execution date, pass/fail/
blocked counts by priority, defect IDs, automated test run link, and a short
release recommendation. Keep payment and live-access cases visibly marked
**Blocked**, rather than treating them as passes or failures.