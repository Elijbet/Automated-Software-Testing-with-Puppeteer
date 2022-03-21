import puppeteer from "puppeteer";
import { expect } from "chai";
import { it } from "mocha";

describe("payment test", () => {
  let browser;
  let page;

  beforeEach(async function () {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
      devtools: false,
    });
    page = await browser.newPage();
    await page.setDefaultTimeout(50000);
    await page.setDefaultNavigationTimeout(50000);

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
  it("displays payment form and makes payment", async function () {
    await page.waitForSelector("#onlineBankingMenu");
    await page.click("#onlineBankingMenu");
    await page.waitForSelector("#online_banking_features");
    // inception borsht: multiple elements with same selector nested in multiple elements with same selector;
    await page.waitForFunction(
      () => document.querySelectorAll(".margin7top").length
    );
    await page.click("#pay_bills_link");
    await page.waitForSelector("#sp_payee");
    await page.select("#sp_payee", "Apple");
    await page.select("#sp_account", "Credit Card");
    await page.type("#sp_amount", "500");
    await page.type("#sp_date", "2020-03-18");
    await page.type("#sp_description", "Payment for rent");
    await page.click("#pay_saved_payees");
    await page.waitForSelector("#alert_content");
  });
});
