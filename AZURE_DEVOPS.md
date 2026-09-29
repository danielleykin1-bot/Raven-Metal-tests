# Azure DevOps Test Plans and pipeline integration

This repository includes the pieces needed to run the existing browser suites
in Azure Pipelines, publish their JUnit results, and import the eight Selenium
test cases into Azure Test Plans. The Azure organization and project must exist
before the pipeline or Test Plan can be created.

## Current status

The requested organization URL `https://dev.azure.com/danielleykintests`
returned Azure DevOps **404 - Page not found** when checked on 2026-09-29.
This workspace also has no Azure DevOps MCP/API connection or authenticated
Azure CLI. Therefore no cloud project, test plan, test suite, or Azure run has
been created from this repository.

The repository-side setup is ready:

- `azure-pipelines.yml` runs both Playwright and Selenium on pushes to `main`
  and `danielleykin1-bot-ravenmetal-test-cases`.
- Each suite emits JUnit XML, and `PublishTestResults@2` publishes each run
  into the Azure Pipeline's **Tests** tab.
- `azure/test-cases.csv` is formatted for bulk import of the eight Selenium
  cases into an existing Azure Test Plan suite.
- The tests are read-only against the site: they don't log in, create accounts,
  add products to a cart, submit orders, or contact payment controls.

## Required Azure access

1. Sign in to [Azure DevOps](https://dev.azure.com/) with the account intended
   for this work.
2. Create or confirm the organization. Its exact URL should resolve to the
   organization home rather than a 404.
3. Create the project **Raven Metal Tests**. For importing and managing
   Test Plans, the user needs at least **Basic** access; creating and managing
   plans/suites requires **Basic + Test Plans** or an eligible Visual Studio
   subscription, along with the appropriate project permissions.
4. In the project, create a pipeline from the connected GitHub repository and
   select `azure-pipelines.yml`. Authorize the GitHub service connection when
   prompted.
5. Review the pipeline variable `SHOP_URL`. It currently targets the live
   public site because the implemented tests only perform read-only checks.
   Prefer an approved QA URL when available. Don't add credentials to YAML.
6. Run the pipeline. Confirm both Playwright and Selenium appear under the
   run's **Tests** tab.

No PAT is required by the YAML pipeline: Azure Pipelines uses its own
GitHub-service connection to fetch source and its built-in test publishing
task to publish results.

## Import Selenium cases

1. In the project, open **Test Plans** and create a plan and suite for Selenium
   browser regression.
2. Confirm that the suite's Area Path exists as `Raven Metal Tests`. If the
   project uses another Area Path, update that CSV column before import.
3. In the suite, choose **Import test cases from CSV/XLSX**, select
   `azure/test-cases.csv`, confirm the field mappings, then import.
4. Verify that the eight cases `SEL-001` through `SEL-008` were created.

The CSV uses blank IDs so Azure DevOps creates new test cases. Don't reimport
it unchanged after the first successful import, or it will create duplicates.
Use Azure DevOps' export/update workflow and existing IDs for later edits.
Additional manual and fixture-dependent scenarios remain documented in
`MANUAL_TESTS.md` and `TEST_CASES.md`; they are not included in this Selenium
automation import file.

## Associate automated results with test cases

The pipeline publishes test outcomes to Azure Pipelines. To show those
automated outcomes against the imported Test Plans cases, associate each
automated test once after its first successful pipeline run:

1. Open the pipeline run and select the **Tests** tab.
2. Find the corresponding Selenium test by its `[SEL-001]` through `[SEL-008]`
   identifier in the result name.
3. Select the test and choose **Associate Test Case**.
4. Search for and associate the matching `SEL-001` through `SEL-008` work item.

After association, later pipeline results can be tracked against the test case.
This is a one-time Azure-side action; this repository cannot perform it until
the organization and project exist and an authenticated Azure DevOps
connection is available.

## Result artifacts and safety

The pipeline generates:

- `test-results/playwright-junit.xml`
- `test-results/selenium-junit.xml`

Azure Pipelines publishes both files even when a test step fails, and the
pipeline fails when tests fail or results cannot be published. The XML files
are result inputs, not substitutes for the Test Plans case records. No
credentials, payment data, or personal test data are needed by this pipeline.

## Microsoft Learn references

- [Publish Test Results v2 task](https://learn.microsoft.com/azure/devops/pipelines/tasks/reference/publish-test-results-v2?view=azure-pipelines)
- [Bulk import or export test cases](https://learn.microsoft.com/azure/devops/test/bulk-import-export-test-cases?view=azure-devops)
- [Associate automated tests with test cases](https://learn.microsoft.com/azure/devops/test/associate-automated-test-with-test-case?view=azure-devops)
