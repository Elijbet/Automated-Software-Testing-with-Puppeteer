import puppeteer from "puppeteer";
import expect from "chai";

//for responsive testing
describe("advanced puppeteer automation: device emulation", () => { 
  // in puppeteer it's a good practice to define variables on the top
  let browser;
  let page;

  before(async function () {
    // specify your test setup in before hook
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 10,
      devtools: false,
    });
    // will run both the regular (in the back, will just sit there do nothing) and incognito (in front) browsers
    const context = await browser.createIncognitoBrowserContext(); 
    page = await context.newPage();
    await page.setDefaultTimeout(10000);
    await page.setDefaultNavigationTimeout(20000);
  });
  after(async function () {
    await browser.close();
  });
  it("desktop device test", async function () {
      await page.setViewport({width: 1650, height: 1050});
      await page.goto('https://www.example.com')
      await page.waitFor(3000) // wait for 3 sec so you can see the difference
  });
  it("tablet device test", async function () {
      const tablet = puppeteer.devices['iPad landscape']
      await page.emulate(tablet) //match iPadLandscape resolution
      await page.goto('https://www.example.com')
      await page.waitFor(3000) 
  });
  it("mobile device test", async function () {
      const mobile = puppeteer.devices['iPhone X']
      await page.emulate(mobile)
      await page.goto('https://www.example.com')
      await page.waitFor(3000)
  });
});
