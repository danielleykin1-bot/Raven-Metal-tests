import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { By, Builder, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const baseUrl = (process.env.SHOP_URL || 'https://ravenmetal.co.il').replace(/\/+$/, '');
const timeout = Number(process.env.SELENIUM_TIMEOUT_MS || 15_000);

describe('Raven Metal Selenium browser suite', () => {
  let driver;

  beforeEach(async () => {
    const options = new chrome.Options().addArguments(
      '--headless=new',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--window-size=1440,1000',
    );

    if (process.env.CHROME_BIN) {
      options.setChromeBinaryPath(process.env.CHROME_BIN);
    }

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    await driver.manage().setTimeouts({ pageLoad: timeout, script: timeout });
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
      driver = undefined;
    }
  });

  async function open(path) {
    await driver.get(`${baseUrl}${path}`);
    await driver.wait(
      async () => (await driver.executeScript('return document.readyState')) === 'complete',
      timeout,
    );
  }

  async function acceptCookieNotice() {
    const consent = await driver.wait(
      until.elementLocated(By.xpath('//button[normalize-space(.)="אישור"]')),
      timeout,
    );
    await driver.wait(until.elementIsVisible(consent), timeout);
    await driver.wait(
      async () =>
        driver.executeScript(
          `const e=arguments[0],r=e.getBoundingClientRect();
           const x=r.left+r.width/2,y=r.top+r.height/2;
           return r.width>0 && r.height>0 && r.left>=0 && r.right<=innerWidth &&
             r.top>=0 && r.bottom<=innerHeight && document.elementFromPoint(x,y)===e`,
          consent,
        ),
      timeout,
    );
    await consent.click();
    await driver.wait(until.elementIsNotVisible(consent), timeout);
  }

  async function linkByText(text) {
    return driver.wait(
      until.elementLocated(By.xpath(`//a[normalize-space(.)="${text}"]`)),
      timeout,
    );
  }

  it('@smoke homepage displays the shop entry points', async () => {
    await open('/');
    await driver.wait(until.titleContains('Raven Metal'), timeout);

    for (const [label, route] of [
      ['קטלוג', 'index.php'],
      ['תכולת הסל', 'shopping_cart.php'],
      ['החשבון שלי', 'account.php'],
      ['לחצו כאן', 'article_info.php?articles_id=44'],
    ]) {
      const link = await linkByText(label);
      assert.match(await link.getAttribute('href'), new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  it('@smoke cookie notice can be accepted', async () => {
    await open('/');
    await acceptCookieNotice();
  });

  it('@smoke catalog product opens a detail page', async () => {
    await open('/');
    await acceptCookieNotice();
    const product = await driver.wait(
      until.elementLocated(
        By.css('a[href*="product_info.php?products_id="]'),
      ),
      timeout,
    );
    await product.click();

    await driver.wait(until.urlMatches(/product_info\.php\?products_id=\d+/), timeout);
    const body = await driver.findElement(By.css('body')).getText();
    assert.match(body, /₪|ש"ח/);
  });

  it('@regression event announcement opens its article', async () => {
    await open('/');
    await (await linkByText('לחצו כאן')).click();

    await driver.wait(until.urlMatches(/article_info\.php\?articles_id=44/), timeout);
    const body = await driver.findElement(By.css('body')).getText();
    assert.match(body, /SEPTICFLESH|PARADISE LOST|BLIND GUARDIAN/i);
    assert.doesNotMatch(body, /404|not found/i);
  });

  it('@regression account and registration links reach their public pages', async () => {
    await open('/');
    await (await linkByText('החשבון שלי')).click();

    await driver.wait(until.urlMatches(/login\.php/), timeout);
    const registration = await driver.findElements(
      By.css('a[href*="create_account.php"]'),
    );
    assert.equal(registration.length, 1);
    await registration[0].click();
    await driver.wait(until.urlMatches(/create_account\.php/), timeout);
  });

  it('@regression registration form exposes customer fields without submitting', async () => {
    await open('/create_account.php');

    assert.match(await driver.getCurrentUrl(), /create_account\.php/);
    await driver.wait(
      until.elementLocated(By.css('input[name="email_address"]')),
      timeout,
    );
    assert.equal(
      await driver.findElements(By.css('input[type="password"]')).then((items) => items.length),
      2,
    );
    assert.ok(
      (await driver.findElements(By.css('input[name], select[name]'))).length > 0,
    );
  });

  it('@regression empty cart shows no items and no payment controls', async () => {
    await open('/shopping_cart.php');

    assert.match(await driver.getCurrentUrl(), /shopping_cart\.php/);
    const body = await driver.findElement(By.css('body')).getText();
    assert.match(body, /0 פריטים|ריק|empty/i);
    assert.doesNotMatch(body, /payment|תשלום/i);
  });

  it('@regression privacy, terms, and accessibility pages load', async () => {
    for (const path of ['/privacy.php', '/conditions.php', '/accessibility.php']) {
      await open(path);
      await driver.wait(until.titleContains('Raven Metal'), timeout);
      const body = await driver.findElement(By.css('body')).getText();
      assert.doesNotMatch(body, /404|not found/i, `${path} should not be a missing page`);
    }
  });
});
