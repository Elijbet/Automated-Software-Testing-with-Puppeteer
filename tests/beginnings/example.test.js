import puppeteer from "puppeteer";
import { expect } from "chai";
import { click, shouldNotExist } from "../../lib/helpers.js";
//to use (ES Modules) syntax instead of const XXX = require('XXX') (CommonJS) syntax add the "type": "module" line in your package.json file.

describe("Learning testing with Puppeteer", () => {
  it("should launch, reload, goto, goBack, goForward, close the browser", async function () {
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
      devtools: false,
    });
    const page = await browser.newPage();
    await page.goto("http://example.com/");
    await page.waitForSelector("h1");
    await page.reload();
    await page.waitForTimeout(3000);
    await page.goto("http://example.com");
    await page.waitForSelector("h1");
    await page.goto("https://dev.to/");
    await page.waitForSelector("#page-content-inner");
    await page.goBack();
    await page.waitForSelector("h1");
    await page.goForward(); //works only in headless mode for some reason
    await page.waitForSelector("#page-content-inner");
    await browser.close();
  });
  it("should interact with input", async function () {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: false,
    });
    const page = await browser.newPage();
    await page.goto("https://devexpress.github.io/testcafe/example");
    await page.type("#developer-name", "Mike", { delay: 10, button: "left" }); //don't use delay for production use, only for debugging and experimenting
    await page.click("#background-parallel-testing", { clickCount: 2 }); //use helper
    await page.select("#preferred-interface", "JavaScript API");
    const message = "Lets fill that message with some text";
    await page.type("#comments", message);
    await click(page, "#submit-button");
    await page.waitForSelector(".result-content");
    await page.waitForTimeout(500);
    browser.close();
  });
  it("should interact with page", async function () {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: false,
    });
    const page = await browser.newPage();

    await page.goto("http://example.com");
    const title = await page.title();
    const url = await page.url();
    const text = await page.$eval("h1", (element) => element.textContent);
    const count = await page.$$eval("p", (element) => element.length);
    console.log("Text in h1" + text);

    expect(title).to.be.a("string", "Example Domain");
    expect(url).to.include("example.com");
    expect(text).to.be.a("string", "Example Domain");
    expect(count).to.equal(2);
    await browser.close();
  });
  it("should interact with keyboard, wait for Xpath, element doesn't exist", async function () {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: false,
    });
    const page = await browser.newPage();
    await page.setDefaultTimeout(10000); //the default is 30 seconds
    await page.setDefaultNavigationTimeout(20000);

    await page.goto("http://zero.webappsecurity.com/index.html");
    await page.waitForXPath("//img"); //give last priority to XPath, because it's little slow compared with other locators (id, name, linktext, css)
    await page.waitForSelector("#searchTerm");
    await page.type("#searchTerm", "Hello World");
    await page.keyboard.press("Enter", { dealay: 10 });
    await page.waitForTimeout(5000);
    await click(page, "#signin_button");
    await page.waitForTimeout(2000); //puppeteer is faster than page loading
    await shouldNotExist(page, "#signin_button");
    // alternatively, this will wait for button to not show instead; default 30 sec with global override, highest precedence to function with exact override
    // await page.waitForSelector("#signin_button", {
    //   hidden: true,
    //   timeout: 3000,
    // });
    await browser.close();
  });
});
