import puppeteer from "puppeteer";

describe("TRIC_TEST", () => {
  let browser;
  let userPage;
  let adminPage;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
   })
    userPage = await browser.newPage();
    adminPage = await browser.newPage();
    await userPage.goto("http://localhost:3000");
    await adminPage.goto("http://localhost:3000/admin");
  });

  it("Join the app", async () => {
    //await userPage.waitForSelector('[e2e-id="inactive"]');
    await userPage.waitForSelector('[e2e-id="join"]');
    await userPage.click('[e2e-id="join"]');
    await userPage.waitForSelector('[e2e-id="create"]');
  });

  afterAll(() => browser.close());
});