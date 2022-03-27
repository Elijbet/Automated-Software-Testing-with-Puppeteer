const puppeteer = require("puppeteer");
const percySnapshot = require("@percy/puppeteer");

describe("percy visual test", () => {
  let browser;
  let page;

  //  use beforeAll if you need a setup and tear down for all of the tests and beforeEach if you need to reset for each test, eg resetting test data in a database before each test is run
  beforeAll(async function () {
    browser = await puppeteer.launch({
      headless: true,
    });
    page = await browser.newPage();
  });
  afterAll(async function () {
    await browser.close();
  });

  test("full percy snapshot", async () => {
    await page.goto("https://www.example.com");
    await page.evaluate(() => {
      (document.querySelectorAll("h1") || []).forEach((el) => el.remove());
    });
    await page.waitForTimeout(1000); // swap waitFor(depricated) for the correct waitForX method: waitForSelector, waitForFunction, or waitForXPath, waitForTimeout
    await percySnapshot(page, "example page"); // use puppeteer to control the browser and percy to take snapshots
  });
});
