import puppeteer from "puppeteer";

describe('login test', () => {
    let browser
    let page
    
    beforeEach(async function() {
        browser = await puppeteer.launch({
            headless: true,
            // slows down Puppeteer operations by the specified amount of milliseconds. It's another way to help see what's going on.
            slowMo: 0,
            devtools: false,
        })
        page = await browser.newPage()
        await page.setDefaultTimeout(10000)
        await page.setDefaultNavigationTimeout(20000)
        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.waitForSelector('#signin_button') //always go for id, as id is the fastest & most stable selector
        await page.click('#signin_button')
        await page.waitForSelector('#login_form')
    })

    after(async function() {
        await browser.close()
    })

    it('login test - invalid credentials', async function(){
        await page.type('#user_login', 'invalid creds')
        await page.type('#user_password', 'invalid password')
        await page.click('#user_remember_me')
        await page.click('input[type="submit"]')
        await page.waitForSelector('.alert-error')
    })
    it('login test - valid credentials', async function(){
        await page.type('#user_login', 'username')
        await page.type('#user_password', 'password')
        await page.click('#user_remember_me')
        await page.click('input[type="submit"]')
        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.waitForFunction(
        () =>
            document.querySelectorAll("#homeMenu, #onlineBankingMenu, #feedback")
            .length
        );
    })
})