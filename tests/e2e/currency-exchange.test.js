import puppeteer from "puppeteer";
import { expect } from "chai";
import { it } from "mocha";

describe("payment test", () => {
  let browser;
  let page;

  before(async function () {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      devtools: false,
    });
    page = await browser.newPage();
    await page.setDefaultTimeout(10000);
    await page.setDefaultNavigationTimeout(20000);

    await page.goto("http://zero.webappsecurity.com/login.html");
    await page.waitForSelector("#login_form");
    await page.type("#user_login", "username");
    await page.type("#user_password", "password");
    await page.click("#user_remember_me");
    await page.click('input[type="submit"]');
    await page.goto("http://zero.webappsecurity.com/index.html");
    // Using all selectors with comma will return all nodes that matches any of the selector. This will only return true if there is some element, it won't return which selector matched which elements.
    await page.waitForFunction(
      () =>
        document.querySelectorAll("#homeMenu, #onlineBankingMenu, #feedback")
          .length
    );
  });
  after(async function () {
    await browser.close();
  });
  it("displays currency exchange form & exchange currency", async function () {
    await page.click("#onlineBankingMenu");
    await page.waitForSelector("#online_banking_features > .margin7top");
    await page.click(
      "#online_banking_features > .margin7top" > "#pay_bills_link"
    );
    await page.waitForSelector(".board-header");
    await click("#tabs > #ui-tabs-3");
    await page.select("#pc-currency", "GBP");
    await page.type("#pc-amount", "800");
    await page.click("#pc_inDollars_ture");
    await page.click("#purchase_cash");
    await page.waitForSelector("#alert_content");
  });
  it("exchange currency", async function () {});
});
