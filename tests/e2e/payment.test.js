import puppeteer from "puppeteer";
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
    await page.waitForSelector("#pay_bills_link");
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

  it("measures page performance", async () => {
    await page.waitForSelector("#onlineBankingMenu");

    const loadTimeMetrics = await page.evaluate(() =>
      JSON.stringify(window.performance)
    );
    console.info(JSON.parse(loadTimeMetrics));

    const runTimeMetrics = await page.metrics();
    console.info(runTimeMetrics);
  });

  it("records browser activities during navigation", async () => {
    await page.waitForSelector("#onlineBankingMenu");

    // Starts to record a trace of the operations
    await page.tracing.start({ path: "trace.json" });

    await page.goto("https://pptr.dev");
    await page.waitForSelector("title");

    // Stops the recording
    await page.tracing.stop();
  });
});
