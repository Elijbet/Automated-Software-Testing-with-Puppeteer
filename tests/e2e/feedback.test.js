import puppeteer from "puppeteer";
import { expect } from "chai";
import { it } from "mocha";

describe('feedback test', () => {
    let browser
    let page

    before(async function(){
        browser = await puppeteer.launch({
            headless: true,
            slowMo: 0,
            devtools: false,
        })
        page = await browser.newPage()
        await page.setDefaultTimeout(10000)
        await page.setDefaultNavigationTimeout(20000)
    })
    after(async function(){
        await browser.close()
    })
    it('dislay feedback form', async function(){
        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.waitForSelector('#feedback')
        await page.click('#feedback')
    })
    it('submit feedback form', async function(){
        await page.waitForSelector('form')
        await page.type('#name', 'Name')
        await page.type('#email', 'test@mail.com')
        await page.type('#subject', 'Name')
        await page.type('#name', 'Name')
        await page.type('#comment', 'Just a message into the text area.')
        await page.click('input[type="submit"]')
    })
    it('dislay results page', async function(){
        await page.waitForSelector('#feedback-title')
        const url = await page.url()
        expect(url).to.include('/sendFeedback.html')
    })
    it('submit feedback form', async function(){
        await page.waitForSelector('form')
        await page.type('#name', 'Name')
        await page.type('#email', 'test@mail.com')
        await page.type('#subject', 'Subject')
        await page.type('#comment', 'Message into the testArea')
        await page.click('input[type="sumbit"]')
    })
    it('display results page', async function(){
        await page.waitForSelector('#feedback-title')
        const url = await page.url()
        expect(url).to.include('/sendFeedback.html')
    })
})