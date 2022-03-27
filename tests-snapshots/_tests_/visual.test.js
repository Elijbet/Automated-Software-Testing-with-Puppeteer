const { afterAll, expect, test } = require("@jest/globals");
const puppeteer = require("puppeteer");
const { toMatchImageSnapshot } = require("jest-image-snapshot");

expect.extend({ toMatchImageSnapshot }); // extend the expect function to include toMatchImageSnapshot method

// This test opens the page running on the localhost, takes a snapshot and saves it in the folder _image_snapshots_.
// Make a change in the source code and re-run the test. The test fails this time.
// Another sub-folder is created by the name _diff_output_. The difference between the snapshot and the reference snapshot is shown marked.

describe("Visual Regression Testing", () => {
  let browser;
  let page;

  beforeAll(async function () {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto("https://www.example.com");
  });
  afterAll(async function () {
    await browser.close();
  });

  test("full Page Snapshot", async function () {
    await page.waitForSelector("h1");
    const image = await page.screenshot(); //puppeteer function
    expect(image).toMatchImageSnapshot({
      failureTresholdType: "pixel",
      failureTreshold: 500,
    });
  });
  test("single element snapshot", async function () {
    const h1 = await page.waitForSelector("h1");
    const image = await h1.screenshot();
    expect(image).toMatchImageSnapshot({
      failureTresholdType: "percent",
      failureTreshold: 0.01,
    });
  });
  test("mobile Snapshot", async function () {
    await page.waitForSelector("h1");
    //page.emulate will resize the page. A lot of websites don't expect phones to change size, so you should emulate before navigating to the page.
    await page.emulate(puppeteer.devices["iPhone X"]);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureTresholdType: "percent",
      failureTreshold: 0.01,
    });
  });

  test("tablet Snapshot", async function () {
    await page.waitForSelector("h1");
    await page.emulate(puppeteer.devices["iPad landscape"]);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureTresholdType: "percent",
      failureTreshold: 0.01,
    });
  });
  // some elements will throw off your test, such as timestamps or loading icons

  test("remove Element Before Snapshot", async function () {
    await page.evaluate(() => {
      (document.querySelectorAll("h1") || []).forEach((el) => el.remove());
    });
    await page.waitFor(5000);
  });
});
