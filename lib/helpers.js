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

export async function typeText(page, selector, text) {
  try {
    await page.waitForSelector(selector);
    await page.type(selector, text);
  } catch (error) {
    throw new Error(`Could not type into selector: ${selector}`);
  }
}

export async function waitForText(page, selector, text) {
  try {
    await page.waitForSelector(selector);
    await page.waitForFunction((selector, text) => {
      document.querySelector(selector).innerText.includes(text),
        {}, // {} pass the value from node to the browser
        selector,
        text;
    });
  } catch (error) {
    throw new Error(`Text: ${text} not found for selector ${selector}`);
  }
}

export async function shouldNotExist(page, selector) {
  try {
    await page.waitForSelector(selector, {hidden: true});
    //the below alternative might fail if the page is just hiding the element
    // await page.waitFor(() => !document.querySelector(selector));
  } catch (error) {
    throw new Error(`Selector: ${selector} is visible, but should not be.`);
  }
}
