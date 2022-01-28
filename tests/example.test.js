const puppeteer = require("puppeteer");

describe("Learning testing with Puppeteer", () => {
  it("should launch, reload, goto, goBack, goForward, close the browser", async function () {
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
      devtools: false,
    });
    const page = await browser.newPage();
    // await page.waitForTimeout(3000);
    await page.goto("http://example.com/");
    await page.waitForSelector("h1");
    await page.reload()
    await page.waitForTimeout(3000)
    await page.goto('http://example.com')
    await page.waitForSelector("h1");
    await page.goto("https://dev.to/")
    await page.waitForSelector("#page-content-inner")
    await page.goBack()
    await page.waitForSelector("h1")
    await page.goForward() //works only in headless mode for some reason
    await page.waitForSelector("#page-content-inner")
    await browser.close()
  });
});
