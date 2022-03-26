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
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });
  afterAll(async function () {
    await browser.close();
  });

  test("full Page Snapshot", async function () {
    await page.goto("https://www.example.com");
    await page.waitForSelector("h1");
    const image = await page.screenshot(); //puppeteer function
    expect(image).toMatchImageSnapshot({
      failureTresholdType: "pixel",
      failureTreshold: 500,
    });
  });
  test("single element snapshot", async function () {
    await page.goto("https://www.example.com");
    const h1 = await page.waitForSelector("h1");
    const image = await h1.screenshot();
    expect(image).toMatchImageSnapshot({
      failureTresholdType: "percent",
      failureTreshold: 0.01,
    });
  });
});
