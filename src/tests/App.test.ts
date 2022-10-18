import puppeteer from "puppeteer";

describe("Feature 1 - Questions database and display", () => {

});

describe("Feature 2 - Voting System", () => {

});

describe("Feature 3 - Voting Rounds", () => {

});

describe("Feature 4 - User Personalization", () => {
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
    await userPage.goto("https://jolly-forest-02e0b3603-test.westeurope.1.azurestaticapps.net");
    await adminPage.goto("https://jolly-forest-02e0b3603-test.westeurope.1.azurestaticapps.net/admin");
  });

  it("Join the app", async () => {
    await userPage.waitForSelector('[e2e-id="join"]');
    await userPage.click('[e2e-id="join"]');
    await userPage.waitForSelector('[e2e-id="create"]');
  });

  it("Create user", async () => {

  });

  afterAll(() => browser.close());
});

describe("Feature 5 - Contribututors Page", () => {

});

describe("Feature 6 - Answer Prediction", () => {

});

describe("Feature 7 - Personal Voting Results", () => {

});

describe("Feature 8 - Downtime management and ending the play", () => {

});