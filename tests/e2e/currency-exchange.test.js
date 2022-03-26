import puppeteer from "puppeteer";
import { it } from "mocha";

describe("currency-exchange test", () => {
  let browser;
  let page;

  before(async function() {
    browser = await puppeteer.launch({
        headless: false,
        // slows down Puppeteer operations by the specified amount of milliseconds. It's another way to help see what's going on.
        slowMo: 150,
        devtools: false,
    })
    page = await browser.newPage()
    // slowMo - add pause between every puppeteer action for specific time, basically it slows "time" so you can see better what is going on, it can be useful for debug/development

    // timeout - how long should puppeteer wait to consider function successful or failed

    // implicit waits - the latency that you want to see if specified web element is not present that puppeteer looking for. You are telling puppeteer that it should wait x seconds in cases of specified element not available on the UI (DOM): await page.waitForSelector("your-selector") dynamically waits until the selector is visible. Default 30 sec, or pass an options object with a timeout attribute to override that: await page.waitForSelector(yourSelector, {timeout: 5000});

    // explicit waits - are confined to a particular web element; the max unit of time it is to wait before it gives up: await page.waitFor(5000) which always waits for 5 seconds no matter what.

    await page.setDefaultTimeout(10000)
    await page.setDefaultNavigationTimeout(20000)
    await page.goto('http://zero.webappsecurity.com/index.html')
    await page.waitForSelector('#signin_button') 
    await page.click('#signin_button')
    await page.waitForSelector('#login_form')
    
    await page.type('#user_login', 'username')
    await page.type('#user_password', 'password')
    await page.click('#user_remember_me')
    await page.click('input[type="submit"]')
    await page.goto('http://zero.webappsecurity.com/index.html')
    await page.waitForFunction(
    () =>
        document.querySelectorAll("#homeMenu, #onlineBankingMenu, #feedback")
        .length
    );
    // Using all selectors with comma will return all nodes that matches any of the selector. This will only return true if there is some element, it won't return which selector matched which elements.
  });
  after(async function () {
    await browser.close();
  });
  it("displays currency exchange form", async function () {
    await page.waitForSelector("#onlineBankingMenu");
    await page.click("#onlineBankingMenu");
    await page.waitForSelector("#online_banking_features");
    // inception borsht: multiple elements with same selector nested in multiple elements with same selector;
    await page.waitForFunction(
      () => document.querySelectorAll(".margin7top").length
    );
    await page.waitForSelector("#pay_bills_link");
    await page.click("#pay_bills_link");
    await page.waitForSelector('a[href="#ui-tabs-3"]')
    await page.click('a[href="#ui-tabs-3"]')
  });
  it("exchange currency", async function () {
    await page.waitForSelector("#pc_purchase_currency_form");
    await page.waitForSelector("select#pc-currency");
    await page.select("", "GBP");
    await page.waitFor(3000)
    await page.type("#pc-amount", "800");
    await page.click("#pc_inDollars_true");
    await page.click("#pc_calculate_costs");
    await page.waitForSelector("#pc_conversion_amount");
    await page.waitForSelector('#purchase_cash')
    await page.click('#purchase_cash')
    await page.waitForSelector('#alert_content')
  });
});
