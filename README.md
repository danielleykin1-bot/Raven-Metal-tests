# Raven Metal Shop QA Pack

Test planning and test cases for the Raven Metal online shop, which sells CDs,
vinyl records, and concert tickets.

## Documents

- [Test plan](TEST_PLAN.md): scope, risks, environments, test data, entry and exit criteria, and execution guidance.
- [Test cases](TEST_CASES.md): manual cases and automation candidates with priorities and traceability.
- [Manual suite](MANUAL_TESTS.md): scenarios requiring a QA environment, payment fixture, concurrency, or human accessibility review.
- [Playwright suite](tests/site.spec.ts): safe public-site smoke and navigation regression tests.

## Running browser tests

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Set `SHOP_URL` to an approved QA environment to avoid exercising production.
The suite intentionally stops at public navigation and an empty cart; it does
not submit credentials, payments, or orders.

The shop URL, supported browsers, payment provider, ticket rules, and test
credentials are intentionally not assumed in this repository. Replace the
placeholders in the plan before execution, and use a payment sandbox or a
provider-approved test card only.
