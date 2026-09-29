# Raven Metal Shop QA Pack

Test planning and test cases for the Raven Metal online shop, which sells CDs,
vinyl records, and concert tickets.

## Documents

- [Test plan](TEST_PLAN.md): scope, risks, environments, test data, entry and exit criteria, and execution guidance.
- [Test cases](TEST_CASES.md): manual cases and automation candidates with priorities and traceability.
- [Manual suite](MANUAL_TESTS.md): scenarios requiring a QA environment, payment fixture, concurrency, or human accessibility review.
- [Playwright suite](tests/site.spec.ts): safe public-site smoke and navigation regression tests.
- [Selenium suite](selenium-tests/site.test.js): Selenium WebDriver smoke and regression coverage for safe public-site journeys.
- [Selenium test plan](SELENIUM_TEST_PLAN.md): Selenium environment, coverage, execution, and maintenance guidance.
- [Selenium test cases](SELENIUM_TEST_CASES.md): documented Selenium steps, expected outcomes, and fixture-dependent exclusions.
- [Azure DevOps integration](AZURE_DEVOPS.md): pipeline setup, Test Plans case import, and automated-result association.
- [Azure Test Plans import file](azure/test-cases.csv): Selenium cases in Azure DevOps CSV import format.

## Running Playwright tests

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Set `SHOP_URL` to an approved QA environment to avoid exercising production.
The suite intentionally stops at public navigation and an empty cart; it does
not submit credentials, payments, or orders.

## Running Selenium tests

Requires Node.js 20 or newer and Chrome or Chromium. Selenium Manager resolves
the matching ChromeDriver; set `CHROME_BIN` if the browser executable is not
installed in a standard location.

```bash
npm install
npm run test:selenium
npm run test:selenium:smoke
npm run test:selenium:regression
```

Set `SHOP_URL` to an approved QA environment. The Selenium suite covers public
navigation, cookie consent, product details, registration-form structure, and
the empty cart. It deliberately does not submit registration/login forms,
modify inventory, create orders, or enter payment flows. Payment, stock-race,
and authenticated cases remain dependent on approved fixtures and are listed
in [the test cases](TEST_CASES.md) and [manual suite](MANUAL_TESTS.md).

The shop URL, supported browsers, payment provider, ticket rules, and test
credentials are intentionally not assumed in this repository. Replace the
placeholders in the plan before execution, and use a payment sandbox or a
provider-approved test card only.
