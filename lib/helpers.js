//extend puppeteer with custom commands

export async function click(page, selector) {
  try {
    await page.waitForSelector(selector);
    await page.click(selector);
  } catch (error) {
    throw new Error(`Could not click on selector: ${selector}`);
  }
}
export async function getText(page, selection) {
  try {
    await page.waitForSelector(selector);
    await page.$eval(selector, (element) => element.innerHTML);
  } catch (error) {
    throw new Error(`Could get text from selector: ${selector}`);
  }
}
export async function getCount(page, selector) {
  try {
    await page.waitForSelector(selector);
    await page.$$eval(selector, (element) => element.length); //$$ iterates through multiple
  } catch (error) {
    throw new Error(`Could get count from selector: ${selector}`);
  }
}
