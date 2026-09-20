# Raven Metal manual test suite

These cases cover behavior that should not be exercised against the live shop
by automation. Use an approved QA environment, disposable data, and a payment
provider sandbox. Never enter real card data or place a production order.

| ID | Priority | Scenario | Steps | Expected result |
|---|---|---|---|---|
| MAN-001 | P0 | Payment handoff | Add an in-stock CD, complete non-payment checkout fields, and stop when the payment page opens. | The amount, currency, customer details, shipping, and line items are correct; no payment request is submitted. |
| MAN-002 | P0 | Payment decline | With an approved provider fixture, trigger a decline before payment submission. | An actionable error is shown, no order/charge is created, and the cart remains usable. |
| MAN-003 | P0 | Payment timeout and 3DS cancel | Use approved timeout, failed 3DS, and cancelled 3DS fixtures. | Each state is recoverable, truthful, and cannot create a duplicate order. |
| MAN-004 | P0 | Duplicate submit | Double-click the final handoff and repeat it with an approved mock. | Only one idempotent request/order is created; the control is disabled while pending. |
| MAN-005 | P0 | Stock race | Use two sessions to buy the final unit or final ticket concurrently. | At most one purchase succeeds; the other receives a clear conflict and stock never becomes negative. |
| MAN-006 | P0 | Order totals | Compare CD, vinyl, discount, shipping, tax, and mixed-cart totals with the documented rules. | Subtotal, discount, delivery, tax, rounding, currency, and grand total are exact. |
| MAN-007 | P1 | Checkout validation | Submit blank, malformed, overlong, Hebrew, and boundary values in every address/contact field. | Errors identify the field, valid data is retained, and unsafe input is rejected or encoded. |
| MAN-008 | P1 | Guest checkout | Complete checkout as a guest with a physical item. | Guest policy is honored; payment handoff contains the right order summary. |
| MAN-009 | P1 | Login/logout | Use an isolated account, log in, refresh a protected page, log out, and revisit it. | Authentication and logout work; private data is not visible after logout. |
| MAN-010 | P1 | Registration | Submit empty, invalid-email, mismatched-password, duplicate-email, and valid disposable-user data. | Field errors are clear; only the valid case creates one account and follows the email policy. |
| MAN-011 | P1 | Ticket limits | Buy 1, maximum, and maximum + 1 tickets for a future event. | Venue/date/quantity/limit are clear and the server enforces the limit. |
| MAN-012 | P1 | Sold-out inventory | Open a sold-out item/event directly and attempt to add it from a stale page/cart. | It remains unavailable and cannot be purchased through a stale URL or cart. |
| MAN-013 | P1 | Recovery | Refresh, use Back, disconnect/reconnect the network, and retry before payment. | The state is recoverable and no duplicate request/order is made. |
| MAN-014 | P1 | Accessibility | Complete search/cart/checkout using keyboard only; test 200% zoom and a screen reader. | Focus order, labels, Hebrew RTL reading order, errors, contrast, and controls are usable. |
| MAN-015 | P1 | Responsive/browser coverage | Run the critical journey on Chrome, Firefox, Edge, Safari, iOS Safari, and Android Chrome in portrait/landscape. | No clipped controls, horizontal scrolling, broken RTL layout, or unreadable totals. |
| MAN-016 | P1 | Confirmation and fulfillment | With an approved fixture, compare confirmation, email, order history, ticket details, and inventory. | Order ID, lines, quantities, totals, customer data, status, and fulfillment details match everywhere. |
| MAN-017 | P1 | Cancellation/refund | Use an approved non-payment order within and outside the allowed cancellation window. | Policy is enforced and order, ticket, inventory, and refund states remain consistent. |
| MAN-018 | P1 | Security | Change product/price/order IDs, use another order URL, inject HTML-like values, and use an expired session. | Authorization is enforced, prices are recalculated server-side, and input is safely encoded/rejected. |
| MAN-019 | P2 | Localization/content | Inspect long Hebrew/English/accented titles, dates, prices, policies, and RTL alignment. | Text is encoded, not clipped, and formatted consistently without broken directionality. |

For execution evidence record environment/build, browser/device, case ID,
result, screenshots/video, console/network logs, and any product, order, or
event identifier. Mask personal data and never attach card details.
