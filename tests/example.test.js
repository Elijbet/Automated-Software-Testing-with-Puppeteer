const puppeteer = require("puppeteer");
const expect = require("chai").expect;

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
    await page.click("#background-parallel-testing", { clickCount: 2 });
    await page.select("#preferred-interface", "JavaScript API");
    const message = "Lets fill that message with some text";
    await page.type("#comments", message);
    await page.click("#submit-button");
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
    const text = await page.$eval("h1", element => element.textContent);
    const count = await page.$$eval('p', element => element.length)
    console.log("Text in h1" + text);

    expect(title).to.be.a("string", "Example Domain");
    expect(url).to.include("example.com");
    expect(text).to.be.a("string", "Example Domain");
    expect(count).to.equal(2);
    await browser.close();
  });
});
